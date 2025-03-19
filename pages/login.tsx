import Login from "../components/User/Login";
import Link from "next/link";

export default function LoginPage() {
  return (
    <main>
      <Login />
      <center>
        <p>
          Don&apos;t have an account? <Link href="/signup">Sign up</Link>
        </p>
      </center>
    </main>
  );
}
