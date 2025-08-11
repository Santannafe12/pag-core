// app/qr/page.tsx
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import QRCodeScreen from "@/components/screen/qr-code-screen";
import { generateQRCode, processQRCode, getQRDetails } from "@/actions/qr-code";

export default async function QRCodePage() {
  const cookieStore = cookies();
  const token = (await cookieStore).get("auth_token")?.value;

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

  const user = await res.json();

  return (
    <QRCodeScreen
      user={user}
      generateQRCode={generateQRCode}
      processQRCode={processQRCode}
      getQRDetails={getQRDetails}
    />
  );
}