export type LicenseType = "Basic" | "Commercial" | "Exclusive";

export interface Stem {
  description: string;
  file: string;
}

export interface License {
  type: LicenseType;
  tokensRequired: number;
}

export class Metadata {
  name: string;
  description: string;
  file: string;
  image: string;
  genre: string;
  bpm: number;
  format: string;
  duration: number;
  stems: Stem[];
  licenses: License[];

  constructor() {
    this.name = "";
    this.description = "";
    this.file = "";
    this.image = "";
    this.genre = "";
    this.bpm = 0;
    this.format = "";
    this.duration = 0;
    this.stems = [];
    this.licenses = [];
  }
}
