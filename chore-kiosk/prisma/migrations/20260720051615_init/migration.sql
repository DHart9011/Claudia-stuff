-- CreateEnum
CREATE TYPE "WeekStart" AS ENUM ('SUNDAY', 'MONDAY');

-- CreateEnum
CREATE TYPE "ProfileRole" AS ENUM ('PARENT', 'KID');

-- CreateEnum
CREATE TYPE "WeekPeriodStatus" AS ENUM ('ACTIVE', 'PENDING_PAYOUT', 'SETTLED');

-- CreateEnum
CREATE TYPE "ChoreClaimStatus" AS ENUM ('CLAIMED', 'COMPLETED', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "PayoutStatus" AS ENUM ('DRAFT', 'SENT_TO_QUICKBOOKS', 'SETTLED');

-- CreateEnum
CREATE TYPE "QuickBooksEnvironment" AS ENUM ('SANDBOX', 'PRODUCTION');

-- CreateTable
CREATE TABLE "Household" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "timezone" TEXT NOT NULL DEFAULT 'America/New_York',
    "weekStart" "WeekStart" NOT NULL DEFAULT 'SUNDAY',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Household_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Profile" (
    "id" TEXT NOT NULL,
    "householdId" TEXT NOT NULL,
    "role" "ProfileRole" NOT NULL,
    "name" TEXT NOT NULL,
    "avatarEmoji" TEXT NOT NULL DEFAULT '🙂',
    "avatarColor" TEXT NOT NULL DEFAULT '#6366f1',
    "pinHash" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "quickbooksVendorId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Chore" (
    "id" TEXT NOT NULL,
    "householdId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "valueCents" INTEGER NOT NULL,
    "isRecurring" BOOLEAN NOT NULL DEFAULT true,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Chore_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WeekPeriod" (
    "id" TEXT NOT NULL,
    "householdId" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "status" "WeekPeriodStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WeekPeriod_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChoreClaim" (
    "id" TEXT NOT NULL,
    "choreId" TEXT NOT NULL,
    "weekPeriodId" TEXT NOT NULL,
    "kidId" TEXT NOT NULL,
    "status" "ChoreClaimStatus" NOT NULL DEFAULT 'CLAIMED',
    "claimedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    "decidedAt" TIMESTAMP(3),
    "decidedById" TEXT,
    "awardedValueCents" INTEGER,
    "decisionNote" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ChoreClaim_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PayoutSummary" (
    "id" TEXT NOT NULL,
    "weekPeriodId" TEXT NOT NULL,
    "status" "PayoutStatus" NOT NULL DEFAULT 'DRAFT',
    "generatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "settledAt" TIMESTAMP(3),

    CONSTRAINT "PayoutSummary_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PayoutLineItem" (
    "id" TEXT NOT NULL,
    "payoutSummaryId" TEXT NOT NULL,
    "kidId" TEXT NOT NULL,
    "totalCents" INTEGER NOT NULL,
    "quickbooksBillId" TEXT,
    "quickbooksSyncStatus" TEXT NOT NULL DEFAULT 'NOT_SYNCED',

    CONSTRAINT "PayoutLineItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuickBooksConnection" (
    "id" TEXT NOT NULL,
    "householdId" TEXT NOT NULL,
    "environment" "QuickBooksEnvironment" NOT NULL DEFAULT 'SANDBOX',
    "realmId" TEXT NOT NULL,
    "encryptedAccessToken" TEXT NOT NULL,
    "encryptedRefreshToken" TEXT NOT NULL,
    "accessTokenExpiresAt" TIMESTAMP(3) NOT NULL,
    "refreshTokenExpiresAt" TIMESTAMP(3) NOT NULL,
    "connectedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "QuickBooksConnection_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Profile_householdId_role_idx" ON "Profile"("householdId", "role");

-- CreateIndex
CREATE INDEX "Chore_householdId_active_idx" ON "Chore"("householdId", "active");

-- CreateIndex
CREATE INDEX "WeekPeriod_householdId_status_idx" ON "WeekPeriod"("householdId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "WeekPeriod_householdId_startDate_key" ON "WeekPeriod"("householdId", "startDate");

-- CreateIndex
CREATE INDEX "ChoreClaim_weekPeriodId_status_idx" ON "ChoreClaim"("weekPeriodId", "status");

-- CreateIndex
CREATE INDEX "ChoreClaim_kidId_weekPeriodId_idx" ON "ChoreClaim"("kidId", "weekPeriodId");

-- CreateIndex
CREATE INDEX "ChoreClaim_choreId_weekPeriodId_idx" ON "ChoreClaim"("choreId", "weekPeriodId");

-- CreateIndex
CREATE UNIQUE INDEX "PayoutSummary_weekPeriodId_key" ON "PayoutSummary"("weekPeriodId");

-- CreateIndex
CREATE UNIQUE INDEX "PayoutLineItem_payoutSummaryId_kidId_key" ON "PayoutLineItem"("payoutSummaryId", "kidId");

-- CreateIndex
CREATE UNIQUE INDEX "QuickBooksConnection_householdId_key" ON "QuickBooksConnection"("householdId");

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_householdId_fkey" FOREIGN KEY ("householdId") REFERENCES "Household"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Chore" ADD CONSTRAINT "Chore_householdId_fkey" FOREIGN KEY ("householdId") REFERENCES "Household"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Chore" ADD CONSTRAINT "Chore_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WeekPeriod" ADD CONSTRAINT "WeekPeriod_householdId_fkey" FOREIGN KEY ("householdId") REFERENCES "Household"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChoreClaim" ADD CONSTRAINT "ChoreClaim_choreId_fkey" FOREIGN KEY ("choreId") REFERENCES "Chore"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChoreClaim" ADD CONSTRAINT "ChoreClaim_weekPeriodId_fkey" FOREIGN KEY ("weekPeriodId") REFERENCES "WeekPeriod"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChoreClaim" ADD CONSTRAINT "ChoreClaim_kidId_fkey" FOREIGN KEY ("kidId") REFERENCES "Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChoreClaim" ADD CONSTRAINT "ChoreClaim_decidedById_fkey" FOREIGN KEY ("decidedById") REFERENCES "Profile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PayoutSummary" ADD CONSTRAINT "PayoutSummary_weekPeriodId_fkey" FOREIGN KEY ("weekPeriodId") REFERENCES "WeekPeriod"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PayoutLineItem" ADD CONSTRAINT "PayoutLineItem_payoutSummaryId_fkey" FOREIGN KEY ("payoutSummaryId") REFERENCES "PayoutSummary"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PayoutLineItem" ADD CONSTRAINT "PayoutLineItem_kidId_fkey" FOREIGN KEY ("kidId") REFERENCES "Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuickBooksConnection" ADD CONSTRAINT "QuickBooksConnection_householdId_fkey" FOREIGN KEY ("householdId") REFERENCES "Household"("id") ON DELETE CASCADE ON UPDATE CASCADE;
