import { Memo, MemoEntry } from "./types";
import { toStorage, fromStorage } from "../../storage";
import { decodeMemoFromArray } from "./decode";
import { MemosStorage } from "../../../constant";
import { Course } from "../../course/types";

/**
 * Save Memos to Storage.
 * @param hostname - A PRIMARY key for storage. Usually a hostname of Sakai LMS.
 * @param memos - An array of Memo to be saved.
 */
export const saveMemos = (hostname: string, memos: Array<Memo>): Promise<string> => {
    return toStorage(hostname, MemosStorage, memos);
};

/**
 * Save single MemoEntry to Storage.
 * @param hostname - A PRIMARY key for storage. Usually a hostname of Sakai LMS.
 * @param changedEntry - A MemoEntry to be saved.
 */
export const saveMemoEntry = async (hostname: string, changedEntry: MemoEntry) => {
    const memos = await fromStorage(hostname, MemosStorage, decodeMemoFromArray);
    LOOP: for (const memo of memos) {
        const entries = memo.getEntries();
        for (let i = 0; i < entries.length; i++) {
            if (entries[i].id === changedEntry.id) {
                entries[i] = changedEntry;
                break LOOP;
            }
        }
    }
    await saveMemos(hostname, memos);
};

/**
 * Save new MemoEntry to Storage.
 * @param hostname - A PRIMARY key for storage. Usually a hostname of Sakai LMS.
 * @param memoEntry - A new MemoEntry to be saved.
 * @param course - List of Course sites.
 */
export const saveNewMemoEntry = async (hostname: string, memoEntry: MemoEntry, course: Course) => {
    const memos = await fromStorage(hostname, MemosStorage, decodeMemoFromArray);

    let foundMemo = false;
    for (const memo of memos) {
        if (memo.course.id === course.id) {
            memo.entries.push(memoEntry);
            foundMemo = true;
        }
    }
    if (!foundMemo) {
        const memo = new Memo(course, [memoEntry]);
        memos.push(memo);
    }
    await saveMemos(hostname, memos);
};

/**
 * Remove MemoEntry from Storage.
 * @param hostname - A PRIMARY key for storage. Usually a hostname of Sakai LMS.
 * @param memoEntry - A MemoEntry to be removed.
 */
export const removeMemoEntry = async (hostname: string, memoEntry: MemoEntry) => {
    const memos = await fromStorage(hostname, MemosStorage, decodeMemoFromArray);
    for (const memo of memos) {
        memo.entries = memo.entries.filter((m) => {
            return m.id != memoEntry.id;
        });
    }

    await saveMemos(hostname, memos);
};
