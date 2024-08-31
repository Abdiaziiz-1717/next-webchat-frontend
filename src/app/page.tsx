import Messages from "@/components/Dashboard/Messages";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import React from "react";

export const metadata: Metadata = {
  title: "web-chat",
  description: "This is Next.js Home page for NextAdmin Dashboard Kit",
};

export default function Home() {
  return (
    <>
      <DefaultLayout>
        <Messages />
      </DefaultLayout>
    </>
  );
}
