// import { createParent, getParents } from "@/controllers/parents";
import { createManagement, getManagements } from "@/controllers/management";
// import { createSchool, getSchools } from "@/controllers/schools";
import express from "express";
const managementRouter = express.Router();

managementRouter.post("/managements", createManagement);
managementRouter.get("/managements", getManagements);
// schoolRouter.get("/customers/:id", getCustomerById);
// schoolRouter.get("/api/v2/customers", getV2Customers);

export default managementRouter;
