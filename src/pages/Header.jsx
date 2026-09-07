import { Briefcase, LogIn, UserPlus, Sun, Moon, Menu, X, LogOut, User } from "lucide-react";
import React from "react";
import { Button } from "@/components/ui/button";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { getInitials } from "@/utils/format";

function Header() {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [theme, setTheme] = React.useState(
    localStorage.getItem("theme") || "light"
  );

  React.useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate("/login");
  };

  const navClass = ({ isActive }) =>
    `text-sm px-4 py-2 rounded-lg transition-colors ${
      isActive
        ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300"
        : "hover:bg-gray-200 dark:hover:bg-gray-700"
    }`;

  return (
    <header className="sticky top-0 z-50 border-b bg-white/90 backdrop-blur-md dark:bg-gray-900/90 dark:text-white dark:border-gray-800">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <button
          type="button"
          className="flex items-center space-x-2"
          onClick={() => navigate("/")}
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-sm">
            <Briefcase className="h-5 w-5" />
          </div>
          <h1 className="text-xl font-bold tracking-tight">Job Match AI</h1>
        </button>

        <nav className="hidden md:flex items-center space-x-1">
          <NavLink to="/" className={navClass} end>
            Home
          </NavLink>
          <NavLink to="/jobs" className={navClass}>
            Jobs
          </NavLink>
          <NavLink to="/profile" className={navClass}>
            Profile
          </NavLink>
        </nav>

        <div className="flex space-x-2 items-center">
          <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
            {theme === "light" ? (
              <Moon className="h-5 w-5" />
            ) : (
              <Sun className="h-5 w-5" />
            )}
          </Button>

          {isAuthenticated ? (
            <div className="hidden sm:flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("/profile")}
                className="gap-2"
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-100 text-xs font-semibold text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300">
                  {getInitials(user?.name)}
                </span>
                {user?.name || "Profile"}
              </Button>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" /> Logout
              </Button>
            </div>
          ) : (
            <div className="hidden sm:flex space-x-2">
              <Button variant="outline" size="sm" onClick={() => navigate("/login")}>
                <LogIn className="mr-2 h-4 w-4" /> Login
              </Button>
              <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700" onClick={() => navigate("/register")}>
                <UserPlus className="mr-2 h-4 w-4" /> Register
              </Button>
            </div>
          )}

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {menuOpen && (
        <div className="border-t bg-white px-4 py-3 dark:bg-gray-900 dark:border-gray-800 md:hidden">
          <div className="flex flex-col gap-1">
            <Button variant="ghost" className="justify-start" onClick={() => { navigate("/"); setMenuOpen(false); }}>
              Home
            </Button>
            <Button variant="ghost" className="justify-start" onClick={() => { navigate("/jobs"); setMenuOpen(false); }}>
              Jobs
            </Button>
            <Button variant="ghost" className="justify-start" onClick={() => { navigate("/profile"); setMenuOpen(false); }}>
              <User className="mr-2 h-4 w-4" /> Profile
            </Button>
            {isAuthenticated ? (
              <Button variant="ghost" className="justify-start text-red-600" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" /> Logout
              </Button>
            ) : (
              <>
                <Button variant="ghost" className="justify-start" onClick={() => { navigate("/login"); setMenuOpen(false); }}>
                  <LogIn className="mr-2 h-4 w-4" /> Login
                </Button>
                <Button className="bg-indigo-600 hover:bg-indigo-700" onClick={() => { navigate("/register"); setMenuOpen(false); }}>
                  <UserPlus className="mr-2 h-4 w-4" /> Register
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;
