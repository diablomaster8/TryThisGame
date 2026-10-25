/**
 * Tunables for the digital line (digi agent). Which hatchling a digital-line egg holds:
 * one per pet version, weighted so the original Ver.1 line stays the most common
 * (40 %, the other four 15 % each).
 */
export const DIGI_EGGS: Readonly<Record<string, number>> = {
  fuzzlet: 4, // Ver.1
  jellop: 1.5, // Ver.2
  driftlet: 1.5, // Ver.3
  fluffseed: 1.5, // Ver.4
  oozlet: 1.5, // Ver.5
};
