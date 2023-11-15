import Image from "next/image";

export default function ItemList({ items }) {
  return (
    <div
      className="mt-5 grid grid-cols-1 
    sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
    >
      {items.map((item, index) => {
        console.log(item.banner.url);
        return item.banner.url ? (
          <div key={index} className="border p-2 rounded-md">
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
        ) : null;
      })}
    </div>
  );
}
