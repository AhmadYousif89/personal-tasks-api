-- AlterTable
ALTER TABLE "tasks" ALTER COLUMN "id" SET DEFAULT (concat('tsk_', gen_random_uuid()))::TEXT;

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "id" SET DEFAULT (concat('usr_', gen_random_uuid()))::TEXT,
ALTER COLUMN "provider" SET DEFAULT 'No provider';
