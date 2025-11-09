import axios from "./axiosInstance";
import { MemberRegisterRequest, MemberUpdateRequest } from "@/types/member";

const multipartHeaders = { "Content-Type": "multipart/form-data" };

// GET /member/ - fetch all members
export const getMembers = async () => {
  const res = await axios.get("/member/");
  return res.data;
};

// GET /member/{member_id} - fetch single member by ID
export const getMemberById = async (id: string) => {
  try {
    const res = await axios.get(`/member/${id}`);
    return res.data;
  } catch (err) {
    // console.error(`"❌ member fetch failed but handled" ${id}:`, err);
    return null;
  }
};

// POST /member/ - create a new member
export const createMember = async (payload: MemberRegisterRequest) => {
  const res = await axios.post("/member/", payload);
  return res.data;
};

// PUT /member/{member_id} - update a member
export const updateMember = async (
  id: string,
  payload: MemberUpdateRequest,
  imageFile?: File
) => {
  if (imageFile) {
    const formData = new FormData();
    formData.append("member", JSON.stringify(payload));
    formData.append("image", imageFile);

    const res = await axios.put(`/member/${id}`, formData, {
      headers: multipartHeaders,
    });
    return res.data;
  }

  const res = await axios.put(`/member/${id}`, payload);
  return res.data;
};
