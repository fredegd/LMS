import { Search } from "lucide-react";

export default function SearchBar() {
  return ( 
    <div className="flex gap-3  items-center p-2  border rounded-lg text-[1rem] bg-gray-50 text-gray-500 ">
      <Search />
      <input
        type="text"
        placeholder="Search"
        className="bg-transparent outline-none p-2 md:w-96"
      />
    </div>
  );
}
