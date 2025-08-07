import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import RequestPaymentScreen from "@/components/screen/request-payment-screen";
import {
  acceptPaymentRequest,
  createPaymentRequest,
  declinePaymentRequest,
  getPaymentRequests,
} from "@/actions/payment";

interface PaymentRequest {
  ID: number;
  RequesterID: number;
  PayerID: number;
  Requester: {
    ID: number;
    FullName: string;
    Email: string;
    Username: string;
    CPF: string;
    Password: string;
    Balance: number;
    Status: string;
    Role: string;
    CreatedAt: string;
    UpdatedAt: string;
  };
  Payer: {
    ID: number;
    FullName: string;
    Email: string;
    Username: string;
    CPF: string;
    Password: string;
    Balance: number;
    Status: string;
    Role: string;
    CreatedAt: string;
    UpdatedAt: string;
  };
  Amount: number;
  Description: string;
  Status: string;
  CreatedAt: string;
  UpdatedAt: string;
}

interface User {
  full_name: string;
  balance: number;
  avatar?: string;
}

export default async function RequestPayment() {
  const cookieStore = cookies();
  const token = (await cookieStore).get("auth_token")?.value;

  if (!token) {
    redirect("/login");
  }

  // Fetch user data
  const userRes = await fetch("http://localhost:8080/api/profile", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!userRes.ok) {
    if (userRes.status === 401) {
      redirect("/login");
    }
    throw new Error("Failed to fetch user data");
  }

  const user: User = await userRes.json();

  // Fetch payment requests
  let sentRequests: PaymentRequest[] = [];
  let receivedRequests: PaymentRequest[] = [];
  try {
    const paymentRequests = await getPaymentRequests();
    sentRequests = paymentRequests.sent;
    receivedRequests = paymentRequests.received;
  } catch (error) {
    // Handle error in the component via toast
    console.error("Failed to fetch payment requests:", error);
  }

  console.log("sentrequests", sentRequests);

  return (
    <RequestPaymentScreen
      user={user}
      sentRequests={sentRequests}
      receivedRequests={receivedRequests}
      createPaymentRequest={createPaymentRequest}
      acceptPaymentRequest={acceptPaymentRequest}
      declinePaymentRequest={declinePaymentRequest}
      getPaymentRequests={getPaymentRequests}
    />
  );
}
