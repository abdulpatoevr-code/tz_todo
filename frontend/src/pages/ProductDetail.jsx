import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShoppingCart, Check, ChevronRight, Shield, Truck, ArrowLeft, Minus, Plus } from 'lucide-react';
import { catalogApi } from '../api/catalog';
import { useCartStore } from '../store/cartStore';
import ProductCard from '../components/ProductCard';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const addToCart = useCartStore((state) => state.addToCart);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await catalogApi.getProduct(id);
        setProduct(data);
        if (data.images && data.images.length > 0) {
          const main = data.images.find((img) => img.is_main) || data.images[0];
          setSelectedImage(main.image);
        } else {
          setSelectedImage(null);
        }
        setQuantity(1);
      } catch (err) {
        console.error('Failed to load product', err);
        setError('Товар не найден или удален');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
    window.scrollTo(0, 0);
  }, [id]);

  const handleAddToCart = () => {
    if (!product || product.stock <= 0) return;
    addToCart(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '100px 0', color: 'var(--text-muted)' }}>
        Загрузка информации о товаре...
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '80px 0' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '16px' }}>{error || 'Товар не найден'}</h2>
        <Link to="/catalog" className="btn btn-primary">Вернуться в каталог</Link>
      </div>
    );
  }

  const isOutOfStock = product.stock <= 0;
  const imageFallback = 'https://placehold.co/600x600/e2e8f0/64748b?text=Нет+фото';
  const currentImage = selectedImage
    ? (selectedImage.startsWith('http') ? selectedImage : `http://127.0.0.1:8000${selectedImage.startsWith('/') ? '' : '/'}${selectedImage}`)
    : imageFallback;

  return (
    <div className="container" style={{ paddingTop: '24px' }}>
      {/* Breadcrumbs */}
      <nav style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontSize: '0.85rem',
        color: 'var(--text-muted)',
        marginBottom: '24px'
      }}>
        <Link to="/">Главная</Link>
        <ChevronRight size={14} />
        <Link to="/catalog">Каталог</Link>
        {product.category && (
          <>
            <ChevronRight size={14} />
            <Link to={`/catalog?category=${product.category.slug}`}>{product.category.name}</Link>
          </>
        )}
        <ChevronRight size={14} />
        <span style={{ color: 'var(--text-main)', fontWeight: '600' }}>{product.name}</span>
      </nav>

      {/* Main Product Info Section */}
      <div className="card" style={{ padding: '32px', marginBottom: '48px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '40px'
        }}>
          {/* 5.3 Галерея изображений */}
          <div>
            <div style={{
              width: '100%',
              aspectRatio: '1',
              backgroundColor: '#f8fafc',
              borderRadius: 'var(--radius-md)',
              overflow: 'hidden',
              marginBottom: '16px',
              border: '1px solid var(--border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <img
                src={currentImage}
                alt={product.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={(e) => { e.currentTarget.src = imageFallback; }}
              />
            </div>

            {/* Thumbnails */}
            {product.images && product.images.length > 1 && (
              <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '6px' }}>
                {product.images.map((img) => {
                  const thumbUrl = img.image.startsWith('http') ? img.image : `http://127.0.0.1:8000${img.image.startsWith('/') ? '' : '/'}${img.image}`;
                  const isSelected = selectedImage === img.image;
                  return (
                    <button
                      key={img.id}
                      onClick={() => setSelectedImage(img.image)}
                      style={{
                        width: '70px',
                        height: '70px',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        border: isSelected ? '2px solid var(--primary)' : '1px solid var(--border)',
                        padding: 0,
                        backgroundColor: '#fff',
                        flexShrink: 0
                      }}
                    >
                      <img src={thumbUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Product Details & Actions */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.85rem',
              color: 'var(--text-muted)',
              marginBottom: '8px'
            }}>
              <span>Артикул:</span>
              <span style={{ fontWeight: '600', color: 'var(--text-main)' }}>{product.sku}</span>
            </div>

            <h1 style={{ fontSize: '1.8rem', fontWeight: '800', lineHeight: '1.25', marginBottom: '16px' }}>
              {product.name}
            </h1>

            {/* Stock status badge */}
            <div style={{ marginBottom: '20px' }}>
              {isOutOfStock ? (
                <span className="badge badge-danger">Нет в наличии</span>
              ) : (
                <span className="badge badge-success">В наличии на складе ({product.stock} шт.)</span>
              )}
            </div>

            {/* Price section */}
            <div style={{
              display: 'flex',
              alignItems: 'baseline',
              gap: '16px',
              backgroundColor: '#f8fafc',
              padding: '16px 20px',
              borderRadius: 'var(--radius-md)',
              marginBottom: '24px'
            }}>
              <span style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--primary)' }}>
                {parseFloat(product.price).toLocaleString('ru-RU')} сом
              </span>
              {product.old_price && (
                <span style={{
                  fontSize: '1.2rem',
                  color: 'var(--text-muted)',
                  textDecoration: 'line-through'
                }}>
                  {parseFloat(product.old_price).toLocaleString('ru-RU')} сом
                </span>
              )}
            </div>

            {/* Quantity and Add to Cart */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              marginBottom: '28px',
              flexWrap: 'wrap'
            }}>
              {/* Quantity selector */}
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--surface)'
              }}>
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1 || isOutOfStock}
                  style={{ padding: '10px 14px', color: 'var(--text-main)', opacity: quantity <= 1 ? 0.4 : 1 }}
                >
                  <Minus size={16} />
                </button>
                <span style={{ width: '40px', textAlign: 'center', fontWeight: '700' }}>
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  disabled={quantity >= product.stock || isOutOfStock}
                  style={{ padding: '10px 14px', color: 'var(--text-main)', opacity: quantity >= product.stock ? 0.4 : 1 }}
                >
                  <Plus size={16} />
                </button>
              </div>

              {/* Add to Cart button */}
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className={`btn ${added ? 'btn-secondary' : 'btn-primary'}`}
                style={{
                  flex: 1,
                  padding: '14px 28px',
                  fontSize: '1rem',
                  opacity: isOutOfStock ? 0.5 : 1,
                  cursor: isOutOfStock ? 'not-allowed' : 'pointer'
                }}
              >
                {added ? (
                  <>
                    <Check size={20} color="var(--success)" />
                    <span style={{ color: 'var(--success)' }}>Добавлено в корзину!</span>
                  </>
                ) : (
                  <>
                    <ShoppingCart size={20} />
                    <span>Добавить в корзину</span>
                  </>
                )}
              </button>
            </div>

            {/* Description */}
            <div style={{ marginBottom: '28px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '10px' }}>
                Описание товара
              </h3>
              <p style={{ color: '#475569', lineHeight: '1.7', whiteSpace: 'pre-line' }}>
                {product.description || 'Описание данного товара пока не заполнено.'}
              </p>
            </div>

            {/* Perks */}
            <div style={{
              display: 'flex',
              gap: '20px',
              borderTop: '1px solid var(--border)',
              paddingTop: '20px',
              fontSize: '0.85rem',
              color: 'var(--text-muted)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Truck size={18} color="var(--primary)" />
                <span>Быстрая доставка</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Shield size={18} color="var(--success)" />
                <span>Гарантия возврата</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 5.3 Блок «Похожие товары» */}
      {product.similar_products && product.similar_products.length > 0 && (
        <section style={{ marginBottom: '60px' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '24px' }}>
            Похожие товары
          </h2>
          <div className="products-grid">
            {product.similar_products.map((sim) => (
              <ProductCard key={sim.id} product={sim} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
