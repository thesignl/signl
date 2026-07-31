export interface NavItem {
  href: string
  label: string
  icon: string
  exact?: boolean
  badge?: number
}

export interface NavGroup {
  label: string
  items: NavItem[]
}

export const ADMIN_NAV: NavGroup[] = [
  {
    label: 'Overview',
    items: [
      { href: '/admin', label: 'Dashboard', icon: 'dashboard', exact: true },
    ],
  },
  {
    label: 'Content',
    items: [
      { href: '/admin/articles', label: 'Articles', icon: 'articles' },
      { href: '/admin/placement', label: 'Hero & Placement', icon: 'placement' },
    ],
  },
  {
    label: 'People',
    items: [
      { href: '/admin/authors', label: 'Authors', icon: 'authors' },
      { href: '/admin/users', label: 'Users', icon: 'users' },
    ],
  },
  {
    label: 'Taxonomy',
    items: [
      { href: '/admin/categories', label: 'Categories', icon: 'categories' },
      { href: '/admin/tags', label: 'Tags', icon: 'tags' },
    ],
  },
  {
    label: 'Growth',
    items: [
      { href: '/admin/campaigns', label: 'Campaigns', icon: 'newsletter' },
      { href: '/admin/newsletter', label: 'Subscribers', icon: 'users' },
      { href: '/admin/analytics', label: 'Analytics', icon: 'analytics' },
    ],
  },
]
