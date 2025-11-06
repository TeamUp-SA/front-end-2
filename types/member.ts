export interface Member {
  memberID: string;
  username: string;
  password?: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;

  bio?: string;
  skills?: string[];
  linkedIn?: string;
  github?: string;
  website?: string;
  profileImage?: string;

  experience?: Experience[];
  education?: Education[];
}

export interface MemberRegisterRequest {
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
}

export interface MemberUpdateRequest {
  username?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;

  bio?: string;
  skills?: string[];
  linkedIn?: string;
  github?: string;
  website?: string;
  profileImage?: string;

  experience?: Experience[];
  education?: Education[];
}

export interface Experience {
  title: string;
  company: string;
  description?: string;
  startYear?: number;
  endYear?: number;
}

export interface Education {
  school: string;
  degree?: string;
  field?: string;
  startYear?: number;
  endYear?: number;
}
