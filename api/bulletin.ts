import { BulletinCreateRequest, BulletinUpdateRequest } from "@/types/bulletin";
import axios from "./axiosInstance";

const multipartHeaders = { "Content-Type": "multipart/form-data" };

// GET /bulletin/
export const getBulletins = async () => {
  const res = await axios.get("/bulletin");
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
export const createBulletin = async (
  payload: BulletinCreateRequest,
  imageFile?: File,
  memberID?: string
) => {
  if (imageFile) {
    const formData = new FormData();
    formData.append("bulletin", JSON.stringify(payload));
    formData.append("image", imageFile);

    const res = await axios.post("/bulletin", formData, {
      headers: {
        ...multipartHeaders,
        ...(memberID ? { "X-Member-ID": memberID } : undefined),
      },
    });
    return res.data;
  }

  const res = await axios.post("/bulletin", payload, {
    headers: memberID ? { "X-Member-ID": memberID } : undefined,
  });
  return res.data;
};

// PUT /bulletin/{bulletin_id}
export const updateBulletin = async (
  id: string,
  payload: BulletinUpdateRequest,
  imageFile?: File,
  memberID?: string
) => {
  if (imageFile) {
    const formData = new FormData();
    formData.append("bulletin", JSON.stringify(payload));
    formData.append("image", imageFile);

    const res = await axios.put(`/bulletin/${id}`, formData, {
      headers: {
        ...multipartHeaders,
        ...(memberID ? { "X-Member-ID": memberID } : undefined),
      },
    });
    return res.data;
  }

  const res = await axios.put(`/bulletin/${id}`, payload, {
    headers: memberID ? { "X-Member-ID": memberID } : undefined,
  });
  return res.data;
};

// DELETE /bulletin/{bulletin_id}
export const deleteBulletin = async (id: string, memberID?: string) => {
  const res = await axios.delete(`/bulletin/${id}`, {
    headers: memberID
      ? {
          "X-Member-ID": memberID,
        }
      : undefined,
  });
  return res.data;
};
