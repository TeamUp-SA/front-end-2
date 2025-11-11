"use client";

import { useEffect } from "react";
import { CollaborationSidebar } from "@/components/collaboration-sidebar";
import { CollabGroupCards } from "@/components/collab-group-cards";
import { getMembers } from "@/api/member";

export default function Page() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const email = params.get("email");
    if (email) {
      const normalizedEmail = email.toLowerCase();
      localStorage.setItem("currentUserEmail", normalizedEmail);
      localStorage.removeItem("currentMemberID");

      getMembers()
        .then((response) => {
          const members = response?.data ?? [];
          const match = members.find(
            (m: { email?: string; memberID?: string }) =>
              m.email?.toLowerCase() === normalizedEmail
          );
          if (match?.memberID) {
            localStorage.setItem("currentMemberID", match.memberID);
          }
        })
        .catch((err) =>
          console.error("Failed to prefetch member profile", err)
        );
    }
  }, []);

  return (
    <div className="flex min-h-screen bg-background">
      <CollaborationSidebar />
      <main className="flex-1 p-6 lg:p-8">
        <CollabGroupCards />
      </main>
    </div>
  );
}
