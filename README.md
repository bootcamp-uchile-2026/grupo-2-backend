<p align="center">
  <img src="https://drive.google.com/thumbnail?id=10uSzFualz9I89UUehPdV6E7CJ81EpDZj&sz=w1000" alt="Logo BuenOrigen" width="280">
</p>

<h1 align="center">BuenOrigen Backend</h1>

<p align="center">API REST desarrollada con NestJS y TypeScript para la plataforma de comercio electrónico BuenOrigen.</p>

Descripción

BuenOrigen es una plataforma orientada a la comercialización de productos sustentables de distintos emprendedores. Este repositorio contiene su backend, organizado mediante módulos, controladores, servicios y objetos de transferencia de datos (DTO).

La API permite consultar el catálogo, explorar categorías y subcategorías, obtener información de emprendedores y artículos, registrar clientes y administrar productos favoritos. Sus interfaces HTTP se documentan mediante Swagger / OpenAPI.

Estado de implementación: se utilizan datos de prueba almacenados en memoria. Algunas comprobaciones de acceso funcionan mediante claves compartidas de prueba; no constituyen un sistema completo de autenticación, sesiones o autorización individual. Al reiniciar la aplicación, los cambios realizados sobre las colecciones en memoria no se conservan.

Tecnologías

Node.js, TypeScript y NestJS 11.

Swagger / OpenAPI para documentación de la API.

class-validator y ValidationPipe para validaciones de entrada.

@nestjs/config para configuración por variables de entorno.

Git para el control de versiones.

Requisitos e instalación

Se requiere Node.js, npm y una terminal. Git es necesario para clonar el repositorio.

node -v
npm -v
git clone https://github.com/bootcamp-uchile-2026/grupo-2-backend.git
cd grupo-2-backend
npm install

También es posible obtener una copia mediante Code → Download ZIP desde GitHub y ejecutar npm install dentro de la carpeta extraída.

Configuración local

El repositorio dispone de un archivo .env.example que sirve como plantilla de configuración. Crea un archivo .env local antes de iniciar la API:

# Git Bash
cp .env.example .env

:: CMD de Windows
copy .env.example .env

Las variables conocidas son PORT (puerto HTTP; predeterminado 3000), ADMIN_API_KEY y CUSTOMER_API_KEY (claves compartidas utilizadas por guards de prueba). Utiliza valores locales de desarrollo. No publiques el archivo .env ni credenciales reales. El archivo .env.example no debe contener secretos.

La aplicación carga esta configuración mediante ConfigModule.forRoot({ isGlobal: true }) y accede a ella mediante process.env. No se incluye aquí un procedimiento de autenticación individual porque no está implementado como tal.

Ejecución

Desarrollo, con recarga ante cambios:

npm run start:dev

Compilación:

npm run build

Ejecución de la versión compilada:

npm run start:prod

Con el puerto predeterminado, la API escucha en http://localhost:3000.

Swagger / OpenAPI

Con la aplicación en ejecución:

Interfaz Swagger: http://localhost:3000/api

Especificación OpenAPI JSON: http://localhost:3000/api-json

Swagger describe las operaciones disponibles, parámetros, cuerpos de solicitud, DTO de respuesta y códigos HTTP. Para conocer los ejemplos y parámetros exactos de cada operación, consulta esta documentación interactiva.

Arquitectura y módulos

La aplicación sigue la organización habitual de NestJS:

Controllers: reciben las solicitudes HTTP, extraen parámetros y delegan en los servicios.

Services: administran las colecciones en memoria, aplican las reglas y construyen las respuestas.

DTO: establecen los contratos de entrada y salida, junto con sus validaciones y documentación.

Models: representan las estructuras de datos del dominio.

Componentes comunes: middleware de trazabilidad, interceptor, guards, errores personalizados y filtros de excepciones.

Dominio

Organización y responsabilidad

Customers

Registro, consulta y actualización de clientes.

