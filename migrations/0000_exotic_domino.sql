CREATE TABLE "activities" (
	"id" serial PRIMARY KEY NOT NULL,
	"type" text NOT NULL,
	"description" text NOT NULL,
	"user_id" text,
	"system_id" text,
	"timestamp" timestamp DEFAULT now(),
	"metadata" jsonb
);
--> statement-breakpoint
CREATE TABLE "ai_systems" (
	"id" serial PRIMARY KEY NOT NULL,
	"system_id" text NOT NULL,
	"name" text NOT NULL,
	"vendor" text,
	"department" text NOT NULL,
	"risk_level" text NOT NULL,
	"risk_score" integer,
	"implementation_date" timestamp,
	"last_assessment_date" timestamp,
	"doc_completeness" integer DEFAULT 0,
	"training_completeness" integer DEFAULT 0,
	"description" text,
	"status" text DEFAULT 'active',
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"created_by" text,
	CONSTRAINT "ai_systems_system_id_unique" UNIQUE("system_id")
);
--> statement-breakpoint
CREATE TABLE "alerts" (
	"id" serial PRIMARY KEY NOT NULL,
	"type" text NOT NULL,
	"severity" text NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"system_id" text,
	"created_at" timestamp DEFAULT now(),
	"is_resolved" boolean DEFAULT false
);
--> statement-breakpoint
CREATE TABLE "deadlines" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"date" timestamp NOT NULL,
	"type" text,
	"related_system_id" text
);
--> statement-breakpoint
CREATE TABLE "departments" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"compliance_score" integer DEFAULT 0,
	CONSTRAINT "departments_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "documents" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"type" text NOT NULL,
	"system_id" text,
	"content" text,
	"version" text,
	"status" text DEFAULT 'draft',
	"created_by" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "risk_assessments" (
	"id" serial PRIMARY KEY NOT NULL,
	"assessment_id" text NOT NULL,
	"system_id" text NOT NULL,
	"assessment_date" timestamp DEFAULT now(),
	"status" text DEFAULT 'completed' NOT NULL,
	"risk_level" text NOT NULL,
	"risk_score" integer,
	"system_category" text,
	"prohibited_use_checks" jsonb,
	"eu_ai_act_articles" jsonb,
	"compliance_gaps" jsonb,
	"remediation_actions" jsonb,
	"evidence_documents" jsonb,
	"summary_notes" text,
	"created_by" text,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "risk_assessments_assessment_id_unique" UNIQUE("assessment_id")
);
--> statement-breakpoint
CREATE TABLE "training_modules" (
	"id" serial PRIMARY KEY NOT NULL,
	"module_id" text NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"estimated_time" text NOT NULL,
	"topics" jsonb NOT NULL,
	"role_relevance" jsonb NOT NULL,
	"content" jsonb NOT NULL,
	"order" integer NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "training_modules_module_id_unique" UNIQUE("module_id")
);
--> statement-breakpoint
CREATE TABLE "training_progress" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"module_id" text NOT NULL,
	"completion" integer DEFAULT 0,
	"assessment_score" integer,
	"last_attempt_date" timestamp,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"uid" text NOT NULL,
	"username" text NOT NULL,
	"email" text NOT NULL,
	"password" text NOT NULL,
	"display_name" text,
	"role" text DEFAULT 'user',
	"department" text,
	"photo_url" text,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "users_uid_unique" UNIQUE("uid"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "activities" ADD CONSTRAINT "activities_user_id_users_uid_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("uid") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "activities" ADD CONSTRAINT "activities_system_id_ai_systems_system_id_fk" FOREIGN KEY ("system_id") REFERENCES "public"."ai_systems"("system_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ai_systems" ADD CONSTRAINT "ai_systems_created_by_users_uid_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("uid") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "alerts" ADD CONSTRAINT "alerts_system_id_ai_systems_system_id_fk" FOREIGN KEY ("system_id") REFERENCES "public"."ai_systems"("system_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "deadlines" ADD CONSTRAINT "deadlines_related_system_id_ai_systems_system_id_fk" FOREIGN KEY ("related_system_id") REFERENCES "public"."ai_systems"("system_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "documents" ADD CONSTRAINT "documents_system_id_ai_systems_system_id_fk" FOREIGN KEY ("system_id") REFERENCES "public"."ai_systems"("system_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "documents" ADD CONSTRAINT "documents_created_by_users_uid_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("uid") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "risk_assessments" ADD CONSTRAINT "risk_assessments_system_id_ai_systems_system_id_fk" FOREIGN KEY ("system_id") REFERENCES "public"."ai_systems"("system_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "risk_assessments" ADD CONSTRAINT "risk_assessments_created_by_users_uid_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("uid") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "training_progress" ADD CONSTRAINT "training_progress_user_id_users_uid_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("uid") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "training_progress" ADD CONSTRAINT "training_progress_module_id_training_modules_module_id_fk" FOREIGN KEY ("module_id") REFERENCES "public"."training_modules"("module_id") ON DELETE no action ON UPDATE no action;