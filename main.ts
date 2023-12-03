import HellCore from "/core/HellCore.ts";
import { botlog, discord, path } from "/config.ts";

new HellCore({ botlog, discord, path }).init();
