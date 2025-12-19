import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import ThemeToggle from "./theme-toggle";

export default function Nav() {
  const location = useLocation();

  const links = [
    { to: "/", label: "Home" },
    { to: "/about", label: "About" },
  ];

  return (
    <nav className="border-b">
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
  );
}
