export interface Bulletin {
  bulletinID: string;
  authorID: string;
  title: string;
  description: string;
  groupID: string[];
  date: string;
  image: string;
  tags: string[];
  createdAt?: string;
}

export interface BulletinCreateRequest {
  authorID: string;
  title: string;
  description: string;
  groupID: string[];
  date: string;
  image: string;
  tags: string[];
}

export interface BulletinUpdateRequest {
  title: string;
  description: string;
  groupID: string[];
  date: string;
  image: string;
  tags: string[];
}