Productos

Búsqueda, ofertas, novedades, más vendidos, detalle, valoraciones, huella verde y productos relacionados.

Categories

Categorías y subcategorías, con controladores y servicios independientes dentro de CategoriesModule.

Emprendedores

Directorio, información pública y productos asociados a cada emprendedor.

Artículos

Listado y detalle de artículos del blog.

Favoritos

Consulta, incorporación y eliminación de productos favoritos de clientes.

ProductsService mantiene la colección principal de productos; los servicios que necesitan esa información la reutilizan en lugar de mantener copias independientes. Los datos actuales se almacenan en arreglos en memoria.

Flujo de una solicitud

flowchart LR
    A[Cliente HTTP] --> B[Middleware de trazabilidad]
    B --> C[Guard cuando corresponde]
    C --> D[Controller]
    D --> E[Validación y Service]
    E --> F[Datos en memoria]
    F --> E
    E --> G[Respuesta JSON]
    G --> A

Los pipes de validación y los filtros de excepciones intervienen en los puntos correspondientes del ciclo de vida de NestJS. Este esquema resume el recorrido general y no pretende representar todas las etapas internas del framework.

Endpoints principales

Las rutas que utilizan parámetros de consulta o de ruta aparecen con ejemplos ilustrativos. buscar es obligatorio en GET /productos; una solicitud sin ese parámetro responde HTTP 400.

Método

Ruta

Descripción

GET

/productos?buscar=polera

Buscar productos.

GET

/productos/ofertas

Productos en oferta.

GET

/productos/mas-vendidos?cantidad=5

Productos más vendidos.

GET

/productos/nuevos

Productos nuevos.

GET

/productos/:productoId

Detalle de un producto.

GET

/productos/:productoId/huella-verde

Huella verde del producto.

GET

/productos/:productoId/valoraciones

Valoraciones.

GET

/productos/:productoId/relacionados

Productos relacionados.

GET

/categorias

Listado de categorías.

GET

/categorias/:categoriaId

Detalle de categoría.

GET

/categorias/:categoriaId/subcategorias

Subcategorías de una categoría.

GET

/subcategorias/:subcategoriaId/productos

Productos de una subcategoría.

GET

/subcategorias/:subcategoriaId/productos/populares

Productos populares de una subcategoría.

GET

/emprendedores?cantidad=2

Listado de emprendedores.

GET

/emprendedores/:emprendedorId

Detalle de emprendedor.

GET

/emprendedores/:emprendedorId/productos

Productos del emprendedor.

GET

/articulos

Listado de artículos.

GET

/articulos/:articleId

Detalle de un artículo.

POST

/customers

Registro de cliente.

GET

/customers

Listado de clientes (acceso restringido de prueba).

GET

/customers/:id

Consulta de cliente (acceso restringido de prueba).

PATCH

/customers/:id

Actualización de cliente (acceso restringido de prueba).

GET

/customers/:customerId/favoritos

Listado de favoritos.

POST

/customers/:customerId/favoritos

Añadir favorito.

DELETE

/customers/:customerId/favoritos/:productId

Eliminar favorito.

Los requisitos exactos de encabezados, cuerpos y respuestas se encuentran en Swagger. Algunos endpoints aplican guards mediante el encabezado x-api-key como mecanismo preliminar de control de acceso.

Validaciones, errores y trazabilidad

El backend utiliza validaciones de DTO y una ValidationPipe global con whitelist, forbidNonWhitelisted y transform. Los servicios incorporan validaciones adicionales para reglas del dominio. Los errores personalizados se procesan mediante filtros comunes.

Entre las respuestas documentadas y verificadas se encuentran:

HTTP

Uso

200 OK

Consulta exitosa.

201 Created

Creación exitosa.

204 No Content

Eliminación de favorito, sin cuerpo de respuesta.

400 Bad Request

Entrada o parámetro inválido.

