import Link from "next/link";
import { useEffect, useState } from "react";
import SwiperCore, { Autoplay, Navigation } from "swiper/core";
import { Swiper, SwiperSlide } from "swiper/react";

import { Post, PostService } from "../../../../lib/repo/post.repo";
import { Button } from "../../../shared/utilities/form/button";
import { Img } from "../../../shared/utilities/img";
import { SectionHeader } from "../../news/component/section-header";

export function News() {
  const [posts, setPosts] = useState<Post[]>(null);
  const [slide, setSlide] = useState(4);
  useEffect(() => {
    PostService.getAll({ query: { limit: 6 } }).then((res) => {
      setPosts([...res.data]);
    });
  }, []);
  SwiperCore.use([Navigation, Autoplay]);

  if (!posts) return null;
  return (
    <>
      <div className="bg-white w-full py-4 ">
        <div className="main-container">
          <SectionHeader text="Tin mới nhất" />
          <Swiper
            navigation
            spaceBetween={12}
            loop
            autoplay
            slidesOffsetAfter={1}
            slidesOffsetBefore={1}
            breakpoints={{
              320: {
                slidesPerView: 1,
                spaceBetween: 20,
              },
              480: {
                slidesPerView: 2,
                spaceBetween: 30,
              },
              640: {
                slidesPerView: 3,
                spaceBetween: 30,
              },
              769: {
                slidesPerView: 4,
                spaceBetween: 40,
              },
            }}
            className=" py-4 "
          >
            {posts.map((post, index) => (
              <SwiperSlide key={post.id}>
                <Link href={post.redirectLink ? post.redirectLink : "/news/" + post.slug}>
                  <a target={post.redirectLink ? "_blank" : ""} className="px-1 block">
                    <Img ratio169 rounded src={post.featureImage} />
                    <div className="text-gray-700 text-lg font-semibold text-ellipsis-2 mt-2 leading-tight">
                      {post.title}
                    </div>
                    <div className="text-gray-500 text-sm text-ellipsis-3 mt-1">{post.excerpt}</div>
                  </a>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
          <div className="w-full flex items-center justify-center py-4">
            <Button href="/news" text="Xem thêm" textAccent small />
          </div>
        </div>
      </div>
    </>
  );
}
