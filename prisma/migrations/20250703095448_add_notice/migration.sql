-- CreateTable
CREATE TABLE "Notice" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT 'main',
    "text" TEXT NOT NULL,
    "updatedAt" DATETIME NOT NULL
);
