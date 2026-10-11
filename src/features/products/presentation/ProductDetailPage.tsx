import {
  IonBackButton,
  IonBadge,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonPage,
  IonSpinner,
  IonTitle,
  IonToolbar,
  useIonViewWillEnter,
} from '@ionic/react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';

import { getErrorMessage } from '../data/api-error';
import { deleteProduct, getProduct } from '../data/products-api';
import { toProductView, type Product } from '../domain/product';
import EmptyState from './EmptyState';

type LoadStatus = 'loading' | 'ready' | 'error';

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const history = useHistory();

  const [product, setProduct] = useState<Product | null>(null);
  const [status, setStatus] = useState<LoadStatus>('loading');
  const [errorMessage, setErrorMessage] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  const loadingIdRef = useRef<string | null>(null);
  const requestRef = useRef(0);
  const deletingRef = useRef(false);

  const loadProduct = useCallback(async () => {
    if (loadingIdRef.current === id) return;

    loadingIdRef.current = id;
    const request = ++requestRef.current;

    setStatus('loading');
    setErrorMessage('');
    setConfirmDelete(false);
    setDeleteError('');

    try {
      const result = await getProduct(Number(id));

      if (request === requestRef.current) {
        setProduct(result);
        setStatus('ready');
      }
    } catch (error) {
      if (request === requestRef.current) {
        setProduct(null);
        setErrorMessage(getErrorMessage(error));
        setStatus('error');
      }
    } finally {
      if (request === requestRef.current) {
        loadingIdRef.current = null;
      }
    }
  }, [id]);

  useEffect(() => {
    void loadProduct();
  }, [loadProduct]);

  useIonViewWillEnter(() => {
    void loadProduct();
  }, [loadProduct]);

  const handleDelete = async () => {
    if (!product || deletingRef.current) return;

    deletingRef.current = true;
    setIsDeleting(true);
    setDeleteError('');

    try {
      await deleteProduct(product.id);
      setConfirmDelete(false);
      history.replace('/productos');
    } catch (error) {
      setDeleteError(getErrorMessage(error));
    } finally {
      deletingRef.current = false;
      setIsDeleting(false);
    }
  };

  const view = product ? toProductView(product) : null;

  const stockColor = view?.isOutOfStock
    ? 'danger'
    : view?.isLowStock
      ? 'warning'
      : 'success';

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/productos" />
          </IonButtons>
          <IonTitle>Detalle del producto</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        {status === 'loading' && (
          <div className="ion-text-center" role="status">
            <IonSpinner aria-label="Cargando producto" />
            <p>Cargando producto…</p>
          </div>
        )}

        {status === 'error' && (
          <div role="alert">
            <EmptyState
              title="No se pudo cargar el producto"
              message={errorMessage}
              actionLabel="Reintentar"
              onAction={() => void loadProduct()}
            />
            <IonButton
              expand="block"
              fill="outline"
              onClick={() => history.replace('/productos')}
            >
              Volver a productos
            </IonButton>
          </div>
        )}

        {status === 'ready' && view && (
          <>
            <h1>{view.name}</h1>
            <p>Identificador: {view.id}</p>
            <p>Categoría: {view.category}</p>
            <p>Precio: {view.priceLabel}</p>
            <p>Existencias: {view.stock}</p>

            <IonBadge color={stockColor}>
              {view.stockLabel}
            </IonBadge>

            <div className="ion-margin-top">
              <IonButton
                expand="block"
                disabled={isDeleting}
                onClick={() =>
                  history.push(`/productos/${view.id}/editar`)
                }
              >
                Editar
              </IonButton>

              {!confirmDelete && (
                <IonButton
                  expand="block"
                  color="danger"
                  onClick={() => {
                    setDeleteError('');
                    setConfirmDelete(true);
                  }}
                >
                  Eliminar
                </IonButton>
              )}
            </div>

            {confirmDelete && (
              <section
                className="ion-padding ion-margin-top"
                aria-labelledby="delete-confirmation"
              >
                <h2 id="delete-confirmation">
                  ¿Eliminar este producto?
                </h2>
                <p>Se eliminará {view.name} del catálogo.</p>

                {deleteError && <p role="alert">{deleteError}</p>}

                <IonButton
                  color="danger"
                  disabled={isDeleting}
                  onClick={() => void handleDelete()}
                >
                  {isDeleting ? 'Eliminando…' : 'Confirmar'}
                </IonButton>

                <IonButton
                  fill="outline"
                  disabled={isDeleting}
                  onClick={() => {
                    setConfirmDelete(false);
                    setDeleteError('');
                  }}
                >
                  Cancelar
                </IonButton>
              </section>
            )}

            <IonButton
              expand="block"
              fill="outline"
              disabled={isDeleting}
              onClick={() => history.replace('/productos')}
            >
              Volver a productos
            </IonButton>
          </>
        )}
      </IonContent>
    </IonPage>
  );
};

export default ProductDetailPage;