import { Briefcase } from "lucide-react";

function Footer() {
  return (
    <footer className="border-t bg-white dark:bg-gray-900 dark:border-gray-800">
      <div className="container mx-auto flex flex-col items-center justify-between gap-3 px-4 py-6 text-sm text-gray-500 dark:text-gray-400 sm:flex-row">
        <div className="flex items-center gap-2">
          <Briefcase className="h-4 w-4 text-indigo-600" />
          <span className="font-medium text-gray-700 dark:text-gray-200">Job Match AI</span>
        </div>
        <p>AI-powered matching for jobs, cover letters, and candidates.</p>
      </div>
    </footer>
  );
}

export default Footer;
