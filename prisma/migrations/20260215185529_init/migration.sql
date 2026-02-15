-- CreateEnum
CREATE TYPE "RequestStatus" AS ENUM ('success', 'failed');

-- CreateEnum
CREATE TYPE "RequestType" AS ENUM ('line', 'bar', 'bar-grouped', 'pie', 'funnel');

-- CreateTable
CREATE TABLE "Request" (
    "id" TEXT NOT NULL,
    "input_text" TEXT NOT NULL,
    "title" TEXT,
    "status" "RequestStatus" NOT NULL,
    "type" "RequestType",
    "config" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Request_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Request_status_type_created_at_idx" ON "Request"("status", "type", "created_at");

-- CreateIndex
CREATE INDEX "Request_title_idx" ON "Request"("title");
