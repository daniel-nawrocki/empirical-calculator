export type RockType = "Granite/Hard Limestone" | "Soft Limestone/Shale/Sandstone";
export type PatternType = "Square" | "Rectangular";
export type InitiationType = "Bottom" | "Top and Bottom";
export type BandLetter = "A" | "B" | "C" | "D" | "E";

export interface BandSelection {
  band: BandLetter;
  constant: number;
  ratioBelowRange: boolean;
}

const GRANITE_CONSTANTS: Record<BandLetter, number> = {
  A: 1200,
  B: 906,
  C: 806,
  D: 484,
  E: 282
};

const LIMESTONE_CONSTANTS: Record<BandLetter, number> = {
  A: 1560,
  B: 1177,
  C: 1047,
  D: 629,
  E: 366
};

export function getRectangularK(rockType: RockType): number {
  return rockType === "Granite/Hard Limestone" ? 0.85 : 0.93;
}

export function getStemmingK(initiation: InitiationType, band: BandLetter): number {
  if (band === "E") return 0.7;
  return initiation === "Bottom" ? 0.5 : 0.7;
}

export function getEmpiricalBandAndConstant(ratioR: number, rockType: RockType): BandSelection {
  const constants = rockType === "Granite/Hard Limestone" ? GRANITE_CONSTANTS : LIMESTONE_CONSTANTS;
  if (ratioR >= 13.23) return { band: "A", constant: constants.A, ratioBelowRange: false };
  if (ratioR >= 9.45) return { band: "B", constant: constants.B, ratioBelowRange: false };
  if (ratioR >= 4.8) return { band: "C", constant: constants.C, ratioBelowRange: false };
  if (ratioR >= 2.62) return { band: "D", constant: constants.D, ratioBelowRange: false };
  if (ratioR >= 1.84) return { band: "E", constant: constants.E, ratioBelowRange: false };
  return { band: "E", constant: constants.E, ratioBelowRange: true };
}

export function calculatePatternFootage(dhInches: number, empiricalConstant: number): number {
  return (dhInches / 12) ** 2 * empiricalConstant;
}

export interface CalculatorInput {
  rockType: RockType;
  faceHeightFt: number;
  dhInches: number;
  patternType: PatternType;
  initiation: InitiationType;
}

export interface CalculatorOutput {
  effectiveFaceHeightFt: number;
  ratioR: number;
  band: BandLetter;
  empiricalConstant: number;
  ratioBelowRange: boolean;
  patternFootage: number;
  burden: number;
  spacing: number;
  subdrill: number;
  stemming: number;
}

export function calculateOutputs(input: CalculatorInput): CalculatorOutput {
  const effectiveFaceHeightFt = input.faceHeightFt;
  const ratioR = effectiveFaceHeightFt / input.dhInches;
  const selection = getEmpiricalBandAndConstant(ratioR, input.rockType);
  const patternFootage = calculatePatternFootage(input.dhInches, selection.constant);
  const base = Math.sqrt(patternFootage);
  const burden = input.patternType === "Square" ? base : getRectangularK(input.rockType) * base;
  const spacing = patternFootage / burden;
  const subdrill = 0.3 * burden;
  const stemming = getStemmingK(input.initiation, selection.band) * burden;

  return {
    effectiveFaceHeightFt,
    ratioR,
    band: selection.band,
    empiricalConstant: selection.constant,
    ratioBelowRange: selection.ratioBelowRange,
    patternFootage,
    burden,
    spacing,
    subdrill,
    stemming
  };
}

export interface TableRow {
  faceHeightFt: number;
  ratioR: number;
  band: BandLetter;
  constant: number;
  patternFootage: number;
  squareBurden: number;
  rectangularBurden: number;
  rectangularSpacing: number;
  ratioBelowRange: boolean;
}

export function buildTableRows(rockType: RockType, dhInches: number, faceHeightsFt: number[]): TableRow[] {
  return faceHeightsFt
    .filter((h) => Number.isFinite(h) && h > 0)
    .map((faceHeightFt) => {
      const ratioR = faceHeightFt / dhInches;
      const selection = getEmpiricalBandAndConstant(ratioR, rockType);
      const patternFootage = calculatePatternFootage(dhInches, selection.constant);
      const squareBurden = Math.sqrt(patternFootage);
      const rectangularBurden = getRectangularK(rockType) * squareBurden;
      const rectangularSpacing = patternFootage / rectangularBurden;

      return {
        faceHeightFt,
        ratioR,
        band: selection.band,
        constant: selection.constant,
        patternFootage,
        squareBurden,
        rectangularBurden,
        rectangularSpacing,
        ratioBelowRange: selection.ratioBelowRange
      };
    });
}
