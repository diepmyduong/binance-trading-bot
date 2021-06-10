import { Card } from "../../shared/utilities/card/card";
import { CategoryToolbar } from "./components/category-toolbar";
import { CategoryBranch } from "./components/category-branch";
import { ProductsContext, ProductsProvider } from "./providers/products-provider";
import { ItemDetails } from "./components/item-details";
import { Search } from "./components/search";

export function ProductsPage(props) {
  return (
    <ProductsProvider>
      <Card className="w-full flex" style={{ height: "calc(100vh - 104px)", padding: 0 }}>
        <div className="flex-grow-0 flex-shrink-0 flex flex-col w-96 border-r border-gray-200">
          <Search />
          <ProductsContext.Consumer>
            {({ search }) => (
              <>
                {!search && (
                  <>
                    <div className="flex-1 overflow-auto p-4">
                      <CategoryBranch category={null} />
                    </div>
                    <div className="flex-grow-0 flex-shrink-0 p-2 bg-gray-100 grid grid-cols-12 gap-2 border-t border-gray-200">
                      <CategoryToolbar />
                    </div>
                  </>
                )}
              </>
            )}
          </ProductsContext.Consumer>
        </div>
        <div className="flex-1 h-full v-scrollbar">
          <ItemDetails />
        </div>
      </Card>
    </ProductsProvider>
  );
}
