import type { Request, Response } from "express"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

// Get all active announcements
export const getAnnouncements = async (req: Request, res: Response) => {
  try {
    const { department, limit = 10 } = req.query

    const announcements = await prisma.announcement.findMany({
      where: {
        isActive: true,
        AND: [
          department ? { department: department as string } : {},
          {
            OR: [{ expiryDate: null }, { expiryDate: { gt: new Date() } }],
          },
        ],
      },
      // include: {
      //   author: {
      //     select: {
      //       firstname: true,
      //       lastname: true,
      //       department: true,
      //     },
      //   },
      // },
      orderBy: [{ priority: "desc" }, { createdAt: "desc" }],
      take: Number.parseInt(limit as string),
    })

    res.json({
      success: true,
      data: announcements,
      count: announcements.length,
    })
  } catch (error) {
    console.error("Error fetching announcements:", error)
    res.status(500).json({
      success: false,
      message: "Failed to fetch announcements",
    })
  }
}

// Create new announcement
export const createAnnouncement = async (req: Request, res: Response) => {
  try {
    const { title, content, type = "info", priority = "medium", department, expiresAt, authorId } = req.body

    const announcement = await prisma.announcement.create({
      data: {
        title,
        content,
        type,
        priority,
        department,
        expiryDate: expiresAt ? new Date(expiresAt) : null,
        authorId,
      },
      // include: {
      //   author: {
      //     select: {
      //       firstname: true,
      //       lastname: true,
      //       department: true,
      //     },
      //   },
      // },
    })

    res.status(201).json({
      success: true,
      data: announcement,
      message: "Announcement created successfully",
    })
  } catch (error) {
    console.error("Error creating announcement:", error)
    res.status(500).json({
      success: false,
      message: "Failed to create announcement",
    })
  }
}

// Update announcement
export const updateAnnouncement = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const updateData = req.body

    const announcement = await prisma.announcement.update({
      where: { id },
      data: {
        ...updateData,
        expiresAt: updateData.expiresAt ? new Date(updateData.expiresAt) : undefined,
        updatedAt: new Date(),
      },
      // include: {
      //   author: {
      //     select: {
      //       firstname: true,
      //       lastname: true,
      //       department: true,
      //     },
      //   },
      // },
    })

    res.json({
      success: true,
      data: announcement,
      message: "Announcement updated successfully",
    })
  } catch (error) {
    console.error("Error updating announcement:", error)
    res.status(500).json({
      success: false,
      message: "Failed to update announcement",
    })
  }
}

// Delete announcement
export const deleteAnnouncement = async (req: Request, res: Response) => {
  try {
    const { id } = req.params

    await prisma.announcement.delete({
      where: { id },
    })

    res.json({
      success: true,
      message: "Announcement deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting announcement:", error)
    res.status(500).json({
      success: false,
      message: "Failed to delete announcement",
    })
  }
}

// Toggle announcement status
export const toggleAnnouncementStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params

    const announcement = await prisma.announcement.findUnique({
      where: { id },
    })

    if (!announcement) {
      return res.status(404).json({
        success: false,
        message: "Announcement not found",
      })
    }

    const updatedAnnouncement = await prisma.announcement.update({
      where: { id },
      data: {
        isActive: !announcement.isActive,
        updatedAt: new Date(),
      },
    })

    res.json({
      success: true,
      data: updatedAnnouncement,
      message: `Announcement ${updatedAnnouncement.isActive ? "activated" : "deactivated"} successfully`,
    })
  } catch (error) {
    console.error("Error toggling announcement status:", error)
    res.status(500).json({
      success: false,
      message: "Failed to toggle announcement status",
    })
  }
}
