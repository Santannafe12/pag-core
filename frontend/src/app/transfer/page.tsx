import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import TransferScreen from "@/components/screen/transfer-screen";

export default async function Transfer() {
  const cookieStore = cookies();
  const token = (await cookieStore).get("auth_token")?.value;

  if (!token) {
    redirect("/login");
  }

  const res = await fetch("http://localhost:8080/api/profile", {
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
    throw new Error("Failed to fetch user data");
  }

  const user = await res.json();

  return <TransferScreen user={user} />;
}