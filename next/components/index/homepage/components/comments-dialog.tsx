import React from "react";
import { Rating } from "../../../shared/homepage-layout/rating";
import { Dialog, DialogPropsType } from "../../../shared/utilities/dialog/dialog";
import useDevice from "../../../../lib/hooks/useDevice";
interface Propstype extends DialogPropsType {
  onSelect?: (string) => void;
}
export function CommentsDialog(props: Propstype) {
  const comments = [
    {
      name: "Nguyễn Nhật Ninh",
      rating: 4.8,
      time: "16:34 ngày 02/04/2021",
      comment:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
    },
    {
      name: "Nguyễn Nhật Ninh",
      rating: 4.8,
      time: "16:34 ngày 02/04/2021",
      comment:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
    },
    {
      name: "Nguyễn Nhật Ninh",
      rating: 4.8,
      time: "16:34 ngày 02/04/2021",
      comment:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
    },
    {
      name: "Nguyễn Nhật Ninh",
      rating: 4.8,
      time: "16:34 ngày 02/04/2021",
      comment:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
    },
    {
      name: "Nguyễn Nhật Ninh",
      rating: 4.8,
      time: "16:34 ngày 02/04/2021",
      comment:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
    },
    {
      name: "Nguyễn Nhật Ninh",
      rating: 4.8,
      time: "16:34 ngày 02/04/2021",
      comment:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
    },
    {
      name: "Nguyễn Nhật Ninh",
      rating: 4.8,
      time: "16:34 ngày 02/04/2021",
      comment:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
    },
  ];
  const { isMobile } = useDevice();
  return (
    <Dialog
      isOpen={props.isOpen}
      onClose={props.onClose}
      title={`Danh sách bình luận (${comments.length})`}
      mobileSizeMode
      bodyClass="relative bg-white rounded"
      slideFromBottom="all"
    >
      <Dialog.Body>
        <div
          className={`flex flex-col text-sm sm:text-base ${isMobile ? "pb-12" : ""}`}
          style={{ minHeight: `calc(100vh - 100px)` }}
        >
          {comments.map((item, index) => (
            <div className="leading-7 px-4 mt-2 border-b pb-2">
              <h3 className=" text-base">{item.name}</h3>
              <Rating rating={4.8} ratingTime={item.time} />
              <p className="text-ellipsis-3">{item.comment}</p>
            </div>
          ))}
        </div>
      </Dialog.Body>
    </Dialog>
  );
}
