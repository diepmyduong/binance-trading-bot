import cloneDeep from "lodash/cloneDeep";
import { createContext, useContext, useEffect, useState } from "react";
import { useToast } from "../../../../lib/providers/toast-provider";
import { CategoryService } from "../../../../lib/repo/category.repo";
import { ShopBranch, ShopBranchService } from "../../../../lib/repo/shop-branch.repo";

export const BranchesContext = createContext<
  Partial<{
    branches: ShopBranch[];
    onCreateOrUpdateBranch: (branch: Partial<ShopBranch>) => Promise<any>;
    onRemoveBranch: (branch: ShopBranch) => Promise<any>;
    onToggleBranch: (branch: ShopBranch) => Promise<any>;
  }>
>({});
export function BranchesProvider(props) {
  const [branches, setBranches] = useState<ShopBranch[]>();
  const toast = useToast();

  useEffect(() => {
    loadBranches();
  }, []);

  const loadBranches = async () => {
    ShopBranchService.getAll({
      query: {
        limit: 0,
        order: { createdAt: 1 },
      },
      fragment: ShopBranchService.fullFragment,
    }).then((res) => {
      setBranches(cloneDeep(res.data));
    });
  };

  const onCreateOrUpdateBranch = async (branch: Partial<ShopBranch>) => {
    if (branch.id) {
      let res = await ShopBranchService.update({ id: branch.id, data: branch, toast });
      let index = branches.findIndex((x) => x.id == branch.id);
      branches[index] = res;
      setBranches([...branches]);
    } else {
      let res = await ShopBranchService.create({ data: branch, toast });
      setBranches([...branches, res]);
    }
  };

  const onRemoveBranch = async (branch: ShopBranch) => {
    await ShopBranchService.delete({ id: branch.id });
    let index = branches.findIndex((x) => x.id == branch.id);
    branches.splice(index, 1);
    setBranches([...branches]);
  };

  const onToggleBranch = async (branch: ShopBranch) => {
    try {
      let index = branches.findIndex((x) => x.id == branch.id);
      branches[index].activated = !branches[index].activated;
      setBranches([...branches]);
      await ShopBranchService.update({
        id: branch.id,
        data: { activated: branches[index].activated },
      })
        .then((res) => toast.success("Mở bán sản phẩm thành công"))
        .catch((err) => {
          toast.error("Mở bán sản phẩm thất bại");
          branches[index].activated = !branches[index].activated;
          setBranches([...branches]);
        });
    } catch (err) {}
  };

  return (
    <BranchesContext.Provider
      value={{
        branches,
        onCreateOrUpdateBranch,
        onRemoveBranch,
        onToggleBranch,
      }}
    >
      {props.children}
    </BranchesContext.Provider>
  );
}

export const useBranchesContext = () => useContext(BranchesContext);
