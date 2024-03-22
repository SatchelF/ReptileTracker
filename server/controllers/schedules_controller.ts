import { Router } from "express";
import { authMiddleware } from "../middleware/authentication";
import { SchedulesRepository as SchedulesRepository } from "../repositories/schedules_repository";
import { ReptileRepository } from "../repositories/reptiles_repository";

// /schedules/...
export const buildSchedulesController = (
  schedulesRepository: SchedulesRepository,
  reptileRepository: ReptileRepository
) => {
  const router = Router();

  router.post("/", authMiddleware, async (req, res) => {
    const userId = req.user!.id;
    const reptileId = parseInt(req.body.reptileId, 10);

    // Check if the conversion resulted in a valid number
    if (isNaN(reptileId)) {
      return res.status(400).json({
        error: "Invalid reptile ID.",
      });
    }

    try {
      const ownsReptile = await reptileRepository.checkReptileOwnership(
        userId,
        reptileId
      );

      if (!ownsReptile) {
        return res.status(403).json({
          error: "You cannot make records for a reptile that is not yours.",
        });
      }

      const schedule = await schedulesRepository.createSchedule({
        ...req.body,
        userId,
        reptileId,
      });
      res.json({ schedule });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to create Husbandry Record." });
    }
  });

  router.get("/user/", authMiddleware, async (req, res) => {
    const userId = req.user!.id;

    try {
      const schedules = await schedulesRepository.getSchedulesByUserId(userId);
      res.json({ schedules });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to retrieve Schedules." });
    }
  });

  router.get("/:day", authMiddleware, async (req, res) => {
    const userId = req.user!.id;
    const day = req.params.day;
    try {
      const schedulesForToday =
        await schedulesRepository.getSchedulesByUserIdForToday(userId, day);
      res.json({ schedules: schedulesForToday });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to fetch schedules for today." });
    }
  });

  router.get("/reptile/:reptileId", authMiddleware, async (req, res) => {
    const userId = req.user!.id;
    const reptileId = parseInt(req.params.reptileId, 10);

    if (isNaN(reptileId)) {
      return res.status(400).json({ error: "Invalid reptile ID." });
    }

    try {
      const ownsReptile = await reptileRepository.checkReptileOwnership(
        userId,
        reptileId
      );

      if (!ownsReptile) {
        return res.status(403).json({
          error: "You cannot access schedules for a reptile that is not yours.",
        });
      }

      const schedules = await schedulesRepository.getSchedulesByReptileId(
        reptileId
      );
      res.json({ schedules });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to retrieve Schedules." });
    }
  });

  return router;
};
