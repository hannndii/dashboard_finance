import { Bell, Mail, Search } from "lucide-react";

export default function Topbar() {
  return (
    <header className="h-16 bg-gradient-to-r from-blue-600 to-indigo-500 flex items-center justify-between px-8">
      <Search size={18} className="text-white" />

      <div className="flex items-center gap-6 text-white">
        <Bell size={18} />
        <Mail size={18} />

        <div className="flex items-center gap-3 border-l border-white/30 pl-5">
          <div className="w-10 h-10 rounded-full bg-white text-blue-600 flex items-center justify-center font-bold">
            M
          </div>
          <span className="font-medium">Maman Ketoprak</span>
        </div>
      </div>
    </header>
  );
}