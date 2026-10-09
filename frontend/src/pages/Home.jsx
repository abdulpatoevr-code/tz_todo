import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, TrendingUp, ShoppingBag, ShieldCheck } from 'lucide-react';
import { catalogApi } from '../api/catalog';
import ProductCard from '../components/ProductCard';
import CategoryCard from '../components/CategoryCard';

export default function Home() {
  const [categories, setCategories] = useState([]);
  const [popularProducts, setPopularProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [catsRes, prodsRes] = await Promise.all([
          catalogApi.getCategories(),
          catalogApi.getProducts({ page_size: 8, ordering: '-created_at' })
        ]);
        setCategories(catsRes);
        setPopularProducts(prodsRes.results || prodsRes);
      } catch (err) {
        console.error('Failed to load home data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      {/* 5.1 Баннер с акцией (Hero Banner) */}
      <section style={{
        background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 50%, #3b82f6 100%)',
        color: '#ffffff',
        padding: '60px 0',
        marginBottom: '48px',
        borderRadius: '0 0 24px 24px',
        boxShadow: '0 10px 25px -5px rgba(37, 99, 235, 0.25)'
      }}>
        <div className="container" style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '30px'
        }}>
          <div style={{ maxWidth: '600px' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
              padding: '6px 14px',
              borderRadius: '9999px',
              fontSize: '0.85rem',
              fontWeight: '600',
              marginBottom: '16px',
              backdropFilter: 'blur(4px)'
            }}>
              <Sparkles size={16} color="#fde047" />
              <span>Сезонная распродажа года</span>
            </div>
            <h1 style={{
              fontSize: 'clamp(2rem, 5vw, 3.2rem)',
              fontWeight: '800',
              lineHeight: '1.15',
              marginBottom: '18px',
              letterSpacing: '-1px'
            }}>
              Скидки до 40% на технику и обувь
            </h1>
            <p style={{
              fontSize: '1.1rem',
              opacity: 0.9,
              marginBottom: '28px',
              lineHeight: '1.6'
            }}>
              Новые поступления флагманских смартфонов, стильной одежды и спортивных аксессуаров с гарантией качества и быстрой доставкой по всему городу.
            </p>
            <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
              <Link to="/catalog" className="btn" style={{
                backgroundColor: '#ffffff',
                color: 'var(--primary)',
                padding: '12px 28px',
                fontSize: '1rem',
                borderRadius: '12px'
              }}>
                <ShoppingBag size={18} />
                <span>Перейти в каталог</span>
              </Link>
              <Link to="/catalog?ordering=-created_at" className="btn" style={{
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                color: '#ffffff',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                padding: '12px 24px',
                borderRadius: '12px'
              }}>
                <span>Новинки</span>
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>

          <div style={{
            flex: '1',
            minWidth: '280px',
            maxWidth: '440px',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '20px',
            padding: '28px',
            color: '#fff'
          }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '16px' }}>
              Преимущества нашего магазина
            </h3>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.95rem' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', padding: '6px', borderRadius: '50%' }}>✓</span>
                Оригинальная продукция от проверенных брендов
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', padding: '6px', borderRadius: '50%' }}>✓</span>
                Оплата наличными или картой при получении
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', padding: '6px', borderRadius: '50%' }}>✓</span>
                Быстрое оформление без обязательной регистрации
              </li>
            </ul>
          </div>
        </div>
      </section>

      <div className="container">
        {/* 5.1 Блок «Категории» */}
        <section style={{ marginBottom: '56px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '24px'
          }}>
            <div>
              <h2 style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--text-main)' }}>
                Популярные категории
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '4px' }}>
                Выберите категорию для быстрого поиска
              </p>
            </div>
            <Link to="/catalog" style={{
              color: 'var(--primary)',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.95rem'
            }}>
              <span>Все категории</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: '20px'
          }}>
            {categories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        </section>

        {/* 5.1 Блок «Популярные товары» */}
        <section style={{ marginBottom: '60px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '24px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ backgroundColor: 'var(--accent-light)', padding: '8px', borderRadius: '10px', color: 'var(--accent)' }}>
                <TrendingUp size={22} />
              </div>
              <div>
                <h2 style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--text-main)' }}>
                  Популярные товары
                </h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '2px' }}>
                  Хиты продаж и выгодные предложения
                </p>
              </div>
            </div>

            <Link to="/catalog" className="btn btn-outline" style={{ fontSize: '0.9rem' }}>
              <span>Смотреть все</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>
              Загрузка товаров...
            </div>
          ) : (
            <div className="products-grid">
              {popularProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
