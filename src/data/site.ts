export type NavItem = {
  label: string
  href: string
}

export const navigation: NavItem[] = [
  { label: 'О нас', href: '#about' },
  { label: 'Услуги', href: '#services' },
  { label: 'Кейсы', href: '#cases' },
  { label: 'Отзывы', href: '#reviews' },
  { label: 'Новости', href: '#news' },
  { label: 'Контакты', href: '#contact' },
]

export const footerPrimaryLinks = navigation.slice(0, 3)
export const footerSecondaryLinks = navigation.slice(3)

export const digitHandles = [
  { left: '18.9%', top: '20.6%' },
  { left: '27.1%', top: '20.6%' },
  { left: '6.5%', top: '56.7%' },
  { left: '61.4%', top: '56.7%' },
  { left: '6.3%', top: '65.7%' },
  { left: '61.2%', top: '65.7%' },
  { left: '13%', top: '56.2%' },
  { left: '67.9%', top: '56.2%' },
  { left: '21%', top: '56.2%' },
  { left: '20.9%', top: '33%' },
  { left: '27.3%', top: '56.2%' },
  { left: '31.2%', top: '56.2%' },
  { left: '39.8%', top: '48.8%' },
  { left: '41%', top: '59.9%' },
  { left: '40.4%', top: '38.2%' },
  { left: '45.9%', top: '29.3%' },
  { left: '45.9%', top: '19.6%' },
  { left: '54%', top: '25.1%' },
  { left: '37.5%', top: '25.1%' },
  { left: '57.6%', top: '35.9%' },
  { left: '34.3%', top: '35.9%' },
  { left: '58.5%', top: '48.8%' },
  { left: '33.4%', top: '47.7%' },
  { left: '57%', top: '63.6%' },
  { left: '34.8%', top: '63.6%' },
  { left: '52.2%', top: '73.3%' },
  { left: '45.9%', top: '76.4%' },
  { left: '38.8%', top: '72.3%' },
  { left: '51%', top: '38.2%' },
  { left: '51%', top: '59.9%' },
  { left: '45.9%', top: '66.7%' },
  { left: '51.6%', top: '48.8%' },
  { left: '31.2%', top: '65.7%' },
  { left: '27.3%', top: '65.7%' },
  { left: '27.3%', top: '75.9%' },
  { left: '21%', top: '75.9%' },
  { left: '21%', top: '65.7%' },
]
