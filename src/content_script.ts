import { loadFromStorage, saveToStorage } from "./storage";
import { Kadai, LectureInfo } from "./kadai";
import { fetchLectureIDs, getKadaiOfLectureID } from "./network";
import {
  createHanburgerButton,
  createMiniPandA,
  createNavBarNotification,
  updateMiniPandA
} from "./minipanda";
import { addMissingBookmarkedLectures } from "./bookmark";
import {
  compareAndMergeKadaiList,
  convertArrayToKadai,
  isLoggedIn,
  miniPandAReady,
  nowTime,
  updateIsReadFlag
} from "./utils";

const baseURL = "http://35.227.163.2/";
const cacheInterval = 120;

async function loadAndMergeKadaiList(lectureIDList: Array<LectureInfo>, fetchedTime: number): Promise<Array<Kadai>> {
  const oldKadaiList = await loadFromStorage("kadaiList");
  console.log("kadaiListOLD", convertArrayToKadai(oldKadaiList));
  const newKadaiList = [];
  let mergedKadaiList = [];

  if ((nowTime - fetchedTime) / 1000 > cacheInterval) {
    console.log("キャッシュなし");
    const pendingList = [];
    for (const i of lectureIDList) {
      pendingList.push(getKadaiOfLectureID(baseURL, i.lectureID));
    }

    const result = await (Promise as any).allSettled(pendingList);
    for (const k of result) {
      if (k.status === "fulfilled") newKadaiList.push(k.value);
    }
    await saveToStorage("fetchedTime", nowTime);
    console.log("kadaiListNEW", newKadaiList);
    mergedKadaiList = compareAndMergeKadaiList(oldKadaiList, newKadaiList);
  } else {
    console.log("キャッシュあり");
    mergedKadaiList = compareAndMergeKadaiList(oldKadaiList, oldKadaiList);
  }
  console.log("kadaiListMERGED", mergedKadaiList);

  return mergedKadaiList;
}

async function main() {
  if (isLoggedIn()) {
    const fetchedTime = await loadFromStorage("fetchedTime");
    console.log("fetchedTime", fetchedTime);
    createHanburgerButton();
    createMiniPandA(fetchedTime);
    const lectureIDList = fetchLectureIDs()[1];
    const mergedKadaiList = await loadAndMergeKadaiList(lectureIDList, fetchedTime);
    saveToStorage("kadaiList", mergedKadaiList);
    updateIsReadFlag(mergedKadaiList);
    updateMiniPandA(mergedKadaiList, lectureIDList);
    miniPandAReady();
    createNavBarNotification(lectureIDList, mergedKadaiList);
  }
}

main();
addMissingBookmarkedLectures();
