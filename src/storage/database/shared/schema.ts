import { sql } from "drizzle-orm";
import {
  pgTable,
  serial,
  varchar,
  text,
  timestamp,
  integer,
  jsonb,
  boolean,
  index,
  numeric,
  uniqueIndex,
} from "drizzle-orm/pg-core";

// ─── 系统表 ───
export const healthCheck = pgTable("health_check", {
  id: serial().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" }).defaultNow(),
});

// ─── 物种内容表 ───
export const speciesContent = pgTable(
  "species_content",
  {
    id: serial().notNull().primaryKey(),
    speciesKey: varchar("species_key", { length: 64 }).notNull().unique(),
    displayOrder: integer("display_order").notNull().default(0),
    name: varchar("name", { length: 128 }).notNull(),
    tagline: varchar("tagline", { length: 256 }).notNull(),
    description: text("description").notNull(),
    imageUrl: varchar("image_url", { length: 512 }).notNull(),
    buff: text("buff"),
    summonTags: text("summon_tags"),
    foodTags: text("food_tags"),
    howToGetAlong: text("how_to_get_along"),
    typicalSymptoms: text("typical_symptoms"),
    roast: text("roast"),
    family: varchar("family", { length: 64 }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("species_content_species_key_idx").on(table.speciesKey),
    index("species_content_family_idx").on(table.family),
  ]
);

// ─── 测试运行表 ───
export const testRuns = pgTable(
  "test_runs",
  {
    id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
    runTokenHash: varchar("run_token_hash", { length: 128 }).notNull(),
    testVersion: varchar("test_version", { length: 64 }).notNull().default("mvp-1.2"),
    scorerVersion: varchar("scorer_version", { length: 64 }),
    status: varchar("status", { length: 32 }).notNull().default("started"),
    mainSpeciesKey: varchar("main_species_key", { length: 64 }),
    secondarySpeciesKeys: jsonb("secondary_species_keys"),
    dimensionScores: jsonb("dimension_scores"),
    summonTags: text("summon_tags"),
    foodTags: text("food_tags"),
    shareCode: varchar("share_code", { length: 16 }),
    completedAt: timestamp("completed_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("test_runs_share_code_idx").on(table.shareCode),
    index("test_runs_status_idx").on(table.status),
    index("test_runs_created_at_idx").on(table.createdAt),
  ]
);

// ─── 测试答案表 ───
export const testAnswers = pgTable(
  "test_answers",
  {
    id: serial().notNull().primaryKey(),
    runId: varchar("run_id", { length: 36 })
      .notNull()
      .references(() => testRuns.id, { onDelete: "cascade" }),
    questionNumber: integer("question_number").notNull(),
    selectedOptions: jsonb("selected_options").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("test_answers_run_id_idx").on(table.runId),
    uniqueIndex("test_answers_run_question_idx").on(table.runId, table.questionNumber),
  ]
);

// ─── 永久结果快照表 ───
export const resultSnapshot = pgTable(
  "result_snapshot",
  {
    id: serial().notNull().primaryKey(),
    shareCode: varchar("share_code", { length: 16 })
      .notNull()
      .unique()
      .references(() => testRuns.shareCode, { onDelete: "cascade" }),
    runId: varchar("run_id", { length: 36 })
      .notNull()
      .unique()
      .references(() => testRuns.id, { onDelete: "cascade" }),
    snapshot: jsonb("snapshot").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("result_snapshot_share_code_idx").on(table.shareCode),
    index("result_snapshot_run_id_idx").on(table.runId),
  ]
);

// ─── 反馈表 ───
export const feedback = pgTable(
  "feedback",
  {
    id: serial().notNull().primaryKey(),
    runId: varchar("run_id", { length: 36 })
      .notNull()
      .unique()
      .references(() => testRuns.id, { onDelete: "cascade" }),
    feedbackValue: integer("feedback_value").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [index("feedback_run_id_idx").on(table.runId)]
);