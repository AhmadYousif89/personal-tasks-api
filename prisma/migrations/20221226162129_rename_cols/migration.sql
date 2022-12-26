/*
  Warnings:

  - You are about to drop the column `isRegistered` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `rT` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "tasks" ALTER COLUMN "id" SET DEFAULT (concat('tsk_', gen_random_uuid()))::TEXT;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "isRegistered",
DROP COLUMN "rT",
ADD COLUMN     "refresh" TEXT,
ADD COLUMN     "registered" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "id" SET DEFAULT (concat('usr_', gen_random_uuid()))::TEXT;
