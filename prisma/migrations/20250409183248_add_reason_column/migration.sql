/*
  Warnings:

  - Added the required column `reason` to the `account_deletion_requests` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "account_deletion_requests" ADD COLUMN     "reason" TEXT NOT NULL;
