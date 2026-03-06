import { useMemo, useState } from "react";
import { calculateOutputs, InitiationType, PatternType, RockType } from "./lib/patternFootage";

function toFixed(value: number, digits = 2): string {
  return Number.isFinite(value) ? value.toFixed(digits) : "-";
}

export default function App() {
  const [rockType, setRockType] = useState<RockType>("Granite/Hard Limestone");
  const [faceHeight, setFaceHeight] = useState("30");
  const [dh, setDh] = useState("6.5");
  const [patternType, setPatternType] = useState<PatternType>("Square");
  const [initiation, setInitiation] = useState<InitiationType>("Bottom");

  const faceHeightNum = Number(faceHeight);
  const dhNum = Number(dh);

  const calcErrors = useMemo(() => {
    const errors: string[] = [];
    if (!Number.isFinite(dhNum) || dhNum <= 0) errors.push("Hole diameter Dh must be greater than 0.");
    if (!Number.isFinite(faceHeightNum) || faceHeightNum <= 0) {
      errors.push("Face height must be greater than 0.");
    }
    return errors;
  }, [dhNum, faceHeightNum]);

  const calcOutput = useMemo(() => {
    if (calcErrors.length > 0) return null;
    return calculateOutputs({
      rockType,
      faceHeightFt: faceHeightNum,
      dhInches: dhNum,
      patternType,
      initiation
    });
  }, [calcErrors.length, dhNum, faceHeightNum, initiation, patternType, rockType]);

  const timestamp = useMemo(() => new Date().toLocaleString(), []);

  return (
    <div className="app">
      <header className="topbar no-print">
        <h1>Pattern Footage Empirical Calculator</h1>
        <div className="actions">
          <button onClick={() => window.print()}>Print / Save PDF</button>
        </div>
      </header>

      <section className="split">
        <div className="panel input-panel">
          <h2>Inputs</h2>

          <label>
            Rock Type
            <select value={rockType} onChange={(e) => setRockType(e.target.value as RockType)}>
              <option value="Granite/Hard Limestone">Granite/Hard Limestone</option>
              <option value="Soft Limestone/Shale/Sandstone">Soft Limestone/Shale/Sandstone</option>
            </select>
          </label>

          <label>
            Face Height (ft)
            <input type="number" min="0" step="0.01" value={faceHeight} onChange={(e) => setFaceHeight(e.target.value)} />
          </label>

          <label>
            Hole Diameter Dh (in)
            <input type="number" min="0" step="0.01" value={dh} onChange={(e) => setDh(e.target.value)} />
          </label>

          <div className="quick-buttons">
            <button type="button" onClick={() => setDh("5.5")}>
              5.5 in
            </button>
            <button type="button" onClick={() => setDh("6.5")}>
              6.5 in
            </button>
          </div>

          <label>
            Pattern Type
            <select value={patternType} onChange={(e) => setPatternType(e.target.value as PatternType)}>
              <option value="Square">Square</option>
              <option value="Rectangular">Rectangular</option>
            </select>
          </label>

          <label>
            Initiation
            <select value={initiation} onChange={(e) => setInitiation(e.target.value as InitiationType)}>
              <option value="Bottom">Bottom</option>
              <option value="Top and Bottom">Top and Bottom</option>
            </select>
          </label>

          {calcErrors.length > 0 && (
            <div className="error-list">
              {calcErrors.map((err) => (
                <p key={err}>{err}</p>
              ))}
            </div>
          )}
        </div>

        <div className="panel results-panel">
          <h2>Results Card</h2>
          {calcOutput ? (
            <>
              <div className="hero-values">
                <div>
                  <span className="label">Burden B (ft)</span>
                  <span className="value">{toFixed(calcOutput.burden, 3)}</span>
                </div>
                <div>
                  <span className="label">Spacing S (ft)</span>
                  <span className="value">{toFixed(calcOutput.spacing, 3)}</span>
                </div>
              </div>

              <div className="grid small-grid">
                <div>
                  <span className="label">Effective Face Height</span>
                  <span>{toFixed(calcOutput.effectiveFaceHeightFt, 3)} ft</span>
                </div>
                <div>
                  <span className="label">R = Height / Dh</span>
                  <span>{toFixed(calcOutput.ratioR, 3)}</span>
                </div>
                <div>
                  <span className="label">Band</span>
                  <span>{calcOutput.band}</span>
                </div>
                <div>
                  <span className="label">Empirical Constant</span>
                  <span>{calcOutput.empiricalConstant}</span>
                </div>
                <div>
                  <span className="label">PF (ft^2)</span>
                  <span>{toFixed(calcOutput.patternFootage, 3)}</span>
                </div>
              </div>

              <div className="secondary-values">
                <div>
                  <span className="label">Subdrill J = 0.30B</span>
                  <span>{toFixed(calcOutput.subdrill, 3)} ft</span>
                </div>
                <div>
                  <span className="label">
                    Calculated Stemming ={" "}
                    {calcOutput.band === "E" ? "0.70B (Band E override)" : initiation === "Bottom" ? "0.50B" : "0.70B"} (
                    {initiation})
                  </span>
                  <span>{toFixed(calcOutput.stemming, 3)} ft</span>
                </div>
              </div>

              {calcOutput.ratioBelowRange && (
                <div className="warning">
                  Ratio below empirical table range; results may not apply. E constant used as conservative fallback.
                </div>
              )}
            </>
          ) : (
            <p className="placeholder">Enter valid inputs to calculate results.</p>
          )}
        </div>
      </section>

      <footer className="print-footer">
        <span>Generated: {timestamp}</span>
        <span>
          Inputs: {rockType}, {patternType}, Dh {dh} in, Face {faceHeight} ft
        </span>
      </footer>
    </div>
  );
}
