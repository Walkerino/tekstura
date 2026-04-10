export function createExcerpt(content: string, length = 160) {
  const normalized = content.replace(/\s+/g, ' ').trim()

  if (normalized.length <= length) {
    return normalized
  }

  return `${normalized.slice(0, length).trimEnd()}...`
}
