import React from 'react';
import { useNavigate, Link, Outlet, useLocation } from 'react-router-dom';
import { FileSpreadsheet, BarChart3, Users, Settings, LogOut, Home } from 'lucide-react';

function OwnerPanel({ user, onLogout, settings }) {
  const navigate = useNavigate();
  const location = useLocation();
  const pathname = location.pathname;

  const siteLogo = settings?.logo || '/logo.png';
  const siteName = settings?.siteName || 'SebaPoint';

  // Check which tab is currently active
  const isBillingActive = pathname === '/owner-panel' || pathname.startsWith('/owner-panel/invoices');
  const isStatsActive = pathname === '/owner-panel/stats';
  const isEmployeesActive = pathname === '/owner-panel/employees';
  const isCmsActive = pathname.startsWith('/owner-panel/cms');

  const NavItem = ({ to, icon: Icon, label, isActive }) => (
    <Link 
      to={to}
      style={{
        display: 'flex', alignItems: 'center', gap: '0.75rem', width: '100%', padding: '1rem 1.25rem', 
        border: 'none', borderRadius: '12px',
        backgroundColor: isActive ? 'rgba(239, 68, 68, 0.08)' : 'transparent', 
        color: isActive ? '#ef4444' : '#475569',
        fontWeight: isActive ? 700 : 600, cursor: 'pointer', textAlign: 'left', 
        transition: 'all 0.2s ease',
        textDecoration: 'none',
        position: 'relative',
        overflow: 'hidden'
      }}
      onMouseOver={(e) => { if (!isActive) e.currentTarget.style.backgroundColor = 'rgba(241, 245, 249, 0.8)'; }}
      onMouseOut={(e) => { if (!isActive) e.currentTarget.style.backgroundColor = 'transparent'; }}
    >
      {isActive && (
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '4px', backgroundColor: '#ef4444', borderTopRightRadius: '4px', borderBottomRightRadius: '4px' }} />
      )}
      <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
      <span>{label}</span>
    </Link>
  );

  return (
    <div className="owner-shell">
      
      {/* Top Banner (Glassmorphism Deep Red Theme) */}
      <header className="owner-header no-print">
        <div className="owner-header-inner">
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ backgroundColor: 'white', padding: '0.3rem', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img src={siteLogo} alt={siteName} style={{ height: '30px', objectFit: 'contain' }} />
            </div>
            <div>
              <h1 style={{ fontSize: '1.15rem', color: 'white', fontFamily: 'var(--font-display)', margin: 0, fontWeight: 700 }}>
                {siteName} Owner
              </h1>
            </div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <Link 
              to="/home" 
              style={{ 
                color: '#fca5a5', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.35rem',
                fontSize: '0.9rem', fontWeight: 600, transition: 'color 0.2s'
              }}
              onMouseOver={(e) => e.currentTarget.style.color = '#ffffff'}
              onMouseOut={(e) => e.currentTarget.style.color = '#fca5a5'}
            >
              <Home size={16} />
              <span className="hidden-xs">View Site</span>
            </Link>

            <div style={{ height: '20px', width: '1px', backgroundColor: 'rgba(255, 255, 255, 0.15)' }} className="hidden-xs" />

            {/* User Avatar & Info */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <div style={{ 
                width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#ef4444', color: 'white', 
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.85rem',
                boxShadow: '0 2px 8px rgba(239, 68, 68, 0.2)'
              }}>
                {user?.email ? user.email.charAt(0).toUpperCase() : 'O'}
              </div>
              <span className="hidden-xs" style={{ fontSize: '0.9rem', color: '#fca5a5', fontWeight: 500 }}>
                {user?.email}
              </span>
            </div>

            <div style={{ height: '20px', width: '1px', backgroundColor: 'rgba(255, 255, 255, 0.15)' }} />

            {/* Log Out */}
            <button 
              onClick={onLogout}
              style={{ 
                background: 'none', border: 'none', color: '#fca5a5', display: 'flex', alignItems: 'center', gap: '0.35rem',
                padding: '0.25rem', cursor: 'pointer', transition: 'color 0.2s'
              }}
              onMouseOver={(e) => e.currentTarget.style.color = '#ef4444'}
              onMouseOut={(e) => e.currentTarget.style.color = '#fca5a5'}
              title="Log Out"
            >
              <LogOut size={18} />
              <span className="hidden-xs" style={{ fontSize: '0.9rem', fontWeight: 600 }}>Log Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Layout Container */}
      <div className="owner-container">
        
        {/* Navigation Sidebar (Desktop Only) */}
        <aside className="owner-sidebar-desktop no-print">
          <div className="owner-sidebar-card">
            <NavItem to="/owner-panel" icon={FileSpreadsheet} label="Billing Portal" isActive={isBillingActive} />
            <NavItem to="/owner-panel/stats" icon={BarChart3} label="Invoice Statistics" isActive={isStatsActive} />
            <NavItem to="/owner-panel/employees" icon={Users} label="Employee Management" isActive={isEmployeesActive} />
            <NavItem to="/owner-panel/cms" icon={Settings} label="Global Settings" isActive={isCmsActive} />
          </div>
        </aside>

        {/* Content Pane */}
        <main className="owner-content-pane">
          <Outlet />
        </main>

      </div>

      {/* Mobile Bottom Navigation (Mobile Only) */}
      <nav className="owner-bottom-nav no-print">
        <div className="owner-bottom-nav-inner">
          <Link to="/owner-panel" className={`owner-bottom-nav-item ${isBillingActive ? 'active' : ''}`}>
            <FileSpreadsheet size={20} />
            <span>Billing</span>
          </Link>
          <Link to="/owner-panel/stats" className={`owner-bottom-nav-item ${isStatsActive ? 'active' : ''}`}>
            <BarChart3 size={20} />
            <span>Stats</span>
          </Link>
          <Link to="/owner-panel/employees" className={`owner-bottom-nav-item ${isEmployeesActive ? 'active' : ''}`}>
            <Users size={20} />
            <span>Employees</span>
          </Link>
          <Link to="/owner-panel/cms" className={`owner-bottom-nav-item ${isCmsActive ? 'active' : ''}`}>
            <Settings size={20} />
            <span>Settings</span>
          </Link>
        </div>
      </nav>

    </div>
  );
}

export default OwnerPanel;
