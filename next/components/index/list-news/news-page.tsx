import { useEffect, useState } from "react";
import { Post, PostService } from "../../../lib/repo/post.repo";
import { SectionHeader } from "../news/component/section-header";
import { OnePost } from "./component/post";

export function ListNewsPage(props) {
  const [posts, setPosts] = useState<Post[]>(null);
  useEffect(() => {
    PostService.getAll({ query: { limit: 6 } }).then((res) => {
      setPosts([...res.data]);
    });
  }, []);
  return (
    <div className="w-full bg-white min-h-screen">
      <div className="main-container pt-10">
        <SectionHeader text="Tất cả bài viết" />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {posts &&
            posts.map((item, index) => {
              return <OnePost post={item}></OnePost>;
            })}
        </div>
      </div>
    </div>
  );
}
