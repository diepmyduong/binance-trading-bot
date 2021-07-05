import { RiDeleteBin6Line, RiStarFill } from "react-icons/ri";
import { NumberPipe } from "../../../../lib/pipes/number";
import { Product } from "../../../../lib/repo/product.repo";
import { Button } from "../../../shared/utilities/form/button";
import { Switch } from "../../../shared/utilities/form/switch";
import { Img } from "../../../shared/utilities/img";

interface PropsType extends ReactProps {
  product: Product;
  onClick: () => any;
  onDeleteClick: () => Promise<any>;
  onToggleClick: () => any;
}
export function ProductItem({ product, ...props }: PropsType) {
  return (
    <div
      className="flex items-center p-2 mb-2 bg-white border border-gray-300 hover:border-primary rounded-md cursor-pointer group"
      onClick={props.onClick}
    >
      <Img src={product.image} className="w-16 rounded-md" showImageOnClick />
      <div className="flex-1 pl-3">
        <div className="text-gray-800 font-semibold text-lg group-hover:text-primary flex flex-wrap items-center">
          {product.name}
          {product.labels?.map((label, index) => (
            <div
              className="ml-2 inline-flex items-center text-white rounded-full font-semibold text-xs px-2 py-1 cursor-pointer whitespace-nowrap"
              style={{ backgroundColor: label.color }}
            >
              <span>{label.name}</span>
            </div>
          ))}
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <i className="text-yellow-400 mr-1">
            <RiStarFill />
          </i>
          <span>
            {product.rating} - Đã bán {product.soldQty || 0}
          </span>
        </div>
        <div className="text-gray-600 text-sm">{product.subtitle}</div>
      </div>
      <div className="px-4 text-gray-700 font-semibold text-right">
        <div>{NumberPipe(product.basePrice, true)}</div>
        {product.downPrice > 0 && (
          <div className="text-gray-400 line-through font-medium">
            {NumberPipe(product.downPrice, true)}
          </div>
        )}
      </div>
      <div
        onClick={(e) => e.stopPropagation()}
        tooltip-data="Mở bán món"
        tooltip-placement="top-center"
      >
        <Switch
          className="px-4"
          value={product.allowSale || false}
          onChange={props.onToggleClick}
        />
      </div>
      <Button
        icon={<RiDeleteBin6Line />}
        hoverDanger
        iconClassName="text-lg"
        onClick={async (e) => {
          e.stopPropagation();
          await props.onDeleteClick();
        }}
      />
    </div>
  );
}
