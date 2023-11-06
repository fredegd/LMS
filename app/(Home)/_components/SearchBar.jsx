import { Search } from "lucide-react"

export default function SearchBar() {
  return (
    <div className="flex items-center p-2 gap-3 border rounded-lg text-[1rem] ">
        <Search/>
        <input type="text" placeholder="Search" className="bg-transparent outline-none p-2 md:w-96" /> 
    </div>
  )
}
