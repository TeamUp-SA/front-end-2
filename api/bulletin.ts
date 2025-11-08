import { BulletinCreateRequest, BulletinUpdateRequest } from "@/types/bulletin";
import axios from "./axiosInstance";

// GET /bulletin/
export const getBulletins = async () => {
  const res = await axios.get("/bulletin/");
  return res.data;
};

// GET /bulletin/{bulletin_id}
export const getBulletinById = async (id: string) => {
  try {
    const res = await axios.get(`/bulletin/${id}`);
    return res.data;
  } catch (err) {
    console.error(`Failed to fetch bulletin id ${id}:`, err);
    return null;
  }
};

// GET /bulletin/author/{author_id}
export const getBulletinsByAuthor = async (authorId: string) => {
  try {
    const res = await axios.get(`/bulletin/author/${authorId}`);
    return res.data;
  } catch (err) {
    console.error(`Failed to fetch bulletin by author id ${authorId}:`, err);
    return null;
  }
};

// GET /bulletin/group/{group_id}
export const getBulletinsByGroup = async (groupId: string) => {
  const res = await axios.get(`/bulletin/group/${groupId}`);
  return res.data;
};

// POST /bulletin/
export const createBulletin = async (payload: BulletinCreateRequest) => {
  const res = await axios.post("/bulletin/", payload);
  return res.data;
};

// PUT /bulletin/{bulletin_id}
export const updateBulletin = async (
  id: string,
  payload: BulletinUpdateRequest
) => {
  const res = await axios.put(`/bulletin/${id}`, payload);
  return res.data;
};

// DELETE /bulletin/{bulletin_id}
export const deleteBulletin = async (id: string) => {
  const res = await axios.delete(`/bulletin/${id}`);
  return res.data;
};
