import { Quiz } from "./types";
import { decodeQuizFromArray } from "./decode";
import { Course } from "../../course/types";
import { fetchQuiz } from "../../api/fetch";
import { toStorage, fromStorage } from "../../storage";
import { mergeEntities } from "../../merge";
import { QuizFetchTimeStorage, QuizzesStorage } from "../../../constant";

/**
 * Get Quizzes from Sakai REST API.
 * @param hostname - A PRIMARY key for storage. Usually a hostname of Sakai LMS.
 * @param courses - List of Course sites.
 * @returns {Promise<Array<Quiz>>}
 */
const getSakaiQuizzes = async (hostname: string, courses: Array<Course>): Promise<Array<Quiz>> => {
    const quizzes: Array<Quiz> = [];
    const pending: Array<Promise<Quiz>> = [];
    for (const course of courses) {
        pending.push(fetchQuiz(course));
    }
    const result = await (Promise as any).allSettled(pending);
    for (const quiz of result) {
        if (quiz.status === "fulfilled") quizzes.push(quiz.value);
    }
    await toStorage(hostname, QuizFetchTimeStorage, new Date().getTime() / 1000);
    return quizzes;
};

/**
 * Get Quizzes from Storage.
 * @param hostname - A PRIMARY key for storage. Usually a hostname of Sakai LMS.
 * @returns {Promise<Array<Quiz>>}
 */
const getStoredQuizzes = (hostname: string): Promise<Array<Quiz>> => {
    return fromStorage<Array<Quiz>>(hostname, QuizzesStorage, decodeQuizFromArray);
};

/**
 * Get Quizzes according to cache flag.
 * If cache flag is true, this returns Quizzes from Storage.
 * Otherwise, returns Quizzes from Sakai REST API.
 * @param hostname - A PRIMARY key for storage. Usually a hostname of Sakai LMS.
 * @param courses - List of Course sites.
 * @param useCache - A flag to use cache.
 * @returns {Promise<Array<Quiz>>}
 */
export const getQuizzes = async (hostname: string, courses: Array<Course>, useCache: boolean): Promise<Array<Quiz>> => {
    const storedQuizzes = await getStoredQuizzes(hostname);
    if (useCache) return storedQuizzes;
    const sakaiQuizzes = await getSakaiQuizzes(hostname, courses);
    const merged = mergeEntities<Quiz>(storedQuizzes, sakaiQuizzes);
    await toStorage(hostname, QuizzesStorage, merged);
    return merged;
};
