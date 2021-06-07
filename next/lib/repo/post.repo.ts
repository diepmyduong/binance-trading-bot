import { BaseModel, CrudRepository } from "./crud.repo";
import { PostTag } from "./post-tag.repo";

export interface Post extends BaseModel {
  title: string;
  excerpt: string;
  slug: string;
  status: string;
  publishedAt: string;
  featureImage: string;
  metaDescription: string;
  metaTitle: string;
  content: string;
  tagIds: string[];
  ogDescription: string;
  ogImage: string;
  ogTitle: string;
  twitterDescription: string;
  twitterImage: string;
  twitterTitle: string;
  priority: number;
  tags: PostTag[];
}
export class PostRepository extends CrudRepository<Post> {
  apiName: string = "Post";
  displayName: string = "bài viết";
  shortFragment: string = this.parseFragment(`
    id: String
    createdAt: DateTime
    updatedAt: DateTime
    title: String
    excerpt: String
    slug: String
    status: String
    publishedAt: DateTime
    featureImage: String
    priority: Int
    tags { id name accentColor }: [PostTag]`);
  fullFragment: string = this.parseFragment(`
    id: String
    createdAt: DateTime
    updatedAt: DateTime
    title: String
    excerpt: String
    slug: String
    status: String
    publishedAt: DateTime
    featureImage: String
    metaDescription: String
    metaTitle: String
    content: String
    tagIds: [ID]
    ogDescription: String
    ogImage: String
    ogTitle: String
    twitterDescription: String
    twitterImage: String
    twitterTitle: String
    priority: Int
    tags { id name slug accentColor }: [PostTag]`);
}

export const PostService = new PostRepository();

export const POST_STATUSES: Option[] = [
  { value: "DRAFT", label: "Bản nháp", color: "accent" },
  { value: "PUBLIC", label: "Đã đăng", color: "success" },
];
