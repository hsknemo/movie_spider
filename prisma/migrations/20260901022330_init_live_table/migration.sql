-- CreateTable
CREATE TABLE `Live` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(100) NOT NULL,
    `src` LONGTEXT NOT NULL,
    `type` VARCHAR(100) NOT NULL DEFAULT '',
    `logo` VARCHAR(500) NOT NULL DEFAULT '',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `movie` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(100) NOT NULL,
    `originalTitle` VARCHAR(100) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `from` VARCHAR(100) NOT NULL,
    `fromWebUrl` VARCHAR(191) NOT NULL,
    `cast` JSON NOT NULL,
    `year` VARCHAR(20) NOT NULL,
    `rating` VARCHAR(20) NOT NULL,
    `summary` LONGTEXT NOT NULL,
    `poster` VARCHAR(200) NOT NULL,
    `isEnd` VARCHAR(10) NOT NULL,
    `genre` JSON NOT NULL,
    `category` VARCHAR(20) NOT NULL,
    `type` VARCHAR(20) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `movieItem` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `category` VARCHAR(20) NOT NULL,
    `title` VARCHAR(200) NOT NULL,
    `source` VARCHAR(200) NOT NULL,
    `movieId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `movieItem` ADD CONSTRAINT `movieItem_movieId_fkey` FOREIGN KEY (`movieId`) REFERENCES `movie`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
