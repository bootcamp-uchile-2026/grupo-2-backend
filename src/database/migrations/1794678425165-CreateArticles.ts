import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateArticles1794678425165
    implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
      CREATE TYPE article_status AS ENUM (
        'DRAFT',
        'PUBLISHED',
        'ARCHIVED'
      );
    `);

        await queryRunner.query(`
      CREATE TABLE articles (
        id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        author_id INTEGER NOT NULL,
        cover_file_id UUID,
        title VARCHAR(200) NOT NULL,
        summary VARCHAR(500),
        content TEXT NOT NULL,
        status article_status NOT NULL DEFAULT 'DRAFT',
        published_at TIMESTAMPTZ,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

        CONSTRAINT fk_articles_author
          FOREIGN KEY (author_id)
          REFERENCES users(id)
          ON DELETE RESTRICT,

        CONSTRAINT fk_articles_cover_file
          FOREIGN KEY (cover_file_id)
          REFERENCES files(id)
          ON DELETE RESTRICT
      );
    `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE articles;`);
        await queryRunner.query(`DROP TYPE article_status;`);
    }
}
