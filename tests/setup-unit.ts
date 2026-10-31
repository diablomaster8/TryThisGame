// TECH-42: the `unit` project registers no story scripts, but it loads the sim the way the app's
// boot does (world first), so a file that reaches the side-story rules through another import
// doesn't trip the campaign ↔ side-rule-kit import cycle halfway through.
import '../src/sim/world';
