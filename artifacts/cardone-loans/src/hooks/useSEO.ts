import { useEffect } from "react"

interface SEOProps {
  title: string
  description: string
  canonical?: string
  ogTitle?: string
  ogDescription?: string
  ogImage?: string
  ogType?: string
  keywords?: string
  jsonLd?: object | object[]
}

const BASE_URL = "https://cardoneloansgrants.com"
const DEFAULT_IMAGE = `${BASE_URL}/opengraph.jpg`
const SITE_NAME = "Cardone Loans & Grants"

function setMeta(name: string, content: string, property = false) {
  const attr = property ? "property" : "name"
  let el = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement | null
  if (!el) {
    el = document.createElement("meta")
    el.setAttribute(attr, name)
    document.head.appendChild(el)
  }
  el.content = content
}

function setLink(rel: string, href: string) {
  let el = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null
  if (!el) {
    el = document.createElement("link")
    el.rel = rel
    document.head.appendChild(el)
  }
  el.href = href
}

function injectJsonLd(id: string, data: object | object[]) {
  const existing = document.getElementById(id)
  if (existing) existing.remove()
  const script = document.createElement("script")
  script.id = id
  script.type = "application/ld+json"
  script.textContent = JSON.stringify(Array.isArray(data) ? data : data)
  document.head.appendChild(script)
}

export function useSEO({
  title,
  description,
  canonical,
  ogTitle,
  ogDescription,
  ogImage,
  ogType = "website",
  keywords,
  jsonLd,
}: SEOProps) {
  useEffect(() => {
    const fullTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`
    document.title = fullTitle

    const canonicalUrl = canonical ? `${BASE_URL}${canonical}` : BASE_URL
    const resolvedOgTitle = ogTitle ?? fullTitle
    const resolvedOgDesc = ogDescription ?? description
    const resolvedOgImage = ogImage ?? DEFAULT_IMAGE

    setMeta("description", description)
    if (keywords) setMeta("keywords", keywords)
    setMeta("robots", "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1")

    setLink("canonical", canonicalUrl)

    setMeta("og:type", ogType, true)
    setMeta("og:url", canonicalUrl, true)
    setMeta("og:title", resolvedOgTitle, true)
    setMeta("og:description", resolvedOgDesc, true)
    setMeta("og:image", resolvedOgImage, true)
    setMeta("og:site_name", SITE_NAME, true)

    setMeta("twitter:card", "summary_large_image")
    setMeta("twitter:title", resolvedOgTitle)
    setMeta("twitter:description", resolvedOgDesc)
    setMeta("twitter:image", resolvedOgImage)

    if (jsonLd) {
      injectJsonLd("page-json-ld", jsonLd)
    }

    return () => {
      const el = document.getElementById("page-json-ld")
      if (el) el.remove()
    }
  }, [title, description, canonical, ogTitle, ogDescription, ogImage, ogType, keywords, jsonLd])
}
