import { Briefcase, LogIn, UserPlus, Sun, Moon } from "lucide-react";
import React from "react";
import { Button } from "@/components/ui/button";
import {useNavigate} from "react-router-dom";


function Header() {

  const navigate = useNavigate();

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

  return (
    <header className="border-b bg-white dark:bg-gray-900 dark:text-white">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">

        {/* Logo */}
        <div className="flex items-center space-x-2">
          <Briefcase className="h-6 w-6 text-indigo-600" />
          <h1 className="text-xl font-bold tracking-tight">Job Match AI</h1>
        </div>

        {/* Navigation */}
        <nav className="flex space-x-4">
          <Button 
          variant="ghost" 
          className="text-sm px-4 py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
          onClick={() => navigate("/")}
          >Home</Button>
          <Button 
          variant="ghost" 
          className="text-sm px-4 py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
          onClick={() => navigate("/jobs")}
          >Jobs</Button>
          <Button 
          variant="ghost" 
          className="text-sm px-4 py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
          onClick={() => navigate("/profile")}
          >Profile</Button>
        </nav>

        {/* Right Side */}
        <div className="flex space-x-2 items-center">

          {/* Theme Toggle */}
          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {theme === "light" ? (
              <Moon className="h-5 w-5" />
            ) : (
              <Sun className="h-5 w-5" />
            )}
          </Button>

          {/* Auth Buttons */}
          <Button 
          variant="outline" 
          size="sm"
          onClick={() => navigate("/login")}
          >
            <LogIn className="mr-2 h-4 w-4" /> Login
          </Button>

          <Button size="sm" onClick={() => navigate("/register")}>
            <UserPlus className="mr-2 h-4 w-4" /> Register
          </Button>

        </div>
      </div>
    </header>
  );
}

export default Header;
