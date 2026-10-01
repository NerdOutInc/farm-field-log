import { redirect } from "next/navigation";

// The dashboard is the home page. proxy.ts sends signed-out visitors to /login.
export default function Home() {
  redirect("/logs");
}
