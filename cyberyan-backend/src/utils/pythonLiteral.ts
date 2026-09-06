class PythonLiteralParser {
  private input: string;
  private pos = 0;

  constructor(input: string) {
    this.input = input;
  }

  parse(): unknown {
    const value = this.parseValue();
    this.skipWhitespace();
    if (this.pos < this.input.length) {
      throw new Error(`Unexpected trailing characters at position ${this.pos}`);
    }
    return value;
  }

  private skipWhitespace(): void {
    while (this.pos < this.input.length && /\s/.test(this.input[this.pos])) {
      this.pos++;
    }
  }

  private peek(): string {
    return this.input[this.pos];
  }

  private expect(char: string): void {
    if (this.input[this.pos] !== char) {
      throw new Error(`Expected '${char}' at position ${this.pos}, got '${this.input[this.pos]}'`);
    }
    this.pos++;
  }

  private parseValue(): unknown {
    this.skipWhitespace();
    const ch = this.peek();

    if (ch === "[") return this.parseList();
    if (ch === "{") return this.parseDict();
    if (ch === "'" || ch === '"') return this.parseString();
    if (ch === "(") return this.parseTuple();

    if (this.input.startsWith("None", this.pos)) {
      this.pos += 4;
      return null;
    }
    if (this.input.startsWith("True", this.pos)) {
      this.pos += 4;
      return true;
    }
    if (this.input.startsWith("False", this.pos)) {
      this.pos += 5;
      return false;
    }
    if (this.input.startsWith("nan", this.pos)) {
      this.pos += 3;
      return null;
    }

    if (/[-\d.]/.test(ch)) return this.parseNumber();

    throw new Error(`Unexpected character '${ch}' at position ${this.pos}`);
  }

  private parseList(): unknown[] {
    this.expect("[");
    const items: unknown[] = [];
    this.skipWhitespace();

    if (this.peek() === "]") {
      this.pos++;
      return items;
    }

    for (;;) {
      items.push(this.parseValue());
      this.skipWhitespace();
      if (this.peek() === ",") {
        this.pos++;
        this.skipWhitespace();
        if (this.peek() === ("]" as string)) {
          break;
        }
        continue;
      }
      break;
    }

    this.skipWhitespace();
    this.expect("]");
    return items;
  }

  private parseTuple(): unknown[] {
    this.expect("(");
    const items: unknown[] = [];
    this.skipWhitespace();

    if (this.peek() === (")" as string)) {
      this.pos++;
      return items;
    }

    for (;;) {
      items.push(this.parseValue());
      this.skipWhitespace();
      if (this.peek() === ",") {
        this.pos++;
        this.skipWhitespace();
        if (this.peek() === (")" as string)) break;
        continue;
      }
      break;
    }

    this.skipWhitespace();
    this.expect(")");
    return items;
  }

  private parseDict(): Record<string, unknown> {
    this.expect("{");
    const obj: Record<string, unknown> = {};
    this.skipWhitespace();

    if (this.peek() === "}") {
      this.pos++;
      return obj;
    }

    for (;;) {
      this.skipWhitespace();
      const key = this.parseValue();
      this.skipWhitespace();
      this.expect(":");
      const value = this.parseValue();
      obj[String(key)] = value;
      this.skipWhitespace();
      if (this.peek() === ",") {
        this.pos++;
        this.skipWhitespace();
        if (this.peek() === ("}" as string)) break;
        continue;
      }
      break;
    }

    this.skipWhitespace();
    this.expect("}");
    return obj;
  }

  private parseString(): string {
    const quote = this.peek();
    this.pos++;
    let result = "";

    while (this.pos < this.input.length && this.peek() !== quote) {
      const ch = this.peek();
      if (ch === "\\") {
        this.pos++;
        const escaped = this.peek();
        switch (escaped) {
          case "n":
            result += "\n";
            break;
          case "t":
            result += "\t";
            break;
          case "r":
            result += "\r";
            break;
          case "\\":
            result += "\\";
            break;
          case "'":
            result += "'";
            break;
          case '"':
            result += '"';
            break;
          default:
            result += escaped;
        }
        this.pos++;
      } else {
        result += ch;
        this.pos++;
      }
    }

    this.expect(quote);
    return result;
  }

  private parseNumber(): number {
    const start = this.pos;
    if (this.peek() === "-") this.pos++;
    while (this.pos < this.input.length && /[\d.eE+-]/.test(this.peek())) {
      this.pos++;
    }
    const raw = this.input.slice(start, this.pos);
    const value = Number(raw);
    if (Number.isNaN(value)) {
      throw new Error(`Invalid number literal '${raw}' at position ${start}`);
    }
    return value;
  }
}

export function tryParsePythonLiteral(raw: string | undefined): unknown {
  if (raw === undefined) return undefined;
  const trimmed = raw.trim();
  if (trimmed === "") return undefined;

  try {
    return new PythonLiteralParser(trimmed).parse();
  } catch {
    return undefined;
  }
}
