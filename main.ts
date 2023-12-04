import HellCore from "/core/HellCore.ts";
import { botlog, discord } from "/config.ts";

new HellCore({ botlog, discord }).init();
