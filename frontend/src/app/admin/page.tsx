import { getStats, getUsers } from "@/actions/admin";
import AdminDashboardScreen from "@/components/screen/admin-dashboard-screen";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function AdminDashboard() {
  const cookieStore = cookies();
  const token = (await cookieStore).get("auth_token")?.value;
  const role = (await cookieStore).get("user_role")?.value;

  if (!token) {
    redirect("/login");
  }

  const res = await getStats();
  const users = await getUsers("all");

  return <AdminDashboardScreen stats={res.json()} users={users.json()} />;
}
