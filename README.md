# Pattern Footage Empirical Calculator

Single-page offline React + Vite app for Dyno Nobel Pattern Footage empirical calculations.

## Features

- Calculator Mode:
  - Inputs for rock type, face height, Dh, pattern type, and initiation type.
  - Automatic empirical band (A-E) and constant selection.
  - Computes PF, burden (B), spacing (S), subdrill (J), and calculated stemming, with Band E stemming fixed at 0.70B.
  - Warnings for out-of-range ratios and invalid inputs.
- Export and print:
  - `Print / Save PDF` for clean landscape report output.
- Shared calculation logic in `src/lib/patternFootage.ts`.
- Unit tests (Vitest) for band selection and PF calculation.

## Tech Stack

- React + Vite + TypeScript
- Vitest

## Run Locally

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start development server:
   ```bash
   npm run dev
   ```
3. Run tests:
   ```bash
   npm run test
   ```
4. Build production bundle:
   ```bash
   npm run build
   ```

## Notes

- No backend required; all calculations run in the browser.
- Designed to work offline once dependencies are installed and the app is built/served locally.
- Print stylesheet targets 8.5x11 landscape with compact spacing and light gridlines.
