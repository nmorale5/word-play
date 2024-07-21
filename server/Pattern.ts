import fs from 'fs';
import path from 'path';

export const BLANK_SYMBOL = "...";

export abstract class Pattern {
  abstract toString(): string;
  abstract frequency: number;
  
  getLetters(): string {
    return this.toString().replace(BLANK_SYMBOL, "");
  }

  toRegex(): RegExp {
    return new RegExp(`^${this.toString().replaceAll(BLANK_SYMBOL, ".+")}$`);
  }
}

export class LeftPattern extends Pattern {
  constructor(private letters: string, public frequency: number) {
    super();
  }

  toString(): string {
    return this.letters + BLANK_SYMBOL;
  }
}

export class RightPattern extends Pattern {
  constructor(private letters: string, public frequency: number) {
    super();
  }

  toString(): string {
    return BLANK_SYMBOL + this.letters;
  }
}

export class MiddlePattern extends Pattern {
  constructor(private letters: string, public frequency: number) {
    super();
  }

  toString(): string {
    return BLANK_SYMBOL + this.letters + BLANK_SYMBOL;
  }
}

export class ExactMultiPattern extends Pattern {
  constructor(private frontLetters: string, private backLetters: string, public frequency: number) {
    super();
  }

  toString(): string {
    return this.frontLetters + BLANK_SYMBOL + this.backLetters;
  }
}

export class LeftMultiPattern extends Pattern {
  constructor(private frontLetters: string, private backLetters: string, public frequency: number) {
    super();
  }

  toString(): string {
    return this.frontLetters + BLANK_SYMBOL + this.backLetters + BLANK_SYMBOL;
  }
}

export class RightMultiPattern extends Pattern {
  constructor(private frontLetters: string, private backLetters: string, public frequency: number) {
    super();
  }

  toString(): string {
    return BLANK_SYMBOL + this.frontLetters + BLANK_SYMBOL + this.backLetters;
  }
}

export class MiddleMultiPattern extends Pattern {
  constructor(private frontLetters: string, private backLetters: string, public frequency: number) {
    super();
  }

  toString(): string {
    return BLANK_SYMBOL + this.frontLetters + BLANK_SYMBOL + this.backLetters + BLANK_SYMBOL;
  }
}

export class PatternGenerator {
  public readonly allPatterns: Pattern[];
  private static _instance: PatternGenerator;

  public static get instance(): PatternGenerator {
    this._instance = this._instance ?? new PatternGenerator();
    return this._instance;
  }

  private constructor() {
    const filePath = path.join(__dirname, 'patterns.json');
    const jsonData = fs.readFileSync(filePath, 'utf-8');
    const parsedPatterns: [string, number][] = JSON.parse(jsonData);

    this.allPatterns = [];
    for (const [pattern, frequency] of parsedPatterns) {
      const arr = pattern.split(BLANK_SYMBOL);
      let newPattern: Pattern;
      if (arr.length === 2 && arr[1] === '') {
        newPattern = new LeftPattern(arr[0], frequency);
      } else if (arr.length === 2 && arr[0] === '') {
        newPattern = new RightPattern(arr[1], frequency);
      } else if (arr.length === 2) {
        newPattern = new ExactMultiPattern(arr[0], arr[1], frequency);
      } else if (arr.length === 3 && arr[0] === '' && arr[2] === '') {
        newPattern = new MiddlePattern(arr[1], frequency);
      } else if (arr.length === 3 && arr[0] === '') {
        newPattern = new RightMultiPattern(arr[1], arr[2], frequency);
      } else if (arr.length === 3) {
        newPattern = new LeftMultiPattern(arr[0], arr[1], frequency);
      } else {
        newPattern = new MiddleMultiPattern(arr[1], arr[2], frequency);
      }
      this.allPatterns.push(newPattern);
    }
  }

  public generateRandom(filterFunc?: (p: Pattern) => boolean): Pattern {
    filterFunc = filterFunc ?? ((p: Pattern) => true);
    const filtered = this.allPatterns.filter(filterFunc);
    if (!filtered) {
      throw new Error(`No patterns exist with those filters!`);
    }
    return filtered[Math.floor(Math.random() * filtered.length)];
  }
}