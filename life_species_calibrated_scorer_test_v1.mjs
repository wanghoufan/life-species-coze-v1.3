/**
 * life_species_calibrated_scorer_test_v1.mjs
 * v1.3 - 24 Fixture Auto-Test Suite
 * Test version: mvp-1.2
 * Scoring engine: mvp-1.2-calibrated
 */

import { score, validateAnswers, SPECIES, VERSION } from './life_species_calibrated_scorer_v1.mjs';

const FIXTURES = {
  'weekend-dog': [[0],[2],[0],[0],[3],[0],[0],[1],[1],[4],[1],[0],[0],[1],[7,0],[0],[2],[0],[3],[3],[0],[0],[2],[2]],
  'weekend-missing': [[2],[3],[0],[3],[1],[3],[2],[1],[3],[3,6],[1],[0],[0],[3],[6,7],[1],[1],[1],[3],[2],[0],[2],[2],[0]],
  'city-guide': [[2],[2],[0],[1],[0],[2],[3],[3],[0],[1,7],[2],[2],[0],[0],[1,3],[0],[2],[1],[1],[1],[3],[3],[1],[3]],
  'homebody': [[0],[3],[1],[3],[3],[1],[1],[1],[2],[1,4],[3],[3],[3],[0],[5,3,6],[2],[1],[1],[1],[3],[0],[0],[3],[3]],
  'social-peacock': [[3],[0],[1],[3],[0],[3],[2],[1],[0],[1,3],[1],[0],[3],[3],[0],[2],[2],[3],[1],[3],[0],[2],[0],[1]],
  'party-king': [[1],[0],[0],[0],[2],[1],[1],[1],[1],[0,7,2],[0],[0],[0],[0],[7],[1],[3],[1],[0],[3],[0],[1],[1],[0]],
  'human-moments': [[2],[0],[2],[1],[1],[1],[3],[1],[2],[4,1,5],[3],[0],[0],[1],[5,2,3],[0],[3],[0],[0],[1],[2],[2],[1],[3]],
  'life-documentary': [[0],[1],[3],[1],[3],[3],[2],[0],[0],[2,0],[0],[0],[1],[1],[1,3],[0],[0],[1],[2],[3],[3],[0],[0],[1]],
  'deep-talk': [[0],[0],[2],[2],[1],[3],[0],[0],[1],[5],[1],[2],[3],[2],[7],[0],[0],[3],[1],[3],[3],[2],[1],[2]],
  'banter-artist': [[1],[0],[1],[1],[2],[3],[1],[2],[1],[6],[2],[3],[1],[2],[0,4,1,7],[1],[0],[1],[3],[3],[0],[1],[3],[1]],
  'invisible-mode': [[3],[3],[3],[0],[2],[2],[3],[3],[2],[0,4,1],[3],[1],[0],[3],[4],[3],[0],[2],[2],[2],[3],[3],[2],[2]],
  'slow-cat': [[3],[1],[0],[3],[2],[0],[1],[0],[3],[2,5],[1],[1],[0],[3],[2],[0],[3],[1],[1],[2],[0],[3],[1],[3]],
  'social-cactus': [[0],[1],[2],[0],[0],[0],[0],[1],[1],[3,4],[0],[2],[0],[1],[4,5,6],[1],[3],[2],[2],[1],[2],[0],[0],[0]],
  'cyber-social': [[2],[3],[2],[2],[1],[3],[2],[2],[0],[5,6,3],[3],[3],[1],[0],[7],[2],[2],[2],[0],[1],[1],[1],[0],[0]],
  'human-itinerary': [[1],[2],[1],[0],[0],[0],[0],[0],[2],[0],[0],[0],[2],[1],[3],[3],[1],[3],[0],[2],[0],[2],[2],[2]],
  'spontaneous-monster': [[1],[0],[1],[0],[1],[0],[2],[3],[1],[6],[1],[1],[1],[2],[5],[1],[2],[0],[3],[1],[1],[1],[1],[3]],
  'night-revive': [[1],[3],[2],[0],[0],[3],[1],[2],[3],[7,6],[1],[0],[2],[2],[1,7],[2],[1],[0],[1],[3],[1],[2],[2],[2]],
  'night-low-power': [[1],[1],[0],[0],[2],[0],[2],[0],[1],[5,3],[3],[0],[3],[3],[3,4],[1],[0],[2],[2],[2],[0],[3],[0],[1]],
  'dopamine-beast': [[3],[2],[1],[0],[0],[0],[1],[2],[3],[7],[3],[2],[2],[0],[6],[2],[0],[1],[3],[2],[2],[0],[3],[2]],
  'outdoor-savage': [[3],[0],[0],[3],[3],[0],[0],[3],[1],[4],[1],[0],[0],[1],[4,5],[1],[2],[3],[1],[2],[2],[1],[1],[1]],
  'dinner-engine': [[0],[1],[0],[0],[0],[0],[2],[2],[1],[0,2],[1],[1],[3],[2],[7,4],[0],[0],[1],[0],[1],[0],[0],[2],[2]],
  'food-hunter': [[0],[2],[1],[0],[0],[0],[2],[2],[1],[0,1,2],[0],[2],[2],[1],[2,4,1],[1],[2],[2],[3],[0],[2],[1],[0],[1]],
  'cafe-resident': [[3],[0],[1],[0],[3],[1],[0],[2],[3],[1,2],[0],[0],[3],[3],[0,1],[1],[2],[0],[2],[2],[2],[2],[2],[3]],
  'happy-eater': [[0],[2],[0],[0],[3],[1],[1],[1],[1],[0,3,6],[1],[0],[1],[1],[4,7],[2],[3],[3],[2],[1],[2],[3],[0],[1]],
};

