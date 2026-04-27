import { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, TrendingUp, TrendingDown, Lightbulb,
  Bell, ListChecks, Settings, Scale, MoreHorizontal, X,
} from 'lucide-react';
import { useT } from '../../i18n/useT';

export function Sidebar() {
  const t = useT();
  const location = useLocation();
  const [moreOpen, setMoreOpen] = useState(false);

  // Close "More" menu on navigation
  useEffect(() => { setMoreOpen(false); }, [location.pathname]);

  const links = [
    { to: '/', icon: LayoutDashboard, label: t.dashboard },
    { to: '/income', icon: TrendingUp, label: t.income },
    { to: '/expenses', icon: TrendingDown, label: t.expenses },
    { to: '/tasks', icon: ListChecks, label: t.tasks },
    { to: '/alerts', icon: Bell, label: t.alerts },
    { to: '/insights', icon: Lightbulb, label: t.insights },
    { to: '/settings', icon: Settings, label: t.settings },
  ];

  const mainMobileLinks = links.slice(0, 5);   // Dashboard, Income, Expenses, Tasks, Alerts
  const moreLinks = links.slice(5);             // Insights, Settings

  const isMoreActive = moreLinks.some((l) => location.pathname === l.to);

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-56 shrink-0 bg-white border-e border-beige-200 flex-col min-h-screen">
        <div className="p-5 flex items-center gap-2 border-b border-beige-200">
          <Scale className="text-calm-blue" size={22} />
          <span className="font-semibold text-gray-800 text-lg">Calm Money</span>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {links.map(({ to, icon: Icon, label }) => (
            <NavLink key={to} to={to} end={to === '/'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isActive ? 'bg-calm-blue-light text-calm-blue' : 'text-gray-500 hover:bg-beige-100 hover:text-gray-700'
                }`}>
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="p-4 text-xs text-gray-400 border-t border-beige-200">{t.tagline}</div>
      </aside>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-beige-200 flex items-center justify-around px-1 py-1">
        {mainMobileLinks.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to} end={to === '/'}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-xl transition-colors flex-1 ${
                isActive ? 'text-calm-blue' : 'text-gray-400'
              }`}>
            <Icon size={19} />
            <span className="text-[9px] font-medium leading-tight text-center">{label}</span>
          </NavLink>
        ))}

        {/* More button */}
        <button
          onClick={() => setMoreOpen((o) => !o)}
          className={`flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-xl transition-colors flex-1 ${
            moreOpen || isMoreActive ? 'text-calm-blue' : 'text-gray-400'
          }`}>
          {moreOpen ? <X size={19} /> : <MoreHorizontal size={19} />}
          <span className="text-[9px] font-medium leading-tight">More</span>
        </button>
      </nav>

      {/* More popup */}
      {moreOpen && (
        <>
          <div className="md:hidden fixed inset-0 z-40" onClick={() => setMoreOpen(false)} />
          <div className="md:hidden fixed bottom-16 right-2 z-50 bg-white rounded-2xl shadow-lg border border-beige-200 overflow-hidden w-44">
            {moreLinks.map(({ to, icon: Icon, label }) => (
              <NavLink key={to} to={to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors ${
                    isActive ? 'text-calm-blue bg-calm-blue-light' : 'text-gray-600 hover:bg-beige-50'
                  }`}>
                <Icon size={17} />
                {label}
              </NavLink>
            ))}
          </div>
        </>
      )}
    </>
  );
}
