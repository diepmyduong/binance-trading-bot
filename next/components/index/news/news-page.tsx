import format from "date-fns/format";
import { HiClock } from "react-icons/hi";

import { Spinner } from "../../shared/utilities/spinner";
import { NewestNews } from "./component/newest-news";
import { NewsRelate } from "./component/news-relate";
import { useDetailNewsContext } from "./provider/detail-news-provider";

export function NewsPage() {
  const { news } = useDetailNewsContext();
  console.log(news);
  if (!news) return <Spinner></Spinner>;
  return (
    <div className=" bg-white pt-4">
      <div className=" main-container lg:flex items-start">
        <div className="flex-1 w-full">
          <div className="  ">
            <div className="pt-2">
              <h1 className="text-xl px-4 uppercase font-semibold">{news.title}</h1>
            </div>
            <div className="text-sm px-4 text-gray-500 pt-1 flex items-center">
              <i className="">
                <HiClock />
              </i>
              <span className=" ml-2">{format(new Date(news.createdAt), "HH:mm dd/MM/yyyy")}</span>
            </div>
            <div
              className="text-sm pt-2 text-gray-500 ck-content"
              dangerouslySetInnerHTML={{
                __html: news.content,
              }}
            ></div>
          </div>
          <div className="w-full ">
            <NewsRelate />
          </div>
        </div>
        <div className=" lg:min-w-xs lg:max-w-sm">
          <NewestNews />
        </div>
      </div>
    </div>
  );
}
