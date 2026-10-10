# Definition of Done — Product Catalog

The catalog is ready for submission only when the applicable checks below have been verified.

Unchecked items are pending. Mark them only after implementation and verification.

---

## Documentation before implementation

- [x] Product feature specification completed.
- [x] List, detail, and reusable form screen specifications completed.
- [x] ADR-001 documents the local state decision.
- [x] ADR-002 documents API consumption and supplied utilities.
- [x] All five endpoints and the Product entity documented.
- [x] This checklist adapted to the assignment.
- [x] Documentation-only commit recorded before the first implementation commit.
- [x] Starter templates and framework license retained.

---

## Express API

- [x] GET /api/products returns 200 with an array.
- [x] Search matches names without case sensitivity.
- [x] Category filtering uses exact matching.
- [x] Search and category filters work together.
- [x] GET /api/products/:id returns the requested product.
- [x] POST creates a product with an incremental id and returns 201.
- [x] PUT updates a product and returns 200.
- [x] DELETE removes a product and returns 204 without a body.
- [x] POST and PUT enforce all four field validation rules.
- [x] Validation collects one details message per problem.
- [x] Invalid identifiers return 400.
- [x] Missing products return 404.
- [x] Errors use the error and details structure.
- [x] Supplied express.json(), CORS, parseId, 404, and 500 handlers retained and understood.
- [x] Runtime changes do not rewrite the initial JSON dataset.

---

## Ionic application

- [x] Data, domain, presentation, and __tests__ folders follow the required structure.
- [x] State lives in each page using useState and useEffect.
- [x] HTTP client implements getProduct, createProduct, updateProduct, and deleteProduct.
- [x] List loads products from the API.
- [x] Search and five category buttons use filterProducts.
- [x] Loading, empty catalog, no results, and error/retry states verified.
- [x] ProductCard uses typed props.
- [x] Detail displays all product fields.
- [x] Editing loads the existing product into the reusable form.
- [x] Creation and editing use inline validateProduct feedback.
- [x] Server validation details are displayed.
- [x] Failed saves preserve entered values.
- [x] Deletion requires an on-screen confirmation.
- [x] Successful deletion returns to the list.
- [x] Returning after mutations displays fresh data.
- [x] toProductView formats COP prices and stock labels correctly.
- [x] Connection failures display useful feedback.
- [x] Inputs have accessible labels and errors are readable.
- [x] Keyboard navigation and a narrow viewport manually checked.

---

## Kotlin

- [x] kotlin/Product.kt defines id, name, price, category, and nullable stock.
- [x] val and var are used according to property responsibilities.
- [x] stockLabel handles null, zero, low stock, and available stock.
- [x] applyDiscount calculates the discounted price.
- [x] main prints three products with labels and a 10 percent discount.
- [x] Code compiles and runs in Kotlin Playground.

---

## Quality

- [x] At least two new domain unit tests pass.
- [x] At least two new API tests using startTestServer() pass.
- [x] A new test exercises a supplied 404 or 500 handler.
- [x] The handler test is explained in English.
- [x] npm test passes.
- [x] npm run lint passes.
- [x] npm run build passes.
- [x] Create → view → edit → delete flow manually verified.
- [x] .env is ignored and .env.example is present.
- [x] No secrets, node_modules, or generated build files are included in the submission.

---

## README and English

- [x] README explains dependency installation and environment configuration.
- [x] README explains npm run server and npm run dev.
- [x] README explains testing, linting, and building.
- [x] State management decision contains 3–5 sentences in English.
- [x] API error handling contains 3–5 sentences in English.
- [x] Documentation reflects the final implementation and actual verification.

---

## Git and submission

- [x] Work is on feature/catalogo-productos or another allowed feature/feat branch.
- [x] At least six meaningful Conventional Commits recorded.
- [x] Documentation commit precedes implementation commits.
- [x] Branch pushed to the personal fork.
- [x] Pull Request targets main in the personal fork.
- [ ] PR includes a description and the verified checklist.
- [ ] PR link submitted as online text in the Moodle partial activity before the deadline.

---

## Scope adaptations from the framework template

- Native Android and iOS packaging is outside this assignment; verification covers the Ionic web app and a narrow viewport.
- Automated domain and API tests are required; UI flows are verified manually.
- Authentication, device permissions, analytics, crash reporting, offline persistence, and multilingual localization are outside scope.
- User-facing text is in Spanish; the required README explanations are in English.
- Delivery requires an open PR toward main in the personal fork. A completed merge or external reviewer approval is not a submission prerequisite.

---

## Verification evidence

- Automated verification: 44 tests passed; lint and production build passed.
- Manual verification: creation, detail, editing, deletion, empty catalog,
  no results, connection failure, retry, preservation of form values,
  keyboard navigation, and narrow viewport.
- Code review: loading indicators and rendering of server validation details.
- Kotlin example compiled and ran in Kotlin Playground.
- Production build reports a bundle size warning.