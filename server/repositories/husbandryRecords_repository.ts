import { PrismaClient } from "@prisma/client";

export type CreateHusbandryRecordsPayload = {
  reptileId: number;
  length: number;
  weight: number;
  temperature: number;
  humidity: number;
};

export class HusbandryRecordsRepository {
  private db: PrismaClient;
  private static instance: HusbandryRecordsRepository;
  constructor(db: PrismaClient) {
    this.db = db;
  }

  static getInstance(db?: PrismaClient): HusbandryRecordsRepository {
    if (!this.instance) {
      this.instance = new HusbandryRecordsRepository(db!!);
    }
    return this.instance;
  }

  async createHusbandryRecord({
    reptileId,
    length,
    weight,
    temperature,
    humidity,
  }: CreateHusbandryRecordsPayload) {
    return this.db.husbandryRecord.create({
      data: { reptileId, length, weight, temperature, humidity },
    });
  }

  async getHusbandryRecordsByReptileId(reptileId: number) {
    return this.db.husbandryRecord.findMany({
      where: {
        reptileId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }
}
