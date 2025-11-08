import axios from "./axiosInstanceAuth";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  bio?: string;
  github?: string;
  linkedin?: string;
  website?: string;
  educations?: EducationInput[];
  experiences?: ExperienceInput[];
  skills?: string[];
}

export interface EducationInput {
  school: string;
  degree?: string;
  field?: string;
  startYear?: number;
  endYear?: number;
}

export interface ExperienceInput {
  title: string;
  company: string;
  description?: string;
  startYear?: number;
  endYear?: number;
}

export const login = async <T = unknown>(payload: LoginRequest): Promise<T> => {
  const { data } = await axios.post<T>("login", payload);
  return data;
};

export const register = async <T = unknown>(
  payload: RegisterRequest
): Promise<T> => {
  const { data } = await axios.post<T>("register", payload);
  return data;
};

export const getGoogleAuthUrl = () => {
  const base = axios.defaults.baseURL ?? "";
  const normalizedBase = base.endsWith("/") ? base.slice(0, -1) : base;
  return `${normalizedBase}/login/google`;
};
