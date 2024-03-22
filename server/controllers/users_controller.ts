import { Router } from "express";
import jwt from "jsonwebtoken";
import { authMiddleware } from "../middleware/authentication";
import { UsersRepository } from "../repositories/users_respository";

// /users/...
export const buildUsersController = (usersRepository: UsersRepository) => {
  const router = Router();

  router.post("/", async (req, res) => {
    try {
      const user = await usersRepository.createUser(req.body);

      const token = jwt.sign(
        {
          userId: user.id,
        },
        process.env.ENCRYPTION_KEY as string
      );
      res.json({ user, token });
    } catch (error: any) {
      if (error.code === "P2002") {
        res.status(409).json("Email already in use.");
      } else {
        res.status(500).json({ error: "Failed to create user." });
      }
    }
  });

  router.get("/me", authMiddleware, (req, res) => {
    res.json({ user: req.user });
  });

  return router;
};
