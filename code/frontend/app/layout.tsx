import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "hello-word-8",
  description: "Hello Word pipeline proof"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
