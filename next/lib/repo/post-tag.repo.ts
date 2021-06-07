import { BaseModel, CrudRepository } from "./crud.repo";

export interface PostTag extends BaseModel {
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
  tags: [PostTag];
}
export class PostTagRepository extends CrudRepository<PostTag> {
  apiName: string = "PostTag";
  displayName: string = "tag bài viết";
  shortFragment: string = this.parseFragment(`
    id: String
    createdAt: DateTime
    updatedAt: DateTime
    name: String
    slug: String
    description: String
    accentColor: String
    featureImage: String`);
  fullFragment: string = this.parseFragment(`
    id: String
    createdAt: DateTime
    updatedAt: DateTime
    name: String
    slug: String
    description: String
    accentColor: String
    featureImage: String`);
}

export const PostTagService = new PostTagRepository();
