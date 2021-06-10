import { Activity, ActivityService } from "../../../../lib/repo/activity.repo";
import { Card } from "../../../shared/utilities/card/card";
import { DataTable } from "../../../shared/utilities/table/data-table";

export function ActivityPage() {
  return (
    <Card className="max-w-5xl">
      <DataTable<Activity> title="Lịch sử thao tác" crudService={ActivityService}>
        <DataTable.Header>
          <DataTable.Title />
          <DataTable.Buttons></DataTable.Buttons>
        </DataTable.Header>

        <DataTable.Divider />

        <DataTable.Toolbar>
          <DataTable.Search />
          <DataTable.Filter></DataTable.Filter>
        </DataTable.Toolbar>

        <DataTable.Table className="mt-4">
          <DataTable.Column
            width={200}
            label="Thời điểm"
            render={(item: Activity) => (
              <DataTable.CellDate value={item.createdAt} format="dd-MM-yyyy HH:mm" />
            )}
          />
          <DataTable.Column
            width={250}
            label="Người dùng"
            render={(item: Activity) => <DataTable.CellText value={item.username} />}
          />
          <DataTable.Column
            label="Thao tác"
            render={(item: Activity) => <DataTable.CellText value={item.message} />}
          />
        </DataTable.Table>

        <DataTable.Pagination />
      </DataTable>
    </Card>
  );
}
