import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`quotes_add_ons\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`label\` text NOT NULL,
  	\`in_kind_type\` text DEFAULT 'volunteer',
  	\`price\` numeric,
  	\`description\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`quotes\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`quotes_add_ons_order_idx\` ON \`quotes_add_ons\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`quotes_add_ons_parent_id_idx\` ON \`quotes_add_ons\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`quotes\` (
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
  	\`donation_statement\` text DEFAULT 'All services listed as volunteer were performed personally by the contributor, on personal time and without compensation. Uncompensated volunteer personal services are not a contribution under W. Va. Code §3-8-1a, so they carry no value. No corporation or business, including any business owned by the contributor, provided, paid for, or supplied equipment or software for this work. Any item listed with a dollar amount is an in-kind contribution from the contributor, valued at fair market value.',
  	\`show_received_by\` integer DEFAULT true,
  	\`signature_id\` integer,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`signature_id\`) REFERENCES \`signatures\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`quotes_quote_number_idx\` ON \`quotes\` (\`quote_number\`);`)
  await db.run(sql`CREATE INDEX \`quotes_signature_idx\` ON \`quotes\` (\`signature_id\`);`)
  await db.run(sql`CREATE INDEX \`quotes_updated_at_idx\` ON \`quotes\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`quotes_created_at_idx\` ON \`quotes\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`signatures\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`name\` text NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`url\` text,
  	\`thumbnail_u_r_l\` text,
  	\`filename\` text,
  	\`mime_type\` text,
  	\`filesize\` numeric,
  	\`width\` numeric,
  	\`height\` numeric,
  	\`focal_x\` numeric,
  	\`focal_y\` numeric
  );
  `)
  await db.run(sql`CREATE INDEX \`signatures_updated_at_idx\` ON \`signatures\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`signatures_created_at_idx\` ON \`signatures\` (\`created_at\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`signatures_filename_idx\` ON \`signatures\` (\`filename\`);`)
  await db.run(sql`ALTER TABLE \`users\` ADD \`signature_id\` integer REFERENCES signatures(id);`)
  await db.run(sql`CREATE INDEX \`users_signature_idx\` ON \`users\` (\`signature_id\`);`)
  await db.run(sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`quotes_id\` integer REFERENCES quotes(id);`)
  await db.run(sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`signatures_id\` integer REFERENCES signatures(id);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_quotes_id_idx\` ON \`payload_locked_documents_rels\` (\`quotes_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_signatures_id_idx\` ON \`payload_locked_documents_rels\` (\`signatures_id\`);`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`quotes_add_ons\`;`)
  await db.run(sql`DROP TABLE \`quotes\`;`)
  await db.run(sql`DROP TABLE \`signatures\`;`)
  await db.run(sql`PRAGMA foreign_keys=OFF;`)
  await db.run(sql`CREATE TABLE \`__new_users\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`name\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`email\` text NOT NULL,
  	\`reset_password_token\` text,
  	\`reset_password_expiration\` text,
  	\`salt\` text,
  	\`hash\` text,
  	\`login_attempts\` numeric DEFAULT 0,
  	\`lock_until\` text
  );
  `)
  await db.run(sql`INSERT INTO \`__new_users\`("id", "name", "updated_at", "created_at", "email", "reset_password_token", "reset_password_expiration", "salt", "hash", "login_attempts", "lock_until") SELECT "id", "name", "updated_at", "created_at", "email", "reset_password_token", "reset_password_expiration", "salt", "hash", "login_attempts", "lock_until" FROM \`users\`;`)
  await db.run(sql`DROP TABLE \`users\`;`)
  await db.run(sql`ALTER TABLE \`__new_users\` RENAME TO \`users\`;`)
  await db.run(sql`PRAGMA foreign_keys=ON;`)
  await db.run(sql`CREATE INDEX \`users_updated_at_idx\` ON \`users\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`users_created_at_idx\` ON \`users\` (\`created_at\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`users_email_idx\` ON \`users\` (\`email\`);`)
  await db.run(sql`CREATE TABLE \`__new_payload_locked_documents_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`pages_id\` integer,
  	\`posts_id\` integer,
  	\`projects_id\` integer,
  	\`media_id\` integer,
  	\`categories_id\` integer,
  	\`users_id\` integer,
  	\`client_files_id\` integer,
  	\`galleries_id\` integer,
  	\`billing_offers_id\` integer,
  	\`billing_invoices_id\` integer,
  	\`billing_payments_id\` integer,
  	\`billing_subscriptions_id\` integer,
  	\`redirects_id\` integer,
  	\`forms_id\` integer,
  	\`form_submissions_id\` integer,
  	\`search_id\` integer,
  	\`payload_folders_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`payload_locked_documents\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`pages_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`posts_id\`) REFERENCES \`posts\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`projects_id\`) REFERENCES \`projects\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`media_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`categories_id\`) REFERENCES \`categories\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`client_files_id\`) REFERENCES \`client_files\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`galleries_id\`) REFERENCES \`galleries\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`billing_offers_id\`) REFERENCES \`billing_offers\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`billing_invoices_id\`) REFERENCES \`billing_invoices\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`billing_payments_id\`) REFERENCES \`billing_payments\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`billing_subscriptions_id\`) REFERENCES \`billing_subscriptions\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`redirects_id\`) REFERENCES \`redirects\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`forms_id\`) REFERENCES \`forms\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`form_submissions_id\`) REFERENCES \`form_submissions\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`search_id\`) REFERENCES \`search\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`payload_folders_id\`) REFERENCES \`payload_folders\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_payload_locked_documents_rels\`("id", "order", "parent_id", "path", "pages_id", "posts_id", "projects_id", "media_id", "categories_id", "users_id", "client_files_id", "galleries_id", "billing_offers_id", "billing_invoices_id", "billing_payments_id", "billing_subscriptions_id", "redirects_id", "forms_id", "form_submissions_id", "search_id", "payload_folders_id") SELECT "id", "order", "parent_id", "path", "pages_id", "posts_id", "projects_id", "media_id", "categories_id", "users_id", "client_files_id", "galleries_id", "billing_offers_id", "billing_invoices_id", "billing_payments_id", "billing_subscriptions_id", "redirects_id", "forms_id", "form_submissions_id", "search_id", "payload_folders_id" FROM \`payload_locked_documents_rels\`;`)
  await db.run(sql`DROP TABLE \`payload_locked_documents_rels\`;`)
  await db.run(sql`ALTER TABLE \`__new_payload_locked_documents_rels\` RENAME TO \`payload_locked_documents_rels\`;`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_order_idx\` ON \`payload_locked_documents_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_parent_idx\` ON \`payload_locked_documents_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_path_idx\` ON \`payload_locked_documents_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_pages_id_idx\` ON \`payload_locked_documents_rels\` (\`pages_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_posts_id_idx\` ON \`payload_locked_documents_rels\` (\`posts_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_projects_id_idx\` ON \`payload_locked_documents_rels\` (\`projects_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_media_id_idx\` ON \`payload_locked_documents_rels\` (\`media_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_categories_id_idx\` ON \`payload_locked_documents_rels\` (\`categories_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_users_id_idx\` ON \`payload_locked_documents_rels\` (\`users_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_client_files_id_idx\` ON \`payload_locked_documents_rels\` (\`client_files_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_galleries_id_idx\` ON \`payload_locked_documents_rels\` (\`galleries_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_billing_offers_id_idx\` ON \`payload_locked_documents_rels\` (\`billing_offers_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_billing_invoices_id_idx\` ON \`payload_locked_documents_rels\` (\`billing_invoices_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_billing_payments_id_idx\` ON \`payload_locked_documents_rels\` (\`billing_payments_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_billing_subscriptions_id_idx\` ON \`payload_locked_documents_rels\` (\`billing_subscriptions_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_redirects_id_idx\` ON \`payload_locked_documents_rels\` (\`redirects_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_forms_id_idx\` ON \`payload_locked_documents_rels\` (\`forms_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_form_submissions_id_idx\` ON \`payload_locked_documents_rels\` (\`form_submissions_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_search_id_idx\` ON \`payload_locked_documents_rels\` (\`search_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_payload_folders_id_idx\` ON \`payload_locked_documents_rels\` (\`payload_folders_id\`);`)
}
