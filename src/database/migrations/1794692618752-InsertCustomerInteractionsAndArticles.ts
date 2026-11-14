import { MigrationInterface, QueryRunner } from 'typeorm';

export class InsertCustomerInteractionsAndArticles1794692618752
    implements MigrationInterface {

    private readonly customerEmails = [
        'maria@buenorigen.test',
        'carlos@buenorigen.test',
        'andrea@buenorigen.test',
        'pedro@buenorigen.test',
        'laura@buenorigen.test',
    ];

    public async up(queryRunner: QueryRunner): Promise<void> {

        if (process.env.NODE_ENV === 'production') {
            throw new Error(
                'Los datos de prueba no pueden cargarse en produccion.',
            );
        }

        // Verificar que no existan datos previos

        const existingData = await queryRunner.query(`
            SELECT (
                (SELECT COUNT(*) FROM reviews) +
                (SELECT COUNT(*) FROM favorites) +
                (SELECT COUNT(*) FROM articles) +
                (
                    SELECT COUNT(*)
                    FROM green_point_movements
                    WHERE type <> 'WELCOME'
                )
            )::int AS total;
        `);

        if (existingData[0].total !== 0) {
            throw new Error(
                'Ya existen datos de interacciones o articulos.',
            );
        }

        // VALORACIONES
        // Solo productos de pedidos entregados.

        await queryRunner.query(`
            INSERT INTO reviews (
                customer_id,
                product_id,
                rating,
                comment,
                created_at,
                updated_at
            )
            SELECT
                o.customer_id,
                oi.product_id,

                CASE oi.product_name
                    WHEN 'Miel de Ulmo Artesanal 500 g' THEN 5
                    WHEN 'Tazón Pez' THEN 5
                    WHEN 'Juguete Pato' THEN 4
                    WHEN 'Kit de Hierbas Aromáticas' THEN 5
                    WHEN 'Crema Corporal de Caléndula 200 ml' THEN 4
                    WHEN 'Vela Cinnamon' THEN 5
                    WHEN 'Polera Trip' THEN 5
                    WHEN 'Limpiador Multiuso Ecológico 500 ml' THEN 4
                    WHEN 'Vela Vainilla' THEN 3
                    WHEN 'Mermelada de Maqui y Murtilla Silvestre 250 g' THEN 5
                END,

                CASE oi.product_name
                    WHEN 'Miel de Ulmo Artesanal 500 g'
                        THEN 'Muy buena calidad y excelente sabor.'

                    WHEN 'Tazón Pez'
                        THEN 'Muy bonito diseño y buena terminacion.'

                    WHEN 'Juguete Pato'
                        THEN 'A mi mascota le gusto mucho.'

                    WHEN 'Kit de Hierbas Aromáticas'
                        THEN 'Excelente para comenzar un huerto en casa.'

                    WHEN 'Crema Corporal de Caléndula 200 ml'
                        THEN 'Buena textura y aroma agradable.'

                    WHEN 'Vela Cinnamon'
                        THEN 'Muy buen aroma y duracion.'

                    WHEN 'Polera Trip'
                        THEN 'Comoda y de buena calidad.'

                    WHEN 'Limpiador Multiuso Ecológico 500 ml'
                        THEN 'Buen producto para la limpieza cotidiana.'

                    WHEN 'Vela Vainilla'
                        THEN NULL

                    WHEN 'Mermelada de Maqui y Murtilla Silvestre 250 g'
                        THEN 'Excelente sabor.'
                END,

                o.delivered_at + INTERVAL '1 day',
                o.delivered_at + INTERVAL '1 day'

            FROM orders o

            JOIN order_items oi
                ON oi.order_id = o.id

            JOIN customers c
                ON c.id = o.customer_id

            JOIN users u
                ON u.id = c.user_id

            WHERE o.status = 'DELIVERED'
            AND u.email = ANY($1::text[]);
        `, [this.customerEmails]);

        // FAVORITOS

        const favorites = [
            {
                email: 'maria@buenorigen.test',
                product: 'Miel de Ulmo Artesanal 500 g',
            },
            {
                email: 'maria@buenorigen.test',
                product: 'Tazón Pez',
            },
            {
                email: 'maria@buenorigen.test',
                product: 'Vela Cinnamon',
            },
            {
                email: 'carlos@buenorigen.test',
                product: 'Juguete Pato',
            },
            {
                email: 'carlos@buenorigen.test',
                product: 'Kit de Hierbas Aromáticas',
            },
            {
                email: 'carlos@buenorigen.test',
                product: 'Macetero Colgante de Yute y Madera Reciclada',
            },
            {
                email: 'andrea@buenorigen.test',
                product: 'Crema Corporal de Caléndula 200 ml',
            },
            {
                email: 'andrea@buenorigen.test',
                product: 'Vela Cinnamon',
            },
            {
                email: 'andrea@buenorigen.test',
                product: 'Sérum Facial Hidratante de Rosa Mosqueta y Vitamina E 30 ml',
            },
            {
                email: 'pedro@buenorigen.test',
                product: 'Limpiador Multiuso Ecológico 500 ml',
            },
            {
                email: 'pedro@buenorigen.test',
                product: 'Tazón Pez',
            },
            {
                email: 'pedro@buenorigen.test',
                product: 'Harina Tostada de Trigo Integral 500 g',
            },
            {
                email: 'laura@buenorigen.test',
                product: 'Vela Vainilla',
            },
            {
                email: 'laura@buenorigen.test',
                product: 'Mermelada de Maqui y Murtilla Silvestre 250 g',
            },
            {
                email: 'laura@buenorigen.test',
                product: 'Té Negro con Merkén y Cítricos 80 g',
            },
        ];

        for (const favorite of favorites) {

            await queryRunner.query(`
                INSERT INTO favorites (
                    customer_id,
                    product_id,
                    created_at
                )
                SELECT
                    c.id,
                    p.id,
                    NOW() - INTERVAL '5 days'

                FROM customers c

                JOIN users u
                    ON u.id = c.user_id

                CROSS JOIN products p

                WHERE u.email = $1
                AND p.name = $2;
            `, [
                favorite.email,
                favorite.product,
            ]);
        }

        // PUNTOS VERDES POR COMPRAS
        // Utilizar valores historicos del detalle del pedido.

        await queryRunner.query(`
            INSERT INTO green_point_movements (
                customer_id,
                type,
                points,
                order_id,
                description,
                created_at
            )
            SELECT
                o.customer_id,
                'PURCHASE',
                SUM(
                    oi.quantity * oi.unit_green_points
                )::int,
                o.id,
                'Puntos verdes por compra entregada',
                o.delivered_at

            FROM orders o

            JOIN order_items oi
                ON oi.order_id = o.id

            JOIN customers c
                ON c.id = o.customer_id

            JOIN users u
                ON u.id = c.user_id

            WHERE o.status = 'DELIVERED'
            AND u.email = ANY($1::text[])

            GROUP BY
                o.id,
                o.customer_id,
                o.delivered_at

            HAVING SUM(
                oi.quantity * oi.unit_green_points
            ) > 0;
        `, [this.customerEmails]);

        // PUNTOS VERDES POR VALORACIONES
        // Cinco puntos por cada valoracion.

        await queryRunner.query(`
            INSERT INTO green_point_movements (
                customer_id,
                type,
                points,
                review_id,
                description,
                created_at
            )
            SELECT
                r.customer_id,
                'REVIEW',
                5,
                r.id,
                'Puntos verdes por valoracion de producto',
                r.created_at

            FROM reviews r

            JOIN customers c
                ON c.id = r.customer_id

            JOIN users u
                ON u.id = c.user_id

            WHERE u.email = ANY($1::text[]);
        `, [this.customerEmails]);

        // CANJE DE PUNTOS VERDES
        // Registrar el descuento como movimiento negativo.

        await queryRunner.query(`
            INSERT INTO green_point_movements (
                customer_id,
                type,
                points,
                order_id,
                description,
                created_at
            )
            SELECT
                o.customer_id,
                'REDEMPTION',
                -SUM(oi.green_point_discount)::int,
                o.id,
                'Canje de puntos verdes en compra',
                o.confirmed_at

            FROM orders o

            JOIN order_items oi
                ON oi.order_id = o.id

            JOIN customers c
                ON c.id = o.customer_id

            JOIN users u
                ON u.id = c.user_id

            WHERE o.status IN (
                'CONFIRMED',
                'PREPARING',
                'SHIPPED',
                'DELIVERED'
            )

            AND u.email = ANY($1::text[])

            GROUP BY
                o.id,
                o.customer_id,
                o.confirmed_at

            HAVING SUM(oi.green_point_discount) > 0;
        `, [this.customerEmails]);

        // DEVOLUCIONES
        // Revertir los puntos de las unidades devueltas.

        await queryRunner.query(`
            INSERT INTO green_point_movements (
                customer_id,
                type,
                points,
                return_id,
                description,
                created_at
            )
            SELECT
                o.customer_id,
                'RETURN',
                -SUM(
                    ri.quantity * oi.unit_green_points
                )::int,
                r.id,
                'Reversion de puntos verdes por devolucion',
                r.completed_at

            FROM returns r

            JOIN orders o
                ON o.id = r.order_id

            JOIN return_items ri
                ON ri.return_id = r.id

            JOIN order_items oi
                ON oi.id = ri.order_item_id

            JOIN customers c
                ON c.id = o.customer_id

            JOIN users u
                ON u.id = c.user_id

            WHERE r.status = 'COMPLETED'
            AND u.email = ANY($1::text[])

            GROUP BY
                r.id,
                o.customer_id,
                r.completed_at

            HAVING SUM(
                ri.quantity * oi.unit_green_points
            ) > 0;
        `, [this.customerEmails]);

        // RESTITUCION DE PUNTOS CANJEADOS
        // Aplicable a devoluciones completadas con puntos restaurados.

        await queryRunner.query(`
            INSERT INTO green_point_movements (
                customer_id,
                type,
                points,
                return_id,
                description,
                created_at
            )
            SELECT
                o.customer_id,
                'REFUND',
                SUM(ri.green_points_restored)::int,
                r.id,
                'Restitucion de puntos verdes canjeados',
                r.completed_at

            FROM returns r

            JOIN orders o
                ON o.id = r.order_id

            JOIN return_items ri
                ON ri.return_id = r.id

            JOIN customers c
                ON c.id = o.customer_id

            JOIN users u
                ON u.id = c.user_id

            WHERE r.status = 'COMPLETED'
            AND u.email = ANY($1::text[])

            GROUP BY
                r.id,
                o.customer_id,
                r.completed_at

            HAVING SUM(ri.green_points_restored) > 0;
        `, [this.customerEmails]);

        // ARTICULOS DEL BLOG

        await queryRunner.query(`
            INSERT INTO articles (
                author_id,
                title,
                summary,
                content,
                status,
                published_at,
                created_at,
                updated_at
            )
            VALUES
            (
                (
                    SELECT id FROM users
                    WHERE email = 'admin@buenorigen.test'
                ),
                'Cinco formas de reducir residuos en el hogar',
                'Recomendaciones para adoptar hábitos más sustentables.',
                'Reducir los residuos comienza con pequeños cambios cotidianos, como reutilizar envases, preferir productos duraderos y separar materiales reciclables.',
                'PUBLISHED',
                NOW() - INTERVAL '20 days',
                NOW() - INTERVAL '21 days',
                NOW() - INTERVAL '20 days'
            ),
            (
                (
                    SELECT id FROM users
                    WHERE email = 'admin@buenorigen.test'
                ),
                'La importancia de apoyar a emprendedores locales',
                'Conoce los beneficios del comercio local.',
                'Apoyar a emprendedores locales contribuye al desarrollo de las comunidades, favorece la economía regional y permite conocer productos con identidad propia.',
                'PUBLISHED',
                NOW() - INTERVAL '15 days',
                NOW() - INTERVAL '16 days',
                NOW() - INTERVAL '15 days'
            ),
            (
                (
                    SELECT id FROM users
                    WHERE email = 'admin@buenorigen.test'
                ),
                'Cómo comenzar un huerto en casa',
                'Consejos para cultivar tus propias plantas.',
                'Un huerto en casa permite acercarnos a la naturaleza. Puedes comenzar utilizando maceteros reutilizables, semillas y hierbas aromáticas.',
                'PUBLISHED',
                NOW() - INTERVAL '5 days',
                NOW() - INTERVAL '6 days',
                NOW() - INTERVAL '5 days'
            ),
            (
                (
                    SELECT id FROM users
                    WHERE email = 'admin@buenorigen.test'
                ),
                'Consumo responsable y economía circular',
                'Introducción a la economía circular.',
                'La economía circular promueve la reutilización, reparación y recuperación de materiales para reducir la generación de residuos.',
                'DRAFT',
                NULL,
                NOW() - INTERVAL '2 days',
                NOW() - INTERVAL '2 days'
            ),
            (
                (
                    SELECT id FROM users
                    WHERE email = 'admin@buenorigen.test'
                ),
                'Bienvenidos a BuenOrigen',
                'Conoce nuestra comunidad.',
                'BuenOrigen busca conectar a consumidores con productores locales y promover alternativas de consumo responsable.',
                'ARCHIVED',
                NOW() - INTERVAL '30 days',
                NOW() - INTERVAL '31 days',
                NOW() - INTERVAL '1 day'
            );
        `);

        // Verificar cantidades insertadas

        const totals = await queryRunner.query(`
            SELECT
                (SELECT COUNT(*) FROM reviews)::int
                    AS reviews,

                (SELECT COUNT(*) FROM favorites)::int
                    AS favorites,

                (SELECT COUNT(*) FROM green_point_movements)::int
                    AS movements,

                (SELECT COUNT(*) FROM articles)::int
                    AS articles;
        `);

        if (
            totals[0].reviews !== 10 ||
            totals[0].favorites !== 15 ||
            totals[0].movements !== 22 ||
            totals[0].articles !== 5
        ) {
            throw new Error(
                'Las cantidades de datos insertados no coinciden.',
            );
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {

        if (process.env.NODE_ENV === 'production') {
            throw new Error(
                'Esta migracion no debe revertirse en produccion.',
            );
        }

        // Eliminar movimientos de puntos verdes.
        // Conservar los puntos de bienvenida.

        await queryRunner.query(`
            DELETE FROM green_point_movements
            WHERE type IN (
                'PURCHASE',
                'REVIEW',
                'REDEMPTION',
                'RETURN',
                'REFUND'
            )

            AND customer_id IN (
                SELECT c.id
                FROM customers c
                JOIN users u ON u.id = c.user_id
                WHERE u.email = ANY($1::text[])
            );
        `, [this.customerEmails]);

        // Eliminar valoraciones

        await queryRunner.query(`
            DELETE FROM reviews

            WHERE customer_id IN (
                SELECT c.id
                FROM customers c
                JOIN users u ON u.id = c.user_id
                WHERE u.email = ANY($1::text[])
            );
        `, [this.customerEmails]);

        // Eliminar favoritos

        await queryRunner.query(`
            DELETE FROM favorites

            WHERE customer_id IN (
                SELECT c.id
                FROM customers c
                JOIN users u ON u.id = c.user_id
                WHERE u.email = ANY($1::text[])
            );
        `, [this.customerEmails]);

        // Eliminar articulos de prueba

        await queryRunner.query(`
            DELETE FROM articles

            WHERE author_id = (
                SELECT id
                FROM users
                WHERE email = 'admin@buenorigen.test'
            )

            AND title IN (
                'Cinco formas de reducir residuos en el hogar',
                'La importancia de apoyar a emprendedores locales',
                'Cómo comenzar un huerto en casa',
                'Consumo responsable y economía circular',
                'Bienvenidos a BuenOrigen'
            );
        `);
    }
}