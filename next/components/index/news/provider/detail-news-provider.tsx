import { createContext, useContext, useEffect, useState } from "react";
import { PaginationQueryProps, usePaginationQuery } from "../../../../lib/hooks/usePaginationQuery";
import { Post, PostService } from "../../../../lib/repo/post.repo";
export const DetailNewsContext = createContext<
  PaginationQueryProps<Post> & {
    [x: string]: any;
    News?: Post;
  }
>({});

export function DetailNewsProvider({ newsId, ...props }) {
  const [news, setNews] = useState<Post>();
  useEffect(() => {
    loadNews();
  }, [newsId]);
  const loadNews = () => {
    PostService.getOne({ id: newsId }).then((res) => {
      console.log(res);
      setNews(res);
    });
  };
  const paginationQueryContext = usePaginationQuery(PostService, null, { order: { _id: -1 } });
  return (
    <DetailNewsContext.Provider value={{ ...paginationQueryContext, news }}>
      {props.children}
    </DetailNewsContext.Provider>
  );
}

export const useDetailNewsContext = () => useContext(DetailNewsContext);
