import React, { useEffect, useState } from "react";
import { Rating } from "../../../shared/homepage-layout/rating";
import { Dialog, DialogPropsType } from "../../../shared/utilities/dialog/dialog";
import useDevice from "../../../../lib/hooks/useDevice";
import { ShopComment, ShopCommentService } from "../../../../lib/repo/shop-comment.repo";
import cloneDeep from "lodash/cloneDeep";
import { Spinner } from "../../../shared/utilities/spinner";
interface Propstype extends DialogPropsType {
  onSelect?: (string) => void;
}
export function CommentsDialog(props: Propstype) {
  const [comments, setComments] = useState<ShopComment[]>();
  useEffect(() => {
    ShopCommentService.getAll({
      query: { filter: { status: "PUBLIC" }, order: { createAt: -1 } },
    }).then((res) => setComments(cloneDeep(res.data)));
  }, []);
  const { isMobile } = useDevice();
  return (
    <Dialog
      isOpen={props.isOpen}
      onClose={props.onClose}
      title={`Danh sách bình luận (${comments?.length})`}
      mobileSizeMode
      bodyClass="relative bg-white rounded"
      slideFromBottom="all"
    >
      <Dialog.Body>
        <div
          className={`flex flex-col text-sm sm:text-base ${isMobile ? "pb-12" : ""}`}
          style={{ minHeight: `calc(100vh - 100px)` }}
        >
          {comments ? (
            <>
              {comments.length > 0 ? (
                <>
                  {" "}
                  {comments.map((item: ShopComment, index) => (
                    <div className="leading-7 px-4 mt-2 border-b pb-2" key={index}>
                      <h3 className=" text-base">{item.ownerName}</h3>
                      <Rating rating={item.rating} ratingTime={item.createdAt} />
                      <p className="text-ellipsis-3">{item.message}</p>
                    </div>
                  ))}
                </>
              ) : (
                <span>Chưa có bình luận</span>
              )}
            </>
          ) : (
            <Spinner />
          )}
        </div>
      </Dialog.Body>
    </Dialog>
  );
}
