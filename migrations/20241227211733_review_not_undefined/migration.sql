/*
  Warnings:

  - Made the column `customer_id` on table `reviews` required. This step will fail if there are existing NULL values in that column.
  - Made the column `booking_id` on table `reviews` required. This step will fail if there are existing NULL values in that column.
  - Made the column `comment` on table `reviews` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "reviews" ALTER COLUMN "customer_id" SET NOT NULL,
ALTER COLUMN "booking_id" SET NOT NULL,
ALTER COLUMN "comment" SET NOT NULL;
