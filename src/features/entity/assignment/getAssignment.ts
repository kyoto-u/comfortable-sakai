import { Assignment } from "./types";
import { decodeAssignmentFromArray } from "./decode";
import { Course } from "../../course/types";
import { fetchAssignment } from "../../api/fetch";
import { toStorage, fromStorage } from "../../storage";
import { mergeEntities } from "../../merge";
import { AssignmentFetchTimeStorage, AssignmentsStorage } from "../../../constant";

/**
 * Get Assignments from Sakai REST API.
 * @param hostname - A PRIMARY key for storage. Usually a hostname of Sakai LMS.
 * @param courses - List of Course sites.
 * @returns {Promise<Array<Assignment>>}
 */
const getSakaiAssignments = async (hostname: string, courses: Array<Course>): Promise<Array<Assignment>> => {
    const assignments: Array<Assignment> = [];
    const pending: Array<Promise<Assignment>> = [];
    for (const course of courses) {
        pending.push(fetchAssignment(course));
    }
    const result = await (Promise as any).allSettled(pending);
    for (const assignment of result) {
        if (assignment.status === "fulfilled") assignments.push(assignment.value);
    }
    await toStorage(hostname, AssignmentFetchTimeStorage, new Date().getTime() / 1000);
    return assignments;
};

/**
 * Get Assignments from Storage.
 * @param hostname - A PRIMARY key for storage. Usually a hostname of Sakai LMS.
 * @returns {Promise<Array<Assignment>>}
 */
const getStoredAssignments = (hostname: string): Promise<Array<Assignment>> => {
    return fromStorage<Array<Assignment>>(hostname, AssignmentsStorage, decodeAssignmentFromArray);
};

/**
 * Get Assignments according to cache flag.
 * If cache flag is true, this returns Assignments from Storage.
 * Otherwise, returns Assignments from Sakai REST API.
 * @param hostname - A PRIMARY key for storage. Usually a hostname of Sakai LMS.
 * @param courses - List of Course sites.
 * @param useCache - A flag to use cache.
 * @returns {Promise<Array<Assignment>>}
 */
export const getAssignments = async (
    hostname: string,
    courses: Array<Course>,
    useCache: boolean
): Promise<Array<Assignment>> => {
    const storedAssignments = await getStoredAssignments(hostname);
    if (useCache) return storedAssignments;
    const sakaiAssignments = await getSakaiAssignments(hostname, courses);
    const merged = mergeEntities<Assignment>(storedAssignments, sakaiAssignments);
    await toStorage(hostname, AssignmentsStorage, merged);
    return merged;
};
