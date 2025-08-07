"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export async function getUsers(statusFilter: string = "all") {
  const cookieStore = cookies();
  const token = (await cookieStore).get("auth_token")?.value;

  try {
    const url = "http://localhost:8080/api/admin/users?status=active"

    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch users");
    }

    console.log("response", response)

    return response;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
}

export async function blockUser(userId: string) {
  const cookieStore = cookies();
  const token = (await cookieStore).get("auth_token")?.value;

  try {
    const response = await fetch(
      `http://localhost:8080/api/admin/users/${userId}/block`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to block user");
    }

    revalidatePath("/admin");
    return response;
  } catch (error) {
    console.error("Error blocking user:", error);
    throw error;
  }
}

export async function getStats() {
  const cookieStore = cookies();
  const token = (await cookieStore).get("auth_token")?.value;

  try {
    const response = await fetch(`http://localhost:8080/api/admin/stats`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch stats");
    }

    return response;
  } catch (error) {
    console.error("Error fetching stats:", error);
    throw error;
  }
}
