import "@/styles/globals.css";

import { Inter } from "next/font/google";
import { cookies } from "next/headers";

import { TRPCReactProvider } from "@/trpc/react";
import Providers from "./_providers";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import Script from 'next/script'

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
            <Navbar />
            <Script
              async
              src="https://umami-eta-peach.vercel.app/script.js"
              data-website-id="d96d0306-5105-4d64-90c6-5b0ffd050c90"
            />
            {children}
            <Footer />
          </Providers>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
