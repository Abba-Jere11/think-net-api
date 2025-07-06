import { Role } from "@prisma/client";
import { Request, Response } from "express";

export interface TypedRequestBody<T> extends Request{
    body:T;
}

export type ContactProps = {
  name: string;
  email: string;
  password: string;
  phone: string;
  department: string;
  level: string;
  priority: string;
  request: string;
  subject: string;
  desc:string;
  employeeId:string
}
export type UserCreateprops = {
  email    :string
  password :string
  name     :string
  role     :Role
  phone?    :string
  image?: string
}
export type UserLoginprops = {
  email    :string
  password :string
  
}
export type DepartmentCreateProps = {
  name: string;
  code: string;
  describtion: string;
  location: string;
  manager: string;
  managerId: string;
  established: string;
}

export type ParentCreateProps = {
  firstname: string;
  email:string;
  lastname: string;
  phone?: string | null;
  dob: string;
  gender: string;
  address?: string | null;
  department: string;
  nin?: string | null;
  religion?: string | null;
  password: string;
  imageUrl?: string | null;
  startingDate: string;
  description?: string | null;
  stateOfOrigin?: string | null;
  lga?: string | null;
  status?: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
  userId:string;
}


export interface Announcement {
 id: string;
  title: string;
  content: string;
  type: string; // 'info', 'warning', 'announcement'
  priority: string; // 'High', 'Medium', 'Low'
  department: string;
  author: string;
  publishDate: Date;
  isActive: boolean;
  authorId?: string | null;
  expiryDate: Date | null;
  status: string; // 'Published', 'Draft', 'Scheduled'
  views: number;
  isUrgent: boolean;
  isPinned: boolean;
  createdAt: Date;
  updatedAt: Date;
  
}

export interface CreateAnnouncementRequest {
  title: string
  content: string
  type: "info" | "warning" | "announcement"
  priority: "High" | "Medium" | "Low"
  department: string
  author: string
  expiryDate?: string
  isUrgent?: boolean
  isPinned?: boolean
}

export interface UpdateAnnouncementRequest {
  title?: string
  content?: string
  type?: "info" | "warning" | "announcement"
  priority?: "High" | "Medium" | "Low"
  department?: string
  author?: string
  expiryDate?: string
  status?: "Published" | "Draft" | "Scheduled"
  isUrgent?: boolean
  isPinned?: boolean
}

export interface AnnouncementFilters {
  search?: string
  type?: string
  priority?: string
  department?: string
  status?: string
  page?: number
  limit?: number
}

export type ManagementProps = {
  userId: string           // Required - references User
  firstName: string        // Required
  lastName: string         // Required
  email: string           // Required and unique
  phone: string           // Required
  dob: string             // Required
  gender: string          // Required
  imageUrl?: string       // Optional (String?)
  password?: string       // Optional (String?)
  employeeId: string      // Required and unique
  dateOfJoining: string   // Required
  address?: string        // Optional (String?)
  stateOrigin?: string    // Optional (String?)
  lga?: string           // Optional (String?)
  experience?: string     // Optional (String?)
  department: string      // Required
  isActive?: boolean      // Optional - has default value (true)
  lastLogin?: Date
}