function toAnswerArray(fixture) {
  return fixture.map((opts, i) => ({ q: i + 1, options: opts }));
}

function getFamily(key) {
  for (const s of SPECIES) if (s.key === key) return s.family;
  return null;
}

console.log('=== Life Species Scorer Test Suite ===');
console.log(`Test version: mvp-1.2`);
console.log(`Scoring engine: ${VERSION}`);
console.log(`Species count: ${SPECIES.length}`);
console.log('');

// 1. 24 Fixture test
console.log('--- 1. 24 Fixture Test ---');
let fixturePass = 0;
let fixtureFail = 0;
const fixtureResults = [];

for (const [expectedKey, fixture] of Object.entries(FIXTURES)) {
  const answers = toAnswerArray(fixture);
  const result = score(answers);
  const actualKey = result.mainSpeciesKey;
  const secondary = result.secondarySpeciesKeys || [];
  const pass = actualKey === expectedKey;
  
  if (pass) fixturePass++;
  else fixtureFail++;
  
  fixtureResults.push({
    key: expectedKey,
    pass,
    actual: actualKey,
    secondary,
    top3: result.speciesScores.slice(0, 3).map(s => `${s.key}(${s.score.toFixed(2)})`)
  });
  
  const mark = pass ? 'PASS' : 'FAIL';
  console.log(`  ${mark}: ${expectedKey.padEnd(20)} → ${actualKey.padEnd(20)} | sec: ${secondary.join(',')}`);
}

console.log(`\n  Fixture hits: ${fixturePass}/24, Fixture misses: ${fixtureFail}/24`);
console.log('');

// 2. Deterministic test
console.log('--- 2. Deterministic Test ---');
const firstFixture = toAnswerArray(FIXTURES[Object.keys(FIXTURES)[0]]);
const firstResult = score(firstFixture);
let deterministic = true;
for (let i = 0; i < 10; i++) {
  const r = score(firstFixture);
  if (r.mainSpeciesKey !== firstResult.mainSpeciesKey) {
    deterministic = false;
    break;
  }
}
console.log(`  Deterministic: ${deterministic ? 'PASS' : 'FAIL'}`);
console.log('');

