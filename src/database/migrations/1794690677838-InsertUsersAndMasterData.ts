import { MigrationInterface, QueryRunner } from 'typeorm';
import * as argon2 from 'argon2';

export class InsertUsersAndMasterData1794690677838
    implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {

        if (process.env.NODE_ENV === 'production') {
            throw new Error(
                'Los datos de prueba no pueden cargarse en produccion.',
            );
        }

        // Usuarios de prueba

        const users = [
            {
                email: 'admin@buenorigen.test',
                password: 'AdminTest2026!',
                firstName: 'Administrador',
                lastName: 'BuenOrigen',
                role: 'ADMIN',
                isActive: true,
            },
            {
                email: 'ecoraiz@buenorigen.test',
                password: 'ProducerTest2026!',
                firstName: 'Camila',
                lastName: 'Torres',
                role: 'PRODUCER',
                isActive: true,
            },
            {
                email: 'verdehogar@buenorigen.test',
                password: 'ProducerTest2026!',
                firstName: 'Felipe',
                lastName: 'Mora',
                role: 'PRODUCER',
                isActive: true,
            },
            {
                email: 'naturalezaviva@buenorigen.test',
                password: 'ProducerTest2026!',
                firstName: 'Daniela',
                lastName: 'Vargas',
                role: 'PRODUCER',
                isActive: true,
            },
            {
                email: 'saboresdelatierra@buenorigen.test',
                password: 'ProducerTest2026!',
                firstName: 'Ignacio',
                lastName: 'Fuentes',
                role: 'PRODUCER',
                isActive: true,
            },
            {
                email: 'huertovivo@buenorigen.test',
                password: 'ProducerTest2026!',
                firstName: 'Rodrigo',
                lastName: 'Castro',
                role: 'PRODUCER',
                isActive: true,
            },
            {
                email: 'aromasdelbosque@buenorigen.test',
                password: 'ProducerTest2026!',
                firstName: 'Constanza',
                lastName: 'Reyes',
                role: 'PRODUCER',
                isActive: true,
            },
            {
                email: 'patitasverdes@buenorigen.test',
                password: 'ProducerTest2026!',
                firstName: 'Paula',
                lastName: 'Contreras',
                role: 'PRODUCER',
                isActive: true,
            },
            {
                email: 'artecircular@buenorigen.test',
                password: 'ProducerTest2026!',
                firstName: 'Tomás',
                lastName: 'Morales',
                role: 'PRODUCER',
                isActive: true,
            },
            {
                email: 'maria@buenorigen.test',
                password: 'CustomerTest2026!',
                firstName: 'María',
                lastName: 'González',
                role: 'CUSTOMER',
                isActive: true,
            },
            {
                email: 'carlos@buenorigen.test',
                password: 'CustomerTest2026!',
                firstName: 'Carlos',
                lastName: 'Muñoz',
                role: 'CUSTOMER',
                isActive: true,
            },
            {
                email: 'andrea@buenorigen.test',
                password: 'CustomerTest2026!',
                firstName: 'Andrea',
                lastName: 'Silva',
                role: 'CUSTOMER',
                isActive: true,
            },
            {
                email: 'pedro@buenorigen.test',
                password: 'CustomerTest2026!',
                firstName: 'Pedro',
                lastName: 'Rojas',
                role: 'CUSTOMER',
                isActive: true,
            },
            {
                email: 'laura@buenorigen.test',
                password: 'CustomerTest2026!',
                firstName: 'Laura',
                lastName: 'Soto',
                role: 'CUSTOMER',
                isActive: false,
            },
        ];

        for (const user of users) {

            const passwordHash = await argon2.hash(
                user.password,
                {
                    type: argon2.argon2id,
                },
            );

            await queryRunner.query(`
                INSERT INTO users (
                    email,
                    password_hash,
                    first_name,
                    last_name,
                    role,
                    is_active,
                    privacy_accepted_at
                )
                VALUES ($1, $2, $3, $4, $5, $6, NOW());
            `, [
                user.email,
                passwordHash,
                user.firstName,
                user.lastName,
                user.role,
                user.isActive,
            ]);
        }

        // Productores

        await queryRunner.query(`
            INSERT INTO producers (
                user_id,
                business_name,
                description,
                location
            )
            VALUES
                (
                    (SELECT id FROM users
                     WHERE email = 'ecoraiz@buenorigen.test'),
                    'EcoRaíz',
                    'Emprendimiento dedicado a la elaboración de productos sustentables.',
                    'Santiago'
                ),
                (
                    (SELECT id FROM users
                     WHERE email = 'verdehogar@buenorigen.test'),
                    'Verde Hogar',
                    'Emprendimiento enfocado en productos ecológicos para el hogar.',
                    'Valparaíso'
                ),
                (
                    (SELECT id FROM users
                     WHERE email = 'naturalezaviva@buenorigen.test'),
                    'Naturaleza Viva',
                    'Emprendimiento dedicado al bienestar y cuidado personal sustentable.',
                    'Santiago'
                ),
                (
                    (SELECT id FROM users
                     WHERE email = 'saboresdelatierra@buenorigen.test'),
                    'Sabores de la Tierra',
                    'Emprendimiento dedicado a alimentos artesanales y productos naturales.',
                    'Temuco'
                ),
                (
                    (SELECT id FROM users
                     WHERE email = 'huertovivo@buenorigen.test'),
                    'Huerto Vivo',
                    'Emprendimiento especializado en huertos urbanos y jardinería sustentable.',
                    'Talca'
                ),
                (
                    (SELECT id FROM users
                     WHERE email = 'aromasdelbosque@buenorigen.test'),
                    'Aromas del Bosque',
                    'Emprendimiento dedicado a productos naturales de aromaterapia y bienestar.',
                    'Valdivia'
                ),
                (
                    (SELECT id FROM users
                     WHERE email = 'patitasverdes@buenorigen.test'),
                    'Patitas Verdes',
                    'Emprendimiento de accesorios y artículos sustentables para mascotas.',
                    'Concepción'
                ),
                (
                    (SELECT id FROM users
                     WHERE email = 'artecircular@buenorigen.test'),
                    'Arte Circular',
                    'Emprendimiento enfocado en decoración y artesanía con materiales reutilizados.',
                    'Puerto Montt'
                );
        `);

        // Clientes

        await queryRunner.query(`
            INSERT INTO customers (user_id)
            SELECT id
            FROM users
            WHERE role = 'CUSTOMER'
            AND email IN (
                'maria@buenorigen.test',
                'carlos@buenorigen.test',
                'andrea@buenorigen.test',
                'pedro@buenorigen.test',
                'laura@buenorigen.test'
            );
        `);

        // Categorias

        await queryRunner.query(`
            INSERT INTO categories (
                name,
                description
            )
            VALUES
                (
                    'Alimentos',
                    'Productos alimenticios artesanales y sustentables.'
                ),
                (
                    'Cuidado personal',
                    'Productos de higiene y cuidado personal.'
                ),
                (
                    'Huerto y jardín',
                    'Productos para el cultivo y la jardinería.'
                ),
                (
                    'Limpieza del hogar',
                    'Productos y accesorios para la limpieza del hogar.'
                ),
                (
                    'Aromas y bienestar',
                    'Productos de aromaterapia y bienestar personal.'
                ),
                (
                    'Ropa y accesorios',
                    'Prendas de vestir y accesorios sustentables.'
                ),
                (
                    'Mascotas',
                    'Productos y accesorios para mascotas.'
                ),
                (
                    'Decoración y artesanía',
                    'Productos decorativos y artesanales.'
                );
        `);

        // Atributos de sostenibilidad

        await queryRunner.query(`
            INSERT INTO sustainability_attributes (
                name,
                description
            )
            VALUES
                (
                    'Vegano',
                    'Producto sin ingredientes de origen animal.'
                ),
                (
                    'Libre de crueldad animal',
                    'Producto no probado en animales.'
                ),
                (
                    'Reciclado',
                    'Producto elaborado total o parcialmente con materiales reciclados.'
                ),
                (
                    'Reutilizable',
                    'Producto diseñado para utilizarse múltiples veces.'
                ),
                (
                    'Libre de plástico',
                    'Producto libre de componentes plásticos.'
                ),
                (
                    'Orgánico certificado',
                    'Producto que cuenta con certificación orgánica.'
                ),
                (
                    'Compostable certificado',
                    'Producto que cuenta con certificación de compostabilidad.'
                );
        `);

        // Carrito permanente de cada cliente

        await queryRunner.query(`
            INSERT INTO carts (customer_id)
            SELECT c.id
            FROM customers c
            JOIN users u ON u.id = c.user_id
            WHERE u.email IN (
                'maria@buenorigen.test',
                'carlos@buenorigen.test',
                'andrea@buenorigen.test',
                'pedro@buenorigen.test',
                'laura@buenorigen.test'
            );
        `);

        // Puntos verdes de bienvenida

        await queryRunner.query(`
            INSERT INTO green_point_movements (
                customer_id,
                type,
                points,
                description
            )
            SELECT
                c.id,
                'WELCOME',
                80,
                'Puntos verdes de bienvenida'
            FROM customers c
            JOIN users u ON u.id = c.user_id
            WHERE u.email IN (
                'maria@buenorigen.test',
                'carlos@buenorigen.test',
                'andrea@buenorigen.test',
                'pedro@buenorigen.test',
                'laura@buenorigen.test'
            );
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {

        await queryRunner.query(`
            DELETE FROM green_point_movements
            WHERE type = 'WELCOME'
            AND customer_id IN (
                SELECT c.id
                FROM customers c
                JOIN users u ON u.id = c.user_id
                WHERE u.email IN (
                    'maria@buenorigen.test',
                    'carlos@buenorigen.test',
                    'andrea@buenorigen.test',
                    'pedro@buenorigen.test',
                    'laura@buenorigen.test'
                )
            );
        `);

        await queryRunner.query(`
            DELETE FROM carts
            WHERE customer_id IN (
                SELECT c.id
                FROM customers c
                JOIN users u ON u.id = c.user_id
                WHERE u.email IN (
                    'maria@buenorigen.test',
                    'carlos@buenorigen.test',
                    'andrea@buenorigen.test',
                    'pedro@buenorigen.test',
                    'laura@buenorigen.test'
                )
            );
        `);

        await queryRunner.query(`
            DELETE FROM producers
            WHERE user_id IN (
                SELECT id
                FROM users
                WHERE email IN (
                    'ecoraiz@buenorigen.test',
                    'verdehogar@buenorigen.test',
                    'naturalezaviva@buenorigen.test',
                    'saboresdelatierra@buenorigen.test',
                    'huertovivo@buenorigen.test',
                    'aromasdelbosque@buenorigen.test',
                    'patitasverdes@buenorigen.test',
                    'artecircular@buenorigen.test'
                )
            );
        `);

        await queryRunner.query(`
            DELETE FROM customers
            WHERE user_id IN (
                SELECT id
                FROM users
                WHERE email IN (
                    'maria@buenorigen.test',
                    'carlos@buenorigen.test',
                    'andrea@buenorigen.test',
                    'pedro@buenorigen.test',
                    'laura@buenorigen.test'
                )
            );
        `);

        await queryRunner.query(`
            DELETE FROM users
            WHERE email IN (
                'admin@buenorigen.test',
                'ecoraiz@buenorigen.test',
                'verdehogar@buenorigen.test',
                'naturalezaviva@buenorigen.test',
                'saboresdelatierra@buenorigen.test',
                'huertovivo@buenorigen.test',
                'aromasdelbosque@buenorigen.test',
                'patitasverdes@buenorigen.test',
                'artecircular@buenorigen.test',
                'maria@buenorigen.test',
                'carlos@buenorigen.test',
                'andrea@buenorigen.test',
                'pedro@buenorigen.test',
                'laura@buenorigen.test'
            );
        `);

        await queryRunner.query(`
            DELETE FROM sustainability_attributes
            WHERE name IN (
                'Vegano',
                'Libre de crueldad animal',
                'Reciclado',
                'Reutilizable',
                'Libre de plástico',
                'Orgánico certificado',
                'Compostable certificado'
            );
        `);

        await queryRunner.query(`
            DELETE FROM categories
            WHERE name IN (
                'Alimentos',
                'Cuidado personal',
                'Huerto y jardín',
                'Limpieza del hogar',
                'Aromas y bienestar',
                'Ropa y accesorios',
                'Mascotas',
                'Decoración y artesanía'
            );
        `);
    }
}