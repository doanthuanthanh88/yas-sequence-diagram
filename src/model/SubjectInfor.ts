export class SubjectInfor {
  subject: string;
  target: string;
  action: string;

  get flowAction() {
    switch (this.action) {
      case '=>':
        return '==>';
      case '>':
        return '-->';
      case '->':
      case '<-':
        return '-.->';
      default:
        return '';
    }
  }

  get uniqueAction() {
    switch (this.action) {
      case '=>':
        return '==>';
      case '>':
        return '-->';
      case '->':
        return '<-.-';
      case '<-':
        return '-.->';
      default:
        return '';
    }
  }

  toMMD() {
    if (this.flowAction) {
      if (this.action.includes('>')) {
        return `${this.subject}${this.flowAction}${this.target}`;
      } else if (this.action.includes('<')) {
        return `${this.target}${this.flowAction}${this.subject}`;
      }
    }
  }

  toString() {
    return `${this.subject} ${this.uniqueAction} ${this.target}`;
  }
}
