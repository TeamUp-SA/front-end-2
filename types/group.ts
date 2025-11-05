export interface Group {
  groupID: string;
  title: string;
  description: string;
  ownerID: string;
  members: string[];
  tags: string[];
  closed: boolean;
  createdAt: string; // frontend can use ISO string instead of Date
}

export interface GroupCreateRequest {
  title: string;
  description: string;
  ownerID: string;
  members: string[];
  tags: string[];
  closed: boolean;
  createdAt: string;
}

export interface GroupUpdateRequest {
  title: string;
  description: string;
  ownerID: string;
  members: string[];
  tags: string[];
  closed: boolean;
  createdAt: string;
}
