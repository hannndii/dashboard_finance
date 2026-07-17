import { getDashboardData } from "./action";
import DashboardView from "./component/DashboardView";
import AppShell from "./component/AppShell";

export const dynamic = "force-dynamic";

export default async function Dashboard() {
  const data = await getDashboardData();

  return (
    <AppShell>
      <DashboardView data={data} />
    </AppShell>
  );
}