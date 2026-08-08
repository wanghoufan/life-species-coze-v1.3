/**
 * life_species_calibrated_scorer_v1.mjs
 * 版本: mvp-1.2-calibrated
 *
 * 24 questions → 18 dimensions → 24 species
 * Weighted sum approach with differentiated weights
 */

const QUESTIONS = Array.from({ length: 24 }, (_, i) => ({
  q: i + 1, type: "single", max: 1
}));
QUESTIONS[9] = { q: 10, type: "multi", max: 3 };
QUESTIONS[14] = { q: 15, type: "multi", max: 5 };

const DIMENSIONS = [
  "social_energy", "weekend_activism", "home_preference",
  "food_focus", "novelty_seeking", "spontaneity",
  "routine_need", "night_owl", "morning_person",
  "depth_need", "humor_style", "plan_need",
  "crowd_preference", "outdoor_love", "social_media",
  "memory_keeping", "energy_level", "food_social",
];

const OPTION_VALUES = {};
OPTION_VALUES[1] = [
  { weekend_activism: 0.9 }, { weekend_activism: 0.4, home_preference: 0.2 },
  { home_preference: 0.9 }, { weekend_activism: 0.6, outdoor_love: 0.2 },
];
OPTION_VALUES[2] = [
  { spontaneity: 0.9 }, { spontaneity: 0.3 },
  { plan_need: 0.9 }, { home_preference: 0.6 },
];
OPTION_VALUES[3] = [
  { crowd_preference: 0.9 }, { social_energy: 0.5 },
  { depth_need: 0.9 }, { home_preference: 0.6 },
];
OPTION_VALUES[4] = [
  { food_focus: 0.5, food_social: 0.2 }, { memory_keeping: 0.9 },
  { social_media: 0.9 }, { social_media: 0.4, memory_keeping: 0.4 },
];
OPTION_VALUES[5] = [
  { novelty_seeking: 0.9 }, { novelty_seeking: 0.3 },
  { routine_need: 0.9 }, { routine_need: 1.0 },
];
OPTION_VALUES[6] = [
  { morning_person: 0.9 }, { morning_person: 0.4 },
  { night_owl: 0.5 }, { night_owl: 0.9 },
];
OPTION_VALUES[7] = [
  { depth_need: 0.9 }, { humor_style: 0.9 },
  { social_energy: 0.5 }, { depth_need: 0.6, memory_keeping: 0.3 },
];
OPTION_VALUES[8] = [
  { plan_need: 0.9 }, { plan_need: 0.4 },
  { spontaneity: 0.7 }, { spontaneity: 1.0 },
];
OPTION_VALUES[9] = [
  { social_media: 0.9 }, { social_media: 0.4 },
  { home_preference: 0.5 }, { home_preference: 0.7 },
];
OPTION_VALUES[10] = [
  { food_focus: 0.4, food_social: 0.2 }, { food_focus: 0.3, novelty_seeking: 0.3 },
  { food_focus: 0.3, routine_need: 0.3 }, { food_focus: 0.3, humor_style: 0.3 },
  { depth_need: 0.5, memory_keeping: 0.3 }, { food_social: 0.3, social_energy: 0.2 },
  { humor_style: 0.5, food_social: 0.1 }, { novelty_seeking: 0.5, food_focus: 0.1 },
];
OPTION_VALUES[11] = [
  { energy_level: 0.9 }, { energy_level: 0.4 },
  { energy_level: 0.2 }, { home_preference: 0.5 },
];
OPTION_VALUES[12] = [
  { crowd_preference: 0.9 }, { crowd_preference: 0.4 },
  { depth_need: 0.6 }, { home_preference: 0.7 },
];
OPTION_VALUES[13] = [
  { outdoor_love: 0.9 }, { outdoor_love: 0.4 },
  { outdoor_love: 0.1 }, { home_preference: 0.5 },
];
OPTION_VALUES[14] = [
  { novelty_seeking: 0.9 }, { novelty_seeking: 0.3 },
  { routine_need: 0.7 }, { routine_need: 1.0 },
];
OPTION_VALUES[15] = [
  { humor_style: 0.5, social_energy: 0.2 }, { humor_style: 0.5, depth_need: 0.3 },
  { humor_style: 0.5, crowd_preference: 0.2 }, { humor_style: 0.5, memory_keeping: 0.2 },
  { humor_style: 0.4, food_focus: 0.1 }, { humor_style: 0.5, spontaneity: 0.2 },
  { humor_style: 0.3, home_preference: 0.3 }, { humor_style: 0.3, night_owl: 0.3 },
];
OPTION_VALUES[16] = [
  { memory_keeping: 0.9 }, { memory_keeping: 0.4 },
  { social_media: 0.7 }, { home_preference: 0.5 },
];
OPTION_VALUES[17] = [
  { food_social: 0.6 }, { food_social: 0.3, home_preference: 0.3 },
  { food_focus: 0.5, novelty_seeking: 0.2 }, { food_focus: 0.4, routine_need: 0.2 },
];
OPTION_VALUES[18] = [
  { night_owl: 0.9 }, { night_owl: 0.4 },
  { morning_person: 0.8 }, { morning_person: 0.9 },
];
OPTION_VALUES[19] = [
  { plan_need: 0.9 }, { plan_need: 0.4 },
  { spontaneity: 0.8 }, { spontaneity: 1.0 },
];
OPTION_VALUES[20] = [
  { home_preference: 0.9 }, { home_preference: 0.4 },
  { outdoor_love: 0.4 }, { social_energy: 0.5 },
];
OPTION_VALUES[21] = [
  { social_energy: 0.7 }, { social_energy: 0.4, depth_need: 0.3 },
  { depth_need: 0.6 }, { home_preference: 0.5 },
];
OPTION_VALUES[22] = [
  { weekend_activism: 0.9 }, { weekend_activism: 0.4 },
  { depth_need: 0.4 }, { home_preference: 0.5 },
];
OPTION_VALUES[23] = [
  { social_media: 0.9 }, { social_media: 0.4, memory_keeping: 0.3 },
  { home_preference: 0.5 }, { home_preference: 0.7 },
];
OPTION_VALUES[24] = [
  { energy_level: 0.7 }, { energy_level: 0.4 },
  { night_owl: 0.4 }, { home_preference: 0.6 },
];

