import { db } from "@/db/db";
import { generateSlug } from "@/utils/generateSlug";
import { Request, Response } from "express";

export async function createSchool(req: Request, res: Response) {
  const { name,  } = req.body;

  
  // Input validation
  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    return res.status(400).json({
      data: null,
      error: "School name is required and must be a non-empty string",
    });
  }

  

  const slug = generateSlug(name);
     
  try {
    // Check if the school already exists
    const existingSchool = await db.school.findUnique({
      where: {
        slug,
      },
    });
         
    if (existingSchool) {
      return res.status(409).json({
        data: null,
        error: "School with this name already exists",
      });
    }
         
    const newSchool = await db.school.create({
      data: {
        name: name.trim(),
        slug,
        
      },
    });
         
    console.log(
      `School created successfully: ${newSchool.name} (${newSchool.id})`
    );
         
    return res.status(201).json({
      data: newSchool,
      error: null,
    });
  } catch (error) {
    console.error("Error creating school:", error);
    return res.status(500).json({
      data: null,
      error: "Something went wrong while creating the school",
    });
  }
}

export async function getSchools(req: Request, res: Response) {
  try {
    const schools = await db.school.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
         
    return res.status(200).json({
      data: schools,
      error: null
    });
  } catch (error) {
    console.error("Error fetching schools:", error);
    return res.status(500).json({
      data: null,
      error: "Something went wrong while fetching schools",
    });
  }
}

export async function getSchoolById(req: Request, res: Response) {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({
      data: null,
      error: "School ID is required",
    });
  }

  try {
    const school = await db.school.findUnique({
      where: {
        id,
      },
    });

    if (!school) {
      return res.status(404).json({
        data: null,
        error: "School not found",
      });
    }

    return res.status(200).json({
      data: school,
      error: null,
    });
  } catch (error) {
    console.error("Error fetching school:", error);
    return res.status(500).json({
      data: null,
      error: "Something went wrong while fetching the school",
    });
  }
}

export async function updateSchool(req: Request, res: Response) {
  const { id } = req.params;
  const { name,  } = req.body;

  if (!id) {
    return res.status(400).json({
      data: null,
      error: "School ID is required",
    });
  }

  // Input validation
  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    return res.status(400).json({
      data: null,
      error: "School name is required and must be a non-empty string",
    });
  }

  

  const slug = generateSlug(name);

  try {
    // Check if school exists
    const existingSchool = await db.school.findUnique({
      where: { id },
    });

    if (!existingSchool) {
      return res.status(404).json({
        data: null,
        error: "School not found",
      });
    }

    // Check if another school with the same name exists (exclude current school)
    const schoolWithSameName = await db.school.findFirst({
      where: {
        slug,
        NOT: { id },
      },
    });

    if (schoolWithSameName) {
      return res.status(409).json({
        data: null,
        error: "Another school with this name already exists",
      });
    }

    const updatedSchool = await db.school.update({
      where: { id },
      data: {
        name: name.trim(),
        slug,
      
      },
    });

    console.log(
      `School updated successfully: ${updatedSchool.name} (${updatedSchool.id})`
    );

    return res.status(200).json({
      data: updatedSchool,
      error: null,
    });
  } catch (error) {
    console.error("Error updating school:", error);
    return res.status(500).json({
      data: null,
      error: "Something went wrong while updating the school",
    });
  }
}

export async function deleteSchool(req: Request, res: Response) {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({
      data: null,
      error: "School ID is required",
    });
  }

  try {
    const existingSchool = await db.school.findUnique({
      where: { id },
    });

    if (!existingSchool) {
      return res.status(404).json({
        data: null,
        error: "School not found",
      });
    }

    await db.school.delete({
      where: { id },
    });

    console.log(`School deleted successfully: ${existingSchool.name} (${id})`);

    return res.status(200).json({
      data: { message: "School deleted successfully" },
      error: null,
    });
  } catch (error) {
    console.error("Error deleting school:", error);
    return res.status(500).json({
      data: null,
      error: "Something went wrong while deleting the school",
    });
  }
}