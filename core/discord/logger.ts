import { botlog } from "@/config.ts";
import HellLog from "@/core/HellLog.ts";

const logger = new HellLog(botlog);

export { logger };
