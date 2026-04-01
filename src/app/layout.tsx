/* eslint-disable @typescript-eslint/ban-ts-comment */
// app/layout.tsx

import type { Metadata } from "next";
import { Inter, Geist } from "next/font/google";
// @ts-ignore: Allow side-effect CSS import without module declarations
import "./globals.css"; // <-- CORRECT IMPORT PATH
import { Toaster } from "react-hot-toast";
import { ReduxProvider } from "@/redux/reduxProvider";
import { cn } from "@/lib/utils";

const geist = Geist({ subsets: ['latin'], variable: '--font-sans' });

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Inventory Management Dashboard",
  description: "Manage your inventory and orders Smartly.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning={true} className={cn("font-sans", geist.variable)}>
      <body className={inter.className} suppressHydrationWarning>
        <ReduxProvider>
          <Toaster
            position="top-center"
            toastOptions={{
              style: {
                background: "#161B22",
                color: "#C9D1D9",
                border: "1px solid #30363D",
              },
            }}
          />
          {children}
        </ReduxProvider>
      </body>
    </html>
  );
}
