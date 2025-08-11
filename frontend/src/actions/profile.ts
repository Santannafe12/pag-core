// actions/profile.ts
"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function getProfile() {
  const token = (await cookies()).get("auth_token")?.value;
  if (!token) {
    throw new Error("No authentication token found");
  }

  const response = await fetch("http://localhost:8080/api/profile", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to get profile");
  }

  return response.json();
}

export async function updatePassword({ old_password, new_password }: { old_password: string; new_password: string }) {
  const token = (await cookies()).get("auth_token")?.value;
  if (!token) {
    throw new Error("No authentication token found");
  }

  const response = await fetch("http://localhost:8080/api/profile", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ old_password, new_password }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to update password");
  }

  return response.json();
}

export async function logout() {
  const token = (await cookies()).get("auth_token")?.value;
  if (!token) {
    redirect("/login");
  }

  const response = await fetch("http://localhost:8080/api/logout", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  (await cookies()).delete("auth_token");
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to logout");
  }

  redirect("/login");
}