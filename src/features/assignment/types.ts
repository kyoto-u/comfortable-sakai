import { IEntity, IEntry } from "../../minisakai";
import { Course } from "../course/types";

const MAX_TIMESTAMP = 99999999999999;
export class AssignmentEntry implements IEntry {
  constructor(public id: string, public title: string, public dueTime: number, public closeTime: number, public hasFinished: boolean) {
  }

  getTimestamp(showLateAcceptedEntry: boolean): number {
    return showLateAcceptedEntry ? this.getCloseDateTimestamp : this.getDueDateTimestamp;
  }

  get getDueDateTimestamp(): number {
    return this.dueTime ? this.dueTime : MAX_TIMESTAMP;
  }

  get getCloseDateTimestamp(): number {
    return this.closeTime ? this.closeTime : MAX_TIMESTAMP;
  }

  getID(): string {
    return this.id;
  }

  getDueDate(): number {
    return this.dueTime;
  }
};

export class Assignment implements IEntity {
  constructor(public course: Course, public entries: Array<AssignmentEntry>, public isRead: boolean) { }

  getCourse(): Course {
    return this.course;
  }
};
