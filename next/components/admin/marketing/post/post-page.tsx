import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Post, PostService, POST_STATUSES } from "../../../../lib/repo/post.repo";
import { Card } from "../../../shared/utilities/card/card";
import { Field } from "../../../shared/utilities/form/field";
import { Select } from "../../../shared/utilities/form/select";
import { DataTable } from "../../../shared/utilities/table/data-table";
import { PostSlideout } from "./components/post-slider";

export function PostPage(props) {
  const [postId, setPostId] = useState(null);
  const router = useRouter();
  useEffect(() => {
    if (router.query["create"]) {
      setPostId("");
    } else if (router.query["id"]) {
      setPostId(router.query["id"]);
    } else {
      setPostId(null);
    }
  }, [router.query]);

  const toggleStatus = (post: Post) => {
    let status = post.status == "PUBLIC" ? "DRAFT" : "PUBLIC";

    return PostService.update({ id: post.id, data: { status } });
  };

  return (
    <Card className="max-w-6xl">
      <DataTable<Post>
        crudService={PostService}
        order={{ createdAt: 1 }}
        createItem={() => router.replace({ pathname: location.pathname, query: { create: true } })}
        updateItem={(item) =>
          router.replace({ pathname: location.pathname, query: { id: item.id } })
        }
      >
        <DataTable.Header>
          <DataTable.Title />
          <DataTable.Buttons>
            <DataTable.Button outline isRefreshButton />
            <DataTable.Button primary isAddButton />
          </DataTable.Buttons>
        </DataTable.Header>

        <DataTable.Divider />

        <DataTable.Toolbar>
          <DataTable.Search />
          <DataTable.Filter>
            <Field name="status" noError>
              <Select placeholder="Tất cả trạng thái" clearable options={POST_STATUSES} autosize />
            </Field>
          </DataTable.Filter>
        </DataTable.Toolbar>

        <DataTable.Table className="mt-4">
          <DataTable.Column
            label="Bài viết"
            render={(item: Post) => (
              <DataTable.CellText
                value={item.title}
                className="font-semibold text-lg"
                image={item.featureImage}
                imageClassName="w-28"
                ratio169
                compress={150}
              />
            )}
          />
          <DataTable.Column
            center
            orderBy="createdAt"
            label="Ngày tạo"
            render={(item: Post) => <DataTable.CellDate value={item.createdAt} />}
          />
          <DataTable.Column
            center
            orderBy="publishedAt"
            label="Ngày đăng"
            render={(item: Post) => <DataTable.CellDate value={item.publishedAt} />}
          />
          <DataTable.Column
            center
            orderBy="status"
            label="Trạng thái"
            render={(item: Post) => (
              <DataTable.CellStatus value={item.status} options={POST_STATUSES} />
            )}
          />
          <DataTable.Column
            right
            render={(item: Post) => (
              <>
                <DataTable.CellButton value={item} isEditButton />
                <DataTable.CellButton hoverDanger value={item} isDeleteButton />
                <DataTable.CellButton
                  value={item}
                  moreItems={[
                    {
                      text: item.status == "DRAFT" ? "Đăng bài viết" : "Chuyển thành bản nháp",
                      refreshAfterTask: true,
                      onClick: async () => {
                        await toggleStatus(item);
                      },
                    },
                  ]}
                />
              </>
            )}
          />
        </DataTable.Table>
        <DataTable.Consumer>
          {({ loadAll }) => <PostSlideout loadAll={loadAll} postId={postId} />}
        </DataTable.Consumer>

        <DataTable.Pagination />
      </DataTable>
    </Card>
  );
}
