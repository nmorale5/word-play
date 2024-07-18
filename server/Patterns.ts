export const BLANK_SYMBOL = "...";

export abstract class Pattern {
  abstract toString(): string;
  abstract frequency: number;
  
  getLetters(): string {
    return this.toString().replace(BLANK_SYMBOL, "");
  }

  toRegex(): RegExp {
    return new RegExp(this.toString().replace(BLANK_SYMBOL, ".+"));
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