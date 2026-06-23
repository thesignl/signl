import Navbar from '@/components/layout/Navbar'
import AdminGuard from '@/features/admin/layout/AdminGuard'
import AdminSidebar from '@/features/admin/layout/AdminSidebar'
import AdminTopbar from '@/features/admin/layout/AdminTopbar'

export const metadata = { title: { default: 'Admin · Signl', template: '%s · Admin · Signl' } }

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    
    <AdminGuard>
      <Navbar />
      <div className="admin-shell">
        <AdminSidebar />
        <div className="admin-main">
          <AdminTopbar />
          <main id="main" className="admin-content">
            {children}
          </main>
        </div>
      </div>
    </AdminGuard>
  )
}
