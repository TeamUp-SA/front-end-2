import axios from "./axiosInstance";
import { GroupCreateRequest, GroupUpdateRequest } from "@/types/group";

// GET /group/ - fetch all groups
export const getGroups = async () => {
  const res = await axios.get("/group/");
  return res.data;
};

// GET /group/{group_id} - fetch single group by ID
export const getGroupById = async (id: string) => {
  const res = await axios.get(`/group/${id}`);
  return res.data;
};

// GET /group/owner/{owner_id} - fetch groups by owner
export const getGroupsByOwnerId = async (ownerId: string) => {
  const res = await axios.get(`/group/owner/${ownerId}`);
  return res.data;
};

// POST /group/ - create a new group
export const createGroup = async (payload: GroupCreateRequest) => {
  const res = await axios.post("/group/", payload);
  return res.data;
};

// PUT /group/{group_id} - update a group
export const updateGroup = async (id: string, payload: GroupUpdateRequest) => {
  const res = await axios.put(`/group/${id}`, payload);
  return res.data;
};

// DELETE /group/{group_id} - delete a group
export const deleteGroup = async (id: string) => {
  const res = await axios.delete(`/group/${id}`);
  return res.data;
};
