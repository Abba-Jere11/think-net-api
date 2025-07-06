import { db } from "@/db/db";
import { ContactProps, DepartmentCreateProps, TypedRequestBody } from "@/types/types";
import { generateSlug } from "@/utils/generateSlug";
import { Request, Response } from "express";

export async function createDepartment(req: TypedRequestBody<DepartmentCreateProps>, res: Response) {
  const data =req.body
  try {

    const newDepartment = await db.department.create({
      data
    });
    console.log(
      `Message Sent successfully: ${newDepartment} (${newDepartment.id})`
    );
    return res.status(201).json({
      data: newDepartment,
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
export async function getDepartments(req: Request, res: Response) {
  try {
    const department = await db.department.findMany({
      orderBy: {
        createdAt: "desc",
      },
      
    });
    return res.status(200).json(department);
  } catch (error) {
    console.log(error);
  }
}
// export async function getCustomerById(req: Request, res: Response) {
//   const { id } = req.params;
//   try {
//     const customer = await db.customer.findUnique({
//       where: {
//         id,
//       },
//     });
//     return res.status(200).json(customer);
//   } catch (error) {
//     console.log(error);
//   }
// }
