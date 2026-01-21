import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import "highlight.js/styles/atom-one-dark.css";
import { ThemeProvider } from "@/components/theme-provider";
import Navbar from "@/components/navbar";

// Load Fonts
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Bloglet",
  description: "A minimalist blog platform for developers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${spaceGrotesk.variable} font-sans antialiased bg-background text-foreground`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1 max-w-6xl mx-auto w-full px-8 py-8">
              {children}
            </main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
