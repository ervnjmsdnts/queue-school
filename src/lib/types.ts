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
  description?: string;
  createdAt: number;
  isActive: boolean;
};

export type Announcement = {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  imageName?: string;
  videoUrl?: string;
  videoName?: string;
  videoPublicId?: string;
  createdAt: number;
  isActive: boolean;
};

export type Ticket = {
  id: string;
  counter: number;
  createdAt: number;
  isActive: boolean;
  type: string;
  isComplete: boolean;
  scheduleDate: number;
  ticketNumber: string;
  completionDate?: number;
  customer: {
    name: string;
    contactNumber: string;
  };
};
