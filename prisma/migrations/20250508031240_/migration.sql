-- CreateEnum
CREATE TYPE "Role" AS ENUM ('MASTER', 'MODERATOR', 'JOB_SEEKER', 'RECRUITER');

-- CreateEnum
CREATE TYPE "SalaryType" AS ENUM ('HOURLY', 'DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY', 'SALARY');

-- CreateEnum
CREATE TYPE "EmployementType" AS ENUM ('FULL_TIME', 'PART_TIME', 'INTERNSHIP', 'CONTRACT', 'FREELANCEING', 'PER_DIEM');

-- CreateEnum
CREATE TYPE "JobType" AS ENUM ('REMOTE', 'ONSITE', 'HYBRID');

-- CreateEnum
CREATE TYPE "Shift" AS ENUM ('DAY', 'NIGHT', 'MORNING', 'EVENING', 'WEEKEND', 'AFTERNOON', 'OVERNIGHT');

-- CreateTable
CREATE TABLE "Users" (
    "id" TEXT NOT NULL,
    "uid" VARCHAR(200) NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "title" VARCHAR(200),
    "email" VARCHAR(100) NOT NULL,
    "phone" VARCHAR(15),
    "role" "Role" NOT NULL,
    "provider" VARCHAR(50) NOT NULL,
    "image" JSONB,
    "location" VARCHAR(200),
    "links" JSONB,
    "about" VARCHAR(1000),
    "experience" JSONB[],
    "education" JSONB[],
    "certification" JSONB[],
    "skills" TEXT[],
    "active" BOOLEAN NOT NULL DEFAULT true,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "moderators" TEXT[],
    "createdById" VARCHAR(36),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubscribedUsers" (
    "id" TEXT NOT NULL,
    "email" VARCHAR(150),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SubscribedUsers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Contacts" (
    "id" TEXT NOT NULL,
    "email" VARCHAR(150) NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "message" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Contacts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuickJobs" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "email" VARCHAR(150) NOT NULL,
    "website" VARCHAR(1000) NOT NULL,
    "payment" JSONB,
    "isFeatured" BOOLEAN NOT NULL,
    "isUrgent" BOOLEAN NOT NULL,
    "isDrafted" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "QuickJobs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Blogs" (
    "id" TEXT NOT NULL,
    "title" VARCHAR(500) NOT NULL,
    "description" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "image" JSONB NOT NULL,
    "author" VARCHAR(150) NOT NULL,
    "slug" VARCHAR(700) NOT NULL,
    "createdById" VARCHAR(36) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Blogs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Companies" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(300) NOT NULL,
    "image" JSONB NOT NULL,
    "location" VARCHAR(150) NOT NULL,
    "website" VARCHAR(1000) NOT NULL,
    "slug" VARCHAR(500) NOT NULL,
    "personalHealth" TEXT[],
    "teamValues" TEXT[],
    "careerGrowth" TEXT[],
    "description" TEXT,
    "establishedAt" VARCHAR(50),
    "teamsize" VARCHAR(50),
    "headquarter" VARCHAR(150),
    "industry" VARCHAR(150),
    "mission" JSONB,
    "values" JSONB,
    "galleries" JSONB,
    "testimonials" JSONB,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdById" VARCHAR(36) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Companies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Jobs" (
    "id" TEXT NOT NULL,
    "title" VARCHAR(500) NOT NULL,
    "overview" TEXT NOT NULL,
    "location" VARCHAR(150) NOT NULL,
    "minSalary" DOUBLE PRECISION,
    "maxSalary" DOUBLE PRECISION,
    "salaryType" "SalaryType",
    "website" VARCHAR(1000) NOT NULL,
    "schedule" VARCHAR(50),
    "employementType" "EmployementType" NOT NULL,
    "jobType" "JobType",
    "shift" "Shift",
    "payment" JSONB,
    "companyName" VARCHAR(300) NOT NULL,
    "companyLocation" VARCHAR(200),
    "companyImage" JSONB NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "experience" VARCHAR(150),
    "isUrgent" BOOLEAN NOT NULL DEFAULT false,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "slug" VARCHAR(500) NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT false,
    "isDrafted" BOOLEAN NOT NULL DEFAULT true,
    "isPostedOnReddit" BOOLEAN NOT NULL DEFAULT false,
    "isPostedOnFacebook" BOOLEAN NOT NULL DEFAULT false,
    "createdById" VARCHAR(36) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "companyId" VARCHAR(36),

    CONSTRAINT "Jobs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CrawledJobs" (
    "id" TEXT NOT NULL,
    "companyName" VARCHAR(300) NOT NULL,
    "companyLocation" VARCHAR(200) NOT NULL,
    "companyImage" JSONB NOT NULL,
    "title" VARCHAR(500) NOT NULL,
    "location" VARCHAR(150) NOT NULL,
    "overview" TEXT NOT NULL,
    "employementType" "EmployementType" NOT NULL,
    "salaryType" "SalaryType" NOT NULL,
    "minSalary" DOUBLE PRECISION,
    "maxSalary" DOUBLE PRECISION,
    "jobType" "JobType" NOT NULL,
    "website" VARCHAR(1000) NOT NULL,
    "slug" VARCHAR(500) NOT NULL,
    "provider" VARCHAR(50) NOT NULL,
    "isPostedOnReddit" BOOLEAN NOT NULL DEFAULT false,
    "isPostedOnFacebook" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CrawledJobs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SavedJobs" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "jobSlug" VARCHAR(500),
    "crawledSlug" VARCHAR(500),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SavedJobs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sessions" (
    "sid" TEXT NOT NULL,
    "sess" TEXT NOT NULL,
    "expire" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Sessions_pkey" PRIMARY KEY ("sid")
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_uid_key" ON "Users"("uid");

-- CreateIndex
CREATE UNIQUE INDEX "Users_email_key" ON "Users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Users_phone_key" ON "Users"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "SubscribedUsers_email_key" ON "SubscribedUsers"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Contacts_email_key" ON "Contacts"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Blogs_slug_key" ON "Blogs"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Blogs_id_slug_key" ON "Blogs"("id", "slug");

-- CreateIndex
CREATE UNIQUE INDEX "Companies_slug_key" ON "Companies"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Companies_id_slug_key" ON "Companies"("id", "slug");

-- CreateIndex
CREATE UNIQUE INDEX "Jobs_slug_key" ON "Jobs"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Jobs_id_slug_key" ON "Jobs"("id", "slug");

-- CreateIndex
CREATE UNIQUE INDEX "CrawledJobs_slug_key" ON "CrawledJobs"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "CrawledJobs_id_slug_key" ON "CrawledJobs"("id", "slug");

-- CreateIndex
CREATE INDEX "Sessions_expire_idx" ON "Sessions"("expire");

-- AddForeignKey
ALTER TABLE "Blogs" ADD CONSTRAINT "Blogs_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Companies" ADD CONSTRAINT "Companies_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Jobs" ADD CONSTRAINT "Jobs_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Companies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Jobs" ADD CONSTRAINT "Jobs_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedJobs" ADD CONSTRAINT "SavedJobs_Job_slug_fkey" FOREIGN KEY ("jobSlug") REFERENCES "Jobs"("slug") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedJobs" ADD CONSTRAINT "SavedJobs_CrawledJob_slug_fkey" FOREIGN KEY ("crawledSlug") REFERENCES "CrawledJobs"("slug") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedJobs" ADD CONSTRAINT "SavedJobs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
