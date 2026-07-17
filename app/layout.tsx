import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next"
import { Poppins } from "next/font/google";
import { cookies } from "next/headers";
import { getDictionary } from "@/lib/dictionaries";
import { LanguageProvider } from "./component/LanguageProvider";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  weight: ["100","200","300","400","500","600","700","800","900"],
});

export const metadata: Metadata = {
  title: "MAMA Finance",
  description: "Dashboard keuangan untuk kantin mama",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const lang = cookieStore.get("lang")?.value || "id";
  const dict = getDictionary(lang);

  return (
    <html lang={lang}>
      <body className={`${poppins.variable} antialiased`}>
        <LanguageProvider initialLang={lang} initialDict={dict}>
          {children}
        </LanguageProvider>
        <Analytics />
      </body>
    </html>
  );
}
