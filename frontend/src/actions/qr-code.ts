// actions/qr.ts
"use server";

import { cookies } from "next/headers";

export async function generateQRCode({ amount }: { amount: number }) {
  const token = (await cookies()).get("auth_token")?.value;
  if (!token) {
    throw new Error("No authentication token found");
  }

  const response = await fetch("http://localhost:8080/api/qr/generate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ amount }),
  });

  if (!response.ok) {
    const text = await response.text();
    console.error("GenerateQR error response:", text);
    let errorData;
    try {
      errorData = JSON.parse(text);
    } catch {
      throw new Error("Failed to generate QR code: Invalid response from server");
    }
    throw new Error(errorData.error || "Failed to generate QR code");
  }

  return response.json();
}

export async function processQRCode({ qr_code_id }: { qr_code_id: number }) {
  const token = (await cookies()).get("auth_token")?.value;
  if (!token) {
    throw new Error("No authentication token found");
  }

  const response = await fetch("http://localhost:8080/api/qr/process", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ qr_code_id }),
  });

  if (!response.ok) {
    const text = await response.text();
    console.error("ProcessQR error response:", text);
    let errorData;
    try {
      errorData = JSON.parse(text);
    } catch {
      throw new Error("Failed to process payment: Invalid response from server");
    }
    throw new Error(errorData.error || "Failed to process payment");
  }

  return response.json();
}

export async function getQRDetails({ qr_code_id }: { qr_code_id: number }) {
  const token = (await cookies()).get("auth_token")?.value;
  if (!token) {
    throw new Error("No authentication token found");
  }

  const response = await fetch(`http://localhost:8080/api/qr/${qr_code_id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const text = await response.text();
    console.error("GetQRDetails error response:", text);
    let errorData;
    try {
      errorData = JSON.parse(text);
    } catch {
      throw new Error("Failed to get QR details: Invalid response from server");
    }
    throw new Error(errorData.error || "Failed to get QR details");
  }

  return response.json();
}