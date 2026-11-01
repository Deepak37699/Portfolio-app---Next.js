import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const outfit = Outfit({
  variable: "--font-heading",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Deepak Kumar Yadav | Full Stack Developer | Python / FastAPI",
  description: "Full Stack Developer and IT Support Engineer specializing in dynamic, database-driven web applications using Python & FastAPI, authenticated account management systems, and reliable web solutions.",
  keywords: ["Deepak Yadav","Deepak Kumar Yadav", "Full Stack Developer", "Python", "FastAPI", "PostgreSQL", "IT Support Engineer", "Nepal"],
  authors: [{ name: "Deepak Kumar Yadav" }],
  openGraph: {
    title: "Deepak Kumar Yadav | Full Stack Developer | Python / FastAPI",
    description: "Full Stack Developer and IT Support Engineer specializing in Python, FastAPI, and robust authenticated web applications.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      data-theme="dark"
      suppressHydrationWarning
      className={`${inter.variable} ${outfit.variable}`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const storedTheme = localStorage.getItem('portfolio-theme');
                  const theme = storedTheme || (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
                  document.documentElement.setAttribute('data-theme', theme);
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
