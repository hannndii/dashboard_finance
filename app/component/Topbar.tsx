"use client";

import { Bell, Settings, Menu } from "lucide-react";
import { useEffect, useState } from "react";

interface TopbarProps {
  title: string;
  subtitle?: React.ReactNode;
  rightElement?: React.ReactNode;
  onMenuClick?: () => void;
}

export default function Topbar({ title, subtitle, rightElement, onMenuClick }: TopbarProps) {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedDate = now?.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const formattedTime = now?.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  return (
    <header className="flex h-20 w-full shrink-0 items-center justify-between border-b border-slate-200 bg-white px-4 md:px-8">
      {/* Left Section - Title */}
      <div className="flex items-center gap-4">
        {onMenuClick && (
          <button
            onClick={onMenuClick}
            className="-ml-2 rounded-lg p-2 text-slate-500 hover:bg-slate-50 hover:text-slate-900 md:hidden hover:cursor-pointer"
          >
            <Menu size={24} />
          </button>
        )}
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-bold text-slate-900 md:text-2xl">{title}</h2>
          {subtitle && (
            <div className="hidden sm:block">
              {subtitle}
            </div>
          )}
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-6">
        {rightElement ? (
          rightElement
        ) : (
          <>
            {/* Default Date and Status */}
            <div className="hidden text-right sm:block">
              <p className="text-sm font-bold text-slate-900">{formattedDate}</p>
              <p className="text-[10px] uppercase tracking-wider text-slate-400">
                {formattedTime}
              </p>
            </div>

            {/* Icons */}
            <div className="flex items-center gap-3 border-l border-slate-200 pl-6">
              <button className="rounded-full p-2 text-slate-400 transition-colors hover:bg-slate-50 hover:text-slate-900 hover:cursor-pointer">
                <Bell size={18} />
              </button>
              <button className="rounded-full p-2 text-slate-400 transition-colors hover:bg-slate-50 hover:text-slate-900 hover:cursor-pointer">
                <Settings size={18} />
              </button>
            </div>
          </>
        )}
      </div>
    </header>
  );
}
