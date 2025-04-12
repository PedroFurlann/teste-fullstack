-- DropForeignKey
ALTER TABLE `Locacao` DROP FOREIGN KEY `Locacao_cliente_id_fkey`;

-- DropForeignKey
ALTER TABLE `Reserva` DROP FOREIGN KEY `Reserva_cliente_id_fkey`;

-- DropForeignKey
ALTER TABLE `Reserva` DROP FOREIGN KEY `Reserva_locacao_id_fkey`;

-- DropIndex
DROP INDEX `Locacao_cliente_id_fkey` ON `Locacao`;

-- DropIndex
DROP INDEX `Reserva_cliente_id_fkey` ON `Reserva`;

-- DropIndex
DROP INDEX `Reserva_locacao_id_fkey` ON `Reserva`;

-- AddForeignKey
ALTER TABLE `Locacao` ADD CONSTRAINT `Locacao_cliente_id_fkey` FOREIGN KEY (`cliente_id`) REFERENCES `Cliente`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Reserva` ADD CONSTRAINT `Reserva_cliente_id_fkey` FOREIGN KEY (`cliente_id`) REFERENCES `Cliente`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Reserva` ADD CONSTRAINT `Reserva_locacao_id_fkey` FOREIGN KEY (`locacao_id`) REFERENCES `Locacao`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
