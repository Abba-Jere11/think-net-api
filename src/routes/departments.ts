// import { createContact, getContacts } from "@/controllers/admin";
import { createDepartment, getDepartments } from "@/controllers/department";
import express from "express";
const departmentRouter = express.Router();

departmentRouter.post("/departments", createDepartment);
departmentRouter.get("/departments", getDepartments);
// schoolRouter.get("/customers/:id", getCustomerById);
// schoolRouter.get("/api/v2/customers", getV2Customers);

export default departmentRouter;
