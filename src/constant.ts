export const MODE = process.env.NODE_ENV;
let _version = "---";
if (MODE === "production") {
    _version = chrome.runtime.getManifest().version;
}
export const VERSION = _version;
export const CurrentTime = new Date().getTime() / 1000;
export const AssignmentsStorage = "Assignments";
export const QuizzesStorage = "Quizzes";
export const MemosStorage = "Memos";
export const CoursesStorage = "Courses";
export const SettingsStorage = "Settings";
export const AssignmentFetchTimeStorage = "AssignmentFetchTime";
export const QuizFetchTimeStorage = "QuizFetchTime";
export const HostnameStorage = "Hostname";
export const MaxTimestamp = 99999999999999;