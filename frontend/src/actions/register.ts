"use server"

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function register(
  fullName: string,
  email: string,
  username: string,
  cpf: string,
  password: string
) {
  try {
    const response = await fetch("http://localhost:8080/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        full_name: fullName,
        email,
        username,
        cpf: cpf.replace(/\D/g, ""), // Remove formatting for API
        password,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Registration failed");
    }

    const data = await response.json();
    const cookieStore = cookies();
    (await cookieStore).set("auth_token", data.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60, // 24 hours
    });

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "An error occurred",
    };
  }
}