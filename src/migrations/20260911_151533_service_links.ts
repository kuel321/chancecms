import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`billing_offers\` ADD \`slug\` text;`)
  await db.run(sql`CREATE UNIQUE INDEX \`billing_offers_slug_idx\` ON \`billing_offers\` (\`slug\`);`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP INDEX \`billing_offers_slug_idx\`;`)
  await db.run(sql`ALTER TABLE \`billing_offers\` DROP COLUMN \`slug\`;`)
}
