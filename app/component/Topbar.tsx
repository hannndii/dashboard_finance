// ============================================================================
// 🧭 MODULE: NAVIGATION (Topbar)
// Baris atas aplikasi. Menampilkan judul halaman, waktu terkini, dan tombol bahasa.
// ============================================================================

"use client";
import { Menu } from "lucide-react";
import { useEffect, useState } from "react";
import { useLanguage } from "./LanguageProvider";

interface TopbarProps {
  title: string;
  subtitle?: React.ReactNode;
  rightElement?: React.ReactNode;
  onMenuClick?: () => void;
}

export default function Topbar({ title, subtitle, rightElement, onMenuClick }: TopbarProps) {
  const [now, setNow] = useState<Date | null>(null);
  const { dict, lang, setLang } = useLanguage();

  useEffect(() => {
    setNow(new Date());
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedDate = now?.toLocaleDateString(dict.topbar.dateLocale, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const formattedTime = now?.toLocaleTimeString(dict.topbar.dateLocale, {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
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
      <div className="flex items-center gap-4 sm:gap-6">
        {rightElement ? (
          rightElement
        ) : (
          <>
            {/* Default Date and Status */}
            <div className="hidden text-right sm:block pr-4 sm:pr-6 border-r border-slate-200">
              <p className="text-sm font-bold text-slate-900">{formattedDate}</p>
              <p className="text-[10px] uppercase tracking-wider text-slate-400">
                {formattedTime}
              </p>
            </div>
          </>
        )}
        
        {/* Language Toggle */}
        <div className="flex bg-slate-100 rounded-lg p-1 relative w-[72px] shrink-0">
          <button
            onClick={() => setLang("id")}
            className={`flex-1 flex items-center justify-center text-[10px] font-bold py-1.5 rounded-md transition-all z-10 ${
              lang === "id" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
            }`}
          >
            ID
          </button>
          <button
            onClick={() => setLang("en")}
            className={`flex-1 flex items-center justify-center text-[10px] font-bold py-1.5 rounded-md transition-all z-10 ${
              lang === "en" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
            }`}
          >
            EN
          </button>
        </div>
      </div>
    </header>
  );
}
