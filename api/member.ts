import axios from "./axiosInstance";
import { MemberRegisterRequest, MemberUpdateRequest } from "@/types/member";

// GET /member/ - fetch all members
export const getMembers = async () => {
  const res = await axios.get("/member/");
  return res.data;
};

// GET /member/{member_id} - fetch single member by ID
export const getMemberById = async (id: string) => {
  const res = await axios.get(`/member/${id}`);
  return res.data;
};

// POST /member/ - create a new member
export const createMember = async (payload: MemberRegisterRequest) => {
  const res = await axios.post("/member/", payload);
  return res.data;
};

// PUT /member/{member_id} - update a member
export const updateMember = async (id: string, payload: MemberUpdateRequest) => {
  const res = await axios.put(`/member/${id}`, payload);
  return res.data;
};