'use client'

import Link from 'next/link'
import EmptyState from '@/components/ui/EmptyState'

export default function BillingPage() {
  return (
    <div className="acct-page">
      <div className="acct-page-header">
        <h1 className="acct-page-title">Billing</h1>
      </div>

      {/* Payment history placeholder */}
      <div className="billing-section">
        <div className="billing-section-head">
          <div className="billing-section-label">Payment history</div>
        </div>

        <div className="billing-table-wrap">
          <table className="billing-table" aria-label="Payment history">
            <thead>
              <tr>
                <th>Date</th>
                <th>Description</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Invoice</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={5} className="billing-empty-row">
                  <EmptyState
                    title="No payments on record"
                    description="Invoices and transaction history will appear here once payment processing is enabled."
                    action={
                      <Link href="/pricing" className="btn btn-sm btn-secondary">
                        View plans
                      </Link>
                    }
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Invoice placeholder */}
      <div className="billing-section">
        <div className="billing-section-head">
          <div className="billing-section-label">Invoices</div>
        </div>
        <div className="billing-placeholder-note">
          PDF invoices will be available here after your first payment.
        </div>
      </div>
    </div>
  )
}
