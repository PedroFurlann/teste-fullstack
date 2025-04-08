/*
  Warnings:

  - Added the required column `cliente_id` to the `Locacao` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Locacao` ADD COLUMN `cliente_id` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `Locacao` ADD CONSTRAINT `Locacao_cliente_id_fkey` FOREIGN KEY (`cliente_id`) REFERENCES `Cliente`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
