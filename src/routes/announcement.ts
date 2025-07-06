import { Router } from "express"
import { AnnouncementController } from "../controllers/announcement"

const router = Router()

// Get all announcements with filtering
router.get("/", AnnouncementController.getAnnouncements)

// Get dashboard announcements (for widget)
router.get("/dashboard", AnnouncementController.getDashboardAnnouncements)

// Get single announcement
router.get("/:id", AnnouncementController.getAnnouncement)

// Create new announcement
router.post("/", AnnouncementController.createAnnouncement)

// Update announcement
router.put("/:id", AnnouncementController.updateAnnouncement)

// Delete announcement
router.delete("/:id", AnnouncementController.deleteAnnouncement)

// Increment view count
router.patch("/:id/views", AnnouncementController.incrementViews)

export default router
