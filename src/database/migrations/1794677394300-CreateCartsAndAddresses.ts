import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateCartsAndAddresses1794677394300
    implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
      CREATE TABLE carts (
        id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        customer_id INTEGER NOT NULL UNIQUE,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

        CONSTRAINT fk_carts_customer
          FOREIGN KEY (customer_id)
          REFERENCES customers(id)
          ON DELETE RESTRICT
      );
    `);

        await queryRunner.query(`
      CREATE TABLE cart_items (
        cart_id INTEGER NOT NULL,
        product_id INTEGER NOT NULL,
        quantity INTEGER NOT NULL CHECK (
          quantity >= 1 AND quantity <= 3
        ),
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

        PRIMARY KEY (cart_id, product_id),

        CONSTRAINT fk_cart_items_cart
          FOREIGN KEY (cart_id)
          REFERENCES carts(id)
          ON DELETE CASCADE,

        CONSTRAINT fk_cart_items_product
          FOREIGN KEY (product_id)
          REFERENCES products(id)
          ON DELETE RESTRICT
      );
    `);

        await queryRunner.query(`
      CREATE TABLE addresses (
        id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        customer_id INTEGER NOT NULL,
        label VARCHAR(50),
        recipient_name VARCHAR(150) NOT NULL,
        recipient_phone VARCHAR(20) NOT NULL,
        street VARCHAR(150) NOT NULL,
        street_number VARCHAR(20) NOT NULL,
        apartment VARCHAR(30),
        commune VARCHAR(100) NOT NULL,
        region VARCHAR(100) NOT NULL,
        reference VARCHAR(255),
        is_default BOOLEAN NOT NULL DEFAULT FALSE,
        is_active BOOLEAN NOT NULL DEFAULT TRUE,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

        CONSTRAINT fk_addresses_customer
          FOREIGN KEY (customer_id)
          REFERENCES customers(id)
          ON DELETE RESTRICT
      );
    `);

        await queryRunner.query(`
      CREATE UNIQUE INDEX uq_addresses_default
      ON addresses (customer_id)
      WHERE is_default = TRUE AND is_active = TRUE;
    `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE addresses;`);
        await queryRunner.query(`DROP TABLE cart_items;`);
        await queryRunner.query(`DROP TABLE carts;`);
    }
}