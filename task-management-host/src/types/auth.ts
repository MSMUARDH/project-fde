export interface User {
  name: string;
  role: "admin" | "user";
}

export interface AuthState {
  user: User | null;
}
