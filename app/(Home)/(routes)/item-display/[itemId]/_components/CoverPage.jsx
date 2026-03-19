import Image from "next/image";

export default function CoverPage({ data }) {
  return (
    <div className="mb-6">
      {data?.banner?.url ? (
        <div className="overflow-hidden rounded-xl shadow-sm border border-gray-100">
          <Image
            src={data.banner.url}
            alt={data.title}
            width={1400}
            height={788}
            className="w-full h-auto"
            priority
          />
        </div>
      ) : (
        <div className="flex items-center justify-center h-48 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 text-sm text-gray-400">
          No banner provided
        </div>
      )}
    </div>
  );
}
