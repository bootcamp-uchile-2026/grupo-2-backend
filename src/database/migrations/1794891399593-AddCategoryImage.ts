import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCategoryImage1794891399593 implements MigrationInterface {
    name = 'AddCategoryImage1794891399593'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "categories" ADD "image_file_id" uuid`);
        await queryRunner.query(`ALTER TABLE "categories" ADD CONSTRAINT "fk_categories_image_file" FOREIGN KEY ("image_file_id") REFERENCES "files"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "categories" DROP CONSTRAINT "fk_categories_image_file"`);
        await queryRunner.query(`ALTER TABLE "categories" DROP COLUMN "image_file_id"`);
    }

}
