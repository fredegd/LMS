import Markdown from "react-markdown";

export default function Chapter({ content }) {
  const markdown = content.descriptionMd;

  console.log(content, "is the content");
  return (
    <div className="my-10 flex-col items-center">
      <h1 className=" font-bold text-[2rem] text-center mb-6">{content.title}</h1>
      <div className="flex flex-col lg:flex-row  justify-around">
        <img
          src={content.banner.url}
          alt={content.title}
          className="w-64 h-64 col-span-6 self-center"
        />
        <div className="overflow-scroll">
          <Markdown>{markdown}</Markdown>
        </div>
      </div>
      <hr />
    </div>
  );
}
