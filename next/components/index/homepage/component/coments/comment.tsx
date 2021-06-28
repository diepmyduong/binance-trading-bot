import React from "react";
import { Button } from "../../../../shared/utilities/form/button";
import StatusTime from "../../../../shared/infomation/status-time";
import Rating from "../../../../shared/infomation/rating";
interface Propstype extends ReactProps {
  comment: { name: string; comment: string; rating: number; time: string };
}
const Comment = (props: Propstype) => {
  return (
    <div className="leading-7 px-4 mt-2 border-b pb-2">
      <h3 className=" text-base">{props.comment.name}</h3>
      <Rating rating={4.8} ratingTime={props.comment.time} />
      <p className="text-ellipsis-3">{props.comment.comment}</p>
    </div>
  );
};

export default Comment;
