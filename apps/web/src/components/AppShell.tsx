import { BarChart3, BookOpenCheck, BrainCircuit, Layers3 } from "lucide-react";
import { NavLink } from "react-router-dom";
import type { ReactNode } from "react";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <NavLink className="brand" to="/" aria-label="Deva dashboard">
          <span className="brand-mark">D</span>
          <span>
            <strong>Deva</strong>
            <small>OA practice lab</small>
          </span>
        </NavLink>

        <nav className="primary-nav" aria-label="Primary navigation">
          <NavLink to="/" end>
            <BarChart3 size={18} /> Dashboard
          </NavLink>
          <a href="#mock-library">
            <BookOpenCheck size={18} /> Mock library
          </a>
        </nav>

        <div className="sidebar-section">
          <p className="sidebar-label">V2 library</p>
          <div className="track-card">
            <div className="track-icon"><Layers3 size={18} /></div>
            <div>
              <strong>12 topic tracks</strong>
              <span>36 strict mocks · 72 problems</span>
            </div>
          </div>
        </div>

        <div className="sidebar-note">
          <BrainCircuit size={18} />
          <div>
            <strong>Practice rule</strong>
            <span>Read constraints before choosing the pattern.</span>
          </div>
        </div>
      </aside>
      <main className="main-content">{children}</main>
    </div>
  );
}
