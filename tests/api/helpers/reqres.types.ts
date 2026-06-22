export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  avatar: string;
}

export interface SupportInfo {
  url: string;
  text: string;
}

export interface PaginatedUsersResponse {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
  data: User[];
  support: SupportInfo;
}

export interface SingleUserResponse {
  data: User;
  support: SupportInfo;
}

export interface UserPayload {
  name: string;
  job?: string;
}

export interface CreateUserResponse {
  name: string;
  job: string;
  id: string;
  createdAt: string;
}

export interface UpdateUserResponse {
  name: string;
  job: string;
  updatedAt: string;
}

export interface AuthPayload {
  email: string;
  password?: string;
}

export interface RegisterSuccessResponse {
  id: number;
  token: string;
}

export interface LoginSuccessResponse {
  token: string;
}

export interface ErrorResponse {
  error: string;
}
