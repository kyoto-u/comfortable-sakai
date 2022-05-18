import { Assignment, AssignmentEntry } from "./types";
import { Course } from "../../course/types";
import { CurrentTime } from "../../../constant";

/**
 * Decode Assignment data from Sakai REST API to AssignmentEntry array.
 * @param data - Data from Sakai REST API.
 * @returns {Array<AssignmentEntry>} - Decoded AssignmentEntry array.
 */
export const decodeAssignmentFromAPI = (data: Record<string, any>): Array<AssignmentEntry> => {
    return data.assignment_collection
        .filter((json: any) => json.closeTime.epochSecond >= CurrentTime)
        .map((json: any) => {
            return new AssignmentEntry(
                json.id,
                json.title,
                json.dueTime.epochSecond ? json.dueTime.epochSecond : null,
                json.closeTime.epochSecond ? json.closeTime.epochSecond : null,
                false
            );
        });
};

/**
 * Decode Assignment data from Storage to Assignment array.
 * @param data - Data from Storage.
 * @returns {Array<Assignment>} - Decoded Assignment array.
 */
export const decodeAssignmentFromArray = (data: Array<any>): Array<Assignment> => {
    const assignments: Array<Assignment> = [];
    if (typeof data === "undefined") return assignments;
    for (const assignment of data) {
        const course: Course = new Course(assignment.course.id, assignment.course.name, assignment.course.link);
        const isRead: boolean = assignment.isRead;
        const entries: Array<AssignmentEntry> = [];
        for (const e of assignment.entries) {
            const entry = new AssignmentEntry(e.id, e.title, e.dueTime, e.closeTime, e.hasFinished);
            if (entry.getCloseDateTimestamp > CurrentTime) entries.push(entry);
        }
        assignments.push(new Assignment(course, entries, isRead));
    }
    return assignments;
};
