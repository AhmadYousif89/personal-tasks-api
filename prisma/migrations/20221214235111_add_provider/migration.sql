-- AlterTable
ALTER TABLE "tasks" ALTER COLUMN "id" SET DEFAULT (concat('tsk_', gen_random_uuid()))::TEXT;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "provider" TEXT DEFAULT 'No_Provider',
ALTER COLUMN "id" SET DEFAULT (concat('usr_', gen_random_uuid()))::TEXT;
