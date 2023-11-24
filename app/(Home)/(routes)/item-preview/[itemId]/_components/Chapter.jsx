import Markdown from "react-markdown";

export default function Chapter({ content }) {
  const markdown = content.chapterSnippet;
  return (
    <div className="my-10 flex flex-col items-start ">
      <h1 className=" font-bold text-[2rem] text-center mb-6">
        {content.title}
      </h1>
      {content?.banner ? (
        <img
          src={content.banner.url}
          alt={content.title}
          className="w-full lg:w-5/6 xl:w-7/12 h-auto  self-center"
        />
      ) : null}
      {content?.chapterDescription ? (
        <div className="self-start min-w-full xl:min-w-fit  ">
          <Markdown>{content.chapterDescription}</Markdown>
        </div>
      ) : null}
      <div className=" my-10 flex flex-col w-full justify-start items-center  overflow-auto">
        <div className="self-start min-w-full  px-5 py-3 bg-slate-200 ">
          <Markdown>{markdown}</Markdown>
        </div>
      </div>
      <hr />
    </div>
  );
}
