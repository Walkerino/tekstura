const transliterationMap: Record<string, string> = {
  а: 'a',
  б: 'b',
  в: 'v',
  г: 'g',
  д: 'd',
  е: 'e',
  ё: 'e',
  ж: 'zh',
  з: 'z',
  и: 'i',
  й: 'y',
  к: 'k',
  л: 'l',
  м: 'm',
  н: 'n',
  о: 'o',
  п: 'p',
  р: 'r',
  с: 's',
  т: 't',
  у: 'u',
  ф: 'f',
  х: 'h',
  ц: 'ts',
  ч: 'ch',
  ш: 'sh',
  щ: 'sch',
  ъ: '',
  ы: 'y',
  ь: '',
  э: 'e',
  ю: 'yu',
  я: 'ya',
}

export function slugify(value: string) {
  const transliterated = value
    .trim()
    .toLowerCase()
    .split('')
    .map((char) => transliterationMap[char] ?? char)
    .join('')

  const slug = transliterated
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

  return slug || 'item'
}

export async function buildUniqueSlug(
  value: string,
  exists: (slug: string) => Promise<boolean>,
) {
  const baseSlug = slugify(value)
  let candidate = baseSlug
  let suffix = 2

  while (await exists(candidate)) {
    candidate = `${baseSlug}-${suffix}`
    suffix += 1
  }

  return candidate
}
