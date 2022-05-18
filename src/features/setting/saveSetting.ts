import { Settings } from "./types";
import { toStorage } from "../storage";
import { SettingsStorage } from "../../constant";

/**
 * Save Settings to Storage.
 * @param hostname - A PRIMARY key for storage. Usually a hostname of Sakai LMS.
 * @param settings - Settings to be saved.
 */
export const saveSettings = (hostname: string, settings: Settings): Promise<string> => {
    return toStorage(hostname, SettingsStorage, settings);
};
