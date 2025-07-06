import { Router } from "express"
import {
  getAnnouncements,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
  toggleAnnouncementStatus,
} from "../controllers/announcements"

const router = Router()

// GET /api/announcements - Get all announcements
router.get("/", getAnnouncements)

// POST /api/announcements - Create new announcement
router.post("/", createAnnouncement)

// PUT /api/announcements/:id - Update announcement
router.put("/:id", updateAnnouncement)

// DELETE /api/announcements/:id - Delete announcement
router.delete("/:id", deleteAnnouncement)

// PATCH /api/announcements/:id/toggle - Toggle announcement status
router.patch("/:id/toggle", toggleAnnouncementStatus)

export default router
