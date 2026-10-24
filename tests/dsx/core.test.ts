import { expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";

const html = readFileSync(new URL("../../src/components/dsx/simulation.html", import.meta.url), "utf8");
const source = html.match(/\/\* DSX SDL6 Pure-Boundary CORE[\s\S]*?(?=\(function\(\)\{'use strict';const C=window)/)?.[0];
if (!source) throw new Error("Simulation engine missing");
const scope: Record<string, any> = {};
runInNewContext(source, scope);
const core = scope.DSXLivingCore;

test("eight-finger model contains eight distinct coins", () => {
  expect(core.create({ mode: "eight" }).coins.length).toBe(8);
});
test("one coin plus eight hypotheses does not create nine physical coins", () => {
  expect(core.create({ mode: "nine" }).coins.length).toBe(1);
  expect(core.nineViews("undetermined").filter((x: any) => x.kind === "counterfactual").length).toBe(8);
});
test("tampering halts the mirror and blocks advancement", () => {
  const guard = core.guarded({ mode: "eight" });
  core.advanceGuarded(guard, 12);
  const tick = guard.tick;
  expect(core.injectCoinTamper(guard)).toBe(false);
  expect(guard.status).toBe("HALTED");
  expect(core.advanceGuarded(guard, 12)).toBe(false);
  expect(guard.tick).toBe(tick);
});
test("motor assist quarters when distance doubles beyond 20 mm", () => {
  expect(core.inverseSquare(0.020)).toBe(1);
  expect(core.inverseSquare(0.040)).toBe(0.25);
  expect(core.inverseSquare(0.080)).toBe(0.0625);
});