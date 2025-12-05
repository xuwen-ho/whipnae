import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { AccessibilityProvider } from "@/components/accessibility/AccessibilityProvider";
import { RemoteConnectionProvider } from "@/components/remote";
import { ChatWidgetProvider } from "@/components/chat";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const openDyslexic = localFont({
  src: [
    {
      path: "../../public/fonts/opendyslexic-0.91.12/compiled/OpenDyslexic-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/opendyslexic-0.91.12/compiled/OpenDyslexic-Bold.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../public/fonts/opendyslexic-0.91.12/compiled/OpenDyslexic-Italic.woff2",
      weight: "400",
      style: "italic",
    },
    {
      path: "../../public/fonts/opendyslexic-0.91.12/compiled/OpenDyslexic-Bold-Italic.woff2",
      weight: "700",
      style: "italic",
    },
  ],
  variable: "--font-dyslexic",
});

export const metadata: Metadata = {
  title: "Whipnae - Financial Assistant",
  description: "Your personalized financial planning assistant",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${openDyslexic.variable} antialiased`}
      >
        <ChatWidgetProvider>
          <RemoteConnectionProvider>
            {children}
          </RemoteConnectionProvider>
        </ChatWidgetProvider>
        <AccessibilityProvider />
      </body>
    </html>
  );
}
