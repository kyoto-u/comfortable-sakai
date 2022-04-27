import { loadFromLocalStorage, saveHostName, saveToLocalStorage } from "./storage";
import { Assignment, CourseSiteInfo } from "./model";
import { getCourseIDList, getAssignmentByCourseID, getQuizFromCourseID } from "./network";
import { createMiniSakaiBtn, createMiniSakai } from "./minisakai";
import { addFavoritedCourseSites } from "./favorites";
import {
  compareAndMergeAssignmentList,
  convertArrayToAssignment,
  isLoggedIn,
  mergeIntoAssignmentList,
  nowTime,
  sortAssignmentList,
  updateIsReadFlag,
  isUsingCache, miniSakaiReady
} from "./utils";
import { Config, loadConfigs } from "./settings";
import { Course } from "./features/course/types";
import { Assignment as NewAssignment, AssignmentEntry } from './features/assignment/types';
import { getAssignments } from "./features/assignment/getAssignment";
import { getQuizzes } from "./features/quiz/getQuiz";
import { getMemos } from "./features/memo/getMemo";
import { getSakaiCourses } from "./features/course/getCourse";
import { fromStorage } from "./features/storage/load";

export let courseIDList: Array<CourseSiteInfo>;
export let mergedAssignmentList: Array<Assignment>;
export let mergedAssignmentListNoMemo: Array<Assignment>;

/**
 * Load old assignments/quizzes from storage and fetch new assignments/quizzes from Sakai.
 * @param {Config} config
 * @param {CourseSiteInfo[]} courseSiteInfos
 * @param {boolean} useAssignmentCache
 * @param {boolean} useQuizCache
 */
export async function loadAndMergeAssignmentList(config: Config, courseSiteInfos: Array<CourseSiteInfo>, useAssignmentCache: boolean, useQuizCache: boolean): Promise<Array<Assignment>> {
  // Load old assignments and quizzes from local storage
  const oldAssignmentList = convertArrayToAssignment(await loadFromLocalStorage("CS_AssignmentList"));
  const oldQuizList = convertArrayToAssignment(await loadFromLocalStorage("CS_QuizList"));
  let newAssignmentList = [];
  let newQuizList = [];

  // Use cache
  if (useAssignmentCache) {
    newAssignmentList = oldAssignmentList;
  } else {
    console.log("Fetching assignments...");
    const pendingList = [];
    const courses: Array<Course> = [];
    // Add course sites to fetch-pending list
    for (const i of courseSiteInfos) {
      pendingList.push(getAssignmentByCourseID(config.baseURL, i.courseID));
      //DEBUG:
      courses.push(new Course(i.courseID, i.courseName, ''));
    }
    // Wait until all assignments are fetched
    const result = await (Promise as any).allSettled(pendingList);
    for (const k of result) {
      if (k.status === "fulfilled") newAssignmentList.push(k.value);
    }

    //DEBUG:
    // const assignments = await getSakaiAssignments(courses);
    // console.log(assignments);

    // Update assignment fetch timestamp
    await saveToLocalStorage("CS_AssignmentFetchTime", nowTime);
    config.fetchedTime.assignment = nowTime;
  }
  // Compare assignments with old ones
  mergedAssignmentListNoMemo = compareAndMergeAssignmentList(oldAssignmentList, newAssignmentList);
  mergedAssignmentList = compareAndMergeAssignmentList(oldAssignmentList, newAssignmentList);

  // Use cache
  if (useQuizCache) {
    if (typeof oldQuizList !== "undefined") {
      newQuizList = oldQuizList;
    }
  } else {
    console.log("Fetching quizzes...");
    const pendingList = [];
    // Add course sites to fetch-pending list
    for (const i of courseSiteInfos) {
      pendingList.push(getQuizFromCourseID(config.baseURL, i.courseID));
    }
    // Wait until all quizzes are fetched
    const result = await (Promise as any).allSettled(pendingList);
    for (const k of result) {
      if (k.status === "fulfilled") newQuizList.push(k.value);
    }
    // Update assignment fetch timestamp
    await saveToLocalStorage("CS_QuizFetchTime", nowTime);
    config.fetchedTime.quiz = nowTime;
  }
  // Compare quizzes with old ones
  const mergedQuizList = compareAndMergeAssignmentList(oldQuizList, newQuizList);

  // Merge assignments and quizzes
  mergedAssignmentList = mergeIntoAssignmentList(mergedAssignmentList, mergedQuizList);

  // Load memos
  const memoList = convertArrayToAssignment(await loadFromLocalStorage("CS_MemoList"));
  // Merge memos
  mergedAssignmentList = sortAssignmentList(mergeIntoAssignmentList(mergedAssignmentList, memoList));

  // Save assignments and quizzes to local storage
  await saveToLocalStorage("CS_AssignmentList", mergedAssignmentListNoMemo);
  await saveToLocalStorage("CS_QuizList", mergedQuizList);

  return mergedAssignmentList;
}

