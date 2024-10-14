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

type PrismaLogEvent = {
  timestamp: Date;
  target: string;
  message: string;
};

type PrismaQueryEvent = {
  timestamp: Date;
  query: string;
  params: string;
  duration: number;
  target: string;
};

prismaClient.$on("error", (e: PrismaLogEvent) => {
  logger.info(
    "LOGGER PRISMA ERROR => "
  );
  logger.error(e);
});

prismaClient.$on("warn", (e: PrismaLogEvent) => {
  logger.info(
    "LOGGER PRISMA WARN => "
  );
  logger.warn(e);
});

prismaClient.$on("info", (e: PrismaLogEvent) => {
  logger.info(
    "LOGGER PRISMA INFO => "
  );
  logger.info(e);
});

prismaClient.$on("query", (e: PrismaQueryEvent) => {
  logger.info(
    "LOGGER PRISMA QUERY => "
  );
  logger.info({
    query: e.query,
    params: e.params,
    duration: e.duration,
  });
});
