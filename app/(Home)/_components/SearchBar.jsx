import { Search } from "lucide-react";

export default function SearchBar() {
  return (
    <div className="flex flex-1 max-w-md items-center gap-2 rounded-lg border border-gray-200 bg-gray-50/70 px-3 py-1.5 text-sm text-gray-500 transition-colors focus-within:border-orange-300 focus-within:bg-white focus-within:ring-2 focus-within:ring-orange-100">
      <Search className="h-4 w-4 shrink-0 text-gray-400" />
      <input
        type="text"
        placeholder="Search snippets..."
        className="w-full bg-transparent text-gray-800 placeholder:text-gray-400 outline-none"
      />
    </div>
  );
}
