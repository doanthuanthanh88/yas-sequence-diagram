import { ControlModel } from "./ControlModel";

export abstract class SupportChildsModel extends ControlModel {
  isRelease(space: number) {
    return this.space >= space;
  }

  getSubjects(context: string) {
    return this.childs?.map(child => child.getSubjects(context)).flat();
  }

  getShapes(context: string) {
    return this.childs?.map(child => child.getShapes(context)).flat();
  }
}