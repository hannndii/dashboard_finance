"use client";

import { useState, useTransition } from "react";
import { loginAdmin } from "./action";
import {
  ShieldCheck,
  Lock,
  User,
  Loader2,
  Utensils,
  Eye,
  EyeOff
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useLanguage } from "./component/LanguageProvider";

export default function LoginPage() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { dict } = useLanguage();

  async function handleSubmit(formData: FormData) {
    setError("");

    startTransition(async () => {
      const result = await loginAdmin(formData);

      if (result.status === "success") {
        router.push("/dashboard");
      } else {
        setError(result.message || "Login gagal");
      }
    });
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <div className="w-full max-w-[400px] bg-white rounded-[2rem] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 sm:p-10">
        
        {/* Header */}
        <div className="flex flex-col items-center mb-10 text-center">
          <div className="w-14 h-14 rounded-2xl bg-slate-900 flex items-center justify-center mb-6 shadow-md">
            <Utensils className="text-white" size={24} />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">
            Kantin PB AU
          </h1>
          <p className="text-xs text-slate-500">
            Selamat Datang di Menu Dashboard Finance
          </p>
        </div>

        <form action={handleSubmit} className="space-y-6">
          {/* Username */}
          <div className="space-y-2">
            <label htmlFor="username" className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
              {dict.login.username}
            </label>
            <div className="flex items-center rounded-xl bg-slate-50 px-4 py-3.5 border border-slate-100 transition focus-within:border-slate-300 focus-within:bg-white">
              <User size={16} className="text-slate-400 shrink-0" />
              <input
                id="username"
                name="username"
                autoComplete="username"
                className="w-full ml-3 bg-transparent outline-none text-sm font-medium text-slate-900 placeholder-slate-400"
                placeholder={dict.login.usernamePlaceholder}
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                {dict.login.password}
              </label>
              <button type="button" className="text-[10px] font-bold text-slate-900 hover:underline">
                Lupa?
              </button>
            </div>
            <div className="flex items-center rounded-xl bg-slate-50 px-4 py-3.5 border border-slate-100 transition focus-within:border-slate-300 focus-within:bg-white">
              <Lock size={16} className="text-slate-400 shrink-0" />
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                className="w-full ml-3 bg-transparent outline-none text-sm font-medium text-slate-900 placeholder-slate-400"
                placeholder="••••••••"
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                className="ml-2 text-slate-400 hover:text-slate-600 focus:outline-none"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Remember Me */}
          <div className="flex items-center gap-2">
            <input 
              type="checkbox" 
              id="remember" 
              className="w-4 h-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900 hover:cursor-pointer"
            />
            <label htmlFor="remember" className="text-xs font-medium text-slate-500 hover:cursor-pointer">
              Ingatkan Saya!
            </label>
          </div>

          {error && (
            <p className="text-red-500 text-xs font-semibold text-center">
              {error}
            </p>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white py-3.5 rounded-xl text-sm font-bold transition-all disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isPending ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 size={16} className="animate-spin" />
                {dict.login.buttonLoading}
              </span>
            ) : (
              dict.login.button
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-10 pt-6 border-t border-slate-100 text-center">
          <p className="text-[10px] font-medium text-slate-400">
            © 2024 Canteen System. All rights reserved.
          </p>
        </div>

      </div>
    </div>
  );
}