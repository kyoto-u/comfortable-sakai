import { Assignment, AssignmentEntry } from "./types";
import { toStorage, fromStorage } from "../../storage";
import { decodeAssignmentFromArray } from "./decode";
import { AssignmentsStorage } from "../../../constant";

/**
 * Save Assignments to Storage.
 * @param hostname - A PRIMARY key for storage. Usually a hostname of Sakai LMS.
 * @param assignments - An array of Assignment to be saved.
 */
export const saveAssignments = (hostname: string, assignments: Array<Assignment>): Promise<string> => {
    return toStorage(hostname, AssignmentsStorage, assignments);
};

/**
 * Save single AssignmentEntry to Storage.
 * @param hostname - A PRIMARY key for storage. Usually a hostname of Sakai LMS.
 * @param changedEntry - An AssignmentEntry to be saved.
 */
export const saveAssignmentEntry = async (hostname: string, changedEntry: AssignmentEntry) => {
    const assignments = await fromStorage(hostname, AssignmentsStorage, decodeAssignmentFromArray);
    LOOP:
        for (const assignment of assignments) {
            const entries = assignment.getEntries();
            for (let i = 0; i < entries.length; i++) {
                if (entries[i].id === changedEntry.id) {
                    entries[i] = changedEntry;
                    break LOOP;
                }
            }
        }
    await saveAssignments(hostname, assignments);
};
