-- AlterTable
ALTER TABLE "User" ADD COLUMN     "lastLogin" TIMESTAMP(3),
ADD COLUMN     "lockedUntil" TIMESTAMP(3);
