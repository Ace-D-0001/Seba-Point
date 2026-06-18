import React from 'react';
import { LayoutDashboard, FileText, PlusCircle, Settings, LogOut, FilePlus2, Home } from 'lucide-react';

function Sidebar({ currentView, onNavigate, onCreateInvoice }) {
  return (
    <aside className="sidebar no-print">
      <div className="sidebar-brand">
        <FilePlus2 size={28} />
        <span>Seba Invoice</span>
      </div>

      <button 
        className="btn btn-primary" 
        onClick={onCreateInvoice}
        style={{
          width: '100%',
          marginBottom: '2rem',
          justifyContent: 'center',
          padding: '0.85rem'
        }}
      >
        <PlusCircle size={18} />
        <span>New Invoice</span>
      </button>

      <ul className="sidebar-menu">
        <li>
          <a 
            href="#landing"
            className="sidebar-item"
            onClick={(e) => {
              e.preventDefault();
              onNavigate('landing');
            }}
          >
            <Home size={18} />
            <span>Public Site</span>
          </a>
        </li>
        <li>
          <a 
            href="#dashboard"
            className={`sidebar-item ${currentView === 'dashboard' ? 'active' : ''}`}
            onClick={(e) => {
              e.preventDefault();
              onNavigate('dashboard');
            }}
          >
            <LayoutDashboard size={18} />
            <span>Dashboard</span>
          </a>
        </li>
        <li>
          <a 
            href="#history"
            className={`sidebar-item ${currentView === 'history' ? 'active' : ''}`}
            onClick={(e) => {
              e.preventDefault();
              onNavigate('history');
            }}
          >
            <FileText size={18} />
            <span>Invoice History</span>
          </a>
        </li>
      </ul>

      <div className="sidebar-footer">
        <p>Seba Invoicing v1.0.0</p>
        <p>© 2026 SebaPoint</p>
      </div>
    </aside>
  );
}

export default Sidebar;
