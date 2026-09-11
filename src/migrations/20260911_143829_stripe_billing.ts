import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`billing_offers\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text NOT NULL,
  	\`description\` text,
  	\`stripe_price_i_d\` text NOT NULL,
  	\`active\` integer DEFAULT false,
  	\`sort_order\` numeric DEFAULT 0,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX \`billing_offers_updated_at_idx\` ON \`billing_offers\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`billing_offers_created_at_idx\` ON \`billing_offers\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`billing_invoices\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text NOT NULL,
  	\`kind\` text DEFAULT 'invoice' NOT NULL,
  	\`customer_name\` text NOT NULL,
  	\`customer_email\` text NOT NULL,
  	\`amount\` numeric NOT NULL,
  	\`days_until_due\` numeric DEFAULT 30 NOT NULL,
  	\`status\` text DEFAULT 'draft',
  	\`stripe_customer_i_d\` text,
  	\`stripe_invoice_i_d\` text,
  	\`hosted_invoice_u_r_l\` text,
  	\`operation_key\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`billing_invoices_stripe_invoice_i_d_idx\` ON \`billing_invoices\` (\`stripe_invoice_i_d\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`billing_invoices_operation_key_idx\` ON \`billing_invoices\` (\`operation_key\`);`)
  await db.run(sql`CREATE INDEX \`billing_invoices_updated_at_idx\` ON \`billing_invoices\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`billing_invoices_created_at_idx\` ON \`billing_invoices\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`billing_payments\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`stripe_session_i_d\` text NOT NULL,
  	\`offer_title\` text,
  	\`customer_email\` text,
  	\`stripe_customer_i_d\` text,
  	\`stripe_payment_intent_i_d\` text,
  	\`stripe_subscription_i_d\` text,
  	\`amount\` numeric,
  	\`currency\` text,
  	\`status\` text,
  	\`livemode\` integer,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`billing_payments_stripe_session_i_d_idx\` ON \`billing_payments\` (\`stripe_session_i_d\`);`)
  await db.run(sql`CREATE INDEX \`billing_payments_stripe_customer_i_d_idx\` ON \`billing_payments\` (\`stripe_customer_i_d\`);`)
  await db.run(sql`CREATE INDEX \`billing_payments_stripe_payment_intent_i_d_idx\` ON \`billing_payments\` (\`stripe_payment_intent_i_d\`);`)
  await db.run(sql`CREATE INDEX \`billing_payments_stripe_subscription_i_d_idx\` ON \`billing_payments\` (\`stripe_subscription_i_d\`);`)
  await db.run(sql`CREATE INDEX \`billing_payments_updated_at_idx\` ON \`billing_payments\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`billing_payments_created_at_idx\` ON \`billing_payments\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`billing_subscriptions\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`stripe_subscription_i_d\` text NOT NULL,
  	\`stripe_customer_i_d\` text NOT NULL,
  	\`status\` text NOT NULL,
  	\`stripe_price_i_d\` text,
  	\`cancel_at_period_end\` integer,
  	\`livemode\` integer,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`billing_subscriptions_stripe_subscription_i_d_idx\` ON \`billing_subscriptions\` (\`stripe_subscription_i_d\`);`)
  await db.run(sql`CREATE INDEX \`billing_subscriptions_stripe_customer_i_d_idx\` ON \`billing_subscriptions\` (\`stripe_customer_i_d\`);`)
  await db.run(sql`CREATE INDEX \`billing_subscriptions_updated_at_idx\` ON \`billing_subscriptions\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`billing_subscriptions_created_at_idx\` ON \`billing_subscriptions\` (\`created_at\`);`)
  await db.run(sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`billing_offers_id\` integer REFERENCES billing_offers(id);`)
  await db.run(sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`billing_invoices_id\` integer REFERENCES billing_invoices(id);`)
  await db.run(sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`billing_payments_id\` integer REFERENCES billing_payments(id);`)
  await db.run(sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`billing_subscriptions_id\` integer REFERENCES billing_subscriptions(id);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_billing_offers_id_idx\` ON \`payload_locked_documents_rels\` (\`billing_offers_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_billing_invoices_id_idx\` ON \`payload_locked_documents_rels\` (\`billing_invoices_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_billing_payments_id_idx\` ON \`payload_locked_documents_rels\` (\`billing_payments_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_billing_subscriptions_id_idx\` ON \`payload_locked_documents_rels\` (\`billing_subscriptions_id\`);`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`billing_offers\`;`)
  await db.run(sql`DROP TABLE \`billing_invoices\`;`)
  await db.run(sql`DROP TABLE \`billing_payments\`;`)
  await db.run(sql`DROP TABLE \`billing_subscriptions\`;`)
  await db.run(sql`PRAGMA foreign_keys=OFF;`)
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
  	FOREIGN KEY (\`redirects_id\`) REFERENCES \`redirects\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`forms_id\`) REFERENCES \`forms\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`form_submissions_id\`) REFERENCES \`form_submissions\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`search_id\`) REFERENCES \`search\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`payload_folders_id\`) REFERENCES \`payload_folders\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_payload_locked_documents_rels\`("id", "order", "parent_id", "path", "pages_id", "posts_id", "projects_id", "media_id", "categories_id", "users_id", "client_files_id", "galleries_id", "redirects_id", "forms_id", "form_submissions_id", "search_id", "payload_folders_id") SELECT "id", "order", "parent_id", "path", "pages_id", "posts_id", "projects_id", "media_id", "categories_id", "users_id", "client_files_id", "galleries_id", "redirects_id", "forms_id", "form_submissions_id", "search_id", "payload_folders_id" FROM \`payload_locked_documents_rels\`;`)
  await db.run(sql`DROP TABLE \`payload_locked_documents_rels\`;`)
  await db.run(sql`ALTER TABLE \`__new_payload_locked_documents_rels\` RENAME TO \`payload_locked_documents_rels\`;`)
  await db.run(sql`PRAGMA foreign_keys=ON;`)
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
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_redirects_id_idx\` ON \`payload_locked_documents_rels\` (\`redirects_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_forms_id_idx\` ON \`payload_locked_documents_rels\` (\`forms_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_form_submissions_id_idx\` ON \`payload_locked_documents_rels\` (\`form_submissions_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_search_id_idx\` ON \`payload_locked_documents_rels\` (\`search_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_payload_folders_id_idx\` ON \`payload_locked_documents_rels\` (\`payload_folders_id\`);`)
}
