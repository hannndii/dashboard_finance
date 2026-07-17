// ============================================================================
// 🌐 MODULE: MULTI-LANGUAGE PROVIDER
// React Context API untuk mengelola preferensi bahasa (ID/EN) secara global.
// Terintegrasi dengan cookies untuk penyimpanan persisten.
// ============================================================================

"use client";
import { createContext, useContext, useState, ReactNode } from "react";
import { Dictionary } from "@/lib/dictionaries";

interface LanguageContextType {
  dict: Dictionary;
  lang: string;
  setLang: (lang: string) => Promise<void>;
  isPending: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({
  children,
  initialLang,
  initialDict,
}: {
  children: ReactNode;
  initialLang: string;
  initialDict: Dictionary;
}) {
  const [lang, setLangState] = useState(initialLang);
  const [dict, setDictState] = useState<Dictionary>(initialDict);
  const [isPending, setIsPending] = useState(false);

  const setLang = async (newLang: string) => {
    setIsPending(true);
    try {
      const res = await fetch("/api/language", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ lang: newLang }),
      });
      
      if (res.ok) {
        // Refresh page to trigger server components re-render with new cookie
        window.location.reload();
      }
    } catch (error) {
      console.error("Failed to set language", error);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <LanguageContext.Provider value={{ dict, lang, setLang, isPending }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
