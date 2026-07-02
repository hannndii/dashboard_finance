"use client";

import { useState, useTransition } from "react";
import { loginAdmin } from "../action";
import {
  ShieldCheck,
  Lock,
  User,
  Loader2,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleSubmit(formData: FormData) {
    setError("");

    startTransition(async () => {
      const result = await loginAdmin(formData);

      if (result.status === "success") {
        router.push("/");
      } else {
        setError(result.message || "Login gagal");
      }
    });
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-700 p-6">

      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8">

        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-4">
            <ShieldCheck className="text-blue-600" size={30} />
          </div>

          <h1 className="text-3xl font-bold text-black">
            Admin Login
          </h1>

          <p className="text-slate-500 mt-2 text-center">
            Masuk untuk mengakses dashboard kasir
          </p>
        </div>

        <form action={handleSubmit} className="space-y-5">

          <div>
            <label className="text-sm font-semibold text-black">
              Username
            </label>

            <div className="mt-2 flex items-center border rounded-xl px-4 py-3">
              <User size={18} className="text-slate-400" />
              <input
                name="username"
                className="w-full ml-3 outline-none text-black"
                placeholder="Masukkan username"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold text-black">
              Password
            </label>

            <div className="mt-2 flex items-center border rounded-xl px-4 py-3">
              <Lock size={18} className="text-slate-400" />
              <input
                name="password"
                type="password"
                className="w-full ml-3 outline-none text-black"
                placeholder="Masukkan password"
              />
            </div>
          </div>

          {error && (
            <p className="text-red-500 text-sm font-semibold">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-semibold flex items-center justify-center gap-2"
          >
            {isPending ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Loading...
              </>
            ) : (
              "Login"
            )}
          </button>

        </form>
      </div>
    </div>
  );
}