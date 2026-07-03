"use client";

import { Bell, Mail, Search, LogOut, Utensils } from "lucide-react";
import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

export default function Topbar() {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/logout", {
      method: "POST",
    });

    router.push("/login");
    router.refresh();
  }

  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedDate = now.toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const formattedTime = now.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: false,
    timeZoneName: "short",
  });

  return (
    <header className="h-16 bg-white from-blue-600 to-indigo-500 flex items-center justify-between px-4 md:px-8 border-r border-slate-200">
      <div className="flex items-center gap-6 text-slate-900">
        <div className="flex flex-col gap-1 border-l border-slate-300 pl-5">
          <div className="text-xs uppercase tracking-[0.24em] text-slate-500">Date</div>
          <div className="font-semibold text-sm">{formattedDate}</div>
          <div className="text-xs uppercase tracking-[0.24em] text-slate-500">Time</div>
          <div className="font-semibold text-sm">{formattedTime}</div>
        </div>
      </div>
    </header>
  );
}
