import Link from "next/link";
import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";

import { Post, PostService } from "../../../../lib/repo/post.repo";
import { Img } from "../../../shared/utilities/img";
import { SectionHeader } from "./section-header";

export function NewestNews() {
  const [posts, setPosts] = useState<Post[]>(null);
  useEffect(() => {
    PostService.getAll({ query: { limit: 6 } }).then((res) => {
      setPosts([...res.data]);
    });
  }, []);
  console.log(posts);
  return (
    <div className="pt-5">
      <SectionHeader text="Tin mới nhất" />
      <Swiper
        direction={"horizontal"}
        spaceBetween={12}
        slidesPerView={2}
        allowTouchMove={false}
        className=" main-container py-4 "
        breakpoints={{
          1024: {
            slidesPerView: 1,
            direction: "vertical",
          },
        }}
      >
        {posts &&
          posts.map((post, index) => {
            if (index < 2)
              return (
                <SwiperSlide key={post.id} className="max-w-full lg:min-h-xs lg:max-h-72 ">
                  <Link href={post.redirectLink ? post.redirectLink : "/news/" + post.slug}>
                    <a target={post.redirectLink ? "_blank" : ""} className="px-1 block">
                      <Img ratio169 rounded src={post.featureImage} compress={200} />
                      <div className="text-gray-700 text-lg font-semibold text-ellipsis-2 mt-2 leading-tight">
                        {post.title}
                      </div>
                      <div className="text-gray-500 text-sm text-ellipsis-3 mt-1 ">
                        {post.excerpt}
                      </div>
                    </a>
                  </Link>
                </SwiperSlide>
              );
          })}
      </Swiper>
    </div>
  );
}
