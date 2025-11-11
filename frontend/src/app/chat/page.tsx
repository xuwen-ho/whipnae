"use client";

import { BottomNav } from "@/components/layout/BottomNav";
import Link from "next/link";
import { FiHome, FiMessageCircle, FiUser } from "react-icons/fi";


const profileNavItems = [
  { id: "home", link: "/", label: "Home", icon: FiHome },
  { id: "Chat", link: "/chat", label: "Chat", icon: FiMessageCircle, isActive: true  },
  { id: "profile", link: "/profile", label: "Profile", icon: FiUser},
];

export default function ChatPage() {
  return (
    <div>
      <main className="flex min-h-screen flex-col items-center justify-center gap-6 p-8">
        <h1 className="text-4xl font-semibold">Chat with the Assistant</h1>
        <p className="text-center text-lg text-muted-foreground">
          Start a conversation with the AI assistant. This page will stream messages and show responses in real time.
        </p>
        <Link
          href="/"
          className="rounded-md bg-primary px-4 py-2 text-primary-foreground shadow-sm"
        >
          Back to Home
        </Link>
      </main>
      <BottomNav items={profileNavItems} />
    </div>
  );
}
