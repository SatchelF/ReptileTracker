import { Router } from "express";
import { authMiddleware } from "../middleware/authentication";
import { HusbandryRecordsRepository } from "../repositories/husbandryRecords_repository";
import { ReptileRepository } from "../repositories/reptiles_repository";

// /husbandry-records/...
export const buildHusbandryRecordsController = (
  husbandryRecordsRepository: HusbandryRecordsRepository,
  reptilesRepository: ReptileRepository
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
      const ownsReptile = await reptilesRepository.checkReptileOwnership(
        userId,
        reptileId
      );

      if (!ownsReptile) {
        return res.status(403).json({
          error: "You cannot make records for a reptile that is not yours.",
        });
      }

      const husbandryRecord =
        await husbandryRecordsRepository.createHusbandryRecord({
          ...req.body,
          reptileId,
        });
      res.json({ husbandryRecord });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to create Husbandry Record." });
    }
  });

  router.get("/:reptileId", authMiddleware, async (req, res) => {
    const userId = req.user!.id;
    const reptileId = parseInt(req.params.reptileId, 10);

    if (isNaN(reptileId)) {
      return res.status(400).json({ error: "Invalid reptile ID." });
    }

    try {
      const ownsReptile = await reptilesRepository.checkReptileOwnership(
        userId,
        reptileId
      );

      if (!ownsReptile) {
        return res.status(403).json({
          error: "You cannot access records for a reptile that is not yours.",
        });
      }

      const husbandryRecords =
        await husbandryRecordsRepository.getHusbandryRecordsByReptileId(
          reptileId
        );
      res.json({ husbandryRecords });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to retrieve Husbandry Records." });
    }
  });

  return router;
};
