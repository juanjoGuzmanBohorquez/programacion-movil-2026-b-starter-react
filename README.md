# Product Catalog — Ionic React

Individual practical assignment for the second assessment period of Programación Móvil, CORHUILA 2026-B.

**Author:** Juan Jose Guzman Bohorquez  
**Branch:** `feature/catalogo-productos`

## Overview

The application provides a product catalog with search, category filters, product details, creation, editing, and deletion with confirmation.

The project includes an Express REST API, an Ionic React application with TypeScript, a Kotlin exercise, and documentation based on the Mobile Governance Framework.

## Requirements

- Node.js 22.12 or later.
- npm.
- A browser.
- Kotlin Playground to run the Kotlin exercise.

## Installation and execution

Install the dependencies from the repository root:

```bash
npm install
```

Optionally copy the environment example on macOS:

```bash
cp .env.example .env
```

The default API address is `http://localhost:3000`. To change it, set `VITE_API_URL` in `.env` and restart the development server.

Start the API in one terminal:

```bash
npm run server
```

Start the application in another terminal:

```bash
npm run dev
```

Open `http://localhost:5173/productos`.

Both processes must remain running. The API stores products in memory, so restarting it restores the eight seed products and removes changes made during the previous session.

## Application routes

| Route | Purpose |
|-------|---------|
| `/productos` | Product list, search, and category filters |
| `/productos/nuevo` | Create a product |
| `/productos/:id` | Product details and deletion confirmation |
| `/productos/:id/editar` | Edit an existing product |

## Features

- Search by product name without case sensitivity.
- Combine search with an exact category filter.
- Filter using All, Bebidas, Snacks, Aseo, and Hogar buttons.
- Display prices in Colombian pesos.
- Display stock labels: Agotado, Pocas unidades, and Disponible.
- Distinguish an empty catalog from a search with no results.
- Show loading indicators and request errors with retry actions.
- Validate product fields before submission.
- Display server error messages and validation details.
- Reload the list when returning to it.
- Require inline confirmation before deleting a product.

## API contract

Base URL: `http://localhost:3000`.

| Method and path | Success | Expected errors |
|-----------------|---------|-----------------|
| `GET /api/products?search=&category=` | 200 with an array | — |
| `GET /api/products/:id` | 200 with a product | 400, 404 |
| `POST /api/products` | 201 with the created product | 400 |
| `PUT /api/products/:id` | 200 with the updated product | 400, 404 |
| `DELETE /api/products/:id` | 204 without a body | 400, 404 |

Product example:

```json
{
  "id": 1,
  "name": "Agua mineral 600 ml",
  "price": 1800,
  "category": "Bebidas",
  "stock": 120
}
```

Creation and update requests contain `name`, `price`, `category`, and `stock`. The server assigns the identifier on creation and preserves it on update.

Validation rules:

- `name`: nonblank string with a maximum length of 60 characters.
- `price`: finite number greater than zero.
- `category`: Bebidas, Snacks, Aseo, or Hogar.
- `stock`: integer greater than or equal to zero.

Errors use the following structure:

```json
{
  "error": "Validation message",
  "details": ["Field validation detail"]
}
```

Unknown routes return 404. Malformed JSON returns 400, and unexpected server errors return 500.

## Architecture

The product feature is organized into three layers:

- `presentation`: Ionic pages and reusable components.
- `domain`: product types, validation, filtering, price formatting, and stock presentation.
- `data`: API configuration, fetch requests, and error translation.

Presentation uses domain rules and data operations. The data layer uses domain types, while the domain layer does not depend on React, Ionic, or HTTP.

## State management decision

Each page manages its local state with React's `useState`, including products, filters, form fields, loading status, and error messages. `useEffect` loads the initial data, while Ionic's `useIonViewWillEnter` refreshes the list and detail pages when users return to them. This approach keeps state close to the screen that uses it and is sufficient for the scope of this catalog. A global store was not introduced because the screens retrieve their data through the shared API client and do not require shared client state.

## API error handling

The server uses the supplied `express.json()` middleware to read JSON bodies and CORS middleware to allow requests from the development application. The supplied `parseId()` helper rejects identifiers that contain characters other than digits, and the routes return validation and missing-product errors using the same `error` and `details` structure. The supplied unknown-route handler returns 404, while the central error handler returns 400 for malformed JSON and 500 for unexpected failures. The client converts HTTP and network failures into `ApiError`, uses `getErrorMessage()` for readable feedback, and displays server validation details in the form. An integration test requests an unknown route and checks the 404 status and response body, verifying the supplied fallback handler.

## Quality checks

Run these commands from the repository root:

```bash
npm test
npm run lint
npm run build
```

The automated suite contains 44 passing tests: 22 API tests and 22 domain tests.

API tests cover CRUD operations, combined filters, invalid identifiers, missing products, validation failures, malformed JSON, and the unknown-route handler.

Domain tests cover seed data, Colombian peso formatting, validation boundaries, stock labels, combined filters, and preservation of the original product array.

The production build also checks TypeScript types. Vite currently reports a JavaScript chunk larger than 500 kB; the build completes successfully.

## Manual verification

Use the application to verify:

- Search and category filters.
- Empty and no-results states.
- Product detail and missing-product feedback.
- Creation and editing with inline validation.
- Deletion confirmation and cancellation.
- List refresh after changes.
- Connection failure and recovery: stop the API, reload the list, restart the API, and select Reintentar.

The application requires the API for data operations and has no persistent offline cache.

## Kotlin exercise

The file `kotlin/Product.kt` defines the Product class, nullable stock handling, and a discount function.

The identifier uses `val`, while editable fields use `var`. The optional `stock` field uses `Int?` and defaults to `null`.

To execute it, open https://play.kotlinlang.org, replace the entire example with the contents of `kotlin/Product.kt`, and select Run.

Expected output:

```text
Agua mineral | Sin dato | Precio con 10% de descuento: 1620.0
Galletas de avena | Agotado | Precio con 10% de descuento: 2430.0
Jabón de manos | Pocas unidades | Precio con 10% de descuento: 6210.0
```

The stock function also returns Disponible when stock is at least five.

## Documentation

- [Product feature](docs/features/productos.md)
- [Product list screen](docs/screens/lista.md)
- [Product detail screen](docs/screens/detalle.md)
- [Product form screen](docs/screens/formulario.md)
- [State management decision](docs/decisions/ADR-001-estado.md)
- [API consumption decision](docs/decisions/ADR-002-consumo-api.md)
- [Product entity](docs/api/product-entity.md)
- [Endpoint integration](docs/api/products-endpoints.md)
- [Definition of Done](docs/definition-of-done.md)

The initial feature documentation was committed before implementation.

## Git and submission

Changes are developed on `feature/catalogo-productos` using Conventional Commits.

The Pull Request targets `main` in the author's own fork. The submission in Moodle consists of the Pull Request URL.

`node_modules`, `dist`, and `.env` are ignored by Git. `.env.example` contains only an example API address.

The official assignment PDF and Moodle instructions define the submission deadline.

## Attribution

Documentation templates originate from the [Mobile Governance Framework](https://github.com/jesusarielgb-works/mobile-governance-framework).

The framework license is preserved in `docs/LICENSE-mobile-governance-framework.txt`.