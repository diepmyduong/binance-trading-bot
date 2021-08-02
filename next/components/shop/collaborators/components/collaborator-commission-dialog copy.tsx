import { CommissionLog, CommissionLogService } from "../../../../lib/repo/commission.repo";
import { Dialog, DialogPropsType } from "../../../shared/utilities/dialog/dialog";
import { DataTable } from "../../../shared/utilities/table/data-table";

interface PropsType extends DialogPropsType {
  filter: any;
}
export function CollaboratorCommissionDialog({ filter, ...props }: PropsType) {
  return (
    <Dialog width="800px" {...props}>
      <Dialog.Body>
        {filter && (
          <>
            <DataTable<CommissionLog>
              crudService={CommissionLogService}
              order={{ createdAt: -1 }}
              filter={filter}
            >
              <DataTable.Header>
                <DataTable.Title />
                <DataTable.Buttons>
                  <DataTable.Button
                    outline
                    isRefreshButton
                    refreshAfterTask
                    className="bg-white w-12 h-12"
                  />
                </DataTable.Buttons>
              </DataTable.Header>

              <DataTable.Divider />

              <DataTable.Toolbar>
                <DataTable.Search className="h-12" />
                <DataTable.Filter></DataTable.Filter>
              </DataTable.Toolbar>

              <DataTable.Table className="mt-4 bg-white">
                <DataTable.Column
                  label="Thời điểm"
                  render={(item: CommissionLog) => (
                    <DataTable.CellDate format="dd/MM/yyyy HH:mm" value={item.createdAt} />
                  )}
                />
                <DataTable.Column
                  label="Hoa hồng"
                  render={(item: CommissionLog) => (
                    <DataTable.CellNumber currency value={item.value} />
                  )}
                />
                <DataTable.Column
                  label="Nội dung"
                  render={(item: CommissionLog) => <DataTable.CellText value={item.note} />}
                />
              </DataTable.Table>
              <DataTable.Pagination />
            </DataTable>
          </>
        )}
      </Dialog.Body>
    </Dialog>
  );
}
