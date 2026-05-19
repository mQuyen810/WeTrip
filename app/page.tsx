"use client";

import { useAuth } from "@/providers/AuthProvider";
export default function Home() {
  const { user } = useAuth();
  console.log(user);
  
  return (
    <div>
      <h1>Welcome</h1>
    </div>
  );
}
