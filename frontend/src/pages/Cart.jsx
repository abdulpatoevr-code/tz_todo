import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, ArrowLeft } from 'lucide-react';
import { useCartStore } from '../store/cartStore';

export default function Cart() {
  const { items, updateQuantity, removeFromCart, clearCart, getTotalPrice, getTotalItems } = useCartStore();
  const navigate = useNavigate();

  const totalPrice = getTotalPrice();
  const totalItems = getTotalItems();

  if (items.length === 0) {
    return (
      <div className="container" style={{ paddingTop: '60px', paddingBottom: '60px' }}>
        <div className="card" style={{
          maxWidth: '540px',
          margin: '0 auto',
          textAlign: 'center',
          padding: '48px 24px'
        }}>
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            backgroundColor: 'var(--primary-light)',
            color: 'var(--primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px'
          }}>
            <ShoppingBag size={40} />
          </div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: '800', marginBottom: '12px' }}>
            Ваша корзина пуста
          </h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '32px', lineHeight: '1.6' }}>
            Кажется, вы еще не добавили ни одного товара. Перейдите в каталог и выберите то, что вам понравится!
          </p>
          <Link to="/catalog" className="btn btn-primary" style={{ padding: '12px 32px' }}>
            <span>Перейти в каталог</span>
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingTop: '32px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: '800' }}>
          Корзина ({totalItems})
        </h1>
        <button
          onClick={clearCart}
          style={{
            color: 'var(--danger)',
            fontSize: '0.9rem',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <Trash2 size={16} />
          <span>Очистить корзину</span>
        </button>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '32px',
        alignItems: 'flex-start'
      }}>
        {/* Items List */}
        <div style={{ flex: '2', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {items.map(({ product, quantity }) => {
            const imageSrc = product.main_image ||
              (product.images && product.images[0] ? product.images[0].image : null) ||
              'https://placehold.co/100x100/e2e8f0/64748b?text=Фото';
            const itemTotal = parseFloat(product.price) * quantity;

            return (
              <div key={product.id} className="card" style={{
                padding: '20px',
                display: 'flex',
                gap: '20px',
                alignItems: 'center',
                flexWrap: 'wrap'
              }}>
                {/* Thumbnail */}
                <Link to={`/product/${product.id}`} style={{
                  width: '90px',
                  height: '90px',
                  borderRadius: '10px',
                  overflow: 'hidden',
                  flexShrink: 0,
                  backgroundColor: '#f8fafc',
                  border: '1px solid var(--border)'
                }}>
                  <img
                    src={imageSrc}
                    alt={product.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={(e) => { e.currentTarget.src = 'https://placehold.co/100x100/e2e8f0/64748b?text=Фото'; }}
                  />
                </Link>

                {/* Info */}
                <div style={{ flex: '1', minWidth: '180px' }}>
                  <Link to={`/product/${product.id}`} style={{
                    fontSize: '1.05rem',
                    fontWeight: '700',
                    color: 'var(--text-main)',
                    display: 'block',
                    marginBottom: '4px'
                  }}>
                    {product.name}
                  </Link>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
                    Артикул: {product.sku}
                  </div>
                  <div style={{ fontSize: '1rem', fontWeight: '600', color: 'var(--primary)' }}>
                    {parseFloat(product.price).toLocaleString('ru-RU')} сом / шт.
                  </div>
                </div>

                {/* Quantity Controls */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  backgroundColor: '#f8fafc'
                }}>
                  <button
                    onClick={() => updateQuantity(product.id, quantity - 1)}
                    style={{ padding: '8px 12px', color: 'var(--text-main)' }}
                  >
                    <Minus size={16} />
                  </button>
                  <span style={{ width: '36px', textAlign: 'center', fontWeight: '700', fontSize: '0.95rem' }}>
                    {quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(product.id, quantity + 1)}
                    style={{ padding: '8px 12px', color: 'var(--text-main)' }}
                  >
                    <Plus size={16} />
                  </button>
                </div>

                {/* Line Total */}
                <div style={{ minWidth: '110px', textAlign: 'right' }}>
                  <div style={{ fontSize: '1.15rem', fontWeight: '800' }}>
                    {itemTotal.toLocaleString('ru-RU')} сом
                  </div>
                </div>

                {/* Delete button */}
                <button
                  onClick={() => removeFromCart(product.id)}
                  style={{
                    color: 'var(--text-muted)',
                    padding: '8px',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  title="Удалить товар"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            );
          })}
        </div>

        {/* Order Summary Sidebar */}
        <div style={{ flex: '1', minWidth: '300px' }}>
          <div className="card" style={{ padding: '24px', position: 'sticky', top: '100px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '20px' }}>
              Сумма заказа
            </h3>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '0.95rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Товары ({totalItems} шт.):</span>
              <span style={{ fontWeight: '600' }}>{totalPrice.toLocaleString('ru-RU')} сом</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', fontSize: '0.95rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Доставка:</span>
              <span style={{ fontWeight: '600', color: 'var(--success)' }}>Бесплатно</span>
            </div>

            <div style={{
              borderTop: '1px solid var(--border)',
              paddingTop: '16px',
              marginBottom: '24px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'baseline'
            }}>
              <span style={{ fontSize: '1.1rem', fontWeight: '700' }}>Итого:</span>
              <span style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--primary)' }}>
                {totalPrice.toLocaleString('ru-RU')} сом
              </span>
            </div>

            <button
              onClick={() => navigate('/checkout')}
              className="btn btn-primary"
              style={{ width: '100%', padding: '14px', fontSize: '1rem', borderRadius: '12px' }}
            >
              <span>Оформить заказ</span>
              <ArrowRight size={18} />
            </button>

            <Link
              to="/catalog"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                marginTop: '16px',
                fontSize: '0.9rem',
                color: 'var(--text-muted)',
                fontWeight: '500'
              }}
            >
              <ArrowLeft size={16} />
              <span>Продолжить покупки</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
