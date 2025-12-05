"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { FiHome, FiMessageCircle, FiUser, FiTrendingUp, FiBarChart2 } from "react-icons/fi";
import type { FinancialProfile } from "@/lib/quiz_v2/types";

type NavItem = {
  id: string;
  link: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  requiresExpert?: boolean; // Only show if user is expert
};

type BottomNavProps = {
  items?: NavItem[];
};

const defaultItems: NavItem[] = [
  { id: "home", link: "/", label: "Home", icon: FiHome },
  { id: "invest", link: "/invest", label: "Invest", icon: FiTrendingUp },
  { id: "stocks", link: "/stocks", label: "Stocks", icon: FiBarChart2, requiresExpert: true },
  { id: "chat", link: "/chat", label: "Chat", icon: FiMessageCircle },
  { id: "profile", link: "/profile", label: "Profile", icon: FiUser },
];

export function BottomNav({ items = defaultItems }: BottomNavProps) {
  const pathname = usePathname();
  const [isExpert, setIsExpert] = useState(false);

  // Check user's expertise level from localStorage
  useEffect(() => {
    const checkExpertise = () => {
      try {
        const savedProfile = localStorage.getItem("whipnae-user-profile");
        if (savedProfile) {
          const profile = JSON.parse(savedProfile) as FinancialProfile;
          setIsExpert(profile.expertiseLevel === "Expert");
        }
      } catch (error) {
        console.error("Failed to check expertise level:", error);
      }
    };

    checkExpertise();

    // Listen for storage changes (in case profile is updated in another tab)
    window.addEventListener("storage", checkExpertise);
    
    // Also check periodically for same-tab updates
    const interval = setInterval(checkExpertise, 1000);

    return () => {
      window.removeEventListener("storage", checkExpertise);
      clearInterval(interval);
    };
  }, []);

  // Filter items based on expertise
  const visibleItems = items.filter((item) => !item.requiresExpert || isExpert);

  return (
    <nav className="sticky bottom-0 z-30 border-t border-slate-200 bg-white">
      <div className="mx-auto flex w-full max-w-3xl items-center justify-around px-6 py-3 text-sm font-medium">
        {visibleItems.map(({ id, link, label, icon: Icon }) => {
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
