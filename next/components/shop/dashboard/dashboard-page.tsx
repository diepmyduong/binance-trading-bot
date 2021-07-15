import { WIP } from "../../shared/utilities/wip";
import { Dashboard } from "./components/dashboard";
import { DashboardProvider } from "./provider/dashboard-privder";

export function DashboardPage() {
  return (
    <DashboardProvider>
      <Dashboard />
    </DashboardProvider>
  );
}
