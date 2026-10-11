import { IonBadge, IonItem, IonLabel } from '@ionic/react';
import type { ProductView } from '../domain/product';

export interface ProductCardProps {
  product: ProductView;
  onSelect?: (id: number) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onSelect }) => {
  const stockColor = product.isOutOfStock
    ? 'danger'
    : product.isLowStock
      ? 'warning'
      : 'success';

  return (
    <IonItem
      button={Boolean(onSelect)}
      detail={Boolean(onSelect)}
      onClick={() => onSelect?.(product.id)}
      aria-label={`Ver ${product.name}, ${product.priceLabel}, ${product.stockLabel}`}
    >
      <IonLabel className="ion-text-wrap">
        <h2>{product.name}</h2>
        <p>{product.category}</p>
        <p>{product.priceLabel}</p>
        <p>Existencias: {product.stock}</p>
        <IonBadge color={stockColor}>{product.stockLabel}</IonBadge>
      </IonLabel>
    </IonItem>
  );
};

export default ProductCard;