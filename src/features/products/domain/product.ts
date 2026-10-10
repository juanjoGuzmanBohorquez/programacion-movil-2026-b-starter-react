/**
 * Dominio de productos: tipos, constantes y funciones puras.
 * No depende de HTTP, React ni Ionic.
 */

export interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  stock: number;
}

export interface ProductInput {
  name: string;
  price: number;
  category: string;
  stock: number;
}

export interface ProductView {
  id: number;
  name: string;
  priceLabel: string;
  category: string;
  stock: number;
  stockLabel: string;
  isLowStock: boolean;
  isOutOfStock: boolean;
}

export type ProductField = 'name' | 'price' | 'category' | 'stock';

export interface ValidationResult {
  isValid: boolean;
  errors: Partial<Record<ProductField, string>>;
}

export interface ProductFilters {
  search: string;
  category: string;
}

export const CATEGORIES = ['Bebidas', 'Snacks', 'Aseo', 'Hogar'] as const;
export const NAME_MAX_LENGTH = 60;
export const LOW_STOCK_THRESHOLD = 5;

/** Formateador suministrado por el starter. */
export function formatCOP(value: number): string {
  const digits = Math.round(value).toString();
  return `$ ${digits.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`;
}

/** Deriva los valores de presentación sin modificar el producto. */
export function toProductView(product: Product): ProductView {
  const isOutOfStock = product.stock === 0;
  const isLowStock =
    product.stock > 0 && product.stock < LOW_STOCK_THRESHOLD;

  const stockLabel = isOutOfStock
    ? 'Agotado'
    : isLowStock
      ? 'Pocas unidades'
      : 'Disponible';

  return {
    id: product.id,
    name: product.name.trim(),
    priceLabel: formatCOP(product.price),
    category: product.category,
    stock: product.stock,
    stockLabel,
    isLowStock,
    isOutOfStock,
  };
}

/** Aplica las mismas reglas de validación que la API. */
export function validateProduct(input: ProductInput): ValidationResult {
  const errors: ValidationResult['errors'] = {};

  if (typeof input.name !== 'string' || input.name.trim() === '') {
    errors.name = 'name es obligatorio';
  } else if (input.name.length > NAME_MAX_LENGTH) {
    errors.name = 'name debe tener máximo 60 caracteres';
  }

  if (
    typeof input.price !== 'number' ||
    !Number.isFinite(input.price) ||
    input.price <= 0
  ) {
    errors.price = 'price debe ser un número mayor que 0';
  }

  if (!CATEGORIES.some((category) => category === input.category)) {
    errors.category = 'category debe ser Bebidas, Snacks, Aseo u Hogar';
  }

  if (!Number.isInteger(input.stock) || input.stock < 0) {
    errors.stock = 'stock debe ser un entero mayor o igual que 0';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/** Combina filtros y devuelve un arreglo nuevo. */
export function filterProducts(
  products: Product[],
  filters: ProductFilters,
): Product[] {
  const search = filters.search.trim().toLowerCase();

  return products.filter((product) => {
    const matchesSearch =
      search === '' || product.name.toLowerCase().includes(search);

    const matchesCategory =
      filters.category === '' || product.category === filters.category;

    return matchesSearch && matchesCategory;
  });
}