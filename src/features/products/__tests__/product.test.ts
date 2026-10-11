import { describe, expect, it } from 'vitest';
import seedProducts from '../../../../server/data/products.json';
import {
  CATEGORIES,
  formatCOP,
  filterProducts,
  LOW_STOCK_THRESHOLD,
  toProductView,
  validateProduct,
  type Product,
  type ProductInput,
} from '../domain/product';

const products: Product[] = seedProducts;

const validInput: ProductInput = {
  name: 'Agua mineral',
  price: 1800,
  category: 'Bebidas',
  stock: 10,
};

describe('Datos iniciales', () => {
  it('contiene ocho productos con identificadores únicos', () => {
    expect(products).toHaveLength(8);
    expect(new Set(products.map((product) => product.id)).size).toBe(8);
  });

  it('usa categorías permitidas y existencias enteras no negativas', () => {
    for (const product of products) {
      expect(CATEGORIES).toContain(product.category);
      expect(Number.isInteger(product.stock)).toBe(true);
      expect(product.stock).toBeGreaterThanOrEqual(0);
    }
  });

  it('incluye productos agotados y con pocas unidades', () => {
    expect(products.some((product) => product.stock === 0)).toBe(true);
    expect(
      products.some(
        (product) =>
          product.stock > 0 && product.stock < LOW_STOCK_THRESHOLD,
      ),
    ).toBe(true);
  });
});

describe('formatCOP', () => {
  it('formatea precios con separadores de miles', () => {
    expect(formatCOP(1250000)).toBe('$ 1.250.000');
    expect(formatCOP(8500)).toBe('$ 8.500');
    expect(formatCOP(950)).toBe('$ 950');
  });
});

describe('validateProduct', () => {
  it('acepta un producto válido y permite stock cero', () => {
    expect(validateProduct(validInput)).toEqual({
      isValid: true,
      errors: {},
    });

    expect(validateProduct({ ...validInput, stock: 0 }).isValid).toBe(true);
  });

  it('rechaza nombre vacío, precio cero, categoría inválida y stock negativo', () => {
    const result = validateProduct({
      name: '   ',
      price: 0,
      category: 'Otra',
      stock: -1,
    });

    expect(result.isValid).toBe(false);
    expect(result.errors.name).toEqual(expect.any(String));
    expect(result.errors.price).toEqual(expect.any(String));
    expect(result.errors.category).toEqual(expect.any(String));
    expect(result.errors.stock).toEqual(expect.any(String));
  });

  it('acepta nombres de 60 caracteres y rechaza nombres de 61', () => {
    expect(
      validateProduct({ ...validInput, name: 'A'.repeat(60) }).isValid,
    ).toBe(true);

    expect(
      validateProduct({ ...validInput, name: 'A'.repeat(61) }).errors.name,
    ).toEqual(expect.any(String));
  });

  it.each([NaN, Infinity, -100])('rechaza el precio %s', (price) => {
    expect(validateProduct({ ...validInput, price }).errors.price).toEqual(
      expect.any(String),
    );
  });

  it('rechaza existencias decimales', () => {
    expect(
      validateProduct({ ...validInput, stock: 1.5 }).errors.stock,
    ).toEqual(expect.any(String));
  });
});

describe('toProductView', () => {
  it.each([
    [0, 'Agotado', false, true],
    [1, 'Pocas unidades', true, false],
    [4, 'Pocas unidades', true, false],
    [5, 'Disponible', false, false],
  ])(
    'para stock %s muestra %s',
    (stock, stockLabel, isLowStock, isOutOfStock) => {
      const view = toProductView({
        id: 99,
        ...validInput,
        stock,
      });

      expect(view.stockLabel).toBe(stockLabel);
      expect(view.isLowStock).toBe(isLowStock);
      expect(view.isOutOfStock).toBe(isOutOfStock);
    },
  );

  it('formatea el precio y conserva los datos del producto', () => {
    const view = toProductView({
      id: 99,
      ...validInput,
      name: '  Agua mineral  ',
      price: 12500,
    });

    expect(view).toMatchObject({
      id: 99,
      name: 'Agua mineral',
      priceLabel: '$ 12.500',
      category: 'Bebidas',
      stock: 10,
    });
  });
});

describe('filterProducts', () => {
  it('devuelve todos los productos cuando no hay filtros', () => {
    expect(
      filterProducts(products, { search: '', category: '' }),
    ).toEqual(products);
  });

  it('busca por nombre sin distinguir mayúsculas y elimina espacios externos', () => {
    const result = filterProducts(products, {
      search: '  GASEOSA  ',
      category: '',
    });

    expect(result.map((product) => product.id)).toEqual([3]);
  });

  it('filtra por categoría exacta', () => {
    const result = filterProducts(products, {
      search: '',
      category: 'Snacks',
    });

    expect(result.map((product) => product.id)).toEqual([4, 5]);
  });

  it('combina búsqueda y categoría', () => {
    expect(
      filterProducts(products, {
        search: 'gaseosa',
        category: 'Bebidas',
      }).map((product) => product.id),
    ).toEqual([3]);

    expect(
      filterProducts(products, {
        search: 'gaseosa',
        category: 'Snacks',
      }),
    ).toEqual([]);
  });

  it('devuelve un arreglo vacío cuando no hay coincidencias', () => {
    expect(
      filterProducts(products, {
        search: 'producto inexistente',
        category: '',
      }),
    ).toEqual([]);
  });

  it('no modifica el arreglo original', () => {
    const original = products.map((product) => ({ ...product }));

    filterProducts(products, { search: 'agua', category: 'Bebidas' });

    expect(products).toEqual(original);
  });
});