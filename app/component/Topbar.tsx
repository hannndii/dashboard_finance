"use client";

import { Bell, Settings } from "lucide-react";
import { useEffect, useState } from "react";

export default function Topbar() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedDate = now.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <header className="w-full h-20 bg-white flex items-center justify-between px-4 md:px-8 border-b border-slate-200 flex-shrink-0">
      {/* Left Section - Title */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Dashboard</h2>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-6">
        {/* Date and Status */}
        <div className="text-right">
          <p className="text-sm font-semibold text-slate-900">{formattedDate}</p>
          <time className="text-xs text-slate-500">{now.toLocaleTimeString()}</time>
        </div>

        {/* Icons */}
        <div className="flex items-center gap-4 pl-4 border-l border-slate-200">
          <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
            <Bell size={20} className="text-slate-600" />
          </button>
          <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
            <Settings size={20} className="text-slate-600" />
          </button>
        </div>
      </div>
    </header>
  );
}