const SPECIES = [
  { key: "weekend-dog",       family: "social",   weights: { weekend_activism: 1.2, outdoor_love: 0.5, home_preference: -0.4 } },
  { key: "weekend-missing",   family: "social",   weights: { home_preference: 1.0, weekend_activism: -0.5, outdoor_love: -0.3 } },
  { key: "city-guide",        family: "social",   weights: { novelty_seeking: 1.0, memory_keeping: 0.7, routine_need: -0.3 } },
  { key: "homebody",          family: "social",   weights: { home_preference: 1.2, crowd_preference: -0.5, outdoor_love: -0.5, social_energy: -0.3 } },
  { key: "social-peacock",    family: "social",   weights: { social_energy: 0.9, social_media: 0.8, home_preference: -0.3 } },
  { key: "party-king",        family: "social",   weights: { crowd_preference: 1.0, energy_level: 0.7, home_preference: -0.4 } },
  { key: "human-moments",     family: "social",   weights: { memory_keeping: 1.0, depth_need: 0.5, social_media: -0.3 } },
  { key: "life-documentary",  family: "social",   weights: { social_media: 0.9, memory_keeping: 0.7, weekend_activism: 0.3 } },
  { key: "deep-talk",         family: "social",   weights: { depth_need: 0.9, night_owl: 0.5, humor_style: -0.3 } },
  { key: "banter-artist",     family: "social",   weights: { humor_style: 1.0, social_energy: 0.5, depth_need: -0.3 } },
  { key: "invisible-mode",    family: "social",   weights: { home_preference: 1.2, social_energy: -0.8, social_media: -0.5, crowd_preference: -0.5 } },

  { key: "slow-cat",          family: "lifestyle", weights: { routine_need: 1.0, plan_need: 0.5, spontaneity: -0.5 } },
  { key: "social-cactus",     family: "lifestyle", weights: { depth_need: 1.0, crowd_preference: -0.5, social_energy: -0.3 } },
  { key: "cyber-social",      family: "lifestyle", weights: { social_media: 1.0, home_preference: 0.5, crowd_preference: -0.3 } },
  { key: "human-itinerary",   family: "lifestyle", weights: { plan_need: 1.0, routine_need: 0.5, spontaneity: -0.5 } },
  { key: "spontaneous-monster", family: "lifestyle", weights: { spontaneity: 1.2, plan_need: -0.5, routine_need: -0.5, novelty_seeking: 0.3 } },
  { key: "night-revive",      family: "lifestyle", weights: { night_owl: 1.0, morning_person: -0.5, depth_need: 0.5 } },
  { key: "night-low-power",   family: "lifestyle", weights: { morning_person: 1.0, night_owl: -0.5, routine_need: 0.5 } },
  { key: "dopamine-beast",    family: "lifestyle", weights: { novelty_seeking: 0.9, spontaneity: 0.5, routine_need: -0.5 } },
  { key: "outdoor-savage",    family: "lifestyle", weights: { outdoor_love: 1.0, morning_person: 0.5, home_preference: -0.5, weekend_activism: 0.3 } },

  { key: "dinner-engine",     family: "food",     weights: { food_focus: 1.0, food_social: 1.0, novelty_seeking: -0.3 } },
  { key: "food-hunter",       family: "food",     weights: { food_focus: 0.7, novelty_seeking: 0.7, routine_need: -0.3 } },
  { key: "cafe-resident",     family: "food",     weights: { food_focus: 0.5, routine_need: 0.5, depth_need: 0.5, home_preference: 0.3 } },
  { key: "happy-eater",       family: "food",     weights: { food_focus: 0.5, humor_style: 0.8, depth_need: -0.3 } },
];

