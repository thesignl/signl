import AccountGuard from '@/features/account/AccountGuard'
import AccountSidebar from '@/features/account/AccountSidebar'

export const metadata = {
  title: {
    default: 'Account · Signl',
    template: '%s · Account · Signl',
  },
}

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AccountGuard>
      <div className="account-shell">
        <AccountSidebar />
        <div className="account-content">
          {children}
        </div>
      </div>
    </AccountGuard>
  )
}
