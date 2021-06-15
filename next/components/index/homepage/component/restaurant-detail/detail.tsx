import { NumberPipe } from "../../../../../lib/pipes/number";
import { Button } from "../../../../shared/utilities/form/button";
import { Img } from "../../../../shared/utilities/img";
export function RestaurantDetail({ item, handleChange }) {
  return (
    <div className="w-full h-full relative">
      <Img src={item.img} className="w-full" ratio169 />
      <h2 className="py-2 text-xl px-1">{item.name}</h2>
      <p className="">{item.des}</p>
      <div className="absolute bottom-0 w-full">
        <Button
          primary
          text={`Thêm vào giỏ hàng - ${NumberPipe(item.sold)}`}
          className="w-full"
          onClick={() => {
            handleChange();
          }}
        />
      </div>
    </div>
  );
}
