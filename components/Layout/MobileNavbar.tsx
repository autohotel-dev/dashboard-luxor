// MobileNavbar.tsx - Barra de navegación mobile
'use client';

import { Menu, Bell } from 'lucide-react';
import Link from 'next/link';

interface MobileNavbarProps {
  onMenuClick: () => void;
}

export default function MobileNavbar({ onMenuClick }: MobileNavbarProps) {
  return (
    <nav className="md:hidden bg-gray-900 text-white p-4 flex items-center justify-between fixed top-0 left-0 right-0 z-40">
      {/* Botón Hamburguesa */}
      <button
        onClick={onMenuClick}
        className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
        aria-label="Abrir menú"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Logo */}
      <Link href="/" className="flex items-center space-x-2">
        <span className="text-xl font-bold">🏨 Luxor</span>
      </Link>

      {/* Notificaciones */}
      <Link
        href="/notifications"
        className="p-2 hover:bg-gray-800 rounded-lg transition-colors relative"
      >
        <Bell className="w-6 h-6" />
        {/* Badge de notificaciones */}
        <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
      </Link>
    </nav>
  );
}
