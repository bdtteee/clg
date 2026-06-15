// Minimal Safaricom Daraja (M-Pesa) STK Push client. All credentials come from
// the environment — nothing is hardcoded.

const SANDBOX_BASE = "https://sandbox.safaricom.co.ke";
const PROD_BASE = "https://api.safaricom.co.ke";

export interface MpesaConfig {
  consumerKey: string;
  consumerSecret: string;
  shortcode: string;
  passkey: string;
  callbackUrl: string;
  baseUrl: string;
}

export function getMpesaConfig(): MpesaConfig | null {
  const consumerKey = process.env.MPESA_CONSUMER_KEY;
  const consumerSecret = process.env.MPESA_CONSUMER_SECRET;
  const shortcode = process.env.MPESA_SHORTCODE;
  const passkey = process.env.MPESA_PASSKEY;
  const callbackUrl = process.env.MPESA_CALLBACK_URL;

  if (!consumerKey || !consumerSecret || !shortcode || !passkey || !callbackUrl) {
    return null;
  }

  const baseUrl =
    (process.env.MPESA_ENV || "sandbox").toLowerCase() === "production"
      ? PROD_BASE
      : SANDBOX_BASE;

  return { consumerKey, consumerSecret, shortcode, passkey, callbackUrl, baseUrl };
}

// Normalise a Kenyan number to the 2547XXXXXXXX / 2541XXXXXXXX format Daraja wants.
export function normalizeMpesaPhone(raw: string): string | null {
  const digits = (raw || "").replace(/\D/g, "");
  if (!digits) return null;
  if (digits.startsWith("0") && digits.length === 10) return `254${digits.slice(1)}`;
  if (digits.length === 9 && (digits.startsWith("7") || digits.startsWith("1"))) return `254${digits}`;
  if (digits.startsWith("254") && digits.length === 12) return digits;
  return null;
}

function timestamp(): string {
  const d = new Date();
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}${p(d.getHours())}${p(d.getMinutes())}${p(d.getSeconds())}`;
}

async function getAccessToken(config: MpesaConfig): Promise<string> {
  const auth = Buffer.from(`${config.consumerKey}:${config.consumerSecret}`).toString("base64");
  const res = await fetch(
    `${config.baseUrl}/oauth/v1/generate?grant_type=client_credentials`,
    { headers: { Authorization: `Basic ${auth}` }, signal: AbortSignal.timeout(20_000) },
  );
  if (!res.ok) throw new Error(`M-Pesa auth failed (${res.status})`);
  const data = (await res.json()) as { access_token?: string };
  if (!data.access_token) throw new Error("M-Pesa auth returned no token");
  return data.access_token;
}

export interface StkPushResult {
  MerchantRequestID?: string;
  CheckoutRequestID?: string;
  ResponseCode?: string;
  ResponseDescription?: string;
  CustomerMessage?: string;
  errorMessage?: string;
}

export async function initiateStkPush(
  config: MpesaConfig,
  params: { phone: string; amount: number; accountReference: string; description: string },
): Promise<StkPushResult> {
  const token = await getAccessToken(config);
  const ts = timestamp();
  const password = Buffer.from(`${config.shortcode}${config.passkey}${ts}`).toString("base64");

  const res = await fetch(`${config.baseUrl}/mpesa/stkpush/v1/processrequest`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      BusinessShortCode: config.shortcode,
      Password: password,
      Timestamp: ts,
      TransactionType: "CustomerPayBillOnline",
      Amount: Math.round(params.amount),
      PartyA: params.phone,
      PartyB: config.shortcode,
      PhoneNumber: params.phone,
      CallBackURL: config.callbackUrl,
      AccountReference: params.accountReference.slice(0, 12),
      TransactionDesc: params.description.slice(0, 13),
    }),
    signal: AbortSignal.timeout(30_000),
  });

  const data = (await res.json().catch(() => ({}))) as StkPushResult;
  if (!res.ok || (data.ResponseCode && data.ResponseCode !== "0")) {
    throw new Error(data.errorMessage || data.ResponseDescription || `STK push failed (${res.status})`);
  }
  return data;
}

// Processing fee in KES by product.
export function processingFeeKes(type: string, category: string): number {
  if (type === "grant" && category === "personal") return 1300;
  if (type === "grant" && category === "business") return 2600;
  if (type === "loan" && category === "personal") return 2600;
  if (type === "loan" && category === "business") return 6500;
  return 1300;
}
