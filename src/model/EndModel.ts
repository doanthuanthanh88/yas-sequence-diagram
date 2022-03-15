import { ControlModel } from './ControlModel';
import { SubjectInfor } from './SubjectInfor';

export class EndModel extends ControlModel {
  isRelease(_space: number): boolean {
    return true
  }
  getSubjects(_context: string): SubjectInfor[] {
    return []
  }

  getShapes(_context: string): string[] {
    return []
  }

  toMMD(_context: string, space?: number) {
    if (space !== undefined)
      this.space = space;
    return `${this.tabString}END`
  }

}
