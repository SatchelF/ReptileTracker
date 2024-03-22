import { PrismaClient } from "@prisma/client";

enum ScheduleType {
  feed = "feed",
  record = "record",
  clean = "clean",
}

export type CreateSchedulesPayload = {
  reptileId: number;
  userId: number;
  type: ScheduleType;
  description: string;
  monday: boolean;
  tuesday: boolean;
  wednesday: boolean;
  thursday: boolean;
  friday: boolean;
  saturday: boolean;
  sunday: boolean;
};

export class SchedulesRepository {
  private db: PrismaClient;
  private static instance: SchedulesRepository;
  constructor(db: PrismaClient) {
    this.db = db;
  }

  static getInstance(db?: PrismaClient): SchedulesRepository {
    if (!this.instance) {
      this.instance = new SchedulesRepository(db!!);
    }
    return this.instance;
  }

  async createSchedule({
    reptileId,
    userId,
    type,
    description,
    monday,
    tuesday,
    wednesday,
    thursday,
    friday,
    saturday,
    sunday,
  }: CreateSchedulesPayload) {
    return this.db.schedule.create({
      data: {
        reptileId,
        userId,
        type,
        description,
        monday,
        tuesday,
        wednesday,
        thursday,
        friday,
        saturday,
        sunday,
      },
    });
  }

  async getSchedulesByReptileId(reptileId: number) {
    return this.db.schedule.findMany({
      where: {
        reptileId,
      },
    });
  }

  async getSchedulesByUserId(userId: number) {
    return this.db.schedule.findMany({
      where: {
        userId,
      },
    });
  }

  async getSchedulesByUserIdForToday(userId: number, day: string) {
    // const daysOfWeek = [
    //   "sunday",
    //   "monday",
    //   "tuesday",
    //   "wednesday",
    //   "thursday",
    //   "friday",
    //   "saturday",
    // ];
    // const today = new Date();
    // const dayOfWeek = daysOfWeek[today.getDay()]; // getDay() returns 0 for Sunday, 1 for Monday, etc.

    const whereClauseForToday = {
      userId,
      [day]: true,
    };

    return this.db.schedule.findMany({
      where: whereClauseForToday,
    });
  }
}
