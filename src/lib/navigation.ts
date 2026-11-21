/*
 * Header menus and footer links. Every href must resolve to a real page.
 * Shop links use query params that the /shop page reads:
 *   dept=women|men|unisex|accessories, category=<type>, badge=new|bestseller, sale=1
 */

export type NavLink = { label: string; href: string }
export type NavMenu = {
  label: string
  /** Landing link for the whole section */
  all: NavLink
  highlights: NavLink[]
  categories: NavLink[]
}

const shop = (params: Record<string, string>) =>
  `/shop?${new URLSearchParams(params).toString()}`

const highlights = (dept: string): NavLink[] => [
  { label: "New in", href: shop({ dept, badge: "new" }) },
  { label: "Bestsellers", href: shop({ dept, badge: "bestseller" }) },
  { label: "Last chance", href: shop({ dept, sale: "1" }) },
]

const cats = (dept: string, list: [string, string][]): NavLink[] =>
  list.map(([label, category]) => ({ label, href: shop({ dept, category }) }))

export const navMenus: NavMenu[] = [
  {
    label: "Women",
    all: { label: "Shop all women", href: shop({ dept: "women" }) },
    highlights: highlights("women"),
    categories: cats("women", [
      ["Dresses", "dresses"],
      ["Blouses", "blouses"],
      ["Knitwear", "knitwear"],
      ["Trousers", "trousers"],
      ["Skirts", "skirts"],
      ["Outerwear", "outerwear"],
    ]),
  },
  {
    label: "Men",
    all: { label: "Shop all men", href: shop({ dept: "men" }) },
    highlights: highlights("men"),
    categories: cats("men", [
      ["Shirts", "shirts"],
      ["T-shirts", "t-shirts"],
      ["Knitwear", "knitwear"],
      ["Chinos", "chinos"],
      ["Jeans", "jeans"],
      ["Jackets", "jackets"],
    ]),
  },
  {
    label: "Unisex",
    all: { label: "Shop all unisex", href: shop({ dept: "unisex" }) },
    highlights: highlights("unisex"),
    categories: cats("unisex", [
      ["Hoodies", "hoodies"],
      ["Basic tees", "t-shirts"],
      ["Sweatpants", "sweatpants"],
      ["Overshirts", "overshirts"],
    ]),
  },
  {
    label: "Accessories",
    all: { label: "Shop all accessories", href: shop({ dept: "accessories" }) },
    highlights: highlights("accessories"),
    categories: cats("accessories", [
      ["Tote bags", "bags"],
      ["Beanies", "hats"],
      ["Scarves", "scarves"],
      ["Socks", "socks"],
    ]),
  },
  {
    label: "Pre-loved",
    all: { label: "About Pre-loved", href: "/pre-loved" },
    highlights: [
      { label: "New in", href: "/pre-loved#new-in" },
      { label: "Bestsellers", href: "/pre-loved#bestsellers" },
      { label: "Last chance", href: "/pre-loved#last-chance" },
    ],
    categories: [
      { label: "How buy-back works", href: "/pre-loved#how-it-works" },
      { label: "My Drip Wardrobe", href: "/wardrobe" },
      { label: "Browse listings", href: "/pre-loved#listings" },
    ],
  },
]

export const footerGroups: { title: string; links: NavLink[] }[] = [
  {
    title: "Help",
    links: [
      { label: "Contact", href: "/contact" },
      { label: "FAQ", href: "/faq" },
      { label: "Size guide", href: "/size-guide" },
    ],
  },
  {
    title: "Delivery & Returns",
    links: [
      { label: "Shipping", href: "/shipping" },
      { label: "Returns", href: "/returns" },
      { label: "Track order", href: "/track-order" },
    ],
  },
  {
    title: "Shopping with Drip",
    links: [
      { label: "Our materials", href: "/materials" },
      { label: "Pre-loved", href: "/pre-loved" },
      { label: "Gift cards", href: "/gift-cards" },
      { label: "Photo credits", href: "/credits" },
    ],
  },
  {
    title: "About",
    links: [
      { label: "About Drip", href: "/about" },
      { label: "Privacy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
      { label: "Cookies", href: "/cookies" },
      { label: "Accessibility", href: "/accessibility" },
    ],
  },
]
