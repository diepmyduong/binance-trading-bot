import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useToast } from "../../../../../lib/providers/toast-provider";
import { PostTagService } from "../../../../../lib/repo/post-tag.repo";
import { Post, PostService } from "../../../../../lib/repo/post.repo";
import { Slideout, SlideoutPropsType } from "../../../../shared/utilities/dialog/slideout";
import { Button } from "../../../../shared/utilities/form/button";
import { Editor } from "../../../../shared/utilities/form/editor";
import { Field } from "../../../../shared/utilities/form/field";
import { Form, FormConsumer } from "../../../../shared/utilities/form/form";
import { FormValidator } from "../../../../shared/utilities/form/form-validator";
import { ImageInput } from "../../../../shared/utilities/form/image-input";
import { Input } from "../../../../shared/utilities/form/input";
import { Select } from "../../../../shared/utilities/form/select";
import { Textarea } from "../../../../shared/utilities/form/textarea";
import { Spinner } from "../../../../shared/utilities/spinner";

interface PostSlideoutPropsType extends SlideoutPropsType {
  postId: string;
  loadAll: () => Promise<any>;
}

export function PostSlideout({ postId, loadAll, ...props }: PostSlideoutPropsType) {
  const router = useRouter();
  const [post, setPost] = useState<Partial<Post>>(null);
  const toast = useToast();

  useEffect(() => {
    if (postId !== null) {
      if (postId) {
        PostService.getOne({ id: postId }).then((res) => {
          let { id, title, content, excerpt, featureImage, slug, priority, tagIds } = res;
          setPost({ id, title, content, excerpt, featureImage, slug, priority, tagIds });
        });
      } else {
        setPost({});
      }
    } else {
      setPost(null);
    }
  }, [postId]);

  const onSubmit = async (data) => {
    if (!data.title) {
      toast.info("Bắt buộc nhập tiêu đề bài viết.");
      return;
    }
    await PostService.createOrUpdate({ id: post.id, data })
      .then((res) => {
        toast.success(`${post.id ? "Cập nhật" : "Tạo"} bài viết thành công`);
        loadAll();
        onClose();
      })
      .catch((err) => {
        console.error(err);
        toast.error(`${post.id ? "Cập nhật" : "Tạo"} bài viết thất bại. ${err.message}`);
      });
  };

  const onClose = () => router.replace({ pathname: location.pathname, query: {} });

  return (
    <Slideout width="80vw" isOpen={postId !== null} onClose={onClose}>
      {!post ? (
        <Spinner />
      ) : (
        <Form className="flex h-full" initialData={post} onSubmit={onSubmit}>
          <div className="p-10 flex-1 v-scrollbar">
            <Field name="title" noError>
              <Textarea
                controlClassName=""
                rows={0}
                className="font-semibold text-3xl h-auto border-0 shadow-none resize-none text-gray-700"
                style={{ paddingBottom: "0" }}
                placeholder="(Tiêu đề bài viết)"
              />
            </Field>
            <Field name="content" noError>
              <Editor
                minHeight="calc(100vh - 150px)"
                noBorder
                controlClassName=""
                className="border-0 bg-transparent"
                maxWidth="none"
                placeholder="Nội dung bài viết"
              />
            </Field>
          </div>
          <div className="min-w-sm max-w-sm border-l border-gray-300 bg-gray-50 flex flex-col">
            <div className="p-4 overflow-y-auto" style={{ height: "calc(100% - 64px)" }}>
              <Field name="featureImage" label="Hình đại diện">
                <ImageInput largeImage ratio169 placeholder="Tỉ lệ 16:9" />
              </Field>
              <Field name="excerpt" label="Mô tả ngắn bài viết">
                <Textarea placeholder="Nên để khoảng 280 ký tự" />
              </Field>
              <Field
                name="slug"
                label="Slug bài viết"
                tooltip="Chỉ cho phép chữ, số và dấu gạch ngang, không có khoảng trắng.Ví dụ: bai-viet-123"
                validate={FormValidator.instance.slug().build()}
              >
                <Input placeholder="(Tự tạo nếu để trống)" />
              </Field>
              <Field name="priority" label="Ưu tiên bài viết">
                <Input number placeholder="Ưu tiên cao sẽ hiện lên đầu." />
              </Field>
              <Field name="tagIds" label="Tag bài viết">
                <Select
                  multi
                  clearable={false}
                  placeholder="Chọn tag đã có hoặc nhập tag mới"
                  createablePromise={(inputValue) =>
                    PostTagService.getAllCreatablePromise({ inputValue })
                  }
                />
              </Field>
            </div>
            <FormConsumer>
              {({ loading }) => (
                <div className="px-4 h-16 flex items-center gap-x-2 border-t border-gray-300 mt-auto">
                  <Button outline text="Đóng" onClick={onClose} />
                  <Button
                    submit
                    className="flex-1"
                    primary
                    isLoading={loading}
                    text={`${post.id ? "Cập nhật" : "Tạo"} bài viết`}
                  />
                </div>
              )}
            </FormConsumer>
          </div>
        </Form>
      )}
    </Slideout>
  );
}
