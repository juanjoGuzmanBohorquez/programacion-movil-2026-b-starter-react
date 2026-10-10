import {
  IonButton,
  IonContent,
  IonHeader,
  IonInput,
  IonList,
  IonPage,
  IonSpinner,
  IonTitle,
  IonToolbar,
  useIonViewWillEnter,
} from '@ionic/react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';

import { getErrorMessage } from '../data/api-error';
import { getProducts } from '../data/products-api';
import {
  CATEGORIES,
  filterProducts,
  toProductView,
  type Product,
} from '../domain/product';
import EmptyState from './EmptyState';
import ProductCard from './ProductCard';

type LoadStatus = 'loading' | 'ready' | 'error';

const ProductListPage: React.FC = () => {
  const history = useHistory();
  const [products, setProducts] = useState<Product[]>([]);
  const [status, setStatus] = useState<LoadStatus>('loading');
  const [errorMessage, setErrorMessage] = useState('');
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const isLoadingRef = useRef(false);

  const loadProducts = useCallback(async () => {
    if (isLoadingRef.current) return;

    isLoadingRef.current = true;
    setStatus('loading');
    setErrorMessage('');

    try {
      setProducts(await getProducts());
      setStatus('ready');
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
      setStatus('error');
    } finally {
      isLoadingRef.current = false;
    }
  }, []);

  useEffect(() => {
    void loadProducts();
  }, [loadProducts]);

  useIonViewWillEnter(() => {
    void loadProducts();
  });

  const filteredProducts = filterProducts(products, { search, category });

  const clearFilters = () => {
    setSearch('');
    setCategory('');
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Productos</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <IonButton
          expand="block"
          onClick={() => history.push('/productos/nuevo')}
        >
          Nuevo producto
        </IonButton>

        <IonInput
          label="Buscar por nombre"
          labelPlacement="stacked"
          fill="outline"
          placeholder="Ejemplo: agua"
          value={search}
          clearInput
          onIonInput={(event) =>
            setSearch(String(event.detail.value ?? ''))
          }
        />

        <div
          className="ion-margin-top ion-margin-bottom"
          role="group"
          aria-label="Filtrar por categoría"
        >
          <IonButton
            fill={category === '' ? 'solid' : 'outline'}
            aria-pressed={category === ''}
            onClick={() => setCategory('')}
          >
            Todas
          </IonButton>

          {CATEGORIES.map((item) => (
            <IonButton
              key={item}
              fill={category === item ? 'solid' : 'outline'}
              aria-pressed={category === item}
              onClick={() => setCategory(item)}
            >
              {item}
            </IonButton>
          ))}
        </div>

        {status === 'loading' && (
          <div
            className="ion-text-center ion-padding"
            role="status"
            aria-live="polite"
          >
            <IonSpinner aria-label="Cargando productos" />
            <p>Cargando productos…</p>
          </div>
        )}

        {status === 'error' && (
          <div role="alert">
            <EmptyState
              title="No se pudo cargar"
              message={errorMessage}
              actionLabel="Reintentar"
              onAction={() => void loadProducts()}
            />
          </div>
        )}

        {status === 'ready' && products.length === 0 && (
          <EmptyState
            title="No hay productos"
            message="Crea el primer producto para empezar."
            actionLabel="Crear producto"
            onAction={() => history.push('/productos/nuevo')}
          />
        )}

        {status === 'ready' &&
          products.length > 0 &&
          filteredProducts.length === 0 && (
            <EmptyState
              title="Sin resultados"
              message="No hay productos que coincidan con los filtros."
              actionLabel="Limpiar filtros"
              onAction={clearFilters}
            />
          )}

        {status === 'ready' && filteredProducts.length > 0 && (
          <>
            <p role="status" aria-live="polite">
              Productos encontrados: {filteredProducts.length}
            </p>

            <IonList>
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={toProductView(product)}
                  onSelect={(id) => history.push(`/productos/${id}`)}
                />
              ))}
            </IonList>
          </>
        )}
      </IonContent>
    </IonPage>
  );
};

export default ProductListPage;