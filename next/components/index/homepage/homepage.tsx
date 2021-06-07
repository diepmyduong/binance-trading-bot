import { Banner } from "./component/banner";
import { News } from "./component/news";
import { QuoteHistory } from "./component/quote-history";

export function Homepage() {
  return (
    <div className="z-0">
      <Banner />
      <QuoteHistory />
      <News />
    </div>
  );
}
