import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Check } from 'lucide-react';
import { useCartStore } from '../store/cartStore';

export default function ProductCard({ product }) {
  const [added, setAdded] = useState(false);
  const addToCart = useCartStore((state) => state.addToCart);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.stock <= 0) return;
    addToCart(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const imageSrc = product.main_image ||
    (product.images && product.images.length > 0 ? product.images[0].image : null) ||
    'https://placehold.co/400x400/e2e8f0/64748b?text=Нет+фото';

  const isOutOfStock = product.stock <= 0;

  return (
    <div className="card" style={{
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      height: '100%',
      position: 'relative',
      transition: 'transform 0.2s, box-shadow 0.2s',
    }}>
      {/* Discount badge if old_price */}
      {product.old_price && parseFloat(product.old_price) > parseFloat(product.price) && (
        <div style={{
          position: 'absolute',
          top: '12px',
          left: '12px',
          backgroundColor: 'var(--danger)',
          color: '#fff',
          fontSize: '0.75rem',
          fontWeight: '700',
          padding: '4px 8px',
          borderRadius: '6px',
          zIndex: 2,
          boxShadow: '0 2px 4px rgba(239, 68, 68, 0.3)'
        }}>
          -{Math.round(((product.old_price - product.price) / product.old_price) * 100)}%
        </div>
      )}

      {/* Product Image Link */}
      <Link to={`/product/${product.id}`} style={{
        position: 'relative',
        paddingTop: '80%',
        backgroundColor: '#f1f5f9',
        overflow: 'hidden',
        display: 'block'
      }}>
        <img
          src={imageSrc}
          alt={product.name}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.3s'
          }}
          onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
          onError={(e) => {
            e.currentTarget.src = 'https://placehold.co/400x400/e2e8f0/64748b?text=No+Photo';
          }}
        />
      </Link>

      {/* Product Details */}
      <div style={{
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        justifyContent: 'space-between'
      }}>
        <div>
          {/* Category */}
          {product.category && (
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '600', marginBottom: '6px' }}>
              {product.category.name}
            </div>
          )}

          {/* Title */}
          <Link to={`/product/${product.id}`} style={{
            fontSize: '1rem',
            fontWeight: '600',
            color: 'var(--text-main)',
            lineHeight: '1.35',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            marginBottom: '8px'
          }}>
            {product.name}
          </Link>
        </div>

        <div>
          {/* Stock info */}
          <div style={{ marginBottom: '12px' }}>
            {isOutOfStock ? (
              <span className="badge badge-danger">Нет в наличии</span>
            ) : (
              <span className="badge badge-success">В наличии ({product.stock} шт.)</span>
            )}
          </div>

          {/* Price & Action */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '8px',
            marginTop: 'auto'
          }}>
            <div>
              <div style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-main)' }}>
                {parseFloat(product.price).toLocaleString('ru-RU')} сом
              </div>
              {product.old_price && (
                <div style={{
                  fontSize: '0.85rem',
                  color: 'var(--text-muted)',
                  textDecoration: 'line-through'
                }}>
                  {parseFloat(product.old_price).toLocaleString('ru-RU')} сом
                </div>
              )}
            </div>

            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className={`btn ${added ? 'btn-secondary' : 'btn-primary'}`}
              style={{
                padding: '8px 12px',
                borderRadius: '8px',
                fontSize: '0.85rem',
                opacity: isOutOfStock ? 0.4 : 1,
                cursor: isOutOfStock ? 'not-allowed' : 'pointer'
              }}
              title={isOutOfStock ? 'Товар закончился' : 'Добавить в корзину'}
            >
              {added ? (
                <>
                  <Check size={16} color="var(--success)" />
                  <span style={{ color: 'var(--success)' }}>В корзине</span>
                </>
              ) : (
                <>
                  <ShoppingCart size={16} />
                  <span>В корзину</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
