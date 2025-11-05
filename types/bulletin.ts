export interface Bulletin {
  bulletinID: string;
  authorID: string;
  title: string;
  description: string;
  groupID: string[];
  date: string;
  image: string;
  tags: number[];
  createdAt?: string;
}

export interface BulletinCreateRequest {
  authorID: string;
  title: string;
  description: string;
  groupID: string[];
  date: string;
  image: string;
  tags: number[];
}

export interface BulletinUpdateRequest {
  title: string;
  description: string;
  groupID: string[];
  date: string;
  image: string;
  tags: number[];
}
