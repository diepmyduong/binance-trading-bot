import Link from "next/link";
import { Post } from "../../../../lib/repo/post.repo";
import { Img } from "../../../shared/utilities/img";

interface PropsType extends ReactProps {
  post: Post;
}
export function OnePost({ post, ...props }: PropsType) {
  return (
    <div className="hover:shadow p-2 rounded">
      <Link href={post.redirectLink ? post.redirectLink : "/news/" + post.slug}>
        <a target={post.redirectLink ? "_blank" : ""} className="px-1 block">
          <Img ratio169 rounded src={post.featureImage} />
          <div className="text-gray-700 text-lg font-semibold text-ellipsis-2 mt-2 leading-tight">
            {post.title}
          </div>
          <div className="text-gray-500 text-sm text-ellipsis-3 mt-1">{post.excerpt}</div>
        </a>
      </Link>
    </div>
  );
}