403 Forbidden

Acceso denegado por un guard.

404 Not Found

Recurso inexistente.

409 Conflict

Conflicto como correo duplicado o favorito existente.

La trazabilidad registra un identificador de solicitud (x-request-id), método, ruta, código HTTP, duración y fecha. Cuando corresponde, se registra el cuerpo de la petición con protección de datos sensibles, como contraseñas. No deben incorporarse secretos a logs ni a ejemplos públicos.

Modelo de datos — diagrama entidad-relación de referencia

El diagrama siguiente representa 14 modelos TypeScript definidos en src/models. Es una vista conceptual de sus asociaciones: no representa tablas SQL creadas ni claves foráneas impuestas por una base de datos. Algunas asociaciones se expresan mediante propiedades de tipo objeto o arreglos, sin campos de identificación explícitos en la clase.

FAVORITE relaciona clientes y productos mediante customerId y productId. ARTICLE no declara asociaciones directas con otros modelos. Los modelos de direcciones, métodos de pago y órdenes forman parte de la estructura del dominio, aunque no corresponden a módulos REST operativos en el código descrito.

erDiagram
    CUSTOMER ||--o| PROFILE : tiene
    CUSTOMER ||--o{ ADDRESS : registra
    CUSTOMER ||--o{ PAYMENT_METHOD : registra
    CUSTOMER ||--o{ ORDER : realiza
    CUSTOMER ||--o{ FAVORITE : guarda

    CATEGORY ||--o{ SUBCATEGORY : contiene
    SUBCATEGORY ||--o{ PRODUCT : agrupa
    ENTREPRENEUR ||--o{ PRODUCT : publica

    PRODUCT ||--o{ FAVORITE : aparece_en
    PRODUCT ||--o{ REVIEW : recibe
    PRODUCT ||--o| GREEN_FOOTPRINT : posee
    PRODUCT ||--o{ ORDER_ITEM : incluido_en

    ORDER ||--o{ ORDER_ITEM : contiene
    PAYMENT_METHOD ||--o{ ORDER : utilizado_en

    CUSTOMER {
        int id PK
        string email
        string password
        int greenPoints
    }
    PROFILE {
        string name
        string lastName
        string phoneNumber
        string profileImageUrl
    }
    ADDRESS {
        int id PK
        string street
        string number
        string department
        string commune
        string city
    }
    PAYMENT_METHOD {
        int id PK
        string cardType
        string cardHolder
        string cardNumber
        string expirationDate
    }
    CATEGORY {
        int id PK
        string name
        string slug
        string imageUrl
    }
    SUBCATEGORY {
        int id PK
        int categoryId FK
        string name
        string slug
        string imageUrl
    }
    ENTREPRENEUR {
        int id PK
        string name
        string description
        string imageUrl
        string story
    }
    PRODUCT {
        int id PK
        int subcategoryId FK
        int entrepreneurId FK
        string brand
        string name
        string description
        float price
        float salePrice
        string imageUrl
        string_array images
        int stock
        float rating
        int salesLastMonth
        datetime createdAt
        string_array colors
        string_array sizes
    }
    FAVORITE {
        int customerId FK
        int productId FK
    }
    REVIEW {
        int id PK
        int productId FK
        string author
        string comment
        float rating
        boolean published
    }
    GREEN_FOOTPRINT {
        int productId FK
        float sustainabilityRating
        string_array materials
        string productionProcess
    }
    ARTICLE {
        int id PK
        string title
        string summary
        string content
        string imageUrl
        string author
        datetime publishedAt
    }
    ORDER {
        int id PK
        int customerId FK
        datetime orderDate
        float totalAmount
    }
    ORDER_ITEM {
        int quantity
        float unitPrice
    }

Notas del modelo: los campos opcionales y los valores nulos se representan mediante su tipo base para mantener legible el diagrama. Las marcas PK y FK identifican claves lógicas o referencias previstas, no restricciones actualmente aplicadas por un motor SQL. PROFILE no define id; ORDER_ITEM tampoco define id, orderId ni productId como propiedades escalares, y ORDER mantiene paymentMethod como objeto.

Pruebas manuales

Con el servidor iniciado, los siguientes comandos permiten verificar endpoints públicos:

curl -i "http://localhost:3000/productos?buscar=polera"
curl -i "http://localhost:3000/productos/ofertas"
curl -i "http://localhost:3000/productos/mas-vendidos?cantidad=5"
curl -i "http://localhost:3000/categorias"
curl -i "http://localhost:3000/categorias/1/subcategorias"
curl -i "http://localhost:3000/emprendedores"
curl -i "http://localhost:3000/articulos"

Ejemplos de comprobación de errores:

# Recurso inexistente: se espera HTTP 404
curl -i "http://localhost:3000/productos/9999"

# Parámetro inválido: se espera HTTP 400
curl -i "http://localhost:3000/productos/mas-vendidos?cantidad=abc"

# Búsqueda sin término: se espera HTTP 400
curl -i "http://localhost:3000/productos"

Estas pruebas no sustituyen la validación de todos los contratos de entrada y salida disponibles en Swagger.

Docker y ejecución en contenedores

La ejecución mediante contenedores requiere definir y comprobar los archivos y parámetros del entorno. Esta sección es una guía de configuración, no una afirmación de que ya exista una imagen publicada o un despliegue funcional.

Campos por completar

Elemento

Configuración

Dockerfile del backend

🔴 [PENDIENTE DE VERIFICAR / DEFINIR] Ruta y estrategia de construcción.

Archivo .dockerignore

🔴 [PENDIENTE DE VERIFICAR / DEFINIR] Exclusiones del contexto de construcción.

Nombre y etiqueta de la imagen

🔴 [PENDIENTE DE DEFINIR] __________

Puerto publicado en el host

🔴 [PENDIENTE DE DEFINIR] __________

Archivo de orquestación (compose.yaml, si aplica)

🔴 [PENDIENTE DE VERIFICAR / DEFINIR] __________

Contenedor o servicio de base de datos

🔴 [PENDIENTE DE DEFINIR] Motor, versión, volumen y parámetros.

Scripts de inicialización de base de datos

🔴 [PENDIENTE DE DEFINIR] Ubicación y modo de ejecución.

URL del servicio desplegado

🔴 [PENDIENTE DE DEFINIR] __________

Comandos orientativos

Una vez creado y validado un Dockerfile, la imagen podrá construirse con un comando como:

# EJEMPLO: sustituir el nombre y la etiqueta definidos para el proyecto
docker build -t buenorigen-backend:local .

La ejecución del contenedor deberá indicar el puerto y las variables de entorno apropiadas. No ejecutar el siguiente ejemplo como configuración definitiva sin verificar el Dockerfile y los puertos:

# EJEMPLO DE REFERENCIA; AJUSTAR CONFIGURACIÓN ANTES DE SU USO
docker run --rm -p 3000:3000 --env-file .env buenorigen-backend:local

No se incluyen credenciales reales ni comandos de creación de base de datos no verificados. Esta sección debe completarse con los archivos y valores efectivos del repositorio cuando estén definidos.

Integración con aplicaciones cliente

Las aplicaciones cliente consumen la API mediante HTTP y reciben respuestas JSON. Los contratos de integración se describen en Swagger; los consumidores deben respetar los parámetros obligatorios, DTO y códigos de respuesta publicados.

Documentación técnica

La documentación complementaria se encuentra en la Wiki del repositorio. Para los contratos HTTP vigentes, se recomienda consultar también el Swagger generado directamente por la versión en ejecución.

Equipo

Proyecto desarrollado por el equipo BuenOrigen, en el contexto del Bootcamp de Desarrollo Backend del DCC de la Universidad de Chile.