import { MigrationInterface, QueryRunner } from 'typeorm';

type ProductData = [
    string,
    number,
    string,
    string,
    (string | number | null)[],
    string[],
];

type CategoryData = {
    category: string;
    producerEmail: string;
    detailSql: string;
    products: ProductData[];
};

export class InsertProductCatalog1794691492041
    implements MigrationInterface {

    private readonly catalog: CategoryData[] = [

        // ALIMENTOS

        {
            category: 'Alimentos',
            producerEmail: 'saboresdelatierra@buenorigen.test',

            detailSql: `
                INSERT INTO food_details (
                    product_id,
                    weight_g,
                    ingredients,
                    allergens
                )
                VALUES ($1, $2, $3, $4);
            `,

            products: [
                [
                    'Miel de Ulmo Artesanal 500 g',
                    6990,
                    '3.0562',
                    'Miel de sabor suave y aroma floral, presentada en un frasco de 500 g. Ideal para endulzar infusiones, desayunos y preparaciones.',
                    [500, 'Miel de ulmo', null],
                    ['Reutilizable'],
                ],
                [
                    'Mermelada de Maqui y Murtilla Silvestre 250 g',
                    5490,
                    '2.4862',
                    'Mermelada artesanal elaborada a partir de frutos nativos, presentada en un frasco de vidrio reutilizable.',
                    [250, 'Maqui, murtilla, azúcar de caña y jugo de limón', null],
                    ['Reutilizable'],
                ],
                [
                    'Harina Tostada de Trigo Integral 500 g',
                    3290,
                    '1.6502',
                    'Tradicional harina tostada de grano entero, ideal para preparar ulpo, batidos y repostería.',
                    [500, 'Trigo integral tostado', 'Gluten'],
                    ['Vegano'],
                ],
                [
                    'Polen de Abeja Deshidratado 150 g',
                    4990,
                    '2.2962',
                    'Polen de abeja deshidratado para complementar desayunos, yogures y batidos.',
                    [150, 'Polen de abeja', 'Polen'],
                    ['Reutilizable'],
                ],
                [
                    'Galletas de Avena y Castañas 200 g',
                    3890,
                    '1.8782',
                    'Galletas artesanales crujientes elaboradas con harina de avena integral y trozos de castañas.',
                    [200, 'Avena, harina de trigo, castañas, azúcar y aceite vegetal', 'Gluten y frutos secos'],
                    ['Vegano'],
                ],
                [
                    'Vinagre de Manzana Orgánico 500 ml',
                    4590,
                    '2.1442',
                    'Vinagre de manzana artesanal, sin filtrar ni pasteurizar, ideal para aliños.',
                    [null, 'Manzanas fermentadas', null],
                    ['Vegano'],
                ],
                [
                    'Pack Granola Andina Crujiente 300g 6u',
                    5190,
                    '2.3722',
                    'Mezcla tostada de avena, frutos secos, semillas y miel.',
                    [1800, 'Avena, almendras, semillas de zapallo, pasas y miel', 'Gluten y frutos secos'],
                    [],
                ],
                [
                    'Té Negro con Merkén y Cítricos 80 g',
                    4290,
                    '2.0302',
                    'Mezcla de té negro con cáscaras de naranja deshidratadas y un toque de merkén.',
                    [80, 'Té negro, cáscara de naranja y merkén', null],
                    ['Vegano', 'Reutilizable'],
                ],
            ],
        },

        // CUIDADO PERSONAL

        {
            category: 'Cuidado personal',
            producerEmail: 'naturalezaviva@buenorigen.test',

            detailSql: `
                INSERT INTO personal_care_details (
                    product_id,
                    volume_ml,
                    ingredients,
                    skin_type
                )
                VALUES ($1, $2, $3, $4);
            `,

            products: [
                [
                    'Crema Corporal de Caléndula 200 ml',
                    7990,
                    '3.4362',
                    'Crema corporal de textura ligera, pensada para hidratar y suavizar la piel en la rutina diaria.',
                    [200, 'Agua, aceites vegetales y extracto de caléndula', 'Todo tipo de piel'],
                    [],
                ],
                [
                    'Crema Corporal de Caléndula 400 ml',
                    12990,
                    '5.3362',
                    'Crema corporal de textura ligera con extracto de caléndula, en presentación de mayor volumen.',
                    [400, 'Agua, aceites vegetales y extracto de caléndula', 'Todo tipo de piel'],
                    [],
                ],
                [
                    'Champú Sólido de Extracto de Ortiga y Romero 90 g',
                    6490,
                    '2.8662',
                    'Barra de champú sólido formulada para la limpieza del cabello normal a graso.',
                    [null, 'Tensioactivos de coco, manteca de karité, ortiga y romero', null],
                    [],
                ],
                [
                    'Desodorante Natural en Crema de Karité y Tea Tree 50 g',
                    5890,
                    '2.6382',
                    'Desodorante de origen natural en formato de crema suave.',
                    [null, 'Aceite de coco, karité, almidón de maíz, bicarbonato y árbol de té', 'Normal'],
                    ['Reutilizable'],
                ],
                [
                    'Exfoliante Corporal de Café y Cacao 250 g',
                    10250,
                    '4.2950',
                    'Exfoliante corporal elaborado a base de café molido y manteca de cacao.',
                    [null, 'Café molido, manteca de cacao, aceite de almendras y azúcar', 'Normal'],
                    ['Reutilizable'],
                ],
                [
                    'Jabón Artesanal de Caléndula y Manzanilla 120 g',
                    3990,
                    '1.9162',
                    'Jabón vegetal de saponificación en frío, enriquecido con caléndula y manzanilla.',
                    [null, 'Aceite de oliva, aceite de coco, manzanilla y caléndula', 'Sensible'],
                    ['Vegano'],
                ],
                [
                    'Bálsamo Labial Nutritivo de Cera de Abeja y Miel 15 g',
                    3490,
                    '1.7262',
                    'Bálsamo labial elaborado con cera de abeja y miel.',
                    [null, 'Cera de abeja, manteca de cacao, aceite de ricino y miel', null],
                    [],
                ],
                [
                    'Sérum Facial Hidratante de Rosa Mosqueta y Vitamina E 30 ml',
                    10990,
                    '4.5762',
                    'Aceite facial ligero elaborado con rosa mosqueta y vitamina E.',
                    [30, 'Aceite de rosa mosqueta, jojoba y vitamina E', 'Seca'],
                    [],
                ],
            ],
        },

        // HUERTO Y JARDIN

        {
            category: 'Huerto y jardín',
            producerEmail: 'huertovivo@buenorigen.test',

            detailSql: `
                INSERT INTO garden_details (
                    product_id,
                    material,
                    height_cm,
                    width_cm,
                    depth_cm,
                    weight_g,
                    usage_type
                )
                VALUES ($1, $2, $3, $4, $5, $6, $7);
            `,

            products: [
                [
                    'Kit de Hierbas Aromáticas',
                    12990,
                    '5.3362',
                    'Kit para comenzar un pequeño huerto en casa, con albahaca, menta y romero.',
                    ['Madera y sustrato', 20, 40, 20, null, 'Interior y exterior'],
                    ['Reutilizable'],
                ],
                [
                    'Kit de Germinación de Brotes en Casa',
                    9990,
                    '4.1962',
                    'Kit compacto para cultivar germinados frescos en la cocina de forma sencilla.',
                    ['Vidrio y acero inoxidable', 18, 12, 12, null, 'Interior'],
                    ['Reutilizable'],
                ],
                [
                    'Abono Orgánico Bocashi',
                    5490,
                    '2.4862',
                    'Fertilizante orgánico fermentado para enriquecer la tierra de macetas y huertos.',
                    ['Residuos vegetales compostados', null, null, null, 1000, 'Exterior'],
                    [],
                ],
                [
                    'Macetero Colgante de Yute y Madera Reciclada',
                    11990,
                    '4.9562',
                    'Soporte colgante de diseño rústico para plantas de interior o enredaderas.',
                    ['Yute y madera reciclada', 60, 25, 25, null, 'Interior'],
                    ['Reciclado', 'Reutilizable'],
                ],
                [
                    'Set de Herramientas de Jardinería Mini (Acero y Madera)',
                    14990,
                    '6.0962',
                    'Set de tres herramientas manuales para el mantenimiento de macetas y huertos urbanos.',
                    ['Acero y madera', 25, 10, null, null, 'Interior y exterior'],
                    ['Reutilizable'],
                ],
                [
                    'Guantes de Jardinería con Refuerzo de Cuero Vegano y Algodón',
                    6990,
                    '3.0562',
                    'Guantes protectores diseñados para trabajos de poda, trasplante y limpieza de tierra.',
                    ['Algodón y cuero sintético', null, null, null, null, 'Exterior'],
                    ['Vegano', 'Reutilizable'],
                ],
                [
                    'Rociador Pulidor de Follaje de Bronce y Vidrio 300 ml',
                    8490,
                    '3.6262',
                    'Atomizador manual de estilo retro para regar plantas de interior.',
                    ['Vidrio y aleación metálica', 16, 9, 9, null, 'Interior'],
                    ['Reutilizable'],
                ],
                [
                    'Sustrato Preparado Sustentable para Macetas 5 Litros',
                    4990,
                    '2.2962',
                    'Mezcla de sustrato preparada con fibra de coco, humus de lombriz y perlita.',
                    ['Fibra de coco, humus y perlita', null, null, null, null, 'Interior y exterior'],
                    [],
                ],
            ],
        },

        // LIMPIEZA DEL HOGAR

        {
            category: 'Limpieza del hogar',
            producerEmail: 'verdehogar@buenorigen.test',

            detailSql: `
                INSERT INTO home_cleaning_details (
                    product_id,
                    volume_ml,
                    composition,
                    application_surface
                )
                VALUES ($1, $2, $3, $4);
            `,

            products: [
                [
                    'Limpiador Multiuso Ecológico 500 ml',
                    4990,
                    '2.2962',
                    'Limpiador multiuso para la limpieza cotidiana de superficies lavables del hogar.',
                    [500, 'Agua y agentes limpiadores de origen vegetal', 'Superficies lavables'],
                    [],
                ],
                [
                    'Detergente Líquido Ecológico para Ropa 1 L',
                    6990,
                    '3.0562',
                    'Detergente concentrado de origen vegetal para lavar ropa blanca y de color.',
                    [1000, 'Agua, tensioactivos de coco, saponaria y lavanda', 'Ropa'],
                    ['Reciclado'],
                ],
                [
                    'Lavaloza Concentrado de Biodegradabilidad Rápida 500 ml',
                    4290,
                    '2.0302',
                    'Lavaloza formulado a base de extractos cítricos y agentes limpiadores.',
                    [500, 'Agua, glucósido de coco, extractos cítricos y glicerina', 'Loza'],
                    [],
                ],
                [
                    'Limpiador desinfectante de Superficies a base de Vinagre y Eucalipto 750 ml',
                    5290,
                    '2.4102',
                    'Solución limpiadora para cubiertas de cocina, baños y mesas.',
                    [750, 'Vinagre blanco, aceite de eucalipto y agua', 'Cocina y baño'],
                    ['Reutilizable'],
                ],
                [
                    'Esponjas Vegetales de Luffa Natural (Pack x 3 unidades)',
                    3990,
                    '1.9162',
                    'Esponjas elaboradas con fibra vegetal de luffa para lavar loza y limpiar superficies.',
                    [null, 'Fibra vegetal de luffa y cordón de algodón', 'Loza y superficies'],
                    ['Reutilizable', 'Libre de plástico'],
                ],
                [
                    'Paños Limpiadores de Celulosa y Algodón Reutilizables (Pack x 4)',
                    4890,
                    '2.2582',
                    'Paños absorbentes elaborados con fibras vegetales para las labores diarias de limpieza.',
                    [null, '70% celulosa y 30% algodón', 'Superficies lavables'],
                    ['Reutilizable'],
                ],
                [
                    'Pastilla Limpiadora de Inodoros Ecológica (Pack x 2 unidades)',
                    3690,
                    '1.8022',
                    'Pastillas efervescentes para limpiar y aromatizar el inodoro.',
                    [null, 'Bicarbonato, ácido cítrico, menta y árbol de té', 'Inodoros'],
                    [],
                ],
                [
                    'Cepillo de Limpieza Multiuso con Mango de Bambú y Cerdas de Coco',
                    4490,
                    '2.1062',
                    'Cepillo ergonómico para limpiar ollas, verduras, azulejos y zonas difíciles.',
                    [null, 'Madera de bambú y fibra de coco', 'Cocina y baño'],
                    ['Reutilizable'],
                ],
            ],
        },

        // AROMAS Y BIENESTAR

        {
            category: 'Aromas y bienestar',
            producerEmail: 'aromasdelbosque@buenorigen.test',

            detailSql: `
                INSERT INTO wellness_details (
                    product_id,
                    fragrance,
                    volume_ml,
                    duration_hours,
                    format
                )
                VALUES ($1, $2, $3, $4, $5);
            `,

            products: [
                [
                    'Vela Cinnamon',
                    4990,
                    '2.2962',
                    'Vela aromática artesanal elaborada a mano con cera de abejas.',
                    ['Canela', null, 20, 'Vela'],
                    [],
                ],
                [
                    'Vela Vainilla',
                    3990,
                    '1.9162',
                    'Vela aromática artesanal de cera de abejas con aroma a vainilla.',
                    ['Vainilla', null, 20, 'Vela'],
                    [],
                ],
                [
                    'Vela Lavanda',
                    4990,
                    '2.2962',
                    'Vela aromática artesanal de cera de abejas con aroma a lavanda.',
                    ['Lavanda', null, 20, 'Vela'],
                    [],
                ],
                [
                    'Bruma de Almohadas "Sueño Profundo" con Lavanda y Manzanilla',
                    6290,
                    '2.7902',
                    'Spray ambiental y textil formulado para rociar sobre ropa de cama y almohadas.',
                    ['Lavanda y manzanilla', null, null, 'Spray'],
                    ['Reutilizable'],
                ],
                [
                    'Sales de Baño Desintoxicantes de Lavanda y Eucalipto 350 g',
                    6990,
                    '3.0562',
                    'Mezcla de sales minerales y marinas enriquecidas con lavanda y eucalipto.',
                    ['Lavanda y eucalipto', null, null, 'Sales de baño'],
                    [],
                ],
                [
                    'Difusor de Ambientes en Vainilla y Maderas Nobles 250 ml',
                    13490,
                    '5.5262',
                    'Difusor de varillas que combina la dulzura de la vainilla con notas amaderadas.',
                    ['Vainilla y madera', 250, 720, 'Difusor'],
                    [],
                ],
                [
                    'Aceite de Masaje Corporal Relajante de Lavanda y Almendras 150 ml',
                    9890,
                    '4.1582',
                    'Aceite corporal de textura ligera formulado para masajes.',
                    ['Lavanda', 150, null, 'Aceite'],
                    [],
                ],
                [
                    'Perfume Sólido Botánico de Vainilla y Sándalo 15 g',
                    8990,
                    '3.8162',
                    'Fragancia sólida elaborada a base de ceras vegetales y mantecas nutritivas.',
                    ['Vainilla y sándalo', null, null, 'Perfume sólido'],
                    ['Vegano'],
                ],
            ],
        },

        // ROPA Y ACCESORIOS

        {
            category: 'Ropa y accesorios',
            producerEmail: 'ecoraiz@buenorigen.test',

            detailSql: `
                INSERT INTO clothing_details (
                    product_id,
                    size,
                    color,
                    material
                )
                VALUES ($1, $2, $3, $4);
            `,

            products: [
                [
                    'Polera Trip',
                    15990,
                    '6.4762',
                    'Polera outdoor de algodón orgánico, cómoda y respirable.',
                    ['XS', 'Verde', 'Algodón orgánico'],
                    [],
                ],
                [
                    'Polera Trip',
                    14978,
                    '6.0917',
                    'Polera outdoor de algodón orgánico, cómoda y respirable.',
                    ['S', 'Verde', 'Algodón orgánico'],
                    [],
                ],
                [
                    'Polera Trip',
                    19073,
                    '7.6479',
                    'Polera outdoor de algodón orgánico, cómoda y respirable.',
                    ['M', 'Verde', 'Algodón orgánico'],
                    [],
                ],
                [
                    'Polera Trip',
                    23169,
                    '9.2041',
                    'Polera outdoor de algodón orgánico, cómoda y respirable.',
                    ['L', 'Verde', 'Algodón orgánico'],
                    [],
                ],
                [
                    'Polera Trip',
                    27264,
                    '10.7602',
                    'Polera outdoor de algodón orgánico, cómoda y respirable.',
                    ['XL', 'Verde', 'Algodón orgánico'],
                    [],
                ],
                [
                    'Polera Trip',
                    31359,
                    '12.3164',
                    'Polera outdoor de algodón orgánico, cómoda y respirable.',
                    ['XXL', 'Verde', 'Algodón orgánico'],
                    [],
                ],
                [
                    'Polera Trip',
                    35454,
                    '13.8726',
                    'Polera outdoor de algodón orgánico, cómoda y respirable.',
                    ['3XL', 'Verde', 'Algodón orgánico'],
                    [],
                ],
                [
                    'Polera Trip',
                    39550,
                    '15.4288',
                    'Polera outdoor de algodón orgánico, cómoda y respirable.',
                    ['4XL', 'Verde', 'Algodón orgánico'],
                    [],
                ],
            ],
        },

        // MASCOTAS

        {
            category: 'Mascotas',
            producerEmail: 'patitasverdes@buenorigen.test',

            detailSql: `
                INSERT INTO pet_details (
                    product_id,
                    pet_type,
                    size,
                    weight_g,
                    material
                )
                VALUES ($1, $2, $3, $4, $5);
            `,

            products: [
                [
                    'Juguete Pato',
                    8990,
                    '3.8162',
                    'Juguete textil con forma de pato y textura acanalada.',
                    ['Perro', 'Mediano', null, 'Tela texturizada y relleno'],
                    ['Reutilizable'],
                ],
                [
                    'Juguete Textil de Cuerda y Algodón Orgánico',
                    7990,
                    '3.4362',
                    'Juguete mordedor elaborado con fibras de algodón trenzadas.',
                    ['Perro', 'Mediano', null, 'Algodón trenzado'],
                    ['Reutilizable'],
                ],
                [
                    'Cama Ortopédica Lavable de Telas Recicladas',
                    24990,
                    '9.8962',
                    'Cama mullida para perros o gatos, con funda desmontable y lavable.',
                    ['Perro y gato', 'Grande', null, 'Algodón y PET reciclado'],
                    ['Reciclado', 'Reutilizable'],
                ],
                [
                    'Snack Natural de Salmón Deshidratado 80 g',
                    5292,
                    '2.4110',
                    'Premio para perros y gatos elaborado con trozos de salmón deshidratado.',
                    ['Perro y gato', null, 80, 'Salmón'],
                    [],
                ],
                [
                    'Champú Seco en Polvo para Mascotas 150 g',
                    6490,
                    '2.8662',
                    'Champú en seco formulado para la limpieza de perros y gatos entre baños.',
                    ['Perro y gato', null, 150, 'Avena, arcilla y manzanilla'],
                    [],
                ],
                [
                    'Rascador de Cartón Prensado y Madera Reciclada',
                    12990,
                    '5.3362',
                    'Rascador horizontal para gatos, elaborado con cartón y madera reciclada.',
                    ['Gato', 'Mediano', null, 'Cartón y madera reciclada'],
                    ['Reciclado', 'Reutilizable'],
                ],
                [
                    'Comedero Doble de Cerámica y Soporte de Madera',
                    18490,
                    '7.4262',
                    'Set de dos platos elevados de cerámica sobre una base firme de madera.',
                    ['Perro y gato', 'Mediano', null, 'Cerámica y madera'],
                    ['Reutilizable'],
                ],
                [
                    'Cepillo Masajeador y Deslanador de Bambú y Dientes de Acero',
                    8990,
                    '3.8162',
                    'Cepillo ergonómico diseñado para el cuidado del pelaje de perros y gatos.',
                    ['Perro y gato', 'Mediano', null, 'Bambú y acero inoxidable'],
                    ['Reutilizable'],
                ],
            ],
        },

        // DECORACION Y ARTESANIA

        {
            category: 'Decoración y artesanía',
            producerEmail: 'artecircular@buenorigen.test',

            detailSql: `
                INSERT INTO craft_details (
                    product_id,
                    material,
                    height_cm,
                    width_cm,
                    depth_cm,
                    color,
                    weight_g
                )
                VALUES ($1, $2, $3, $4, $5, $6, $7);
            `,

            products: [
                [
                    'Tazón Pez',
                    9990,
                    '4.1962',
                    'Tazón de cerámica con ilustraciones de peces en tonos azules.',
                    ['Cerámica esmaltada', 10, 9, 9, 'Azul', 350],
                    ['Reutilizable'],
                ],
                [
                    'Pantalla de Lámpara Artesanal de Mimbre',
                    29990,
                    '11.7962',
                    'Pantalla para lámpara tejida artesanalmente en mimbre flexible.',
                    ['Mimbre y metal', 30, 35, 35, 'Natural', null],
                    ['Reutilizable'],
                ],
                [
                    'Cestería de Colihue y Fibras Naturales',
                    18900,
                    '7.5820',
                    'Canasto decorativo y utilitario tejido a mano con varas de colihue y fibras vegetales.',
                    ['Colihue y fibras naturales', 25, 30, 30, 'Natural', null],
                    ['Reutilizable'],
                ],
                [
                    'Tabla de Picar de Madera Nativa (Raulí y Mañío)',
                    16490,
                    '6.6662',
                    'Tabla decorativa y funcional tallada a partir de retazos seleccionados de madera.',
                    ['Madera de raulí y mañío', 2, 25, 40, 'Natural', null],
                    ['Reutilizable'],
                ],
                [
                    'Jarrón de Cerámica Modelado a Mano',
                    22990,
                    '9.1362',
                    'Pieza de cerámica gres de líneas orgánicas para flores secas o decoración.',
                    ['Cerámica gres', 30, 15, 15, 'Terracota', null],
                    ['Reutilizable'],
                ],
                [
                    'Tapiz Mural Decorativo en Lana de Oveja',
                    24990,
                    '9.8962',
                    'Tapiz tejido en telar vertical con lana de oveja y tintes de origen botánico.',
                    ['Lana de oveja y madera', 60, 40, null, 'Multicolor', null],
                    [],
                ],
                [
                    'Posavasos de Greda Pulida (Set de 4)',
                    9990,
                    '4.1962',
                    'Set de cuatro posavasos circulares elaborados en greda tradicional.',
                    ['Greda', 1, 10, 10, 'Terracota', null],
                    ['Reutilizable'],
                ],
                [
                    'Cuaderno Artesanal con Tapa de Madera y Papel Reciclado',
                    11490,
                    '4.7662',
                    'Libreta de notas con encuadernación artesanal y hojas interiores de papel reciclado.',
                    ['Madera y papel reciclado', 21, 15, 2, 'Natural', null],
                    ['Reciclado'],
                ],
            ],
        },
    ];

    public async up(queryRunner: QueryRunner): Promise<void> {

        if (process.env.NODE_ENV === 'production') {
            throw new Error(
                'Los datos de prueba no pueden cargarse en produccion.',
            );
        }

        const existingProducts = await queryRunner.query(`
            SELECT COUNT(*)::int AS total
            FROM products;
        `);

        if (existingProducts[0].total !== 0) {
            throw new Error(
                'La tabla products debe estar vacia para cargar estos datos de prueba.',
            );
        }

        const stockValues = [20, 15, 0, 30, 12, 8, 25, 10];

        const now = new Date();

        const yesterday = new Date(now);
        yesterday.setDate(yesterday.getDate() - 1);

        const nextMonth = new Date(now);
        nextMonth.setDate(nextMonth.getDate() + 30);

        const lastMonth = new Date(now);
        lastMonth.setDate(lastMonth.getDate() - 30);

        for (const group of this.catalog) {

            for (let i = 0; i < group.products.length; i++) {

                const [
                    name,
                    price,
                    co2Avoided,
                    description,
                    details,
                    attributes,
                ] = group.products[i];

                const stock = stockValues[i];

                let offerPrice: number | null = null;
                let offerStartAt: Date | null = null;
                let offerEndAt: Date | null = null;

                // Primer producto: oferta vigente del 10%

                if (i === 0) {
                    offerPrice = Math.floor(price * 90 / 100);
                    offerStartAt = yesterday;
                    offerEndAt = nextMonth;
                }

                // Segundo producto: oferta vencida del 20%

                if (i === 1) {
                    offerPrice = Math.floor(price * 80 / 100);
                    offerStartAt = lastMonth;
                    offerEndAt = yesterday;
                }

                // Insertar producto

                const result = await queryRunner.query(`
                    INSERT INTO products (
                        producer_id,
                        category_id,
                        name,
                        description,
                        price,
                        stock,
                        co2_avoided,
                        offer_price,
                        offer_start_at,
                        offer_end_at,
                        is_active
                    )
                    SELECT
                        p.id,
                        c.id,
                        $3,
                        $4,
                        $5,
                        $6,
                        $7,
                        $8,
                        $9,
                        $10,
                        true
                    FROM producers p
                    JOIN users u ON u.id = p.user_id
                    CROSS JOIN categories c
                    WHERE u.email = $1
                    AND c.name = $2
                    RETURNING id;
                `, [
                    group.producerEmail,
                    group.category,
                    name,
                    description,
                    price,
                    stock,
                    co2Avoided,
                    offerPrice,
                    offerStartAt,
                    offerEndAt,
                ]);

                if (result.length !== 1) {
                    throw new Error(
                        `No se pudo insertar el producto: ${name}`,
                    );
                }

                const productId = result[0].id;

                // Insertar especializacion

                await queryRunner.query(
                    group.detailSql,
                    [productId, ...details],
                );

                // Asociar atributos de sostenibilidad

                for (const attribute of attributes) {

                    await queryRunner.query(`
                        INSERT INTO product_sustainability_attributes (
                            product_id,
                            sustainability_attribute_id
                        )
                        VALUES (
                            $1,
                            (
                                SELECT id
                                FROM sustainability_attributes
                                WHERE name = $2
                            )
                        );
                    `, [
                        productId,
                        attribute,
                    ]);
                }
            }
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {

        if (process.env.NODE_ENV === 'production') {
            throw new Error(
                'Esta migracion de prueba no debe revertirse en produccion.',
            );
        }

        for (const group of this.catalog) {

            const productNames = group.products.map(
                (product) => product[0],
            );

            await queryRunner.query(`
                DELETE FROM products pr
                USING producers p, users u, categories c
                WHERE pr.producer_id = p.id
                AND p.user_id = u.id
                AND pr.category_id = c.id
                AND u.email = $1
                AND c.name = $2
                AND pr.name = ANY($3::text[]);
            `, [
                group.producerEmail,
                group.category,
                productNames,
            ]);
        }
    }
}