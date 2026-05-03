import { useState } from 'react';
import { Sun, Moon, Database, Menu, X, Zap } from 'lucide-react';
import { useTheme } from '../context/useStore';
import { DataPanel } from './DataPanel';
import type { Page } from '../types';

interface Props {
  page: Page;
  setPage: (p: Page) => void;
}

const tabs: { id: Page; label: string }[] = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'tasks', label: 'Tasks' },
  { id: 'stats', label: 'Stats' },
];

export function Header({ page, setPage }: Props) {
  const { theme, toggleTheme } = useTheme();
  const [showData, setShowData] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  function navigate(p: Page) {
    setPage(p);
    setMenuOpen(false);
  }

  const iconBtn: React.CSSProperties = {
    background: 'var(--bg-muted)',
    border: '1px solid var(--border)',
    borderRadius: '50%',
    width: 34,
    height: 34,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    color: 'var(--text-muted)',
  };

  return (
    <>
      <header style={{
        background: 'var(--bg-card)',
        borderBottom: '1px solid var(--border)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}>
        <div style={{
          maxWidth: 960,
          margin: '0 auto',
          padding: '0 16px',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          height: 56,
        }}>
          {/* Logo */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 7,
            fontWeight: 800,
            fontSize: 17,
            color: 'var(--primary)',
            userSelect: 'none',
            flexShrink: 0,
            marginRight: 8,
            fontFamily: 'monospace',
            letterSpacing: '-0.5px',
          }}>
            <Zap size={18} fill="var(--primary)" strokeWidth={1.5} />
            <span>DevPulse</span>
          </div>

          {/* Desktop nav */}
          <nav style={{ display: 'flex', gap: 2, flex: 1 }} className="desktop-nav">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => navigate(tab.id)}
                style={{
                  background: page === tab.id ? 'var(--primary-light)' : 'transparent',
                  color: page === tab.id ? 'var(--primary)' : 'var(--text-muted)',
                  border: 'none',
                  borderRadius: 10,
                  padding: '6px 14px',
                  fontWeight: page === tab.id ? 700 : 500,
                  fontSize: 14,
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                  whiteSpace: 'nowrap',
                }}
              >
                {tab.label}
              </button>
            ))}
          </nav>

          <div style={{ flex: 1 }} className="mobile-spacer" />

          {/* Right icons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
            <button onClick={() => setShowData(true)} aria-label="Data management" title="Export / Import data" style={iconBtn}>
              <Database size={15} />
            </button>

            <button onClick={toggleTheme} aria-label="Toggle theme" style={iconBtn}>
              {theme === 'light' ? <Moon size={15} /> : <Sun size={15} />}
            </button>

            <button
              onClick={() => setMenuOpen((o) => !o)}
              aria-label="Toggle menu"
              className="mobile-menu-btn"
              style={{ ...iconBtn, display: 'none' }}
            >
              {menuOpen ? <X size={16} /> : <Menu size={16} />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        {menuOpen && (
          <div style={{
            borderTop: '1px solid var(--border)',
            background: 'var(--bg-card)',
            padding: '8px 16px 12px',
          }}>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => navigate(tab.id)}
                style={{
                  display: 'block',
                  width: '100%',
                  textAlign: 'left',
                  background: page === tab.id ? 'var(--primary-light)' : 'transparent',
                  color: page === tab.id ? 'var(--primary)' : 'var(--text-muted)',
                  border: 'none',
                  borderRadius: 10,
                  padding: '10px 14px',
                  fontWeight: page === tab.id ? 700 : 500,
                  fontSize: 15,
                  cursor: 'pointer',
                  marginBottom: 2,
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        )}
      </header>

      {showData && <DataPanel onClose={() => setShowData(false)} />}
    </>
  );
}
