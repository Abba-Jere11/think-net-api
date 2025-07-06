import express from "express";
import { db } from "@/db/db"

const staffRouter = express.Router();

// Get all staff members
staffRouter.get("/staffs", async (req, res) => {
  try {
    const staffs = await db.staff.findMany({
      where: {
        status: "active",
      },
      orderBy: [{ department: "asc" }, { lastname: "asc" }, { firstname: "asc" }],
    });

    // Group staff by department
    const staffByDepartment = staffs.reduce((acc: any, staff) => {
      if (!acc[staff.department]) {
        acc[staff.department] = [];
      }
      acc[staff.department].push(staff);
      return acc;
    }, {});

    res.json({
      success: true,
      data: {
        staffs,
        staffByDepartment,
        totalCount: staffs.length,
      },
    });
  } catch (error) {
    console.error("Error fetching staff:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch staff members",
    });
  }
});

// Create new staff member
staffRouter.post("/staffs", async (req, res) => {
  try {
    const {
      firstname,
      lastname,
      email,
      phone,
      dob,
      gender,
      address,
      department,
      nin,
      religion,
      password,
      imageUrl,
      startingDate,
      description,
      stateOfOrigin,
      lga,

      user,
    } = req.body;

    // Check if email already exists
    const existingStaff = await db.staff.findUnique({
      where: { email },
    });

    if (existingStaff) {
      return res.status(409).json({
        success: false,
        message: "Email address already exists",
      });
    }

    // Create staff member
    const newStaff = await db.staff.create({
      data: {
        firstname,
        lastname,
        email,
        phone,
        dob: new Date(dob),
        gender,
        address,
        department,
        nin,
        religion,
        password, // In production, you should hash this
        imageUrl,
        startingDate: startingDate && startingDate.trim() !== "" ? new Date(startingDate) : null,
        description,
        stateOfOrigin,
        lga,
        user,
      },
    });

    res.status(201).json({
      success: true,
      message: "Staff member created successfully",
      data: newStaff,
    });
  } catch (error) {
    console.error("Error creating staff:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create staff member",
    });
  }
});

export default staffRouter;