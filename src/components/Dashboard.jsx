import React from 'react';
import { DollarSign, FileText, CheckCircle, Clock } from 'lucide-react';

function Dashboard({ invoices, onCreateInvoice }) {
  // Calculate metrics
  const totalInvoiced = invoices.reduce((sum, inv) => sum + inv.total, 0);
  const paidAmount = invoices
    .filter(inv => inv.status === 'Paid')
    .reduce((sum, inv) => sum + inv.total, 0);
  const outstandingBalance = totalInvoiced - paidAmount;
  const invoiceCount = invoices.length;

  const kpiCards = [
    {
      title: 'Total Invoiced',
      value: `$${totalInvoiced.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: DollarSign,
      color: '#6366f1'
    },
    {
      title: 'Outstanding Balance',
      value: `$${outstandingBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: Clock,
      color: '#f59e0b'
    },
    {
      title: 'Paid Amount',
      value: `$${paidAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: CheckCircle,
      color: '#10b981'
    },
    {
      title: 'Total Invoices',
      value: invoiceCount.toString(),
      icon: FileText,
      color: '#8b5cf6'
    }
  ];

  // Get recent invoices
  const recentInvoices = invoices.slice(0, 5);

  return (
    <div>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '32px'
      }}>
        <div>
          <h2 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '8px' }}>
            Dashboard
          </h2>
          <p style={{ color: '#94a3b8' }}>
            Overview of your invoice performance
          </p>
        </div>
        <button onClick={onCreateInvoice} className="btn btn-primary">
          Create New Invoice
        </button>
      </div>

      {/* KPI Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '24px',
        marginBottom: '32px'
      }}>
        {kpiCards.map((kpi, index) => {
          const Icon = kpi.icon;
          return (
            <div key={index} className="glass-card kpi-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{
                  padding: '12px',
                  background: `${kpi.color}20`,
                  borderRadius: '12px',
                  color: kpi.color
                }}>
                  <Icon size={24} />
                </div>
                <div>
                  <div className="kpi-value">{kpi.value}</div>
                  <div className="kpi-label">{kpi.title}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Status Distribution */}
      <div className="glass-card" style={{ padding: '24px', marginBottom: '32px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '20px' }}>
          Invoice Status Distribution
        </h3>
        <div style={{ display: 'flex', gap: '24px' }}>
          {['Paid', 'Unpaid', 'Overdue'].map(status => {
            const count = invoices.filter(inv => inv.status === status).length;
            const percentage = invoiceCount > 0 ? (count / invoiceCount) * 100 : 0;
            const colors = {
              Paid: '#10b981',
              Unpaid: '#f59e0b',
              Overdue: '#ef4444'
            };
            
            return (
              <div key={status} style={{ flex: 1 }}>
                <div style={{ 
                  height: '8px', 
                  background: '#334155', 
                  borderRadius: '4px',
                  overflow: 'hidden',
                  marginBottom: '8px'
                }}>
                  <div style={{
                    width: `${percentage}%`,
                    height: '100%',
                    background: colors[status],
                    transition: 'width 0.3s ease'
                  }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                  <span style={{ color: '#94a3b8' }}>{status}</span>
                  <span style={{ color: '#f1f5f9', fontWeight: '500' }}>{count}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Invoices */}
      <div className="glass-card" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '20px' }}>
          Recent Invoices
        </h3>
        {recentInvoices.length > 0 ? (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ textAlign: 'left', borderBottom: '1px solid #334155' }}>
                <th style={{ padding: '12px', color: '#94a3b8', fontWeight: '500' }}>Invoice #</th>
                <th style={{ padding: '12px', color: '#94a3b8', fontWeight: '500' }}>Client</th>
                <th style={{ padding: '12px', color: '#94a3b8', fontWeight: '500' }}>Amount</th>
                <th style={{ padding: '12px', color: '#94a3b8', fontWeight: '500' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentInvoices.map(invoice => (
                <tr key={invoice._id} style={{ borderBottom: '1px solid #334155' }}>
                  <td style={{ padding: '12px', color: '#f1f5f9' }}>{invoice.invoiceNumber}</td>
                  <td style={{ padding: '12px', color: '#f1f5f9' }}>{invoice.client.name}</td>
                  <td style={{ padding: '12px', color: '#f1f5f9' }}>
                    ${invoice.total.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </td>
                  <td style={{ padding: '12px' }}>
                    <span className={`status-badge status-${invoice.status.toLowerCase()}`}>
                      {invoice.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p style={{ color: '#94a3b8', textAlign: 'center', padding: '40px' }}>
            No invoices yet. Create your first invoice to get started!
          </p>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
