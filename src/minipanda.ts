import { Kadai } from "./kadai";
import { getDaysUntil, getTimeRemain, createElem, appendChildAll } from "./utils";

const nowTime = new Date().getTime();

function createButton(): HTMLDivElement {
  const hamburger = document.createElement("div");
  hamburger.className = "loader";
  return hamburger;
}

let toggle = false;
const miniPandA = createElem("div", { id: "miniPandA" });
miniPandA.classList.add("sidenav");
miniPandA.classList.add("cp_tab");

function toggleSideNav() {
  if (toggle) {
    miniPandA.style.width = "0px";
    // @ts-ignore
    document.getElementById("cover").remove();
  } else {
    miniPandA.style.width = "300px";
    const cover = document.createElement("div");
    cover.id = "cover";
    document.getElementsByTagName("body")[0].appendChild(cover);
    cover.onclick = toggleSideNav;
  }
  toggle = !toggle;
}

function createMiniPandA(fetchedTime: number) {
  const hamburger = createButton();
  const topbar = document.getElementById("mastLogin");
  hamburger.addEventListener("click", toggleSideNav);
  try {
    topbar?.appendChild(hamburger);
  } catch (e) {
    console.log("could not launch miniPandA.");
  }

  const miniPandALogo = createElem("img", {
    className: "logo",
    alt: "logo",
    src: chrome.extension.getURL("img/logo.png")
  });

  const miniPandACloseBtn = createElem("a", { href: "#", id: "close_btn", textContent: "×" });
  miniPandACloseBtn.classList.add("closebtn");
  miniPandACloseBtn.classList.add("q");
  miniPandACloseBtn.addEventListener("click", toggleSideNav);

  const kadaiTab = createElem("input", { type: "radio", id: "kadaiTab", name: "cp_tab", checked: true });
  // kadaiTab.addEventListener('click', toggleKadaiTab);
  const kadaiTabLabel = createElem("label", { htmlFor: "kadaiTab", innerText: "課題一覧" });
  const examTab = createElem("input", { type: "radio", id: "examTab", name: "cp_tab", checked: false });
  // examTab.addEventListener('click', toggleExamTab);
  const examTabLabel = createElem("label", { htmlFor: "examTab", innerText: "テスト・クイズ一覧" });
  const addMemoButton = createElem("button", { className: "plus-button", innerText: "+" });
  // addMemoButton.addEventListener('click', toggleMemoBox, true);

  const fetchedTimestamp = new Date(fetchedTime);
  const fetchedTimeString = createElem("p", { className: "kadai-time" });
  fetchedTimeString.innerText = "取得日時： " + fetchedTimestamp.toLocaleDateString() + " " + fetchedTimestamp.getHours() + ":" + ("00" + fetchedTimestamp.getMinutes()).slice(-2) + ":" + ("00" + fetchedTimestamp.getSeconds()).slice(-2);

  appendChildAll(miniPandA, [
    miniPandALogo,
    miniPandACloseBtn,
    kadaiTab,
    kadaiTabLabel,
    examTab,
    examTabLabel,
    addMemoButton,
    fetchedTimeString
  ]);

  const parent = document.getElementById("pageBody");
  const ref = document.getElementById("toolMenuWrap");

  parent?.insertBefore(miniPandA, ref);
}

