/*
  Warnings:

  - Added the required column `data_atualizacao` to the `Cliente` table without a default value. This is not possible if the table is not empty.
  - Added the required column `senha` to the `Cliente` table without a default value. This is not possible if the table is not empty.
  - Added the required column `data_atualizacao` to the `Locacao` table without a default value. This is not possible if the table is not empty.
  - Added the required column `data_atualizacao` to the `Reserva` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Cliente` ADD COLUMN `data_atualizacao` DATETIME(3) NOT NULL,
    ADD COLUMN `senha` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `Locacao` ADD COLUMN `data_atualizacao` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `Reserva` ADD COLUMN `data_atualizacao` DATETIME(3) NOT NULL;
