// app/profile/page.tsx
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import ProfileScreen from "@/components/screen/profile-screen";
import { getProfile, updatePassword, logout } from "@/actions/profile";

export default async function ProfilePage() {
  const cookieStore = cookies();
  const token = (await cookieStore).get("auth_token")?.value;

  if (!token) {
    redirect("/login");
  }

  let user;
  try {
    user = await getProfile();
  } catch (error) {
    redirect("/login");
  }

  return <ProfileScreen user={user} updatePassword={updatePassword} logout={logout} />;
}