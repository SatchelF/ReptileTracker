import { Router } from "express";
import { authMiddleware } from "../middleware/authentication";
import { ReptileRepository } from "../repositories/reptiles_repository";

// /reptiles/...
export const buildReptilesController = (
  reptilesRepository: ReptileRepository
) => {
  const router = Router();

  router.post("/", authMiddleware, async (req, res) => {
    const createReptilePayload = {
      userId: req.user!.id,
      ...req.body,
    };

    try {
      const reptile = await reptilesRepository.createReptile(
        createReptilePayload
      );
      res.json({ reptile });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to create reptile." });
    }
  });

  router.put("/:reptileId", authMiddleware, async (req, res) => {
    const userId = req.user!.id;
    const reptileId = parseInt(req.params.reptileId, 10);

    const createReptilePayload = {
      userId,
      ...req.body,
    };

    try {
      const ownsReptile = await reptilesRepository.checkReptileOwnership(
        userId,
        reptileId
      );

      if (!ownsReptile) {
        return res.status(403).json({
          error: "You cannot update records for a reptile that is not yours.",
        });
      }

      const reptile = await reptilesRepository.updateReptile(
        reptileId,
        createReptilePayload
      );
      res.json({ reptile });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to update reptile." });
    }
  });

  router.delete("/:reptileId", authMiddleware, async (req, res) => {
    const userId = req.user!.id;
    const reptileId = parseInt(req.params.reptileId, 10);

    try {
      const ownsReptile = await reptilesRepository.checkReptileOwnership(
        userId,
        reptileId
      );

      if (!ownsReptile) {
        return res.status(403).json({
          error: "You cannot update records for a reptile that is not yours.",
        });
      }

      const reptile = await reptilesRepository.deleteReptile(reptileId);
      res.json({ reptile });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to update reptile." });
    }
  });

  router.get("/", authMiddleware, async (req, res) => {
    const userId = req.user!.id;

    try {
      const reptiles = await reptilesRepository.getReptilesByUserId(userId);
      res.json({ reptiles });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to update reptile." });
    }
  });

  router.get("/:reptileId", authMiddleware, async (req, res) => {
    const userId = req.user!.id;
    const reptileId = parseInt(req.params.reptileId, 10);

    try {
      const ownsReptile = await reptilesRepository.checkReptileOwnership(
        userId,
        reptileId
      );

      if (!ownsReptile) {
        return res.status(403).json({
          error: "You cannot update records for a reptile that is not yours.",
        });
      }

      const reptile = await reptilesRepository.getReptileById(reptileId);
      res.json({ reptile });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to update reptile." });
    }
  });

  return router;
};
