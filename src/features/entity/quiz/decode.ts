import { Quiz, QuizEntry } from "./types";
import { Course } from "../../course/types";
import { CurrentTime, MaxTimestamp } from "../../../constant";

/**
 * Decode Quiz data from Sakai REST API to QuizEntry array.
 * @param data - Data from Sakai REST API.
 * @returns {Array<QuizEntry>} - Decoded QuizEntry array.
 */
export const decodeQuizFromAPI = (data: Record<string, any>): Array<QuizEntry> => {
    return data.sam_pub_collection
        .filter((json: any) => json.startDate < CurrentTime * 1000 && (json.dueDate >= CurrentTime * 1000 || json.dueDate == null))
        .map((json: any) => {
            const entry = new QuizEntry(
                json.publishedAssessmentId,
                json.title,
                json.dueDate ? json.dueDate / 1000 : MaxTimestamp,
                false
            );
            return entry;
        });
};

/**
 * Decode Quiz data from Storage to Quiz array.
 * @param data - Data from Storage.
 * @returns {Array<Quiz>} - Decoded Quiz array.
 */
export const decodeQuizFromArray = (data: Array<any>): Array<Quiz> => {
    const quizzes: Array<Quiz> = [];
    if (typeof data === "undefined") return quizzes;
    for (const quiz of data) {
        const course: Course = new Course(quiz.course.id, quiz.course.name, quiz.course.link);
        const isRead: boolean = quiz.isRead;
        const entries: Array<QuizEntry> = [];
        for (const e of quiz.entries) {
            const entry = new QuizEntry(e.id, e.title, e.dueTime, e.hasFinished);
            if (entry.getDueDateTimestamp > CurrentTime) entries.push(entry);
        }
        quizzes.push(new Quiz(course, entries, isRead));
    }
    return quizzes;
};
