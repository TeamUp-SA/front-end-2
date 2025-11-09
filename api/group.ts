import axios from "./axiosInstance";
import { GroupCreateRequest, GroupUpdateRequest } from "@/types/group";

// GET /group/ - fetch all groups
export const getGroups = async () => {
  const res = await axios.get("/group/");
  return res.data;
};

// GET /group/{group_id} - fetch single group by ID
export const getGroupById = async (id: string) => {
  try {
    const res = await axios.get(`/group/${id}`);
    return res.data;
  } catch (err) {
    console.error(`Failed to fetch group ${id}:`, err);
    return null; //
  }
};

// GET /group/owner/{owner_id} - fetch groups by owner
export const getGroupsByOwnerId = async (ownerId: string) => {
  try {
    const res = await axios.get(`/group/owner/${ownerId}`);
    return res.data;
  } catch (err) {
    console.error(`Failed to fetch group by owner ${ownerId}:`, err);
    return null;
  }
};

// POST /group - create a new group
export const createGroup = async (
  payload: GroupCreateRequest,
  memberID?: string
) => {
  const res = await axios.post("/group", payload, {
    headers: memberID ? { "X-Member-ID": memberID } : undefined,
  });
  return res.data;
};

// PUT /group/{group_id} - update a group
export const updateGroup = async (
  id: string,
  payload: GroupUpdateRequest,
  memberID?: string
) => {
  const res = await axios.put(`/group/${id}`, payload, {
    headers: memberID ? { "X-Member-ID": memberID } : undefined,
  });
  return res.data;
};

// DELETE /group/{group_id} - delete a group
export const deleteGroup = async (id: string, memberID?: string) => {
  const res = await axios.delete(`/group/${id}`, {
    headers: memberID
      ? {
          "X-Member-ID": memberID,
        }
      : undefined,
  });
  return res.data;
};
