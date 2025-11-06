import { FiHome, FiMessageCircle, FiUser } from "react-icons/fi";

type NavItem = {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  isActive?: boolean;
};

type BottomNavProps = {
  items?: NavItem[];
};

const defaultItems: NavItem[] = [
  { id: "home", label: "Home", icon: FiHome, isActive: true },
  { id: "ai-assistant", label: "AI Assistant", icon: FiMessageCircle },
  { id: "profile", label: "Profile", icon: FiUser },
];

export function BottomNav({ items = defaultItems }: BottomNavProps) {
  return (
    <nav className="sticky bottom-0 z-30 border-t border-slate-200 bg-white">
      <div className="mx-auto flex w-full max-w-3xl items-center justify-around px-6 py-3 text-sm font-medium">
        {items.map(({ id, label, icon: Icon, isActive }) => (
          <button
            key={id}
            type="button"
            className={`flex flex-col items-center gap-1 transition-colors ${
              isActive ? "text-blue-600" : "text-slate-500 hover:text-blue-600"
            }`}
            aria-current={isActive ? "page" : undefined}
          >
            <Icon className="text-xl" aria-hidden />
            <span>{label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}
