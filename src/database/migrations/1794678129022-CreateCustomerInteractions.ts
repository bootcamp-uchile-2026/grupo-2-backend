import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateCustomerInteractions1794678129022
    implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
      CREATE TYPE green_point_movement_type AS ENUM (
        'WELCOME',
        'PURCHASE',
        'REVIEW',
        'REDEMPTION',
        'RETURN',
        'REFUND',
        'ADJUSTMENT'
      );
    `);

        await queryRunner.query(`
      CREATE TABLE reviews (
        id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        customer_id INTEGER NOT NULL,
        product_id INTEGER NOT NULL,
        rating INTEGER NOT NULL CHECK (
          rating >= 1 AND rating <= 5
        ),
        comment TEXT,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

        CONSTRAINT fk_reviews_customer
          FOREIGN KEY (customer_id)
          REFERENCES customers(id)
          ON DELETE RESTRICT,

        CONSTRAINT fk_reviews_product
          FOREIGN KEY (product_id)
          REFERENCES products(id)
          ON DELETE RESTRICT,

        CONSTRAINT uq_reviews_customer_product
          UNIQUE (customer_id, product_id)
      );
    `);

        await queryRunner.query(`
      CREATE TABLE favorites (
        customer_id INTEGER NOT NULL,
        product_id INTEGER NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

        PRIMARY KEY (customer_id, product_id),

        CONSTRAINT fk_favorites_customer
          FOREIGN KEY (customer_id)
          REFERENCES customers(id)
          ON DELETE CASCADE,

        CONSTRAINT fk_favorites_product
          FOREIGN KEY (product_id)
          REFERENCES products(id)
          ON DELETE CASCADE
      );
    `);

        await queryRunner.query(`
      CREATE TABLE green_point_movements (
        id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        customer_id INTEGER NOT NULL,
        type green_point_movement_type NOT NULL,
        points INTEGER NOT NULL CHECK (points <> 0),
        order_id INTEGER,
        return_id INTEGER,
        review_id INTEGER,
        description VARCHAR(255),
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

        CONSTRAINT fk_green_point_movements_customer
          FOREIGN KEY (customer_id)
          REFERENCES customers(id)
          ON DELETE RESTRICT,

        CONSTRAINT fk_green_point_movements_order
          FOREIGN KEY (order_id)
          REFERENCES orders(id)
          ON DELETE RESTRICT,

        CONSTRAINT fk_green_point_movements_return
          FOREIGN KEY (return_id)
          REFERENCES returns(id)
          ON DELETE RESTRICT,

        CONSTRAINT fk_green_point_movements_review
          FOREIGN KEY (review_id)
          REFERENCES reviews(id)
          ON DELETE RESTRICT,

        CONSTRAINT chk_green_point_movements_sign
          CHECK (
            (type = 'WELCOME' AND points = 80)
            OR
            (type = 'REVIEW' AND points = 5)
            OR
            (
              type IN ('PURCHASE', 'REFUND')
              AND points > 0
            )
            OR
            (
              type IN ('REDEMPTION', 'RETURN')
              AND points < 0
            )
            OR
            (type = 'ADJUSTMENT')
          ),

        CONSTRAINT chk_green_point_movements_source
          CHECK (
            (
              type IN ('WELCOME', 'ADJUSTMENT')
              AND order_id IS NULL
              AND return_id IS NULL
              AND review_id IS NULL
            )
            OR
            (
              type IN ('PURCHASE', 'REDEMPTION')
              AND order_id IS NOT NULL
              AND return_id IS NULL
              AND review_id IS NULL
            )
            OR
            (
              type = 'REVIEW'
              AND review_id IS NOT NULL
              AND order_id IS NULL
              AND return_id IS NULL
            )
            OR
            (
              type = 'RETURN'
              AND return_id IS NOT NULL
              AND order_id IS NULL
              AND review_id IS NULL
            )
            OR
            (
              type = 'REFUND'
              AND review_id IS NULL
              AND (
                (
                  order_id IS NOT NULL
                  AND return_id IS NULL
                )
                OR
                (
                  return_id IS NOT NULL
                  AND order_id IS NULL
                )
              )
            )
          ),

        CONSTRAINT uq_green_point_movements_order
          UNIQUE (order_id, type),

        CONSTRAINT uq_green_point_movements_return
          UNIQUE (return_id, type),

        CONSTRAINT uq_green_point_movements_review
          UNIQUE (review_id, type)
      );
    `);

        await queryRunner.query(`
      CREATE UNIQUE INDEX uq_green_point_movements_welcome
      ON green_point_movements (customer_id)
      WHERE type = 'WELCOME';
    `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE green_point_movements;`);
        await queryRunner.query(`DROP TABLE favorites;`);
        await queryRunner.query(`DROP TABLE reviews;`);
        await queryRunner.query(`DROP TYPE green_point_movement_type;`);
    }
}