import { useRouter } from "next/router";
import React from "react";
import { HiOutlineFolder } from "react-icons/hi";

import { Category } from "../../../../lib/repo/category.repo";
import BreadCrumbs from "../../../shared/utilities/breadcrumbs/breadcrumbs";
import { Button } from "../../../shared/utilities/form/button";
import { Spinner } from "../../../shared/utilities/spinner";

interface Propstype extends ReactProps {
  categories: Category[];
  breadCrumbs: { label: string; href: string }[];
  category: Category;
  search: string;
}

const CategoryOptions = ({ categories, breadCrumbs, category, search, ...props }: Propstype) => {
  const router = useRouter();
  return (
    <>
      {(categories && (
        <>
          {!search && (
            <>
              <BreadCrumbs
                breadcrumbs={[
                  ...breadCrumbs.map((item, index) =>
                    index !== breadCrumbs.length - 1 ? item : { ...item, href: "" }
                  ),
                ]}
                accent
                native
              />
              <h3 className="uppercase text-28 font-bold">
                {(category && category.name) || "Danh sách hạng mục "}
              </h3>
            </>
          )}
          <div className="space-y-4">
            {(search && (
              <h3 className="text-24 font-bold">
                {categories.length} kết quả nhóm hạng mục cho "{search}"
              </h3>
            )) || <p>Nhóm hạng mục</p>}
            <div className="flex gap-2 flex-wrap">
              {(categories.length > 0 &&
                categories.map(
                  (item) =>
                    item.name && (
                      <Button
                        text={item.name}
                        primary
                        key={item.code}
                        onClick={() => router.push("/category/" + item.code)}
                        icon={<HiOutlineFolder />}
                      />
                    )
                )) ||
                (!search && <p>Chưa có hạng mục nào thuộc hạng mục này</p>)}
            </div>
          </div>
        </>
      )) || <Spinner />}
    </>
  );
};

export default CategoryOptions;
