/**
 * Cliente HTTP de productos.
 * Las pantallas consumen estas funciones sin manejar fetch directamente.
 */
import type { Product, ProductInput } from '../domain/product';
import { ApiError } from './api-error';
import { API_URL } from './config';

/**
 * Utilidad suministrada por el starter:
 * - Error de conexión: ApiError con status null.
 * - Error HTTP: ApiError con status y details del servidor.
 * - Respuesta 204: devuelve undefined sin intentar leer JSON.
 */
async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let response: Response;

  try {
    response = await fetch(`${API_URL}${path}`, init);
  } catch {
    throw new ApiError('No fue posible conectar con el servidor.', null);
  }

  if (!response.ok) {
    const body = await response.json().catch(() => null);

    throw new ApiError(
      body?.error ?? `Error ${response.status}`,
      response.status,
      body?.details ?? [],
    );
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

export interface ProductQuery {
  search?: string;
  category?: string;
}

/** GET de ejemplo suministrado por el starter. */
export async function getProducts(
  query: ProductQuery = {},
): Promise<Product[]> {
  const params = new URLSearchParams();

  if (query.search) params.set('search', query.search);
  if (query.category) params.set('category', query.category);

  const queryString = params.toString();

  return request<Product[]>(
    `/api/products${queryString ? `?${queryString}` : ''}`,
  );
}

/** Consultar un producto por id. */
export async function getProduct(id: number): Promise<Product> {
  return request<Product>(`/api/products/${id}`);
}

/** Crear un producto enviando sus campos como JSON. */
export async function createProduct(
  input: ProductInput,
): Promise<Product> {
  return request<Product>('/api/products', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
}

/** Actualizar un producto existente. */
export async function updateProduct(
  id: number,
  input: ProductInput,
): Promise<Product> {
  return request<Product>(`/api/products/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
}

/** Eliminar un producto; la respuesta exitosa no tiene cuerpo. */
export async function deleteProduct(id: number): Promise<void> {
  return request<void>(`/api/products/${id}`, {
    method: 'DELETE',
  });
}