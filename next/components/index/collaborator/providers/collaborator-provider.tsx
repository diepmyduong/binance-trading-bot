import { createContext, useContext, useEffect, useState } from "react";
import { UserService } from "../../../../lib/repo/user.repo";
import cloneDeep from "lodash/cloneDeep";
import { useToast } from "../../../../lib/providers/toast-provider";
import { useShopContext } from "../../../../lib/providers/shop-provider";
import { Collaborator } from "../../../../lib/repo/collaborator.repo";
import { CommissionLog, CommissionLogService } from "../../../../lib/repo/commission.repo";
export const CollaboratorContext = createContext<Partial<{ commissions: CommissionLog[] }>>({});

export function CollaboratorProvider(props) {
  let [commissions, setCommissions] = useState<CommissionLog[]>();
  async function getCommissions() {
    CommissionLogService.getAll({ query: { filter: { createdAt: -1 } }, cache: false })
      .then((res) => setCommissions(res.data))
      .catch((err) => console.log(err));
  }

  useEffect(() => {
    getCommissions();
  }, []);
  return (
    <CollaboratorContext.Provider value={{ commissions }}>
      {props.children}
    </CollaboratorContext.Provider>
  );
}

export const useCollaboratorContext = () => useContext(CollaboratorContext);
