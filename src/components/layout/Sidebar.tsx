import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, TrendingUp, TrendingDown, Lightbulb,
  Bell, ListChecks, Settings, Leaf,
} from 'lucide-react';

const links = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/income', icon: TrendingUp, label: 'Income' },
  { to: '/expenses', icon: TrendingDown, label: 'Expenses' },
  { to: '/insights', icon: Lightbulb, label: 'Insights' },
  { to: '/tasks', icon: ListChecks, label: 'Tasks' },
  { to: '/alerts', icon: Bell, label: 'Alerts' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

export function Sidebar() {
  return (
    <aside className="w-56 shrink-0 bg-white border-r border-beige-200 flex flex-col min-h-screen">
      <div className="p-5 flex items-center gap-2 border-b border-beige-200">
        <Leaf className="text-calm-green" size={22} />
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
        Your finances, calmly.
      </div>
    </aside>
  );
}
