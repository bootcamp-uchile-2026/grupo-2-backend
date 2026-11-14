import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateOrdersAndReturns1794677761696
    implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
      CREATE TYPE order_status AS ENUM (
        'PENDING',
        'CONFIRMED',
        'PREPARING',
        'SHIPPED',
        'DELIVERED',
        'CANCELLED'
      );
    `);

        await queryRunner.query(`
      CREATE TYPE payment_method AS ENUM (
        'DEBIT_CARD',
        'CREDIT_CARD',
        'BANK_TRANSFER'
      );
    `);

        await queryRunner.query(`
      CREATE TYPE payment_status AS ENUM (
        'PENDING',
        'PAID',
        'FAILED',
        'PARTIALLY_REFUNDED',
        'REFUNDED'
      );
    `);

        await queryRunner.query(`
      CREATE TYPE return_status AS ENUM (
        'REQUESTED',
        'APPROVED',
        'REJECTED',
        'COMPLETED'
      );
    `);

        await queryRunner.query(`
      CREATE TABLE orders (
        id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        customer_id INTEGER NOT NULL,
        address_id INTEGER NOT NULL,
        status order_status NOT NULL DEFAULT 'PENDING',
        payment_method payment_method NOT NULL,
        payment_status payment_status NOT NULL DEFAULT 'PENDING',
        shipping_cost INTEGER NOT NULL DEFAULT 2990
          CHECK (shipping_cost >= 0),

        shipping_recipient_name VARCHAR(150) NOT NULL,
        shipping_recipient_phone VARCHAR(20) NOT NULL,
        shipping_street VARCHAR(150) NOT NULL,
        shipping_street_number VARCHAR(20) NOT NULL,
        shipping_apartment VARCHAR(30),
        shipping_commune VARCHAR(100) NOT NULL,
        shipping_region VARCHAR(100) NOT NULL,
        shipping_reference VARCHAR(255),

        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        confirmed_at TIMESTAMPTZ,
        shipped_at TIMESTAMPTZ,
        delivered_at TIMESTAMPTZ,
        cancelled_at TIMESTAMPTZ,

        CONSTRAINT fk_orders_customer
          FOREIGN KEY (customer_id)
          REFERENCES customers(id)
          ON DELETE RESTRICT,

        CONSTRAINT fk_orders_address
          FOREIGN KEY (address_id)
          REFERENCES addresses(id)
          ON DELETE RESTRICT
      );
    `);

        await queryRunner.query(`
      CREATE TABLE order_items (
        id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        order_id INTEGER NOT NULL,
        product_id INTEGER NOT NULL,

        product_name VARCHAR(200) NOT NULL,
        product_description TEXT NOT NULL,
        product_size VARCHAR(50),
        product_color VARCHAR(50),
        product_material VARCHAR(150),

        quantity INTEGER NOT NULL CHECK (
          quantity >= 1 AND quantity <= 3
        ),
        unit_price INTEGER NOT NULL CHECK (unit_price > 0),
        unit_co2_avoided NUMERIC(10,4) NOT NULL
          CHECK (unit_co2_avoided >= 0),
        unit_green_points INTEGER NOT NULL
          CHECK (unit_green_points >= 0),
        green_point_discount INTEGER NOT NULL DEFAULT 0,

        is_prepared BOOLEAN NOT NULL DEFAULT FALSE,
        prepared_at TIMESTAMPTZ,

        CONSTRAINT fk_order_items_order
          FOREIGN KEY (order_id)
          REFERENCES orders(id)
          ON DELETE RESTRICT,

        CONSTRAINT fk_order_items_product
          FOREIGN KEY (product_id)
          REFERENCES products(id)
          ON DELETE RESTRICT,

        CONSTRAINT uq_order_items_product
          UNIQUE (order_id, product_id),

        CONSTRAINT chk_order_items_discount
          CHECK (
            green_point_discount >= 0
            AND green_point_discount <=
              quantity::BIGINT * unit_price
          )
      );
    `);

        await queryRunner.query(`
      CREATE TABLE returns (
        id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        order_id INTEGER NOT NULL,
        status return_status NOT NULL DEFAULT 'REQUESTED',
        reason TEXT NOT NULL,
        admin_notes TEXT,
        processed_by INTEGER,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        completed_at TIMESTAMPTZ,

        CONSTRAINT fk_returns_order
          FOREIGN KEY (order_id)
          REFERENCES orders(id)
          ON DELETE RESTRICT,

        CONSTRAINT fk_returns_processed_by
          FOREIGN KEY (processed_by)
          REFERENCES users(id)
          ON DELETE RESTRICT
      );
    `);

        await queryRunner.query(`
      CREATE TABLE return_items (
        return_id INTEGER NOT NULL,
        order_item_id INTEGER NOT NULL,
        quantity INTEGER NOT NULL CHECK (
          quantity >= 1 AND quantity <= 3
        ),
        refund_amount INTEGER NOT NULL DEFAULT 0
          CHECK (refund_amount >= 0),
        green_points_restored INTEGER NOT NULL DEFAULT 0
          CHECK (green_points_restored >= 0),
        restock BOOLEAN NOT NULL DEFAULT FALSE,

        PRIMARY KEY (return_id, order_item_id),

        CONSTRAINT fk_return_items_return
          FOREIGN KEY (return_id)
          REFERENCES returns(id)
          ON DELETE RESTRICT,

        CONSTRAINT fk_return_items_order_item
          FOREIGN KEY (order_item_id)
          REFERENCES order_items(id)
          ON DELETE RESTRICT
      );
    `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE return_items;`);
        await queryRunner.query(`DROP TABLE returns;`);
        await queryRunner.query(`DROP TABLE order_items;`);
        await queryRunner.query(`DROP TABLE orders;`);

        await queryRunner.query(`DROP TYPE return_status;`);
        await queryRunner.query(`DROP TYPE payment_status;`);
        await queryRunner.query(`DROP TYPE payment_method;`);
        await queryRunner.query(`DROP TYPE order_status;`);
    }
}
