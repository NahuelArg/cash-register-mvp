-- CreateTable
CREATE TABLE `Barber` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `isOwner` BOOLEAN NOT NULL DEFAULT false,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AlterTable
ALTER TABLE `CashMovement` ADD COLUMN `barberId` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `CashClosing` ADD COLUMN `barberBreakdown` JSON NULL;

-- CreateIndex
CREATE INDEX `CashMovement_barberId_idx` ON `CashMovement`(`barberId`);

-- AddForeignKey
ALTER TABLE `CashMovement` ADD CONSTRAINT `CashMovement_barberId_fkey` FOREIGN KEY (`barberId`) REFERENCES `Barber`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
