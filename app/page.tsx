import { getDashboardData } from "./action";
import DashboardView from "./component/DashboardView";

export const dynamic = "force-dynamic";

export default async function Dashboard() {
  const data = await getDashboardData();

  return <DashboardView data={data} />;
}