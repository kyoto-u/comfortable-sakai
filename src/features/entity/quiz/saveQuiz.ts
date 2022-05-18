import { Quiz, QuizEntry } from "./types";
import { toStorage, fromStorage } from "../../storage";
import { decodeQuizFromArray } from "./decode";
import { QuizzesStorage } from "../../../constant";

/**
 * Save Quizzes to Storage.
 * @param hostname - A PRIMARY key for storage. Usually a hostname of Sakai LMS.
 * @param quizzes - An array of Quiz to be saved.
 */
export const saveQuizzes = (hostname: string, quizzes: Array<Quiz>): Promise<string> => {
    return toStorage(hostname, QuizzesStorage, quizzes);
};

/**
 * Save single QuizEntry to Storage.
 * @param hostname - A PRIMARY key for storage. Usually a hostname of Sakai LMS.
 * @param changedEntry - A QuizEntry to be saved.
 */
export const saveQuizEntry = async (hostname: string, changedEntry: QuizEntry) => {
    const quizzes = await fromStorage(hostname, QuizzesStorage, decodeQuizFromArray);
    LOOP:
        for (const quiz of quizzes) {
            const entries = quiz.getEntries();
            for (let i = 0; i < entries.length; i++) {
                if (entries[i].id === changedEntry.id) {
                    entries[i] = changedEntry;
                    break LOOP;
                }
            }
        }
    await saveQuizzes(hostname, quizzes);
};
