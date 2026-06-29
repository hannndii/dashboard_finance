"use client";

import { Search, Bell, Mail } from "lucide-react";

export default function Topbar() {
  return (
    <header className="h-16 bg-gradient-to-r from-blue-600 to-indigo-500 flex items-center justify-between px-4 md:px-8">
      <div className="flex items-center gap-4 text-white">
        <Search size={18} />
      </div>

      <div className="flex items-center gap-4 md:gap-6 text-white">
        <Bell size={18} />
        <Mail size={18} />

        <div className="flex items-center gap-3 border-l border-white/30 pl-4 md:pl-5">
          <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-white text-blue-600 flex items-center justify-center font-bold">
            M
          </div>

          <span className="hidden md:block font-medium">
            Administrator
          </span>
        </div>
      </div>
    </header>
  );
}