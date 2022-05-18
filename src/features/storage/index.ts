import { HostnameStorage } from "../../constant";

/**
 * Load data from Storage.
 * Type T is generics for return type.
 * @param hostname - A PRIMARY key for storage. Usually a hostname of Sakai LMS.
 * @param key - - A SECONDARY key for storage. Defined in `constant.ts`.
 * @param decoder - Decoder for generics type T.
 */
export const fromStorage = <T>(hostname: string, key: string, decoder: (data: any) => T): Promise<T> => {
    return new Promise(function (resolve) {
        chrome.storage.local.get(hostname, function (items: any) {
            if (hostname in items && key in items[hostname]) {
                resolve(decoder(items[hostname][key]));
            } else {
                resolve(decoder(undefined));
            }
        });
    });
};

/**
 * Get hostname from Storage.
 * Hostname is a primary key for storage. Usually a hostname of Sakai LMS.
 * @returns {Promise<string | undefined>}
 */
export const loadHostName = (): Promise<string | undefined> => {
    return new Promise(function (resolve) {
        chrome.storage.local.get(HostnameStorage, function (items: any) {
            if (typeof items[HostnameStorage] === "undefined") {
                resolve(undefined);
            } else resolve(items[HostnameStorage]);
        });
    });
};

/**
 * Save data to Storage.
 * @param hostname - A PRIMARY key for storage. Usually a hostname of Sakai LMS.
 * @param key - A SECONDARY key for storage. Defined in `constant.ts`.
 * @param value - A data to be stored.
 */
export const toStorage = (hostname: string, key: string, value: any): Promise<string> => {
    const entity: { [key: string]: [value: any] } = {};
    entity[key] = value;
    return new Promise(function (resolve) {
        chrome.storage.local.get(hostname, function (items: any) {
            if (typeof items[hostname] === "undefined") {
                items[hostname] = {};
            }
            items[hostname][key] = value;
            chrome.storage.local.set({ [hostname]: items[hostname] }, () => {
                resolve("saved");
            });
        });
    });
};

/**
 * Saves hostname to Storage.
 * @param hostname - A PRIMARY key for storage. Usually a hostname of Sakai LMS.
 */
export const saveHostName = (hostname: string): Promise<string> => {
    return new Promise(function (resolve) {
        chrome.storage.local.set({ [HostnameStorage]: hostname }, () => {
            resolve("saved");
        });
    });
};
