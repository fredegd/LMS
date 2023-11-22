import React from "react";

export default function CoverPage({ data }) {
  return (
    <div>
      <h2 className="text-gray-400 mb-3">Preview:</h2>
      {data?.banner?.url ? (
        <div className="w-full flex justify-center">
          <img src={data.banner.url} alt={data.title} 
          className="w-full sm:w-2/3 md:w-1/2"/>
        </div>
      ) : (
        <div className="h-64 w-full bg-gray-200"></div>
      )}{" "}
    </div>
  );
}
