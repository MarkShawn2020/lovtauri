import { Link, useLocation } from "react-router-dom";
import { Home, Info, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import ThemeToggle from "./theme-toggle";

export default function Nav() {
  const location = useLocation();

  const links = [
    { to: "/", label: "Home", icon: Home },
    { to: "/about", label: "About", icon: Info },
    { to: "/settings", label: "Settings", icon: Settings },
  ];

  return (
    <>
      {/* Desktop: Top nav */}
      <nav className="hidden sm:block border-b sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <div className="flex gap-6">
              {links.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-primary",
                    location.pathname === link.to ? "text-foreground" : "text-muted-foreground"
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </div>
            <ThemeToggle />
          </div>
        </div>
      </nav>

      {/* Mobile: Bottom nav */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50 pb-safe">
        <div className="flex justify-around items-center">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                className={cn(
                  "flex flex-col items-center justify-center py-2 px-4 min-h-[56px] flex-1 transition-colors",
                  isActive ? "text-primary" : "text-muted-foreground active:text-primary"
                )}
              >
                <Icon className={cn("h-6 w-6", isActive && "stroke-[2.5px]")} />
                <span className="text-xs mt-1 font-medium">{link.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
