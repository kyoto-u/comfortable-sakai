import React from "react";
import { EntryUnion, MiniSakaiEntryList } from "../../../src/components/entryTab";
import { Settings } from "../../../src/features/setting/types";
import { Course } from "../../../src/features/course/types";
import { AssignmentEntry } from "../../../src/features/entity/assignment/types";

type EntryWithCourse = {
    entry: EntryUnion;
    course: Course;
};
import "./comfortable-sakai.css";

export const Example = () => {
    const settings = new Settings();
    const elements: Array<EntryWithCourse> = [
        {
            course: new Course("12345", "Sample", ""),
            entry: new AssignmentEntry("12", "test", 1654044495, 1654044495, false)
        }
    ];
    return (
        <MiniSakaiEntryList
            dueType="danger"
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
}