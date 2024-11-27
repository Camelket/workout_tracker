-- CreateEnum
CREATE TYPE "Units" AS ENUM ('metric', 'imperial');

-- CreateEnum
CREATE TYPE "PerceivedGrade" AS ENUM ('A', 'B', 'C', 'D', 'E');

-- CreateEnum
CREATE TYPE "AccuracyLevel" AS ENUM ('high', 'medium', 'low');

-- CreateTable
CREATE TABLE "User" (
    "userId" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "UserPreferences" (
    "userId" INTEGER NOT NULL,
    "units" "Units" NOT NULL,

    CONSTRAINT "UserPreferences_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "HeartRateZone" (
    "zoneId" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "lowerBound" DOUBLE PRECISION NOT NULL,
    "upperBound" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HeartRateZone_pkey" PRIMARY KEY ("zoneId")
);

-- CreateTable
CREATE TABLE "Threshold" (
    "thresholdId" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "lactateThreshold" DOUBLE PRECISION NOT NULL,
    "aerobicExhaustionThreshold" DOUBLE PRECISION NOT NULL,
    "effectiveDate" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Threshold_pkey" PRIMARY KEY ("thresholdId")
);

-- CreateTable
CREATE TABLE "MacroPlan" (
    "planId" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MacroPlan_pkey" PRIMARY KEY ("planId")
);

-- CreateTable
CREATE TABLE "PlanEvent" (
    "eventId" SERIAL NOT NULL,
    "planId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "PlanEvent_pkey" PRIMARY KEY ("eventId")
);

-- CreateTable
CREATE TABLE "PlanUnit" (
    "unitId" SERIAL NOT NULL,
    "planId" INTEGER NOT NULL,
    "weekNumber" INTEGER NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "notes" TEXT NOT NULL,

    CONSTRAINT "PlanUnit_pkey" PRIMARY KEY ("unitId")
);

-- CreateTable
CREATE TABLE "PlannedActivity" (
    "plannedActivityId" SERIAL NOT NULL,
    "unitId" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "activityType" TEXT NOT NULL,
    "distance" DOUBLE PRECISION NOT NULL,
    "verticalGain" DOUBLE PRECISION NOT NULL,
    "duration" DOUBLE PRECISION NOT NULL,
    "notes" TEXT NOT NULL,

    CONSTRAINT "PlannedActivity_pkey" PRIMARY KEY ("plannedActivityId")
);

-- CreateTable
CREATE TABLE "Activity" (
    "activityId" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "plannedActivityId" INTEGER,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "activityType" TEXT NOT NULL,
    "perceivedGrade" "PerceivedGrade" NOT NULL,
    "userNotes" TEXT NOT NULL,
    "distance" DOUBLE PRECISION NOT NULL,
    "verticalGain" DOUBLE PRECISION NOT NULL,
    "duration" DOUBLE PRECISION NOT NULL,
    "source" TEXT NOT NULL,
    "manualOverride" BOOLEAN NOT NULL,
    "startLatitude" DOUBLE PRECISION NOT NULL,
    "startLongitude" DOUBLE PRECISION NOT NULL,
    "startTimestamp" TIMESTAMP(3) NOT NULL,
    "endLatitude" DOUBLE PRECISION NOT NULL,
    "endLongitude" DOUBLE PRECISION NOT NULL,
    "endTimestamp" TIMESTAMP(3) NOT NULL,
    "lactateThreshold" DOUBLE PRECISION NOT NULL,
    "aerobicExhaustionThreshold" DOUBLE PRECISION NOT NULL,
    "gpsData" JSONB NOT NULL,
    "accelerationData" JSONB NOT NULL,
    "gyroData" JSONB NOT NULL,
    "routeData" JSONB NOT NULL,
    "heartRateData" JSONB NOT NULL,
    "zonesSummary" JSONB NOT NULL,
    "zonesUsed" JSONB NOT NULL,
    "thresholds" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Activity_pkey" PRIMARY KEY ("activityId")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "UserPreferences" ADD CONSTRAINT "UserPreferences_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HeartRateZone" ADD CONSTRAINT "HeartRateZone_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Threshold" ADD CONSTRAINT "Threshold_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MacroPlan" ADD CONSTRAINT "MacroPlan_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlanEvent" ADD CONSTRAINT "PlanEvent_planId_fkey" FOREIGN KEY ("planId") REFERENCES "MacroPlan"("planId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlanUnit" ADD CONSTRAINT "PlanUnit_planId_fkey" FOREIGN KEY ("planId") REFERENCES "MacroPlan"("planId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlannedActivity" ADD CONSTRAINT "PlannedActivity_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "PlanUnit"("unitId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Activity" ADD CONSTRAINT "Activity_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Activity" ADD CONSTRAINT "Activity_plannedActivityId_fkey" FOREIGN KEY ("plannedActivityId") REFERENCES "PlannedActivity"("plannedActivityId") ON DELETE SET NULL ON UPDATE CASCADE;
