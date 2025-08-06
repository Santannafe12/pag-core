"use server"

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function makeTransfer(
  recipientUsername: string,
  amount: string,
  description: string
) {
  const cookieStore = cookies();
  const token = (await cookieStore).get("auth_token")?.value;

  if (!token) {
    redirect("/login");
  }

  const res = await fetch("http://localhost:8080/api/transfer", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      recipient_username: recipientUsername,
      amount: parseFloat(amount),
      description,
    }),
  });

  if (!res.ok) {
    if (res.status === 401) {
      redirect("/login");
    }
    const errorData = await res.json();
    throw new Error(errorData.error || "Failed to process transfer");
  }

  return res.json();
}