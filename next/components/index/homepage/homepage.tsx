import RestaurantFood from "./component/restaurant-menus/restaurant-menus";
import RestaurantInformation from "./component/restaurant-information/restaurant-information";

export function Homepage() {
  return (
    <div className="z-0 bg-white">
      <RestaurantInformation />
      <RestaurantFood />
    </div>
  );
}
