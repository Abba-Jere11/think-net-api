import type { Request, Response } from "express"
import { db } from "../db/db"
import { CreateAnnouncementRequest,UpdateAnnouncementRequest, AnnouncementFilters } from "@/types/types"


export class AnnouncementController {
  // Get all announcements with filtering
  static async getAnnouncements(req: Request, res: Response) {
    try {
      const { search, type, priority, department, status, page = 1, limit = 10 } = req.query as AnnouncementFilters

      const skip = (Number(page) - 1) * Number(limit)

      // Build where clause for filtering
      const where: any = {}

      if (search) {
        where.OR = [
          { title: { contains: search, mode: "insensitive" } },
          { content: { contains: search, mode: "insensitive" } },
        ]
      }

      if (type && type !== "all") {
        where.type = type
      }

      if (priority && priority !== "all") {
        where.priority = priority
      }

      if (department && department !== "all") {
        where.department = department
      }

      if (status && status !== "all") {
        where.status = status
      }

      const [announcements, total] = await Promise.all([
        db.announcement.findMany({
          where,
          orderBy: [{ isPinned: "desc" }, { publishDate: "desc" }],
          skip,
          take: Number(limit),
        }),
        db.announcement.count({ where }),
      ])

      res.json({
        announcements,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit)),
        },
      })
    } catch (error) {
      console.error("Error fetching announcements:", error)
      res.status(500).json({ error: "Failed to fetch announcements" })
    }
  }

  // Get single announcement
  static async getAnnouncement(req: Request, res: Response) {
    try {
      const { id } = req.params

      const announcement = await db.announcement.findUnique({
        where: { id: (id) },
      })

      if (!announcement) {
        return res.status(404).json({ error: "Announcement not found" })
      }

      res.json(announcement)
    } catch (error) {
      console.error("Error fetching announcement:", error)
      res.status(500).json({ error: "Failed to fetch announcement" })
    }
  }

  // Create new announcement
  static async createAnnouncement(req: Request, res: Response) {
    try {
      const data: CreateAnnouncementRequest = req.body

      const announcement = await db.announcement.create({
        data: {
          title: data.title,
          content: data.content,
          type: data.type,
          priority: data.priority,
          department: data.department,
          author: data.author,
          expiryDate: data.expiryDate ? new Date(data.expiryDate) : null,
          isUrgent: data.isUrgent || false,
          isPinned: data.isPinned || false,
          status: "Published", // Default to published for now
        },
      })

      res.status(201).json(announcement)
    } catch (error) {
      console.error("Error creating announcement:", error)
      res.status(500).json({ error: "Failed to create announcement" })
    }
  }

  // Update announcement
  static async updateAnnouncement(req: Request, res: Response) {
    try {
      const { id } = req.params
      const data: UpdateAnnouncementRequest = req.body

      const announcement = await db.announcement.update({
        where: { id: (id) },
        data: {
          ...(data.title && { title: data.title }),
          ...(data.content && { content: data.content }),
          ...(data.type && { type: data.type }),
          ...(data.priority && { priority: data.priority }),
          ...(data.department && { department: data.department }),
          ...(data.author && { author: data.author }),
          ...(data.expiryDate && { expiryDate: new Date(data.expiryDate) }),
          ...(data.status && { status: data.status }),
          ...(data.isUrgent !== undefined && { isUrgent: data.isUrgent }),
          ...(data.isPinned !== undefined && { isPinned: data.isPinned }),
        },
      })

      res.json(announcement)
    } catch (error) {
      console.error("Error updating announcement:", error)
      res.status(500).json({ error: "Failed to update announcement" })
    }
  }

  // Delete announcement
  static async deleteAnnouncement(req: Request, res: Response) {
    try {
      const { id } = req.params

      await db.announcement.delete({
        where: { id: (id) },
      })

      res.json({ message: "Announcement deleted successfully" })
    } catch (error) {
      console.error("Error deleting announcement:", error)
      res.status(500).json({ error: "Failed to delete announcement" })
    }
  }

  // Increment view count
  static async incrementViews(req: Request, res: Response) {
    try {
      const { id } = req.params

      const announcement = await db.announcement.update({
        where: { id: (id) },
        data: {
          views: {
            increment: 1,
          },
        },
      })

      res.json(announcement)
    } catch (error) {
      console.error("Error incrementing views:", error)
      res.status(500).json({ error: "Failed to increment views" })
    }
  }

  // Get announcements for dashboard widget (recent, pinned)
  static async getDashboardAnnouncements(req: Request, res: Response) {
    try {
      const announcements = await db.announcement.findMany({
        where: {
          status: "Published",
        },
        orderBy: [{ isPinned: "desc" }, { publishDate: "desc" }],
        take: 4, // Limit to 4 for dashboard widget
      })

      res.json(announcements)
    } catch (error) {
      console.error("Error fetching dashboard announcements:", error)
      res.status(500).json({ error: "Failed to fetch dashboard announcements" })
    }
  }
}
