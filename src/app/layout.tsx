import "@/styles/globals.css";

import { Inter } from "next/font/google";
import { cookies } from "next/headers";

import { TRPCReactProvider } from "@/trpc/react";
import Providers from "./_providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = {
  title: "ESTIN-HUB",
  description: "ESTIN-HUB is a platform for ESTIN students to share their projects and ideas.",
  verification: {
    google: 'VilpNi6hu483aketPk0q0Hav4pNhtXlo63NBcyxe4dY'
  },
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`font-sans ${inter.variable}`}>
        <TRPCReactProvider cookies={cookies().toString()}>
          <Providers>
            {children}
          </Providers>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
