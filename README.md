<p align="center">
  <img
    src="https://drive.google.com/thumbnail?id=10uSzFualz9I89UUehPdV6E7CJ81EpDZj&sz=w1000"
    alt="Logo BuenOrigen"
    width="280"
  >
</p>

<h1 align="center">BuenOrigen Backend</h1>

<p align="center">
  API REST desarrollada con NestJS para la plataforma e-commerce BuenOrigen.
</p>

---

## Descripción

**BuenOrigen** es una plataforma e-commerce orientada a la comercialización de productos sustentables ofrecidos por distintos emprendedores.

Este repositorio contiene el **Backend** de la aplicación, desarrollado utilizando **NestJS y TypeScript**.

El Backend proporciona una API REST que permitirá la integración con las aplicaciones Frontend y Mobile.

---

## Tecnologías utilizadas

- Node.js
- TypeScript
- NestJS
- Swagger / OpenAPI
- Git
- GitHub

---

## Descarga del proyecto

El proyecto puede obtenerse de dos formas.

### Opción 1: Clonar el repositorio con Git

Esta es la opción recomendada para los integrantes del equipo, ya que permite trabajar con ramas y mantener el proyecto sincronizado con GitHub.

```bash
git clone https://github.com/bootcamp-uchile-2026/grupo-2-backend.git
```

Luego ingresar a la carpeta del proyecto:

```bash
cd grupo-2-backend
```

---

### Opción 2: Descargar como ZIP

También es posible descargar una copia del proyecto directamente desde GitHub.

1. Ingresar al repositorio.
2. Presionar el botón **Code**.
3. Seleccionar **Download ZIP**.
4. Descomprimir el archivo descargado.
5. Abrir una terminal dentro de la carpeta del proyecto.

> La descarga mediante ZIP permite ejecutar el proyecto, pero para desarrollo colaborativo se recomienda utilizar `git clone`.

---

## Instalación

Una vez descargado o clonado el proyecto, instalar las dependencias(recuerda hacerlo desde el cmd o VScode):

```bash
npm install
```

Las dependencias utilizadas por la aplicación se encuentran definidas en el archivo:

```text
package.json
```

---

## Ejecución

Para iniciar el Backend en modo desarrollo:

```bash
npm run start:dev
```

Por defecto, la API estará disponible en:

```text
http://localhost:3000/api
```

---

## Swagger / OpenAPI

La API se encuentra documentada mediante **Swagger / OpenAPI**.

Una vez iniciado el proyecto, la documentación puede consultarse en:

```text
http://localhost:3000/api
```

Swagger permite visualizar:

- Endpoints disponibles.
- Métodos HTTP.
- Parámetros de ruta.
- Query parameters.
- DTOs.
- Respuestas HTTP.

---

## Módulos implementados

Actualmente el Backend cuenta con los siguientes dominios principales:

```text
Productos
Subcategorías
Emprendedores
```

### Productos

Se encuentran implementadas funcionalidades para:

- Búsqueda de productos.
- Productos en oferta.
- Productos más vendidos.
- Nuevos productos.
- Detalle de producto.
- Huella Verde.
- Valoraciones.
- Productos relacionados.

### Subcategorías

Permite:

- Consultar subcategorías pertenecientes a una categoría.
- Consultar productos de una subcategoría.
- Consultar productos populares de una subcategoría.

### Emprendedores

Permite:

- Consultar el directorio de emprendedores.
- Consultar el perfil público de un emprendedor.
- Consultar los productos asociados a un emprendedor.

La documentación detallada de las funcionalidades se encuentra disponible en la **Wiki del repositorio**. https://github.com/bootcamp-uchile-2026/grupo-2-backend/wiki

---

## Integración con Frontend

Frontend y Backend se integrarán mediante una **API REST**, utilizando peticiones HTTP y respuestas en formato JSON.

```text
Frontend
   |
   | HTTP Request
   v
Backend NestJS
   |
   v
Controller
   |
   v
Service
   |
   v
DTO
   |
   | JSON Response
   v
Frontend
```

Los contratos de integración se encuentran documentados mediante **Swagger / OpenAPI**.

Algunas de las primeras interfaces de integración son:

```http
GET /productos/ofertas
```

```http
GET /productos/mas-vendidos?cantidad={n}
```

```http
GET /productos/nuevos
```

```http
GET /productos?buscar={texto}
```

```http
GET /emprendedores?cantidad={n}
```

---

## Estrategia de ramas

El proyecto utiliza la siguiente estrategia:

```text
main
  |
  v
develop
  |
  v
feature/*
```

Las nuevas funcionalidades deberán desarrollarse en ramas:

```text
feature/nombre-funcionalidad
```

y posteriormente integrarse a:

```text
develop
```

mediante **Pull Request**.

---

## Flujo básico de Git

Actualizar la rama `develop`:

```bash
git switch develop
git pull origin develop
```

Crear una nueva rama:

```bash
git switch -c feature/nombre-funcionalidad
```

Después de realizar los cambios:

```bash
git status
git add .
git commit -m "feature: descripción del cambio"
git push -u origin feature/nombre-funcionalidad
```

Finalmente se deberá crear un **Pull Request hacia `develop`**.

---

## Reglas básicas de trabajo

- No desarrollar directamente sobre `main`.
- Evitar realizar cambios directamente sobre `develop`.
- Utilizar ramas `feature/*` para nuevas funcionalidades.
- Integrar los cambios mediante Pull Request.
- Utilizar mensajes de commit claros y descriptivos.

Ejemplos:

```text
feature: se implementa funcionalidad de emprendedores
fix: se corrige validación de producto
docs: se actualiza documentación Swagger
refactor: se reorganiza lógica de productos
chore: se actualizan dependencias
```

---

## Próximas funcionalidades

Entre las funcionalidades identificadas para siguientes etapas se encuentran:

```text
Usuarios
Autenticación
Favoritos
Carrito de compras
Artículos
Cuenta de Emprendedor
```

---

## Documentación

La documentación técnica detallada del proyecto se encuentra disponible en la **Wiki de GitHub**, incluyendo:

- Funcionalidades Backend.
- Módulos y dominios.
- Servicios.
- Endpoints.
- DTOs.
- Swagger / OpenAPI.
- Flujo de Git.
- Reglas de negocio.

---

## Equipo

Proyecto desarrollado por el equipo **BuenOrigen** en el contexto del **Bootcamp de Desarrollo Backend del DCC de la Universidad de Chile**.