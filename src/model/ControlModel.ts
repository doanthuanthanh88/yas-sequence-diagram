import { SubjectInfor } from "./SubjectInfor";

export abstract class ControlModel {
  current: ControlModel;
  childs: ControlModel[];
  context?: string
  space: number;
  get tabString() {
    return new Array(this.space).fill(' ').join('');
  }

  constructor() {
    this.childs = new Array();
  }

  get finalChilds() {
    const childs = this.childs?.reduce((sum, step, i) => {
      sum.push(step);
      if (step instanceof SupportChildsModel) {
        if (step.constructor.name !== this.childs[i + 1]?.constructor.name) {
          const end = new EndModel()
          end.space = step.space
          sum.push(end);
        }
      }
      return sum;
    }, []);
    return childs
  }

  match(txt: string, space: number) {
    if (this.current?.isRelease(space)) {
      this.current = null;
    }
    if (!this.current) {
      let model: ControlModel
      model = ConditionModel.Match(txt);
      if (model) {
        model.space = space;
        this.current = model;
        this.childs.push(model);
        return;
      }
      model = GroupModel.Match(txt);
      if (model) {
        model.space = space;
        this.current = model;
        this.childs.push(model);
        return;
      }
      model = LoopModel.Match(txt);
      if (model) {
        model.space = space;
        this.current = model;
        this.childs.push(model);
        return;
      }
      model = ParallelModel.Match(txt);
      if (model) {
        model.space = space;
        this.current = model;
        this.childs.push(model);
        return;
      }
      model = NoteModel.Match(txt);
      if (model) {
        model.space = space;
        this.current = model;
        this.childs.push(model);
        return;
      }
      model = CommandModel.Match(txt);
      if (model) {
        model.space = space;
        this.current = model;
        this.childs.push(model);
        return;
      }
      model = RefModel.Match(txt);
      if (model) {
        model.space = space;
        this.current = model;
        this.childs.push(model);
        return;
      }
    }

    if (this.current instanceof SupportChildsModel) {
      this.current.match(txt, space);
    }
  }

  abstract isRelease(space: number): boolean;

  abstract toMMD(context: string, space?: number): string;

  abstract getSubjects(context: string): SubjectInfor[];

  abstract getShapes(context: string): string[]
}

import { CommandModel } from "./CommandModel";
import { ConditionModel } from "./ConditionModel";
import { SupportChildsModel } from "./SupportChildsModel";
import { RefModel } from "./RefModel";
import { ParallelModel } from "./ParallelModel";
import { LoopModel } from "./LoopModel";
import { GroupModel } from "./GroupModel";
import { EndModel } from "./EndModel";
import { NoteModel } from "./NoteModel";