/**
 * Load course site IDs
 */
async function loadCourseIDList() {
  courseIDList = getCourseIDList();
  await saveToLocalStorage("CS_CourseInfo", courseIDList);
}

async function updateReadFlag() {
  const updatedAssignmentList = updateIsReadFlag(mergedAssignmentListNoMemo);
  await saveToLocalStorage("CS_AssignmentList", updatedAssignmentList);
}

async function main() {
  if (isLoggedIn()) {
    createMiniSakaiBtn();
    const config = await loadConfigs();
    await loadCourseIDList();
    // mergedAssignmentList = await loadAndMergeAssignmentList(
    //   config,
    //   courseIDList,
    //   isUsingCache(config.fetchedTime.assignment, config.cacheInterval.assignment),
    //   isUsingCache(config.fetchedTime.quiz, config.cacheInterval.quiz)
    // );
    await addFavoritedCourseSites(config.baseURL);
    // displayMiniSakai(mergedAssignmentList, courseIDList);
    createMiniSakai([
      new NewAssignment(
        new Course('test-course-id', 'test-course-name', ''),
        [
          new AssignmentEntry('test-assign-id', 'test-title', 10000000000000, 10000000000001, false)
        ],
        false
      ),
      new NewAssignment(
        new Course('test-course-id', 'test-course-name', ''),
        [
          new AssignmentEntry('test-assign-id3', 'test-titlefoobar', 10000000000003, 10000000000004, false)
        ],
        false
      ),
      new NewAssignment(
        new Course('test-course-id2', 'test-course-name2', ''),
        [
          new AssignmentEntry('test-assign-ida46bhs346h', 'test-titasfvsflefoobar', 10000000000005, 10000000000006, false)
        ],
        false
      )
    ]);
    // await createFavoritesBarNotification(courseIDList, mergedAssignmentList); // TODO: fix this

    miniSakaiReady();
    await updateReadFlag();
    await saveHostName();

    await getEntities(getCourses());
    await getLastCache();
  }
}

main();

async function getLastCache() {
  const hostname = window.location.hostname;
  const assignmentTime = await fromStorage<string>(hostname, "CS_AssignmentFetchTime", (time) => { return time as string });
  const quizTime = await fromStorage<string>(hostname, "CS_QuizFetchTime", (time) => { return time as string });
  return {
    assignment: assignmentTime,
    quiz: quizTime,
  };
}

function getCourses(): Array<Course> {
  return getSakaiCourses();
}

async function getEntities(courses: Array<Course>) {
  const hostname = window.location.hostname;
  // TODO: 並列化する
  const assignment = await getAssignments(hostname, courses, false);
  const quiz = await getQuizzes(hostname, courses, false);
  const memo = await getMemos(hostname);
  return {
    assignment: assignment,
    quiz: quiz,
    memo: memo,
  };
}
