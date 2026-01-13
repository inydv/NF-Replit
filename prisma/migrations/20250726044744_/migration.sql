-- CreateEnum
CREATE TYPE "AccessPages" AS ENUM ('JOBS', 'COMPANIES', 'USERS', 'BLOGS');

-- AlterTable
ALTER TABLE "Tokens" ADD COLUMN     "accessPages" "AccessPages"[];

-- AlterTable
ALTER TABLE "Users" ADD COLUMN     "accessPages" "AccessPages"[];
