import React from "react";
import { createRoot } from 'react-dom/client';

import { EntryUnion, MiniSakaiEntryList } from "@das08/comfortable-sakai-component/src/components/entryTab";
import { Settings } from "@das08/comfortable-sakai-component/src/features/setting/types";
import { Course } from "@das08/comfortable-sakai-component/src/features/course/types";
import { AssignmentEntry } from "@das08/comfortable-sakai-component/src/features/entity/assignment/types";
import { QuizEntry } from "@das08/comfortable-sakai-component/src/features/entity/quiz/types";

import "./comfortable-sakai.css";

type EntryWithCourse = {
    entry: EntryUnion;
    course: Course;
};

export default function App() {
    const time = new Date();
    time.setDate(time.getDate() + 4);
    const timestamp = time.getTime() / 1000;
    const settings = new Settings();
    const elements: Array<EntryWithCourse> = [
        {
            course: new Course("1", "Assignment Entity", ""),
            entry: new AssignmentEntry("1", "1st Assignment Entry", timestamp, timestamp, false)
        },
        {
            course: new Course("1", "Assignment Entity", ""),
            entry: new AssignmentEntry("2", "2nd Assignment Entry", timestamp + 10000, timestamp + 10000, false)
        }
    ];
    return (
        <MiniSakaiEntryList
            dueType="warning"
            isSubset={false}
            settings={settings}
            entriesWithCourse={elements}
            onCheck={() => {
                return null;
            }}
            onDelete={() => {
                return null;
            }}
        />
    );
};

const rootElement = document.getElementById("root");
const root = createRoot(rootElement!);
root.render(<App />);
