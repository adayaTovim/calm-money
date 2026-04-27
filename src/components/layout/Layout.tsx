import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';

export function Layout() {
  return (
    <div className="flex min-h-screen bg-beige-50">
      <Sidebar />
      <main className="flex-1 overflow-y-auto pb-24 md:pb-0">
        <Outlet />
      </main>
    </div>
  );
}
