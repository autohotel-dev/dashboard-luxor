// LayoutWrapper.tsx - Wrapper del layout con estado del sidebar
'use client';

import { useState } from 'react';
import Sidebar from './Sidebar';
import MobileNavbar from './MobileNavbar';

interface LayoutWrapperProps {
  children: React.ReactNode;
}

export default function LayoutWrapper({ children }: LayoutWrapperProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <>
      {/* Mobile Navbar */}
      <MobileNavbar onMenuClick={toggleSidebar} />

      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

      {/* Overlay (solo mobile) */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={closeSidebar}
          aria-label="Cerrar menú"
        />
      )}

      {/* Main Content */}
      <main className="min-h-screen md:ml-64 pt-16 md:pt-0">
        {children}
      </main>
    </>
  );
}
