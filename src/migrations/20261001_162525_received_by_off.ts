import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`PRAGMA foreign_keys=OFF;`)
  await db.run(sql`CREATE TABLE \`__new_quotes\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text NOT NULL,
  	\`quote_number\` text,
  	\`kind\` text DEFAULT 'business' NOT NULL,
  	\`status\` text DEFAULT 'draft' NOT NULL,
  	\`issue_date\` text NOT NULL,
  	\`election\` text,
  	\`valid_until\` text,
  	\`total\` numeric,
  	\`donor_name\` text,
  	\`donor_email\` text,
  	\`donor_address\` text,
  	\`donor_occupation\` text,
  	\`donor_employer\` text,
  	\`client_name\` text NOT NULL,
  	\`client_company\` text,
  	\`client_email\` text,
  	\`project_type\` text DEFAULT 'website',
  	\`work_description\` text,
  	\`show_estimated_value\` integer DEFAULT false,
  	\`estimated_value\` numeric,
  	\`package\` text DEFAULT 'launch' NOT NULL,
  	\`package_price\` numeric,
  	\`pages\` numeric,
  	\`photography\` integer,
  	\`discount\` numeric,
  	\`discount_label\` text,
  	\`include_care_plan\` integer DEFAULT true,
  	\`care_plan_price\` numeric,
  	\`notes\` text,
  	\`terms\` text DEFAULT 'A 50% deposit is due to begin work, with the balance due at launch. Hosting & Support is billed monthly starting at launch and can be cancelled anytime.',
  	\`donation_statement\` text DEFAULT 'All services listed as volunteer were performed personally by the contributor, on personal time and without compensation.',
  	\`show_received_by\` integer DEFAULT false,
  	\`signature_id\` integer,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`signature_id\`) REFERENCES \`signatures\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`INSERT INTO \`__new_quotes\`("id", "title", "quote_number", "kind", "status", "issue_date", "election", "valid_until", "total", "donor_name", "donor_email", "donor_address", "donor_occupation", "donor_employer", "client_name", "client_company", "client_email", "project_type", "work_description", "show_estimated_value", "estimated_value", "package", "package_price", "pages", "photography", "discount", "discount_label", "include_care_plan", "care_plan_price", "notes", "terms", "donation_statement", "show_received_by", "signature_id", "updated_at", "created_at") SELECT "id", "title", "quote_number", "kind", "status", "issue_date", "election", "valid_until", "total", "donor_name", "donor_email", "donor_address", "donor_occupation", "donor_employer", "client_name", "client_company", "client_email", "project_type", "work_description", "show_estimated_value", "estimated_value", "package", "package_price", "pages", "photography", "discount", "discount_label", "include_care_plan", "care_plan_price", "notes", "terms", "donation_statement", "show_received_by", "signature_id", "updated_at", "created_at" FROM \`quotes\`;`)
  await db.run(sql`DROP TABLE \`quotes\`;`)
  await db.run(sql`ALTER TABLE \`__new_quotes\` RENAME TO \`quotes\`;`)
  await db.run(sql`PRAGMA foreign_keys=ON;`)
  await db.run(sql`CREATE UNIQUE INDEX \`quotes_quote_number_idx\` ON \`quotes\` (\`quote_number\`);`)
  await db.run(sql`CREATE INDEX \`quotes_signature_idx\` ON \`quotes\` (\`signature_id\`);`)
  await db.run(sql`CREATE INDEX \`quotes_updated_at_idx\` ON \`quotes\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`quotes_created_at_idx\` ON \`quotes\` (\`created_at\`);`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`PRAGMA foreign_keys=OFF;`)
  await db.run(sql`CREATE TABLE \`__new_quotes\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text NOT NULL,
  	\`quote_number\` text,
  	\`kind\` text DEFAULT 'business' NOT NULL,
  	\`status\` text DEFAULT 'draft' NOT NULL,
  	\`issue_date\` text NOT NULL,
  	\`election\` text,
  	\`valid_until\` text,
  	\`total\` numeric,
  	\`donor_name\` text,
  	\`donor_email\` text,
  	\`donor_address\` text,
  	\`donor_occupation\` text,
  	\`donor_employer\` text,
  	\`client_name\` text NOT NULL,
  	\`client_company\` text,
  	\`client_email\` text,
  	\`project_type\` text DEFAULT 'website',
  	\`work_description\` text,
  	\`show_estimated_value\` integer DEFAULT false,
  	\`estimated_value\` numeric,
  	\`package\` text DEFAULT 'launch' NOT NULL,
  	\`package_price\` numeric,
  	\`pages\` numeric,
  	\`photography\` integer,
  	\`discount\` numeric,
  	\`discount_label\` text,
  	\`include_care_plan\` integer DEFAULT true,
  	\`care_plan_price\` numeric,
  	\`notes\` text,
  	\`terms\` text DEFAULT 'A 50% deposit is due to begin work, with the balance due at launch. Hosting & Support is billed monthly starting at launch and can be cancelled anytime.',
  	\`donation_statement\` text DEFAULT 'All services listed as volunteer were performed personally by the contributor, on personal time and without compensation.',
  	\`show_received_by\` integer DEFAULT true,
  	\`signature_id\` integer,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`signature_id\`) REFERENCES \`signatures\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`INSERT INTO \`__new_quotes\`("id", "title", "quote_number", "kind", "status", "issue_date", "election", "valid_until", "total", "donor_name", "donor_email", "donor_address", "donor_occupation", "donor_employer", "client_name", "client_company", "client_email", "project_type", "work_description", "show_estimated_value", "estimated_value", "package", "package_price", "pages", "photography", "discount", "discount_label", "include_care_plan", "care_plan_price", "notes", "terms", "donation_statement", "show_received_by", "signature_id", "updated_at", "created_at") SELECT "id", "title", "quote_number", "kind", "status", "issue_date", "election", "valid_until", "total", "donor_name", "donor_email", "donor_address", "donor_occupation", "donor_employer", "client_name", "client_company", "client_email", "project_type", "work_description", "show_estimated_value", "estimated_value", "package", "package_price", "pages", "photography", "discount", "discount_label", "include_care_plan", "care_plan_price", "notes", "terms", "donation_statement", "show_received_by", "signature_id", "updated_at", "created_at" FROM \`quotes\`;`)
  await db.run(sql`DROP TABLE \`quotes\`;`)
  await db.run(sql`ALTER TABLE \`__new_quotes\` RENAME TO \`quotes\`;`)
  await db.run(sql`PRAGMA foreign_keys=ON;`)
  await db.run(sql`CREATE UNIQUE INDEX \`quotes_quote_number_idx\` ON \`quotes\` (\`quote_number\`);`)
  await db.run(sql`CREATE INDEX \`quotes_signature_idx\` ON \`quotes\` (\`signature_id\`);`)
  await db.run(sql`CREATE INDEX \`quotes_updated_at_idx\` ON \`quotes\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`quotes_created_at_idx\` ON \`quotes\` (\`created_at\`);`)
}
