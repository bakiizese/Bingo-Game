import { sqliteTable, text } from "drizzle-orm/sqlite-core";

export const boards = sqliteTable("boards", {
  id: text("id").primaryKey().notNull(),
  B: text("B").notNull(),
  I: text("I").notNull(),
  N: text("N").notNull(),
  G: text("G").notNull(),
  O: text("O").notNull(),
});

export type Kboard = typeof boards.$inferSelect;

// export const tasks = sqliteTable("tasks", {
//   id: integer("id").primaryKey({ autoIncrement: true }),
//   name: text("name").notNull(),
// });

// export type Task = typeof tasks.$inferSelect;
