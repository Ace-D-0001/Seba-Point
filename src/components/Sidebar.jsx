import React from 'react';
import { LayoutDashboard, FileText, PlusCircle, History } from 'lucide-react';

function Sidebar({ currentView, onViewChange }) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'editor', label: 'New Invoice', icon: PlusCircle },
    { id: 'history', label: 'History', icon: History }
  ];

  return (
    <aside className="glass-card" style={{
      width: '260px',
      margin: '24px',
      padding: '24px',
      display: 'flex',
      flexDirection: 'column',
      height: 'calc(100vh - 48px)',
      position: 'sticky',
      top: '24px'
    }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ 
          fontSize: '24px', 
          fontWeight: '700',
          background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
          '-webkit-background-clip': 'text',
          '-webkit-text-fill-color': 'transparent',
          backgroundClip: 'text'
        }}>
          InvoicePro
        </h1>
        <p style={{ fontSize: '14px', color: '#94a3b8', marginTop: '8px' }}>
          Professional Invoice Manager
        </p>
      </div>

      <nav style={{ flex: 1 }}>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => {
                if (item.id === 'editor') {
                  onViewChange('editor');
                } else {
                  onViewChange(item.id);
                }
              }}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                marginBottom: '8px',
                background: isActive ? 'rgba(99, 102, 241, 0.2)' : 'transparent',
                border: 'none',
                borderRadius: '8px',
                color: isActive ? '#6366f1' : '#94a3b8',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                textAlign: 'left',
                fontSize: '14px',
                fontWeight: '500'
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.target.style.background = 'rgba(99, 102, 241, 0.1)';
                  e.target.style.color = '#6366f1';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.target.style.background = 'transparent';
                  e.target.style.color = '#94a3b8';
                }
              }}
            >
              <Icon size={20} />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div style={{
        padding: '16px',
        background: 'rgba(99, 102, 241, 0.1)',
        borderRadius: '12px',
        marginTop: 'auto'
      }}>
        <p style={{ fontSize: '12px', color: '#94a3b8' }}>
          Need help? Check out our documentation.
        </p>
      </div>
    </aside>
  );
}

export default Sidebar;
