import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUsersAndFiles1794676587318
    implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
      CREATE TYPE user_role AS ENUM (
        'CUSTOMER',
        'PRODUCER',
        'ADMIN'
      );
    `);

        await queryRunner.query(`
      CREATE TABLE files (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        original_name VARCHAR(255) NOT NULL,
        storage_key VARCHAR(500) NOT NULL UNIQUE,
        mime_type VARCHAR(100) NOT NULL,
        size INTEGER NOT NULL CHECK (size > 0),
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);

        await queryRunner.query(`
      CREATE TABLE users (
        id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        email VARCHAR(255) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100),
        phone VARCHAR(20),
        profile_file_id UUID,
        role user_role NOT NULL,
        is_active BOOLEAN NOT NULL DEFAULT TRUE,
        privacy_accepted_at TIMESTAMPTZ NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

        CONSTRAINT fk_users_profile_file
          FOREIGN KEY (profile_file_id)
          REFERENCES files(id)
          ON DELETE RESTRICT
      );
    `);

        await queryRunner.query(`
      CREATE TABLE customers (
        id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        user_id INTEGER NOT NULL UNIQUE,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

        CONSTRAINT fk_customers_user
          FOREIGN KEY (user_id)
          REFERENCES users(id)
          ON DELETE RESTRICT
      );
    `);

        await queryRunner.query(`
      CREATE TABLE producers (
        id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        user_id INTEGER NOT NULL UNIQUE,
        business_name VARCHAR(150) NOT NULL,
        description TEXT,
        logo_file_id UUID,
        banner_file_id UUID,
        location VARCHAR(150),
        website_url VARCHAR(500),
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

        CONSTRAINT fk_producers_user
          FOREIGN KEY (user_id)
          REFERENCES users(id)
          ON DELETE RESTRICT,

        CONSTRAINT fk_producers_logo_file
          FOREIGN KEY (logo_file_id)
          REFERENCES files(id)
          ON DELETE RESTRICT,

        CONSTRAINT fk_producers_banner_file
          FOREIGN KEY (banner_file_id)
          REFERENCES files(id)
          ON DELETE RESTRICT
      );
    `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE producers;`);
        await queryRunner.query(`DROP TABLE customers;`);
        await queryRunner.query(`DROP TABLE users;`);
        await queryRunner.query(`DROP TABLE files;`);
        await queryRunner.query(`DROP TYPE user_role;`);
    }
}
