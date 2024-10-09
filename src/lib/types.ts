export type Staff = {
  id: string;
  name: string;
  createdAt: number;
  isActive: boolean;
  counter: number;
  email: string;
  contactNumber: string;
  password: string;
  confirmPassword: string;
  role: string;
};

export type Counter = {
  id: string;
  counterNum: number;
  createdAt: number;
  isActive: boolean;
};

export type Announcement = {
  id: string;
  title: string;
  description: string;
  createdAt: number;
  isActive: boolean;
};
