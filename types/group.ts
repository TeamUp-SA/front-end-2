export interface Group {
  groupID: string;
  title: string;
  description: string;
  ownerID: string;
  members: string[];
  tags: string[];
  closed: boolean;
  date: string;
  createdAt: string;
}

export interface GroupCreateRequest {
  title: string;
  description: string;
  ownerID: string;
  members: string[];
  tags: string[];
  closed: boolean;
  date: string;
  createdAt: string;
}

export interface GroupUpdateRequest {
  title: string;
  description: string;
  ownerID: string;
  members: string[];
  tags: string[];
  closed: boolean;
  date: string;
  createdAt: string;
}
