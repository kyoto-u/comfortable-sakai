import { Settings } from "./types";

/**
 * Decode Settings data from Storage to Settings object.
 * @param data - Data from Storage.
 * @returns {Array<Memo>} - Decoded Memo array.
 */
export const decodeSettings = (data: any): Settings => {
    const settings = new Settings();
    if (typeof data === "undefined") return settings;
    settings.appInfo = data.appInfo;
    settings.fetchTime = data.fetchTime;
    settings.cacheInterval = data.cacheInterval;
    settings.miniSakaiOption = data.miniSakaiOption;
    settings.color = data.color;
    return settings;
};
