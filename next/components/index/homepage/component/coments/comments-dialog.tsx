import React from "react";
import { Dialog, DialogPropsType } from "../../../../shared/utilities/dialog/dialog";
import Comment from "./comment";
interface Propstype extends DialogPropsType {
  onSelect?: (string) => void;
}
const CommentsDialog = (props: Propstype) => {
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
  return (
    <Dialog
      isOpen={props.isOpen}
      onClose={props.onClose}
      title={`Danh sách bình luận (${comments.length})`}
      mobileSizeMode
      slideFromBottom="all"
    >
      <Dialog.Body>
        <div
          className="flex flex-col text-sm sm:text-base overscroll-y-auto"
          style={{ maxHeight: `calc(100vh - 250px)`, minHeight: `calc(100vh - 100px)` }}
        >
          {comments.map((item, index) => (
            <Comment comment={item} key={index} />
          ))}
        </div>
      </Dialog.Body>
    </Dialog>
  );
};

export default CommentsDialog;
