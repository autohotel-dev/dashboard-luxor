// Sidebar.tsx - Navegación lateral
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  CalendarCheck, 
  Users, 
  MessageSquare, 
  Bell,
  Search,
  Settings,
  X,
  LucideIcon
} from 'lucide-react';
import ThemeToggle from './ThemeToggle';

interface MenuItem {
  name: string;
  href: string;
  icon: LucideIcon;
}

const menuItems: MenuItem[] = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Reservas', href: '/reservations', icon: CalendarCheck },
  { name: 'Usuarios', href: '/users', icon: Users },
  { name: 'Mensajes', href: '/messages', icon: MessageSquare },
  { name: 'Notificaciones', href: '/notifications', icon: Bell },
  { name: 'Búsqueda', href: '/search', icon: Search },
];

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ isOpen = false, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className={`
      bg-gray-900 text-white w-64 h-screen p-4 flex flex-col fixed left-0 top-0 z-50
      transition-transform duration-300 ease-in-out
      ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      md:translate-x-0
    `}>
      {/* Header con botón cerrar (solo mobile) */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-center">🏨 Auto Hotel Luxor</h1>
          <p className="text-xs text-gray-400 text-center mt-1">Dashboard</p>
        </div>
        {/* Botón cerrar solo en mobile */}
        <button
          onClick={onClose}
          className="md:hidden p-2 hover:bg-gray-800 rounded-lg transition-colors"
          aria-label="Cerrar menú"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="space-y-2 flex-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => onClose?.()} // Cerrar drawer al hacer click
              className={`
                flex items-center space-x-3 px-4 py-3 rounded-lg
                transition-colors duration-200
                ${isActive 
                  ? 'bg-blue-600 text-white shadow-lg' 
                  : 'text-gray-200 hover:bg-gray-800 hover:text-white'
                }
              `}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-gray-800 pt-4 mt-4">
        <div className="flex items-center justify-center gap-4">
          <ThemeToggle />
          <Link
            href="/settings"
            className="p-2 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-colors duration-200"
            title="Configuración"
          >
            <Settings className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </aside>
  );
}
