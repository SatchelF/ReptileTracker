import { PrismaClient } from "@prisma/client";

export type CreateFeedingsPayload = {
  reptileId: number;
  foodItem: string;
};

export class FeedingsRepository {
  private db: PrismaClient;
  private static instance: FeedingsRepository;
  constructor(db: PrismaClient) {
    this.db = db;
  }

  static getInstance(db?: PrismaClient): FeedingsRepository {
    if (!this.instance) {
      this.instance = new FeedingsRepository(db!!);
    }
    return this.instance;
  }

  async createFeeding({ reptileId, foodItem }: CreateFeedingsPayload) {
    return this.db.feeding.create({
      data: { reptileId, foodItem },
    });
  }

  async getFeedingsByReptileId(reptileId: number) {
    return this.db.feeding.findMany({
      where: {
        reptileId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }
}
