import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "Sentinel — KYC/AML Operations",
  description: "AI-powered compliance orchestration platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans">
        {children}
        <Toaster
          theme="light"
          position="bottom-right"
          toastOptions={{
            className: "bg-card border-border text-foreground",
          }}
        />
      </body>
    </html>
  );
}
