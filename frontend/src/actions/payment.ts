"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function createPaymentRequest(
  payerUsername: string,
  amount: string,
  description: string
) {
  const cookieStore = cookies();
  const token = (await cookieStore).get("auth_token")?.value;

  if (!token) {
    redirect("/login");
  }

  const res = await fetch("http://localhost:8080/api/payment/request", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      payer_username: payerUsername,
      amount: parseFloat(amount),
      description,
    }),
  });

  if (!res.ok) {
    if (res.status === 401) {
      redirect("/login");
    }
    const errorData = await res.json();
    throw new Error(errorData.error || "Failed to create payment request");
  }

  return res.json();
}

export async function acceptPaymentRequest(requestId: number) {
  const cookieStore = cookies();
  const token = (await cookieStore).get("auth_token")?.value;

  if (!token) {
    redirect("/login");
  }

  const res = await fetch(
    `http://localhost:8080/api/payment/accept/${requestId}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (!res.ok) {
    if (res.status === 401) {
      redirect("/login");
    }
    const errorData = await res.json();
    throw new Error(errorData.error || "Failed to accept payment request");
  }

  return res.json();
}

// protected.GET("/api/payment-requests", controllers.GetPaymentRequests)
// protected.POST("/payment/request", controllers.CreatePaymentRequest)
// protected.POST("/payment/accept/:id", controllers.AcceptPaymentRequest)
// protected.POST("/payment/decline/:id", controllers.DeclinePaymentRequest)

export async function declinePaymentRequest(requestId: number) {
  const cookieStore = cookies();
  const token = (await cookieStore).get("auth_token")?.value;

  if (!token) {
    redirect("/login");
  }

  const res = await fetch(
    `http://localhost:8080/api/payment/decline/${requestId}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (!res.ok) {
    if (res.status === 401) {
      redirect("/login");
    }
    const errorData = await res.json();
    throw new Error(errorData.error || "Failed to decline payment request");
  }

  return res.json();
}

export async function getPaymentRequests() {
  const cookieStore = cookies();
  const token = (await cookieStore).get("auth_token")?.value;

  if (!token) {
    redirect("/login");
  }

  const res = await fetch("http://localhost:8080/api/payment/payment-requests", {
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
    const errorData = await res.json();
    throw new Error(errorData.error || "Failed to fetch payment requests");
  }

  const data = await res.json();
  console.log(data);

  return data;
}