function updateMiniPandA(kadaiList: Array<Kadai>, lectureIDList: Array<{ tabType: string; lectureID: string; lectureName: string; }>) {
  const dueGroupHeaderName = ["締め切り２４時間以内", "締め切り５日以内", "締め切り１４日以内", "その他"];
  const dueGroupColor = ["danger", "warning", "success", "other"];
  const initLetter = ["a", "b", "c", "d"];
  const _dueGroupHeader = createElem("div");
  const _dueGroupHeaderTitle = createElem("span", { className: "q" });
  const _dueGroupContainer = createElem("div", { className: "sidenav-list" });
  const _dueGroupBody = createElem("div");
  const _lectureNameHeader = createElem("h2");
  const _kadaiCheckbox = createElem("input", { type: "checkbox", className: "todo-check" });
  const _kadaiLabel = createElem("label");
  const _kadaiDueDate = createElem("p", { className: "kadai-date" });
  const _kadaiRemainTime = createElem("span", { className: "time-remain" });
  const _kadaiTitle = createElem("p", { className: "kadai-title" });
  const kadaiDiv = createElem("div", { className: "kadai-tab" });
  const examDiv = createElem("div", { className: "exam-tab" });

  // 0: <24h, 1: <5d, 2: <14d, 3: >14d
  for (let i = 0; i < 4; i++) {
    let entryCount = 0;
    // 色別のグループを作成する
    const dueGroupHeader = _dueGroupHeader.cloneNode(true);
    const dueGroupHeaderTitle = _dueGroupHeaderTitle.cloneNode(true);
    dueGroupHeader.className = `sidenav-${dueGroupColor[i]}`;
    dueGroupHeader.style.display = "none";
    dueGroupHeaderTitle.textContent = `${dueGroupHeaderName[i]}`;
    dueGroupHeader.appendChild(dueGroupHeaderTitle);
    const dueGroupContainer = _dueGroupContainer.cloneNode(true);
    dueGroupContainer.classList.add(`sidenav-list-${dueGroupColor[i]}`);
    dueGroupContainer.style.display = "none";

    // 各講義についてループ
    for (const item of kadaiList) {
      const kadaiEntries = item.kadaiEntries;
      const lectureID = item.lectureID;
      const lectureName = item.lectureName;

      // 課題アイテムを入れるやつを作成
      const dueGroupBody = _dueGroupBody.cloneNode(true);
      dueGroupBody.className = `kadai-${dueGroupColor[i]}`;
      dueGroupBody.id = initLetter[i] + lectureID;
      const lectureNameHeader = _lectureNameHeader.cloneNode(true);
      lectureNameHeader.className = `lecture-${dueGroupColor[i]}`;
      lectureNameHeader.textContent = "" + lectureName;
      dueGroupBody.appendChild(lectureNameHeader);

      // 各講義の課題一覧についてループ
      let cnt = 0;
      for (const kadai of kadaiEntries) {
        let kadaiCheckbox = _kadaiCheckbox.cloneNode(true);
        const kadaiLabel = _kadaiLabel.cloneNode(true);
        const kadaiDueDate = _kadaiDueDate.cloneNode(true);
        const kadaiRemainTime = _kadaiRemainTime.cloneNode(true);
        const kadaiTitle = _kadaiTitle.cloneNode(true);

        const _date = new Date(kadai.dueDateTimestamp * 1000);
        const dispDue = _date.toLocaleDateString() + " " + _date.getHours() + ":" + ("00" + _date.getMinutes()).slice(-2);
        const timeRemain = getTimeRemain((kadai.dueDateTimestamp * 1000 - nowTime) / 1000);

        const daysUntilDue = getDaysUntil(nowTime, kadai.dueDateTimestamp * 1000);
        if ((daysUntilDue <= 1 && i === 0) || (daysUntilDue > 1 && daysUntilDue <= 5 && i === 1) || (daysUntilDue > 5 && daysUntilDue <= 14 && i === 2) || (daysUntilDue > 14 && i === 3)) {
          kadaiDueDate.textContent = "" + dispDue;
          kadaiRemainTime.textContent = `あと${timeRemain[0]}日${timeRemain[1]}時間${timeRemain[2]}分`;
          kadaiTitle.textContent = "" + kadai.assignmentTitle;
          if (kadai.isFinished) kadaiCheckbox = true;
          kadaiCheckbox.id = kadai.kadaiID;
          kadaiCheckbox.lectureID = lectureID;
          // kadaiCheckbox.addEventListener('change', updateKadaiTodo, false);
          kadaiLabel.htmlFor = kadai.kadaiID;
          appendChildAll(dueGroupBody, [kadaiCheckbox, kadaiLabel, kadaiDueDate, kadaiRemainTime, kadaiTitle]);
          cnt++;
        }
      }
      // 各講義の課題で該当するものがある場合はグループに追加
      if (cnt > 0) {
        dueGroupContainer.appendChild(dueGroupBody);
        entryCount++;
      }
    }
    if (entryCount > 0) {
      dueGroupHeader.style.display = "";
      dueGroupContainer.style.display = "";
    }
    appendChildAll(miniPandA, [kadaiDiv, examDiv]);
    appendChildAll(kadaiDiv, [dueGroupHeader, dueGroupContainer]);
  }

  // 何もない時はRelaxPandAを表示する
  if (kadaiList.length === 0) {
    const kadaiTab = kadaiDiv;
    const img_relaxPanda = chrome.extension.getURL("img/relaxPanda.png");
    const relaxDiv = createElem("div", {className: "relaxpanda"});
    const relaxPandaP = createElem("p", {className: "relaxpanda-p", innerText: "現在表示できる課題はありません"});
    const relaxPandaImg = createElem("img", {className: "relaxpanda-img", alt: "logo", src: img_relaxPanda});
    appendChildAll(relaxDiv, [relaxPandaP, relaxPandaImg]);
    kadaiTab.appendChild(relaxDiv);
  }

}


export { createMiniPandA, updateMiniPandA };
