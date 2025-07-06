import { db } from "@/db/db";
import { ContactProps, ManagementProps, ParentCreateProps, TypedRequestBody } from "@/types/types";
import { generateSlug } from "@/utils/generateSlug";
import { Request, Response } from "express";

export async function createManagement(req: TypedRequestBody<ManagementProps>, res: Response) {
  const data =req.body;
  try {

    const newManagement = await db.management.create({
      data
    });
    console.log(
      `Message Sent successfully: ${newManagement} (${newManagement.id})`
    );
    return res.status(201).json({
      data: newManagement,
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
export async function getManagements(req: Request, res: Response) {
  try {
    const management = await db.parent.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    return res.status(200).json(management);
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
