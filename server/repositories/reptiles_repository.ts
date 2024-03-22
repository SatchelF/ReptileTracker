import { PrismaClient } from "@prisma/client";

enum ReptileSpecies {
  ball_python = "ball_python",
  king_snake = "king_snake",
  corn_snake = "corn_snake",
  redtail_boa = "redtail_boa",
}

enum ReptileSex {
  m = "m",
  f = "f",
}

export type CreateReptilePayload = {
  userId: number;
  species: ReptileSpecies;
  name: string;
  sex: ReptileSex;
};

export class ReptileRepository {
  private db: PrismaClient;
  private static instance: ReptileRepository;
  constructor(db: PrismaClient) {
    this.db = db;
  }

  static getInstance(db?: PrismaClient): ReptileRepository {
    if (!this.instance) {
      this.instance = new ReptileRepository(db!!);
    }
    return this.instance;
  }

  async createReptile({ userId, species, name, sex }: CreateReptilePayload) {
    return this.db.reptile.create({
      data: { userId, species, name, sex },
    });
  }

  async getReptileById(id: number) {
    return this.db.reptile.findUnique({
      where: {
        id,
      },
    });
  }

  // can add "include: { feedings: true }" etc to get those if needed
  // can add "orderBy: { createdAt: 'desc' }" etc to sort
  async getReptilesByUserId(userId: number) {
    return this.db.reptile.findMany({
      where: {
        userId,
      },
    });
  }

  async updateReptile(id: number, update: Partial<CreateReptilePayload>) {
    const { userId, ...updateData } = update;

    return this.db.reptile.update({
      where: {
        id,
      },
      data: updateData,
    });
  }

  async deleteReptile(id: number) {
    return this.db.reptile.delete({
      where: {
        id,
      },
    });
  }

  async checkReptileOwnership(
    userId: number,
    reptileId: number
  ): Promise<boolean> {
    const reptile = await this.db.reptile.findUnique({
      where: { id: reptileId },
    });

    return reptile !== null && reptile.userId === userId;
  }
}
