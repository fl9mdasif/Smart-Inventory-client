"use client";

import { logoutUser } from "@/services/actions/logoutUser";
import { getUserInfo, removeUser } from "@/services/auth.services";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react"; // useEffect যোগ করুন

const AuthButton = () => {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const userInfo = getUserInfo();

  const handleLogOut = async () => {
    removeUser();
    await logoutUser();
    router.push("/login");
    router.refresh();
  };

  if (!mounted) return null;

  return (
    <>
      {userInfo?._id && (
        <button
          onClick={handleLogOut}
          className=" rounded-2xl font-bold px-3 py-2"
        >
          Logout
        </button>
      )}
    </>
  );
};

export default AuthButton;
