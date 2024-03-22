import { Router } from "express";
import { authMiddleware } from "../middleware/authentication";
import { FeedingsRepository } from "../repositories/feedings_repository";
import { ReptileRepository } from "../repositories/reptiles_repository";

// /feedings/...
export const buildFeedingsController = (
  feedingsRepository: FeedingsRepository,
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
          error: "You cannot make feedings for a reptile that is not yours.",
        });
      }

      const feeding = await feedingsRepository.createFeeding({
        ...req.body,
        reptileId,
      });
      res.json({ feeding });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to create Feeding." });
    }
  });

  router.get("/:reptileId", authMiddleware, async (req, res) => {
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
          error: "You cannot access feedings for a reptile that is not yours.",
        });
      }

      const feedings = await feedingsRepository.getFeedingsByReptileId(
        reptileId
      );
      res.json({ feedings });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to retrieve feedings." });
    }
  });

  return router;
};
