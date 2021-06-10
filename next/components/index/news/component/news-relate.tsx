import Link from "next/link";
import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";

import { Post, PostService } from "../../../../lib/repo/post.repo";
import { Img } from "../../../shared/utilities/img";
import { SectionHeader } from "./section-header";

export function NewsRelate() {
  const [posts, setPosts] = useState<Post[]>(null);
  useEffect(() => {
    PostService.getAll({ query: { limit: 6 } }).then((res) => {
      setPosts([...res.data]);
    });
  }, []);
  console.log(posts);

  if (!posts) return null;
  return (
    <>
      <div className="bg-white py-4">
        <SectionHeader text="Tin liên quan" />
        <Swiper
          allowTouchMove={false}
          spaceBetween={12}
          slidesPerView={2}
          className=" p-4 "
          breakpoints={{
            // when window width is >= 640px
            1024: {
              slidesPerView: 3,
              spaceBetween: 40,
            },
          }}
        >
          {posts.map((post, index) => {
            if (index < 3)
              return (
                <SwiperSlide key={post.id}>
                  <Link href={post.redirectLink ? post.redirectLink : "/news/" + post.slug}>
                    <a target={post.redirectLink ? "_blank" : ""} className="px-1 block">
                      <Img ratio169 rounded src={post.featureImage} />
                      <div className="text-gray-700 text-lg font-semibold text-ellipsis-2 mt-2 leading-tight">
                        {post.title}
                      </div>
                      <div className="text-gray-500 text-sm text-ellipsis-3 mt-1">
                        {post.excerpt}
                      </div>
                    </a>
                  </Link>
                </SwiperSlide>
              );
          })}
        </Swiper>
      </div>
    </>
  );
}
