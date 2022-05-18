import { Memo } from "./types";
import { decodeMemoFromArray } from "./decode";
import { fromStorage } from "../../storage";
import { MemosStorage } from "../../../constant";

/**
 * Get Memos from Storage.
 * @param hostname - A PRIMARY key for storage. Usually a hostname of Sakai LMS.
 * @returns {Promise<Array<Memo>>}
 */
const getStoredMemos = (hostname: string): Promise<Array<Memo>> => {
    return fromStorage<Array<Memo>>(hostname, MemosStorage, decodeMemoFromArray);
};

/**
 * Get Memos.
 * Since Memos are only stored in Storage, this returns Memos from Storage.
 * @param hostname - A PRIMARY key for storage. Usually a hostname of Sakai LMS.
 * @returns {Promise<Array<Assignment>>}
 */
export const getMemos = async (hostname: string): Promise<Array<Memo>> => {
    return await getStoredMemos(hostname);
};
