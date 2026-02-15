/*
  Warnings:

  - The `type` column on the `Request` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `status` on the `Request` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Request" DROP COLUMN "status",
ADD COLUMN     "status" TEXT NOT NULL,
DROP COLUMN "type",
ADD COLUMN     "type" TEXT;

-- DropEnum
DROP TYPE "RequestStatus";

-- DropEnum
DROP TYPE "RequestType";

-- CreateIndex
CREATE INDEX "Request_status_type_created_at_idx" ON "Request"("status", "type", "created_at");
