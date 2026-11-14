import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateProductCatalog1794677059315
    implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
      CREATE TABLE categories (
        id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        name VARCHAR(100) NOT NULL UNIQUE,
        description TEXT
      );
    `);

        await queryRunner.query(`
      CREATE TABLE products (
        id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        producer_id INTEGER NOT NULL,
        category_id INTEGER NOT NULL,
        name VARCHAR(200) NOT NULL,
        description TEXT NOT NULL,
        price INTEGER NOT NULL CHECK (price > 0),
        offer_price INTEGER,
        offer_start_at TIMESTAMPTZ,
        offer_end_at TIMESTAMPTZ,
        stock INTEGER NOT NULL CHECK (stock >= 0),
        co2_avoided NUMERIC(10,4) NOT NULL CHECK (co2_avoided >= 0),
        is_active BOOLEAN NOT NULL DEFAULT TRUE,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

        CONSTRAINT fk_products_producer
          FOREIGN KEY (producer_id)
          REFERENCES producers(id)
          ON DELETE RESTRICT,

        CONSTRAINT fk_products_category
          FOREIGN KEY (category_id)
          REFERENCES categories(id)
          ON DELETE RESTRICT,

        CONSTRAINT chk_products_offer
          CHECK (
            (
              offer_price IS NULL
              AND offer_start_at IS NULL
              AND offer_end_at IS NULL
            )
            OR
            (
              offer_price IS NOT NULL
              AND offer_start_at IS NOT NULL
              AND offer_end_at IS NOT NULL
              AND offer_price > 0
              AND offer_price < price
              AND offer_end_at > offer_start_at
            )
          )
      );
    `);

        await queryRunner.query(`
      CREATE TABLE product_images (
        id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        product_id INTEGER NOT NULL,
        file_id UUID NOT NULL UNIQUE,
        display_order INTEGER NOT NULL CHECK (display_order > 0),
        is_primary BOOLEAN NOT NULL DEFAULT FALSE,

        CONSTRAINT fk_product_images_product
          FOREIGN KEY (product_id)
          REFERENCES products(id)
          ON DELETE CASCADE,

        CONSTRAINT fk_product_images_file
          FOREIGN KEY (file_id)
          REFERENCES files(id)
          ON DELETE RESTRICT,

        CONSTRAINT uq_product_images_display_order
          UNIQUE (product_id, display_order)
      );
    `);

        await queryRunner.query(`
      CREATE UNIQUE INDEX uq_product_images_primary
      ON product_images (product_id)
      WHERE is_primary = TRUE;
    `);

        await queryRunner.query(`
      CREATE TABLE sustainability_attributes (
        id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        name VARCHAR(100) NOT NULL UNIQUE,
        description TEXT
      );
    `);

        await queryRunner.query(`
      CREATE TABLE product_sustainability_attributes (
        product_id INTEGER NOT NULL,
        sustainability_attribute_id INTEGER NOT NULL,

        PRIMARY KEY (
          product_id,
          sustainability_attribute_id
        ),

        CONSTRAINT fk_product_sustainability_product
          FOREIGN KEY (product_id)
          REFERENCES products(id)
          ON DELETE CASCADE,

        CONSTRAINT fk_product_sustainability_attribute
          FOREIGN KEY (sustainability_attribute_id)
          REFERENCES sustainability_attributes(id)
          ON DELETE CASCADE
      );
    `);

        await queryRunner.query(`
      CREATE TABLE food_details (
        product_id INTEGER PRIMARY KEY,
        weight_g NUMERIC(10,2) CHECK (weight_g > 0),
        ingredients TEXT,
        allergens TEXT,
        expiration_date DATE,

        CONSTRAINT fk_food_details_product
          FOREIGN KEY (product_id)
          REFERENCES products(id)
          ON DELETE CASCADE
      );
    `);

        await queryRunner.query(`
      CREATE TABLE personal_care_details (
        product_id INTEGER PRIMARY KEY,
        volume_ml NUMERIC(10,2) CHECK (volume_ml > 0),
        ingredients TEXT,
        skin_type VARCHAR(100),

        CONSTRAINT fk_personal_care_details_product
          FOREIGN KEY (product_id)
          REFERENCES products(id)
          ON DELETE CASCADE
      );
    `);

        await queryRunner.query(`
      CREATE TABLE garden_details (
        product_id INTEGER PRIMARY KEY,
        material VARCHAR(150),
        height_cm NUMERIC(10,2) CHECK (height_cm > 0),
        width_cm NUMERIC(10,2) CHECK (width_cm > 0),
        depth_cm NUMERIC(10,2) CHECK (depth_cm > 0),
        weight_g NUMERIC(10,2) CHECK (weight_g > 0),
        usage_type VARCHAR(100),

        CONSTRAINT fk_garden_details_product
          FOREIGN KEY (product_id)
          REFERENCES products(id)
          ON DELETE CASCADE
      );
    `);

        await queryRunner.query(`
      CREATE TABLE home_cleaning_details (
        product_id INTEGER PRIMARY KEY,
        volume_ml NUMERIC(10,2) CHECK (volume_ml > 0),
        composition TEXT,
        application_surface VARCHAR(150),

        CONSTRAINT fk_home_cleaning_details_product
          FOREIGN KEY (product_id)
          REFERENCES products(id)
          ON DELETE CASCADE
      );
    `);

        await queryRunner.query(`
      CREATE TABLE wellness_details (
        product_id INTEGER PRIMARY KEY,
        fragrance VARCHAR(100),
        volume_ml NUMERIC(10,2) CHECK (volume_ml > 0),
        duration_hours NUMERIC(8,2) CHECK (duration_hours > 0),
        format VARCHAR(100),

        CONSTRAINT fk_wellness_details_product
          FOREIGN KEY (product_id)
          REFERENCES products(id)
          ON DELETE CASCADE
      );
    `);

        await queryRunner.query(`
      CREATE TABLE clothing_details (
        product_id INTEGER PRIMARY KEY,
        size VARCHAR(30),
        color VARCHAR(50),
        material VARCHAR(150),

        CONSTRAINT fk_clothing_details_product
          FOREIGN KEY (product_id)
          REFERENCES products(id)
          ON DELETE CASCADE
      );
    `);

        await queryRunner.query(`
      CREATE TABLE pet_details (
        product_id INTEGER PRIMARY KEY,
        pet_type VARCHAR(50),
        size VARCHAR(50),
        weight_g NUMERIC(10,2) CHECK (weight_g > 0),
        material VARCHAR(150),

        CONSTRAINT fk_pet_details_product
          FOREIGN KEY (product_id)
          REFERENCES products(id)
          ON DELETE CASCADE
      );
    `);

        await queryRunner.query(`
      CREATE TABLE craft_details (
        product_id INTEGER PRIMARY KEY,
        material VARCHAR(150),
        height_cm NUMERIC(10,2) CHECK (height_cm > 0),
        width_cm NUMERIC(10,2) CHECK (width_cm > 0),
        depth_cm NUMERIC(10,2) CHECK (depth_cm > 0),
        color VARCHAR(50),
        weight_g NUMERIC(10,2) CHECK (weight_g > 0),

        CONSTRAINT fk_craft_details_product
          FOREIGN KEY (product_id)
          REFERENCES products(id)
          ON DELETE CASCADE
      );
    `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE craft_details;`);
        await queryRunner.query(`DROP TABLE pet_details;`);
        await queryRunner.query(`DROP TABLE clothing_details;`);
        await queryRunner.query(`DROP TABLE wellness_details;`);
        await queryRunner.query(`DROP TABLE home_cleaning_details;`);
        await queryRunner.query(`DROP TABLE garden_details;`);
        await queryRunner.query(`DROP TABLE personal_care_details;`);
        await queryRunner.query(`DROP TABLE food_details;`);
        await queryRunner.query(`DROP TABLE product_sustainability_attributes;`);
        await queryRunner.query(`DROP TABLE sustainability_attributes;`);
        await queryRunner.query(`DROP TABLE product_images;`);
        await queryRunner.query(`DROP TABLE products;`);
        await queryRunner.query(`DROP TABLE categories;`);
    }
}
