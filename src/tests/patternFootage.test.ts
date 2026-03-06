import { describe, expect, it } from "vitest";
import { calculateOutputs, calculatePatternFootage, getEmpiricalBandAndConstant } from "../lib/patternFootage";

describe("getEmpiricalBandAndConstant", () => {
  it("selects granite band boundaries correctly", () => {
    expect(getEmpiricalBandAndConstant(13.23, "Granite/Hard Limestone")).toMatchObject({ band: "A", constant: 1200 });
    expect(getEmpiricalBandAndConstant(13.22, "Granite/Hard Limestone")).toMatchObject({ band: "B", constant: 906 });
    expect(getEmpiricalBandAndConstant(9.45, "Granite/Hard Limestone")).toMatchObject({ band: "B", constant: 906 });
    expect(getEmpiricalBandAndConstant(9.44, "Granite/Hard Limestone")).toMatchObject({ band: "C", constant: 806 });
    expect(getEmpiricalBandAndConstant(4.8, "Granite/Hard Limestone")).toMatchObject({ band: "C", constant: 806 });
    expect(getEmpiricalBandAndConstant(2.62, "Granite/Hard Limestone")).toMatchObject({ band: "D", constant: 484 });
    expect(getEmpiricalBandAndConstant(1.84, "Granite/Hard Limestone")).toMatchObject({ band: "E", constant: 282 });
  });

  it("applies below-range fallback to E for limestone family", () => {
    const result = getEmpiricalBandAndConstant(1.2, "Soft Limestone/Shale/Sandstone");
    expect(result.band).toBe("E");
    expect(result.constant).toBe(366);
    expect(result.ratioBelowRange).toBe(true);
  });
});

describe("calculatePatternFootage", () => {
  it("computes PF correctly", () => {
    const pf = calculatePatternFootage(6.5, 1200);
    expect(pf).toBeCloseTo(352.0833, 4);
  });
});

describe("stemming override", () => {
  it("forces 0.70B for band E even with bottom initiation", () => {
    const output = calculateOutputs({
      rockType: "Granite/Hard Limestone",
      faceHeightFt: 10,
      dhInches: 6.5,
      patternType: "Square",
      initiation: "Bottom"
    });
    expect(output.band).toBe("E");
    expect(output.stemming).toBeCloseTo(output.burden * 0.7, 6);
  });
});
