import Image from "next/image";
import Link from "next/link";

export default function ItemList({ items }) {
  return (
    <div
      className="mt-5 grid grid-cols-1 
    sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
    >
      {items.map((item, index) => 

      {
        // const linkTo = "/item-preview/" + item.description.replace(/\s+/g, '-').toLowerCase();//.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
        const linkTo = `/item-display/${item.id}`
        return(
        <Link href={linkTo} key={index}>
          <div className="border rounded-md p-2 cursor-pointer shadow-lg hover:shadow-orange-500">
            <Image
              className="w-full"
              src={item.banner.url}
              alt={item.title}
              width={400}
              height={0}
            />
            <h1 className="text-[1.5rem] font-medium">{item.title}</h1>
            <p>{item.description}</p>
          </div>
        </Link>
      )})}
    </div>
  );
}
