import axios from "./axiosInstance";
import { Group } from "@/types/group"; // Assuming this type is available
import { GroupCreateRequest, GroupUpdateRequest } from "@/types/group";

// GET /group/ - fetch all groups
// export const getGroups = async () => {
//   const res = await axios.get("/group/");
//   return res.data;
// };

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
  memberID?: string,
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
  memberID?: string,
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

export interface GroupSearchParams {
  title?: string;
  tags?: string[];
  date?: string;
  includeClosed?: boolean;
  limit?: number;
  offset?: number;
}

export const getGroups = async (
  params: GroupSearchParams = {},
): Promise<{ data: Group[] }> => {
  const {
    title = null,
    tags = undefined,
    date = undefined,
    includeClosed = false,
    limit = undefined,
    offset = undefined,
  } = params;

  const SEARCH_GROUPS_QUERY = `
    query SearchGroups(
      $title: String
      $tags: [GroupTag]
      $date: String
      $includeClosed: Boolean
      $limit: Int
      $offset: Int
    ) {
      searchGroups(
        title: $title
        tags: $tags
        date: $date
        includeClosed: $includeClosed
        limit: $limit
        offset: $offset
      ) {
        groupID: id
        title
        tags
        date
        members
        description
      }
    }
  `;

  try {
    const response = await axios.post(
      "http://localhost:30011/search/graphql",
      {
        query: SEARCH_GROUPS_QUERY,
        variables: {
          title,
          tags,
          date,
          includeClosed,
          limit,
          offset,
        },
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    if (response.data.errors) {
      console.error("GraphQL Errors:", response.data.errors);
      throw new Error("GraphQL request failed.");
    }

    const groupsData = response.data.data.searchGroups;

    const formattedGroups: Group[] = groupsData.map((group: any) => ({
      groupID: group.groupID,
      title: group.title,
      tags: group.tags,
      date: group.date,
      description: group.description || "N/A",
      members: group.members || [],
    }));

    return { data: formattedGroups };
  } catch (error) {
    console.error("API Request Failed:", error);
    throw error;
  }
};