function validateInput(answers) {
  if (!Array.isArray(answers) || answers.length !== 24)
    return { valid: false, error: "需要24道题目的答案" };
  for (let i = 0; i < 24; i++) {
    const a = answers[i];
    if (!a || typeof a.q !== "number" || !Array.isArray(a.options))
      return { valid: false, error: `第${i + 1}题答案格式错误` };
    if (a.q !== i + 1)
      return { valid: false, error: `第${i + 1}题序号不匹配` };
    const nOpts = i === 9 || i === 14 ? 8 : 4;
    for (const o of a.options) {
      if (typeof o !== "number" || o < 0 || o >= nOpts)
        return { valid: false, error: `第${i + 1}题选项值非法: ${o}` };
    }
    if (QUESTIONS[i].type === "single" && a.options.length > 1)
      return { valid: false, error: `第${i + 1}题为单选题，只能选1项` };
    if (QUESTIONS[i].type === "single" && a.options.length === 0)
      return { valid: false, error: `第${i + 1}题为单选题，必须选1项` };
    if (a.q === 10 && a.options.length > 3)
      return { valid: false, error: "Q10最多选3项" };
    if (a.q === 15 && a.options.length > 5)
      return { valid: false, error: "Q15最多选5项" };
  }
  return { valid: true };
}

function computeDimensions(answers) {
  const dims = {};
  DIMENSIONS.forEach(d => dims[d] = 0);
  for (const a of answers) {
    const values = OPTION_VALUES[a.q];
    if (!values) continue;
    for (const opt of a.options) {
      if (values[opt]) {
        for (const d of DIMENSIONS) {
          if (values[opt][d] !== undefined) dims[d] += values[opt][d];
        }
      }
    }
  }
  return dims;
}

function computeSpeciesScores(dims) {
  const scores = SPECIES.map(s => {
    let score = 0;
    for (const d of DIMENSIONS) {
      const w = s.weights[d] || 0;
      score += (dims[d] || 0) * w;
    }
    return { key: s.key, family: s.family, score: Math.round(score * 100) / 100 };
  });
  scores.sort((a, b) => b.score - a.score);
  return scores;
}

function getSecondarySpecies(scores, mainKey, mainFamily) {
  const secondary = [];
  for (const s of scores) {
    if (s.key === mainKey) continue;
    if (s.family !== mainFamily) {
      secondary.push(s.key);
      if (secondary.length >= 2) break;
    }
  }
  return secondary;
}

export function score(answers) {
  const validation = validateInput(answers);
  if (!validation.valid) return { valid: false, error: validation.error };
  const dims = computeDimensions(answers);
  const speciesScores = computeSpeciesScores(dims);
  const mainSpeciesKey = speciesScores[0].key;
  const mainSpecies = SPECIES.find(s => s.key === mainSpeciesKey);
  const secondarySpeciesKeys = getSecondarySpecies(speciesScores, mainSpeciesKey, mainSpecies.family);
  return { valid: true, dims, speciesScores, mainSpeciesKey, secondarySpeciesKeys };
}

export function validateAnswers(answers) {
  const result = validateInput(answers);
  if (!result.valid) throw new Error(result.error);
  return result;
}

export const VERSION = 'mvp-1.2-calibrated';
export { QUESTIONS, DIMENSIONS, SPECIES, OPTION_VALUES };