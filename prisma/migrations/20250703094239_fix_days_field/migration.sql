-- CreateTable
CREATE TABLE "Member" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "number" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "job" TEXT NOT NULL,
    "hp" INTEGER,
    "mp" INTEGER,
    "days" TEXT,
    "imageUrl" TEXT,
    "message" TEXT,
    "lastUpdated" DATETIME NOT NULL
);
