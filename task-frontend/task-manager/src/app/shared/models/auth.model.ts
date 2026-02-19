export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface TokenResponse {
  token: string;
  expiresIn: number;
}

export interface UserResponse {
  id: number;
  name: string;
  email: string;
  roles: string[];
}
