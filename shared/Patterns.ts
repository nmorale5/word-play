const BLANK_SYMBOL = "...";

abstract class Pattern {
  abstract toString(): string;
  abstract frequency: number;
  
  get_letters() {
    return this.toString().replace(BLANK_SYMBOL, "");
  }
}

class LeftPattern extends Pattern {
  constructor(private _letters: string, public frequency: number) {
    super();
  }

  toString(): string {
    return this._letters + BLANK_SYMBOL;
  }
}

class RightPattern extends Pattern {
  constructor(private _letters: string, public frequency: number) {
    super();
  }

  toString(): string {
    return BLANK_SYMBOL + this._letters;
  }
}

class MiddlePattern extends Pattern {
  constructor(private _letters: string, public frequency: number) {
    super();
  }

  toString(): string {
    return BLANK_SYMBOL + this._letters + BLANK_SYMBOL;
  }
}

class ExactMultiPattern extends Pattern {
  constructor(private frontLetters: string, private backLetters: string, public frequency: number) {
    super();
  }

  toString(): string {
    return this.frontLetters + BLANK_SYMBOL + this.backLetters;
  }
}

class LeftMultiPattern extends Pattern {
  constructor(private frontLetters: string, private backLetters: string, public frequency: number) {
    super();
  }

  toString(): string {
    return this.frontLetters + BLANK_SYMBOL + this.backLetters + BLANK_SYMBOL;
  }
}

class RightMultiPattern extends Pattern {
  constructor(private frontLetters: string, private backLetters: string, public frequency: number) {
    super();
  }

  toString(): string {
    return BLANK_SYMBOL + this.frontLetters + BLANK_SYMBOL + this.backLetters;
  }
}

class MiddleMultiPattern extends Pattern {
  constructor(private frontLetters: string, private backLetters: string, public frequency: number) {
    super();
  }

  toString(): string {
    return BLANK_SYMBOL + this.frontLetters + BLANK_SYMBOL + this.backLetters + BLANK_SYMBOL;
  }
}