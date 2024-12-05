import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/router";
import { useEffect } from "react";

const ProtectedPage = () => {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);

  if (!user) return <p>Loading...</p>;

  return <p>Welcome, {user.email}!</p>;
};

export default ProtectedPage;
