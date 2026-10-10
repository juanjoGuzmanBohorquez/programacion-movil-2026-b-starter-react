import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonInput,
  IonPage,
  IonSpinner,
  IonText,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';

import { ApiError, getErrorMessage } from '../data/api-error';
import {
  createProduct,
  getProduct,
  updateProduct,
} from '../data/products-api';
import {
  CATEGORIES,
  validateProduct,
  type ValidationResult,
} from '../domain/product';
import EmptyState from './EmptyState';

type LoadStatus = 'loading' | 'ready' | 'error';

const ProductFormPage: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const history = useHistory();
  const isEditing = id !== undefined;

  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [stock, setStock] = useState('');

  const [status, setStatus] = useState<LoadStatus>(
    isEditing ? 'loading' : 'ready',
  );
  const [loadError, setLoadError] = useState('');
  const [errors, setErrors] = useState<ValidationResult['errors']>({});
  const [saveError, setSaveError] = useState('');
  const [serverDetails, setServerDetails] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  const savingRef = useRef(false);
  const requestRef = useRef(0);

  const loadForm = useCallback(async () => {
    const request = ++requestRef.current;

    setErrors({});
    setSaveError('');
    setServerDetails([]);
    setLoadError('');

    if (id === undefined) {
      setName('');
      setPrice('');
      setCategory('');
      setStock('');
      setStatus('ready');
      return;
    }

    setStatus('loading');

    try {
      const product = await getProduct(Number(id));

      if (request !== requestRef.current) return;

      setName(product.name);
      setPrice(String(product.price));
      setCategory(product.category);
      setStock(String(product.stock));
      setStatus('ready');
    } catch (error) {
      if (request !== requestRef.current) return;

      setLoadError(getErrorMessage(error));
      setStatus('error');
    }
  }, [id]);

  useEffect(() => {
    void loadForm();

    return () => {
      requestRef.current += 1;
    };
  }, [loadForm]);

  const handleSave = async () => {
    if (savingRef.current) return;

    setSaveError('');
    setServerDetails([]);

    const input = {
      name: name.trim(),
      price: price.trim() === '' ? NaN : Number(price),
      category,
      stock: stock.trim() === '' ? NaN : Number(stock),
    };

    const validation = validateProduct(input);
    setErrors(validation.errors);

    if (!validation.isValid) return;

    savingRef.current = true;
    setIsSaving(true);

    try {
      if (id !== undefined) {
        await updateProduct(Number(id), input);
      } else {
        await createProduct(input);
      }

      history.replace('/productos');
    } catch (error) {
      setSaveError(getErrorMessage(error));

      if (error instanceof ApiError) {
        setServerDetails(error.details);
      }
    } finally {
      savingRef.current = false;
      setIsSaving(false);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/productos" />
          </IonButtons>
          <IonTitle>
            {isEditing ? 'Editar producto' : 'Nuevo producto'}
          </IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        {status === 'loading' && (
          <div className="ion-text-center" role="status">
            <IonSpinner aria-label="Cargando formulario" />
            <p>Cargando producto…</p>
          </div>
        )}

        {status === 'error' && (
          <div role="alert">
            <EmptyState
              title="No se pudo cargar el formulario"
              message={loadError}
              actionLabel="Reintentar"
              onAction={() => void loadForm()}
            />
          </div>
        )}

        {status === 'ready' && (
          <form
            noValidate
            onSubmit={(event) => {
              event.preventDefault();
              void handleSave();
            }}
          >
            <IonInput
              label="Nombre"
              labelPlacement="stacked"
              fill="outline"
              value={name}
              disabled={isSaving}
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? 'name-error' : undefined}
              onIonInput={(event) =>
                setName(String(event.detail.value ?? ''))
              }
            />
            {errors.name && (
              <IonText color="danger">
                <p id="name-error" role="alert">{errors.name}</p>
              </IonText>
            )}

            <IonInput
              className="ion-margin-top"
              label="Precio en pesos colombianos"
              labelPlacement="stacked"
              fill="outline"
              type="number"
              inputmode="decimal"
              value={price}
              disabled={isSaving}
              aria-invalid={Boolean(errors.price)}
              aria-describedby={errors.price ? 'price-error' : undefined}
              onIonInput={(event) =>
                setPrice(String(event.detail.value ?? ''))
              }
            />
            {errors.price && (
              <IonText color="danger">
                <p id="price-error" role="alert">{errors.price}</p>
              </IonText>
            )}

            <fieldset
              className="ion-margin-top"
              disabled={isSaving}
              aria-describedby={
                errors.category ? 'category-error' : undefined
              }
            >
              <legend>Categoría</legend>

              {CATEGORIES.map((item) => (
                <IonButton
                  key={item}
                  type="button"
                  fill={category === item ? 'solid' : 'outline'}
                  aria-pressed={category === item}
                  disabled={isSaving}
                  onClick={() => setCategory(item)}
                >
                  {item}
                </IonButton>
              ))}
            </fieldset>
            {errors.category && (
              <IonText color="danger">
                <p id="category-error" role="alert">
                  {errors.category}
                </p>
              </IonText>
            )}

            <IonInput
              className="ion-margin-top"
              label="Existencias"
              labelPlacement="stacked"
              fill="outline"
              type="number"
              inputmode="numeric"
              step="1"
              value={stock}
              disabled={isSaving}
              aria-invalid={Boolean(errors.stock)}
              aria-describedby={errors.stock ? 'stock-error' : undefined}
              onIonInput={(event) =>
                setStock(String(event.detail.value ?? ''))
              }
            />
            {errors.stock && (
              <IonText color="danger">
                <p id="stock-error" role="alert">{errors.stock}</p>
              </IonText>
            )}

            {saveError && (
              <div role="alert">
                <IonText color="danger">
                  <p>{saveError}</p>
                  {serverDetails.length > 0 && (
                    <ul>
                      {serverDetails.map((detail, index) => (
                        <li key={`${index}-${detail}`}>{detail}</li>
                      ))}
                    </ul>
                  )}
                </IonText>
              </div>
            )}

            <IonButton
              className="ion-margin-top"
              expand="block"
              type="submit"
              disabled={isSaving}
            >
              {isSaving
                ? 'Guardando…'
                : isEditing
                  ? 'Guardar cambios'
                  : 'Crear producto'}
            </IonButton>
          </form>
        )}

        <IonButton
          expand="block"
          fill="outline"
          disabled={isSaving}
          onClick={() => history.replace('/productos')}
        >
          Cancelar y volver
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default ProductFormPage;