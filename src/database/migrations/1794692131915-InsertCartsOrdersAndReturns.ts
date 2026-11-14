import { MigrationInterface, QueryRunner } from 'typeorm';

type AddressData = {
    email: string;
    name: string;
    phone: string;
    street: string;
    streetNumber: string;
    commune: string;
    region: string;
};

type OrderData = {
    email: string;
    status: string;
    paymentMethod: string;
    paymentStatus: string;
    daysAgo: number;
    products: {
        name: string;
        quantity: number;
        size?: string;
        discount: number;
    }[];
};

export class InsertCartsOrdersAndReturns1794692131915
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

        // Verificar que las tablas no tengan datos anteriores

        const existingData = await queryRunner.query(`
            SELECT (
                (SELECT COUNT(*) FROM addresses) +
                (SELECT COUNT(*) FROM cart_items) +
                (SELECT COUNT(*) FROM orders) +
                (SELECT COUNT(*) FROM order_items) +
                (SELECT COUNT(*) FROM returns) +
                (SELECT COUNT(*) FROM return_items)
            )::int AS total;
        `);

        if (existingData[0].total !== 0) {
            throw new Error(
                'Las tablas deben estar vacias para cargar los datos de prueba.',
            );
        }

        // DIRECCIONES

        const addresses: AddressData[] = [
            {
                email: 'maria@buenorigen.test',
                name: 'María González',
                phone: '+56910000001',
                street: 'Avenida de Prueba',
                streetNumber: '100',
                commune: 'Santiago',
                region: 'Metropolitana',
            },
            {
                email: 'carlos@buenorigen.test',
                name: 'Carlos Muñoz',
                phone: '+56910000002',
                street: 'Calle de Prueba',
                streetNumber: '200',
                commune: 'Providencia',
                region: 'Metropolitana',
            },
            {
                email: 'andrea@buenorigen.test',
                name: 'Andrea Silva',
                phone: '+56910000003',
                street: 'Pasaje de Prueba',
                streetNumber: '300',
                commune: 'Ñuñoa',
                region: 'Metropolitana',
            },
            {
                email: 'pedro@buenorigen.test',
                name: 'Pedro Rojas',
                phone: '+56910000004',
                street: 'Avenida de Prueba',
                streetNumber: '400',
                commune: 'Valparaíso',
                region: 'Valparaíso',
            },
            {
                email: 'laura@buenorigen.test',
                name: 'Laura Soto',
                phone: '+56910000005',
                street: 'Calle de Prueba',
                streetNumber: '500',
                commune: 'Concepción',
                region: 'Biobío',
            },
        ];

        for (const address of addresses) {

            // Direccion principal

            await queryRunner.query(`
                INSERT INTO addresses (
                    customer_id,
                    label,
                    recipient_name,
                    recipient_phone,
                    street,
                    street_number,
                    commune,
                    region,
                    is_default,
                    is_active
                )
                SELECT
                    c.id,
                    'Casa',
                    $2,
                    $3,
                    $4,
                    $5,
                    $6,
                    $7,
                    true,
                    true
                FROM customers c
                JOIN users u ON u.id = c.user_id
                WHERE u.email = $1;
            `, [
                address.email,
                address.name,
                address.phone,
                address.street,
                address.streetNumber,
                address.commune,
                address.region,
            ]);

            // Direccion secundaria

            await queryRunner.query(`
                INSERT INTO addresses (
                    customer_id,
                    label,
                    recipient_name,
                    recipient_phone,
                    street,
                    street_number,
                    apartment,
                    commune,
                    region,
                    is_default,
                    is_active
                )
                SELECT
                    c.id,
                    'Trabajo',
                    $2,
                    $3,
                    $4,
                    '900',
                    '201',
                    $5,
                    $6,
                    false,
                    true
                FROM customers c
                JOIN users u ON u.id = c.user_id
                WHERE u.email = $1;
            `, [
                address.email,
                address.name,
                address.phone,
                address.street,
                address.commune,
                address.region,
            ]);
        }

        // ITEMS DE CARRITO

        const cartItems = [
            {
                email: 'maria@buenorigen.test',
                product: 'Miel de Ulmo Artesanal 500 g',
                quantity: 2,
            },
            {
                email: 'maria@buenorigen.test',
                product: 'Vela Cinnamon',
                quantity: 1,
            },
            {
                email: 'maria@buenorigen.test',
                product: 'Tazón Pez',
                quantity: 1,
            },
            {
                email: 'carlos@buenorigen.test',
                product: 'Juguete Pato',
                quantity: 2,
            },
            {
                email: 'carlos@buenorigen.test',
                product: 'Kit de Hierbas Aromáticas',
                quantity: 1,
            },
            {
                email: 'andrea@buenorigen.test',
                product: 'Crema Corporal de Caléndula 200 ml',
                quantity: 1,
            },
            {
                email: 'andrea@buenorigen.test',
                product: 'Limpiador Multiuso Ecológico 500 ml',
                quantity: 3,
            },
            {
                email: 'andrea@buenorigen.test',
                product: 'Vela Vainilla',
                quantity: 1,
            },
            {
                email: 'pedro@buenorigen.test',
                product: 'Tazón Pez',
                quantity: 2,
            },
            {
                email: 'pedro@buenorigen.test',
                product: 'Mermelada de Maqui y Murtilla Silvestre 250 g',
                quantity: 1,
            },
        ];

        for (const item of cartItems) {

            await queryRunner.query(`
                INSERT INTO cart_items (
                    cart_id,
                    product_id,
                    quantity
                )
                SELECT
                    ca.id,
                    p.id,
                    $3
                FROM carts ca
                JOIN customers c ON c.id = ca.customer_id
                JOIN users u ON u.id = c.user_id
                CROSS JOIN products p
                WHERE u.email = $1
                AND p.name = $2
                AND p.is_active = true
                AND p.stock >= $3;
            `, [
                item.email,
                item.product,
                item.quantity,
            ]);
        }

        // PEDIDOS

        const orders: OrderData[] = [

            // Pedido 1 - Entregado

            {
                email: 'maria@buenorigen.test',
                status: 'DELIVERED',
                paymentMethod: 'DEBIT_CARD',
                paymentStatus: 'PARTIALLY_REFUNDED',
                daysAgo: 20,
                products: [
                    {
                        name: 'Miel de Ulmo Artesanal 500 g',
                        quantity: 2,
                        discount: 0,
                    },
                    {
                        name: 'Tazón Pez',
                        quantity: 1,
                        discount: 0,
                    },
                ],
            },

            // Pedido 2 - Entregado

            {
                email: 'carlos@buenorigen.test',
                status: 'DELIVERED',
                paymentMethod: 'CREDIT_CARD',
                paymentStatus: 'PAID',
                daysAgo: 18,
                products: [
                    {
                        name: 'Juguete Pato',
                        quantity: 2,
                        discount: 0,
                    },
                    {
                        name: 'Kit de Hierbas Aromáticas',
                        quantity: 1,
                        discount: 0,
                    },
                ],
            },

            // Pedido 3 - Entregado

            {
                email: 'andrea@buenorigen.test',
                status: 'DELIVERED',
                paymentMethod: 'BANK_TRANSFER',
                paymentStatus: 'PAID',
                daysAgo: 16,
                products: [
                    {
                        name: 'Crema Corporal de Caléndula 200 ml',
                        quantity: 1,
                        discount: 0,
                    },
                    {
                        name: 'Vela Cinnamon',
                        quantity: 2,
                        discount: 0,
                    },
                ],
            },

            // Pedido 4 - Entregado

            {
                email: 'pedro@buenorigen.test',
                status: 'DELIVERED',
                paymentMethod: 'DEBIT_CARD',
                paymentStatus: 'PAID',
                daysAgo: 14,
                products: [
                    {
                        name: 'Polera Trip',
                        size: 'L',
                        quantity: 1,
                        discount: 0,
                    },
                    {
                        name: 'Limpiador Multiuso Ecológico 500 ml',
                        quantity: 2,
                        discount: 0,
                    },
                ],
            },

            // Pedido 5 - Entregado
            // Compra historica de la clienta actualmente inactiva

            {
                email: 'laura@buenorigen.test',
                status: 'DELIVERED',
                paymentMethod: 'CREDIT_CARD',
                paymentStatus: 'PAID',
                daysAgo: 12,
                products: [
                    {
                        name: 'Vela Vainilla',
                        quantity: 1,
                        discount: 0,
                    },
                    {
                        name: 'Mermelada de Maqui y Murtilla Silvestre 250 g',
                        quantity: 1,
                        discount: 0,
                    },
                ],
            },

            // Pedido 6 - Confirmado

            {
                email: 'maria@buenorigen.test',
                status: 'CONFIRMED',
                paymentMethod: 'DEBIT_CARD',
                paymentStatus: 'PAID',
                daysAgo: 1,
                products: [
                    {
                        name: 'Desodorante Natural en Crema de Karité y Tea Tree 50 g',
                        quantity: 1,
                        discount: 25,
                    },
                    {
                        name: 'Juguete Pato',
                        quantity: 1,
                        discount: 38,
                    },
                ],
            },

            // Pedido 7 - En preparacion

            {
                email: 'carlos@buenorigen.test',
                status: 'PREPARING',
                paymentMethod: 'BANK_TRANSFER',
                paymentStatus: 'PAID',
                daysAgo: 2,
                products: [
                    {
                        name: 'Tabla de Picar de Madera Nativa (Raulí y Mañío)',
                        quantity: 1,
                        discount: 0,
                    },
                    {
                        name: 'Snack Natural de Salmón Deshidratado 80 g',
                        quantity: 2,
                        discount: 0,
                    },
                ],
            },

            // Pedido 8 - Despachado

            {
                email: 'andrea@buenorigen.test',
                status: 'SHIPPED',
                paymentMethod: 'CREDIT_CARD',
                paymentStatus: 'PAID',
                daysAgo: 4,
                products: [
                    {
                        name: 'Kit de Germinación de Brotes en Casa',
                        quantity: 1,
                        discount: 0,
                    },
                    {
                        name: 'Tazón Pez',
                        quantity: 1,
                        discount: 0,
                    },
                ],
            },

            // Pedido 9 - Pendiente

            {
                email: 'pedro@buenorigen.test',
                status: 'PENDING',
                paymentMethod: 'BANK_TRANSFER',
                paymentStatus: 'PENDING',
                daysAgo: 0,
                products: [
                    {
                        name: 'Té Negro con Merkén y Cítricos 80 g',
                        quantity: 2,
                        discount: 0,
                    },
                    {
                        name: 'Vela Lavanda',
                        quantity: 1,
                        discount: 0,
                    },
                ],
            },

            // Pedido 10 - Cancelado antes del despacho

            {
                email: 'maria@buenorigen.test',
                status: 'CANCELLED',
                paymentMethod: 'DEBIT_CARD',
                paymentStatus: 'REFUNDED',
                daysAgo: 8,
                products: [
                    {
                        name: 'Juguete Pato',
                        quantity: 1,
                        discount: 0,
                    },
                    {
                        name: 'Vela Cinnamon',
                        quantity: 1,
                        discount: 0,
                    },
                ],
            },
        ];

        const insertedOrders: number[] = [];

        const now = new Date();

        for (const order of orders) {

            const createdAt = new Date(now);

            createdAt.setDate(
                createdAt.getDate() - order.daysAgo,
            );

            const confirmedAt = new Date(
                createdAt.getTime() + 60000,
            );

            const preparedAt = new Date(
                createdAt.getTime() + 3600000,
            );

            const shippedAt = new Date(
                createdAt.getTime() + 86400000,
            );

            const deliveredAt = new Date(
                createdAt.getTime() + 172800000,
            );

            const cancelledAt = new Date(
                createdAt.getTime() + 3600000,
            );

            const isConfirmed =
                order.status !== 'PENDING';

            const isShipped =
                order.status === 'SHIPPED' ||
                order.status === 'DELIVERED';

            const isDelivered =
                order.status === 'DELIVERED';

            const isCancelled =
                order.status === 'CANCELLED';

            let updatedAt = createdAt;

            if (isConfirmed) {
                updatedAt = confirmedAt;
            }

            if (order.status === 'PREPARING') {
                updatedAt = preparedAt;
            }

            if (isShipped) {
                updatedAt = shippedAt;
            }

            if (isDelivered) {
                updatedAt = deliveredAt;
            }

            if (isCancelled) {
                updatedAt = cancelledAt;
            }

            // Insertar encabezado del pedido

            const result = await queryRunner.query(`
                INSERT INTO orders (
                    customer_id,
                    address_id,
                    status,
                    payment_method,
                    payment_status,
                    shipping_cost,
                    shipping_recipient_name,
                    shipping_recipient_phone,
                    shipping_street,
                    shipping_street_number,
                    shipping_apartment,
                    shipping_commune,
                    shipping_region,
                    shipping_reference,
                    created_at,
                    updated_at,
                    confirmed_at,
                    shipped_at,
                    delivered_at,
                    cancelled_at
                )
                SELECT
                    c.id,
                    a.id,
                    $2,
                    $3,
                    $4,
                    2990,
                    a.recipient_name,
                    a.recipient_phone,
                    a.street,
                    a.street_number,
                    a.apartment,
                    a.commune,
                    a.region,
                    a.reference,
                    $5,
                    $6,
                    $7,
                    $8,
                    $9,
                    $10
                FROM customers c
                JOIN users u ON u.id = c.user_id
                JOIN addresses a ON a.customer_id = c.id
                WHERE u.email = $1
                AND a.is_default = true
                AND a.is_active = true
                RETURNING id;
            `, [
                order.email,
                order.status,
                order.paymentMethod,
                order.paymentStatus,
                createdAt,
                updatedAt,
                isConfirmed ? confirmedAt : null,
                isShipped ? shippedAt : null,
                isDelivered ? deliveredAt : null,
                isCancelled ? cancelledAt : null,
            ]);

            if (result.length !== 1) {
                throw new Error(
                    `No se pudo crear el pedido de ${order.email}`,
                );
            }

            const orderId = result[0].id;

            insertedOrders.push(orderId);

            // Insertar detalle del pedido

            for (let i = 0; i < order.products.length; i++) {

                const item = order.products[i];

                const isPrepared =
                    isShipped ||
                    (
                        order.status === 'PREPARING' &&
                        i === 0
                    );

                const products = await queryRunner.query(`
                    SELECT
                        p.id,
                        p.name,
                        p.description,
                        COALESCE(
                            cd.material,
                            gd.material,
                            pd.material,
                            cr.material
                        ) AS material,
                        COALESCE(cd.size, pd.size) AS size,
                        COALESCE(cd.color, cr.color) AS color,
                        CASE
                            WHEN p.offer_price IS NOT NULL
                            AND $3::timestamptz >= p.offer_start_at
                            AND $3::timestamptz < p.offer_end_at
                            THEN p.offer_price
                            ELSE p.price
                        END AS effective_price,
                        p.co2_avoided,
                        FLOOR(p.co2_avoided * 100)::int
                            AS green_points
                    FROM products p
                    LEFT JOIN clothing_details cd
                        ON cd.product_id = p.id
                    LEFT JOIN garden_details gd
                        ON gd.product_id = p.id
                    LEFT JOIN pet_details pd
                        ON pd.product_id = p.id
                    LEFT JOIN craft_details cr
                        ON cr.product_id = p.id
                    WHERE p.name = $1
                    AND (
                        $2::varchar IS NULL
                        OR cd.size = $2
                    );
                `, [
                    item.name,
                    item.size ?? null,
                    createdAt,
                ]);

                if (products.length !== 1) {
                    throw new Error(
                        `Producto no encontrado o ambiguo: ${item.name}`,
                    );
                }

                const product = products[0];

                await queryRunner.query(`
                    INSERT INTO order_items (
                        order_id,
                        product_id,
                        product_name,
                        product_description,
                        product_size,
                        product_color,
                        product_material,
                        quantity,
                        unit_price,
                        unit_co2_avoided,
                        unit_green_points,
                        green_point_discount,
                        is_prepared,
                        prepared_at
                    )
                    VALUES (
                        $1, $2, $3, $4, $5, $6, $7,
                        $8, $9, $10, $11, $12, $13, $14
                    );
                `, [
                    orderId,
                    product.id,
                    product.name,
                    product.description,
                    product.size,
                    product.color,
                    product.material,
                    item.quantity,
                    product.effective_price,
                    product.co2_avoided,
                    product.green_points,
                    item.discount,
                    isPrepared,
                    isPrepared ? preparedAt : null,
                ]);

                // Descontar stock de pedidos confirmados,
                // en preparacion, despachados o entregados.
                // Los pendientes no descuentan stock.
                // Los cancelados tienen su stock restituido.

                if (isConfirmed && !isCancelled) {

                    const updatedProducts = await queryRunner.query(`
                        UPDATE products
                        SET stock = stock - $2
                        WHERE id = $1
                        AND stock >= $2
                        RETURNING id;
                    `, [
                        product.id,
                        item.quantity,
                    ]);

                    // PostgreSQL y TypeORM pueden retornar
                    // las filas y el numero de registros afectados.

                    const affectedRows = Array.isArray(
                        updatedProducts[0],
                    )
                        ? updatedProducts[0]
                        : updatedProducts;

                    if (affectedRows.length !== 1) {
                        throw new Error(
                            `Stock insuficiente: ${item.name}`,
                        );
                    }
                }
            }
        }

        // DEVOLUCIONES

        // Devolucion 1
        // Maria devuelve una de las dos unidades de miel.
        // Devolucion completada, parcial y con reposicion de stock.

        const completedReturn = await queryRunner.query(`
            INSERT INTO returns (
                order_id,
                status,
                reason,
                admin_notes,
                processed_by,
                created_at,
                updated_at,
                completed_at
            )
            VALUES (
                $1,
                'COMPLETED',
                'Una unidad llego con el envase danado.',
                'Devolucion aprobada y reembolso realizado.',
                (
                    SELECT id FROM users
                    WHERE email = 'admin@buenorigen.test'
                ),
                NOW() - INTERVAL '10 days',
                NOW() - INTERVAL '9 days',
                NOW() - INTERVAL '9 days'
            )
            RETURNING id;
        `, [insertedOrders[0]]);

        await queryRunner.query(`
            INSERT INTO return_items (
                return_id,
                order_item_id,
                quantity,
                refund_amount,
                green_points_restored,
                restock
            )
            SELECT
                $1,
                oi.id,
                1,
                oi.unit_price,
                0,
                true
            FROM order_items oi
            WHERE oi.order_id = $2
            AND oi.product_name = 'Miel de Ulmo Artesanal 500 g';
        `, [
            completedReturn[0].id,
            insertedOrders[0],
        ]);

        // Reponer una unidad por devolucion completada

        await queryRunner.query(`
            UPDATE products p
            SET stock = p.stock + ri.quantity
            FROM return_items ri
            JOIN order_items oi ON oi.id = ri.order_item_id
            WHERE ri.return_id = $1
            AND oi.product_id = p.id
            AND ri.restock = true;
        `, [completedReturn[0].id]);

        // Devolucion 2
        // Carlos solicita devolver todos los productos.

        const requestedReturn = await queryRunner.query(`
            INSERT INTO returns (
                order_id,
                status,
                reason,
                created_at,
                updated_at
            )
            VALUES (
                $1,
                'REQUESTED',
                'Solicitud de devolucion de la compra.',
                NOW() - INTERVAL '2 days',
                NOW() - INTERVAL '2 days'
            )
            RETURNING id;
        `, [insertedOrders[1]]);

        await queryRunner.query(`
            INSERT INTO return_items (
                return_id,
                order_item_id,
                quantity,
                refund_amount,
                green_points_restored,
                restock
            )
            SELECT
                $1,
                oi.id,
                oi.quantity,
                0,
                0,
                false
            FROM order_items oi
            WHERE oi.order_id = $2;
        `, [
            requestedReturn[0].id,
            insertedOrders[1],
        ]);

        // Devolucion 3
        // Andrea tiene una devolucion aprobada,
        // pero todavia no completada.

        const approvedReturn = await queryRunner.query(`
            INSERT INTO returns (
                order_id,
                status,
                reason,
                admin_notes,
                processed_by,
                created_at,
                updated_at
            )
            VALUES (
                $1,
                'APPROVED',
                'Solicitud de devolucion de una vela.',
                'Solicitud aprobada, pendiente de recepcion.',
                (
                    SELECT id FROM users
                    WHERE email = 'admin@buenorigen.test'
                ),
                NOW() - INTERVAL '3 days',
                NOW() - INTERVAL '1 day'
            )
            RETURNING id;
        `, [insertedOrders[2]]);

        await queryRunner.query(`
            INSERT INTO return_items (
                return_id,
                order_item_id,
                quantity,
                refund_amount,
                green_points_restored,
                restock
            )
            SELECT
                $1,
                oi.id,
                1,
                0,
                0,
                false
            FROM order_items oi
            WHERE oi.order_id = $2
            AND oi.product_name = 'Vela Cinnamon';
        `, [
            approvedReturn[0].id,
            insertedOrders[2],
        ]);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {

        if (process.env.NODE_ENV === 'production') {
            throw new Error(
                'Esta migracion no debe revertirse en produccion.',
            );
        }

        // Deshacer las reposiciones de stock
        // correspondientes a devoluciones completadas.

        await queryRunner.query(`
            UPDATE products p
            SET stock = p.stock - returned.quantity
            FROM (
                SELECT
                    oi.product_id,
                    SUM(ri.quantity)::int AS quantity
                FROM return_items ri
                JOIN returns r ON r.id = ri.return_id
                JOIN order_items oi ON oi.id = ri.order_item_id
                JOIN orders o ON o.id = r.order_id
                JOIN customers c ON c.id = o.customer_id
                JOIN users u ON u.id = c.user_id
                WHERE r.status = 'COMPLETED'
                AND ri.restock = true
                AND u.email = ANY($1::text[])
                GROUP BY oi.product_id
            ) returned
            WHERE p.id = returned.product_id;
        `, [this.customerEmails]);

        // Restituir el stock descontado por los pedidos.

        await queryRunner.query(`
            UPDATE products p
            SET stock = p.stock + sold.quantity
            FROM (
                SELECT
                    oi.product_id,
                    SUM(oi.quantity)::int AS quantity
                FROM order_items oi
                JOIN orders o ON o.id = oi.order_id
                JOIN customers c ON c.id = o.customer_id
                JOIN users u ON u.id = c.user_id
                WHERE o.status IN (
                    'CONFIRMED',
                    'PREPARING',
                    'SHIPPED',
                    'DELIVERED'
                )
                AND u.email = ANY($1::text[])
                GROUP BY oi.product_id
            ) sold
            WHERE p.id = sold.product_id;
        `, [this.customerEmails]);

        // Eliminar detalles de devoluciones

        await queryRunner.query(`
            DELETE FROM return_items
            WHERE return_id IN (
                SELECT r.id
                FROM returns r
                JOIN orders o ON o.id = r.order_id
                JOIN customers c ON c.id = o.customer_id
                JOIN users u ON u.id = c.user_id
                WHERE u.email = ANY($1::text[])
            );
        `, [this.customerEmails]);

        // Eliminar devoluciones

        await queryRunner.query(`
            DELETE FROM returns
            WHERE order_id IN (
                SELECT o.id
                FROM orders o
                JOIN customers c ON c.id = o.customer_id
                JOIN users u ON u.id = c.user_id
                WHERE u.email = ANY($1::text[])
            );
        `, [this.customerEmails]);

        // Eliminar detalles de pedidos

        await queryRunner.query(`
            DELETE FROM order_items
            WHERE order_id IN (
                SELECT o.id
                FROM orders o
                JOIN customers c ON c.id = o.customer_id
                JOIN users u ON u.id = c.user_id
                WHERE u.email = ANY($1::text[])
            );
        `, [this.customerEmails]);

        // Eliminar pedidos

        await queryRunner.query(`
            DELETE FROM orders
            WHERE customer_id IN (
                SELECT c.id
                FROM customers c
                JOIN users u ON u.id = c.user_id
                WHERE u.email = ANY($1::text[])
            );
        `, [this.customerEmails]);

        // Eliminar items de carrito
        // No eliminar los carritos permanentes.

        await queryRunner.query(`
            DELETE FROM cart_items
            WHERE cart_id IN (
                SELECT ca.id
                FROM carts ca
                JOIN customers c ON c.id = ca.customer_id
                JOIN users u ON u.id = c.user_id
                WHERE u.email = ANY($1::text[])
            );
        `, [this.customerEmails]);

        // Eliminar direcciones

        await queryRunner.query(`
            DELETE FROM addresses
            WHERE customer_id IN (
                SELECT c.id
                FROM customers c
                JOIN users u ON u.id = c.user_id
                WHERE u.email = ANY($1::text[])
            );
        `, [this.customerEmails]);
    }
}
