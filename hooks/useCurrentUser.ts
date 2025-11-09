"use client";

import { useEffect, useState } from "react";
import { Member } from "@/types/member";
import { getMemberById, getMembers } from "@/api/member";
import apiClient from "@/api/axiosInstance";

let cachedUser: Member | null = null;
let pendingRequest: Promise<Member | null> | null = null;

const isBrowser = typeof window !== "undefined";

const normalizeMemberResponse = (payload: any): Member | null => {
  if (!payload) return null;

  if (payload.data?.data) return payload.data.data as Member;
  if (payload.data) return payload.data as Member;
  if (payload.data?.length) return payload.data[0] as Member;
  if (Array.isArray(payload)) return (payload[0] ?? null) as Member | null;

  return payload as Member;
};

const writeMemberHeader = (member: Member | null) => {
  if (member?.memberID) {
    apiClient.defaults.headers.common["X-Member-ID"] = member.memberID;
  } else {
    delete apiClient.defaults.headers.common["X-Member-ID"];
  }
};

const storeIdentifiers = (member: Member | null) => {
  if (!isBrowser) return;
  if (member?.memberID) {
    localStorage.setItem("currentMemberID", member.memberID);
    if (member.email) {
      localStorage.setItem("currentUserEmail", member.email.toLowerCase());
    }
    return;
  }

  localStorage.removeItem("currentMemberID");
};

const fetchCurrentUser = async (): Promise<Member | null> => {
  if (!isBrowser) return null;

  try {
    const storedId = localStorage.getItem("currentMemberID");
    const storedEmail =
      localStorage.getItem("currentUserEmail")?.toLowerCase() ?? null;

    if (storedId) {
      const response = await getMemberById(storedId);
      const member = normalizeMemberResponse(response);
      if (member) {
        storeIdentifiers(member);
        writeMemberHeader(member);
        return member;
      }
    }

    if (storedEmail) {
      const response = await getMembers();
      const rawMembers =
        response?.data ??
        response?.data?.data ??
        response ??
        (Array.isArray(response) ? response : []);

      const membersArray: Member[] = Array.isArray(rawMembers)
        ? rawMembers
        : Array.isArray(rawMembers?.data)
        ? rawMembers.data
        : [];

      const normalizedEmail = storedEmail.toLowerCase();
      const found =
        membersArray.find((m) => m.email?.toLowerCase() === normalizedEmail) ??
        null;

      if (found) {
        storeIdentifiers(found);
        writeMemberHeader(found);
        return found;
      }
    }
  } catch (error) {
    console.error("Failed to resolve current user", error);
  }

  storeIdentifiers(null);
  writeMemberHeader(null);
  return null;
};

const resolveCurrentUser = async (): Promise<Member | null> => {
  if (cachedUser) return cachedUser;

  if (!pendingRequest) {
    pendingRequest = fetchCurrentUser().finally(() => {
      pendingRequest = null;
    });
  }

  cachedUser = await pendingRequest;
  return cachedUser;
};

export const useCurrentUser = (): Member | null => {
  const [user, setUser] = useState<Member | null>(cachedUser);

  useEffect(() => {
    let mounted = true;

    if (cachedUser) {
      writeMemberHeader(cachedUser);
      setUser(cachedUser);
      return;
    }

    resolveCurrentUser().then((resolved) => {
      if (!mounted) return;
      setUser(resolved);
    });

    return () => {
      mounted = false;
    };
  }, []);

  return user;
};
