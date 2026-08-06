import type { Metadata } from "next";
import { Inter, Fira_Code } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const fira = Fira_Code({
  subsets: ["latin"],
  variable: "--font-fira",
});

export const metadata: Metadata = {
  title: "Ariel J. Tshibangu | Développeur Full-Stack & Expert en Cybersécurité",
  description:
    "Portfolio d'Ariel J. Tshibangu — Développeur Full-Stack & Expert en Cybersécurité. Applications web et mobiles modernes, performantes et sécurisées.",
  authors: [{ name: "Ariel J. Tshibangu" }],
  openGraph: {
    title: "Ariel J. Tshibangu — Développeur Full-Stack & Expert en Cybersécurité",
    description:
      "Découvrez le portfolio d'Ariel J. Tshibangu. Applications web/mobiles sécurisées, DevOps et solutions cybersécurité.",
    url: "https://ariel-jason-tshibangu.vercel.app/",
    type: "website",
    images: ["/images/og-image.png"],
  },
  icons: {
    icon: [
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" className={`${inter.variable} ${fira.variable}`} suppressHydrationWarning>
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
          crossOrigin="anonymous"
        />
      </head>
      {/* suppressHydrationWarning: extensions navigateur (traduction, password managers) modifient le DOM */}
      <body className="min-h-screen antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
