import Markdown from "react-markdown";

export default function Chapter({ content }) {
  const markdown = content.descriptionMd;
  return (
    <div className="my-10 flex-col items-center">
      <h1 className=" font-bold text-[2rem] text-center mb-6">{content.title}</h1>
      <div className=" my-10 flex flex-col xl:flex-row  justify-start items-center xl:items-start overflow-auto">
        <img
          src={content.banner.url}
          alt={content.title}
          className="w-full lg:w-5/6 xl:w-5/12 h-auto "
        />
        <div className="self-start min-w-full xl:min-w-fit  px-5 bg-slate-200 ">
          <Markdown>{markdown}</Markdown>
        </div>
      </div>
      <hr />
    </div>
  );
}