// 3. Cross-family secondary check
console.log('--- 3. Cross-Family Secondary Check ---');
let crossFamilyPass = 0;
let crossFamilyFail = 0;
for (const result of fixtureResults) {
  if (!result.pass) continue;
  const mainFamily = getFamily(result.key);
  const secFamilies = result.secondary.map(s => getFamily(s));
  const allCross = secFamilies.every(f => f !== mainFamily);
  if (allCross) crossFamilyPass++;
  else {
    crossFamilyFail++;
    console.log(`  FAIL: ${result.key} (family ${mainFamily}) has secondary ${result.secondary.map((s,i) => `${s}(family ${secFamilies[i]})`).join(',')}`);
  }
}
if (crossFamilyFail === 0) console.log(`  Cross-family secondary: PASS (all ${crossFamilyPass} fixtures)`);
console.log('');

// 4. Input validation test
console.log('--- 4. Input Validation Test ---');
let validationPass = 0;
let validationFail = 0;

// Test 4a: Invalid answer count
try {
  validateAnswers([{ q: 1, options: [0] }]);
  validationFail++;
  console.log('  FAIL: Should reject < 24 answers');
} catch (e) {
  validationPass++;
  console.log('  PASS: Rejects < 24 answers');
}

// Test 4b: Q1 single but multi options
try {
  const answers = Array.from({ length: 24 }, (_, i) => ({ q: i + 1, options: [0, 1, 2, 3] }));
  validateAnswers(answers);
  validationFail++;
  console.log('  FAIL: Should reject multi options on single-choice Q1');
} catch (e) {
  validationPass++;
  console.log('  PASS: Rejects multi options on single-choice Q1');
}

// Test 4c: Q10 with 4 options (exceeds max 3)
try {
  const answers = Array.from({ length: 24 }, (_, i) => {
    if (i === 9) return { q: 10, options: [0, 1, 2, 3] };
    return { q: i + 1, options: [0] };
  });
  validateAnswers(answers);
  validationFail++;
  console.log('  FAIL: Should reject Q10 with > 3 options');
} catch (e) {
  validationPass++;
  console.log('  PASS: Rejects Q10 with > 3 options');
}

// Test 4d: Q15 with 6 options (exceeds max 5)
try {
  const answers = Array.from({ length: 24 }, (_, i) => {
    if (i === 14) return { q: 15, options: [0, 1, 2, 3, 4, 5] };
    return { q: i + 1, options: [0] };
  });
  validateAnswers(answers);
  validationFail++;
  console.log('  FAIL: Should reject Q15 with > 5 options');
} catch (e) {
  validationPass++;
  console.log('  PASS: Rejects Q15 with > 5 options');
}

// Test 4e: Invalid option value
try {
  const answers = Array.from({ length: 24 }, (_, i) => {
    if (i === 0) return { q: 1, options: [999] };
    return { q: i + 1, options: [0] };
  });
  validateAnswers(answers);
  validationFail++;
  console.log('  FAIL: Should reject invalid option value');
} catch (e) {
  validationPass++;
  console.log('  PASS: Rejects invalid option value');
}

console.log(`\n  Input validation: ${validationPass === 5 ? 'PASS' : 'FAIL'} (${validationPass}/5)`);
console.log('');

// 5. Summary
console.log('=== Summary ===');
console.log(`  24/24 fixture main species hit: ${fixturePass === 24 ? 'PASS' : 'FAIL'}`);
console.log(`  Deterministic (repeatable): ${deterministic ? 'PASS' : 'FAIL'}`);
console.log(`  Cross-family secondary: ${crossFamilyFail === 0 ? 'PASS' : 'FAIL'}`);
console.log(`  Input validation: ${validationPass === 5 ? 'PASS' : 'FAIL'}`);

const overallPass = fixturePass === 24 && deterministic && crossFamilyFail === 0 && validationPass === 5;
console.log(`\n  Overall: ${overallPass ? 'PASS ✅' : 'FAIL ❌'}`);
console.log(`  Status: ${overallPass ? 'PASS' : 'FAIL'}`);