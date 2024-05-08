import { PrismaClient } from "@prisma/client";
import { logger } from "./logging";

export const prismaClient = new PrismaClient({
  log: [
    {
      emit: "event",
      level: "query",
    },
    {
      emit: "event",
      level: "error",
    },
    {
      emit: "event",
      level: "info",
    },
    {
      emit: "event",
      level: "warn",
    },
  ],
});

prismaClient.$on("error", (e) => {
  logger.info(
    "=========================== PRISMA ERROR ==========================="
  );
  logger.error(e);
});
prismaClient.$on("warn", (e) => {
  logger.info(
    "=========================== PRISMA WARN ==========================="
  );
  logger.warn(e);
});
prismaClient.$on("info", (e) => {
  logger.info(
    "=========================== PRISMA INFO ==========================="
  );
  logger.info(e);
});
prismaClient.$on("query", (e) => {
  logger.info(
    "=========================== PRISMA QUERY ==========================="
  );
  logger.info(e);
});
