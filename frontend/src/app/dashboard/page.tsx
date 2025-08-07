import { redirect } from "next/navigation";
import DashboardScreen from "@/components/screen/dashboard-screen";
import { cookies } from "next/headers";

export default async function Dashboard() {
  const cookieStore = cookies();
  const token = (await cookieStore).get("auth_token")?.value;
  const role = (await cookieStore).get("user_role")?.value;

  if (!token) {
    redirect("/login");
  }

  const res = await fetch("http://localhost:8080/api/dashboard", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    if (res.status === 401) {
      redirect("/login");
    }
    throw new Error("Failed to fetch dashboard data");
  }

  const data = await res.json();

  return (
    <DashboardScreen user={data} transactions={data.recent_transactions} role={role} />
  );
}
