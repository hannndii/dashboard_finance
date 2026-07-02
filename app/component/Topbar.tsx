"use client";

import {
  Bell,
  Mail,
  Search,
  LogOut,
} from "lucide-react";

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

  return (
    <header className="h-16 bg-gradient-to-r from-blue-600 to-indigo-500 flex items-center justify-between px-4 md:px-8">
      <div className="flex items-center gap-4 text-white"></div>
      <div className="flex items-center gap-6 text-white">

        <div className="flex items-center gap-3 border-l border-white/30 pl-5">
          <div className="w-10 h-10 rounded-full bg-white text-blue-600 flex items-center justify-center font-bold">
            A
          </div>

          <span className="hidden md:block font-medium">
            Administrator
          </span>

          <button
            onClick={handleLogout}
            className="ml-2 bg-red-500 hover:bg-red-600 p-2 rounded-lg"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </header>
  );
}