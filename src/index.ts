import express from "express"
import adminRouter from "./routes/admin"
import schoolRouter from "./routes/school"
import staffRouter from "./routes/staff"
import announcementRouter from "@/routes/announcement"
import parentRouter from "./routes/parents"
import departmentRouter from "./routes/departments"
import managementRouter from "./routes/management"
import userRouter from "./routes/user"
require("dotenv").config()

const cors = require("cors")

const app = express()

app.use(cors())

const PORT = process.env.PORT || 8000

app.use(express.json())

// Routes
app.use("/api/v1", schoolRouter)
app.use("/api/v1", adminRouter)
app.use("/api/v1", staffRouter)
app.use("/api/v1/announcements", announcementRouter)
app.use("/api/v1/", parentRouter)
app.use("/api/v1/", departmentRouter)
app.use("/api/v1/", managementRouter)
app.use("/api/v1/", userRouter)

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
