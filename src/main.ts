import env from "dotenv";
import { logger } from "./app/logging";
import { web } from "./app/web";

env.config();

const PORT = process.env.PORT;

// console.log(new Date().toString());

web.listen(PORT, () => {
  logger.info("Listening on port " + PORT);
});
