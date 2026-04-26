import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, TrendingUp, TrendingDown, Lightbulb,
  Bell, ListChecks, Settings, Scale,
} from 'lucide-react';
import { useT } from '../../i18n/useT';

export function Sidebar() {
  const t = useT();

  const links = [
    { to: '/', icon: LayoutDashboard, label: t.dashboard },
    { to: '/income', icon: TrendingUp, label: t.income },
    { to: '/expenses', icon: TrendingDown, label: t.expenses },
    { to: '/insights', icon: Lightbulb, label: t.insights },
    { to: '/tasks', icon: ListChecks, label: t.tasks },
    { to: '/alerts', icon: Bell, label: t.alerts },
    { to: '/settings', icon: Settings, label: t.settings },
  ];

  const mobileLinks = [
    links[0], // Dashboard
    links[1], // Income
    links[2], // Expenses
    links[3], // Insights
    links[6], // Settings
  ];

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
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-calm-blue-light text-calm-blue'
                    : 'text-gray-500 hover:bg-beige-100 hover:text-gray-700'
                }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="p-4 text-xs text-gray-400 border-t border-beige-200">
          {t.tagline}
        </div>
      </aside>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-beige-200 flex items-center justify-around px-2 py-1">
        {mobileLinks.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl transition-colors ${
                isActive ? 'text-calm-blue' : 'text-gray-400'
              }`
            }
          >
            <Icon size={20} />
            <span className="text-[10px] font-medium">{label}</span>
          </NavLink>
        ))}
      </nav>
    </>
  );
}
