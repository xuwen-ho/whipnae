"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiHome, FiMessageCircle, FiUser } from "react-icons/fi";

type NavItem = {
  id: string;
  link: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
};

type BottomNavProps = {
  items?: NavItem[];
};

const defaultItems: NavItem[] = [
  { id: "home", link: "/", label: "Home", icon: FiHome },
  { id: "chat", link: "/chat", label: "Chat", icon: FiMessageCircle },
  { id: "profile", link: "/profile", label: "Profile", icon: FiUser },
];

export function BottomNav({ items = defaultItems }: BottomNavProps) {
  const pathname = usePathname();

  return (
    <nav className="sticky bottom-0 z-30 border-t border-slate-200 bg-white">
      <div className="mx-auto flex w-full max-w-3xl items-center justify-around px-6 py-3 text-sm font-medium">
        {items.map(({ id, link, label, icon: Icon }) => {
          const isActive = pathname === link;
          return (
            <Link
              key={id}
              href={link}
              className={`flex flex-col items-center gap-1 transition-colors ${
                isActive ? "text-blue-600" : "text-slate-500 hover:text-blue-600"
              }`}
              aria-current={isActive ? "page" : undefined}
            >
              <Icon className="text-xl" aria-hidden />
              <span>{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
