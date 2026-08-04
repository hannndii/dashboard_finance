// ============================================================================
// MODULE: CORE LAYOUT (AppShell)
// Pembungkus utama aplikasi. Mengatur tata letak responsif, Sidebar, dan Topbar.
// ============================================================================

"use client";
import { useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function AppShell({
  children,
  title = "Dashboard",
  subtitle,
  rightElement,
}: {
  children: React.ReactNode;
  title?: string;
  subtitle?: React.ReactNode;
  rightElement?: React.ReactNode;
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"} shrink-0`}>
        <Sidebar onClose={() => setIsMobileMenuOpen(false)} />
      </div>

      {/* Main Content Area */}
      <div className="flex w-full min-w-0 flex-1 flex-col overflow-hidden">
        {/* Fixed Topbar */}
        <Topbar 
          title={title} 
          subtitle={subtitle} 
          rightElement={rightElement}
          onMenuClick={() => setIsMobileMenuOpen(true)} 
        />

        {/* Scrollable Main Content */}
        <main className="relative flex-1 overflow-x-hidden overflow-y-auto">
          <div className="min-h-full p-4 md:p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}