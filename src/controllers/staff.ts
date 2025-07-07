import { db } from "@/db/db";
import { StaffCreateProps, TypedRequestBody } from "@/types/types";
import { Request, Response } from "express";

// Define the Staff creation type (add this to your types file)


export async function createStaff(req: TypedRequestBody<StaffCreateProps>, res: Response) {
  const data = req.body;
  const { email } = data;
  
  try {
    // Check if email already exists
    const existingEmail = await db.staff.findUnique({
      where: {
        email,
      },
    });
    
    if (existingEmail) {
      return res.status(409).json({
        data: null,
        error: "Email already exists",
      });
    }

    // Create new staff member
   const newStaff = await db.staff.create({
      data
    });
    console.log(
      `user Sent successfully: ${newStaff} (${newStaff.id})`
    );
    return res.status(201).json({
      data: newStaff,
      error: null,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      data: null,
      error: "Something went wrong",
    });
  }
}

export async function getStaff(req: Request, res: Response) {
  try {
    const staff = await db.staff.findMany({
      where: {
        status: 'active'
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return res.status(200).json(staff);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      data: null,
      error: "Failed to fetch staff",
    });
  }
}

export async function getStaffById(req: Request, res: Response) {
  const { id } = req.params;
  try {
    const staff = await db.staff.findUnique({
      where: {
        id,
      },
    });
    
    if (!staff) {
      return res.status(404).json({
        data: null,
        error: "Staff member not found",
      });
    }
    
    return res.status(200).json({
      data: staff,
      error: null,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      data: null,
      error: "Failed to fetch staff member",
    });
  }
}

