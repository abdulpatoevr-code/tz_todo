import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search as SearchIcon, ArrowRight } from 'lucide-react';
import { catalogApi } from '../api/catalog';
import ProductCard from '../components/ProductCard';

export default function Search() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';

  const [products, setProducts] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSearch = async () => {
      if (!query.trim()) {
        setProducts([]);
        setTotalCount(0);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await catalogApi.getProducts({ search: query });
        setProducts(data.results || []);
        setTotalCount(data.count || 0);
      } catch (err) {
        console.error('Failed to execute search', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSearch();
  }, [query]);

  return (
    <div className="container" style={{ paddingTop: '32px' }}>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '8px' }}>
          Результаты поиска: «{query}»
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          Найдено товаров: {totalCount}
        </p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--text-muted)' }}>
          Выполняется поиск...
        </div>
      ) : products.length === 0 ? (
        <div className="card" style={{
          textAlign: 'center',
          padding: '60px 24px',
          maxWidth: '540px',
          margin: '0 auto'
        }}>
          <div style={{
            width: '72px',
            height: '72px',
            borderRadius: '50%',
            backgroundColor: '#f1f5f9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
            color: 'var(--text-muted)'
          }}>
            <SearchIcon size={36} />
          </div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '8px' }}>
            Ничего не найдено
          </h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>
            По запросу «{query}» ничего не найдено. Проверьте правильность написания или посмотрите весь каталог.
          </p>
          <Link to="/catalog" className="btn btn-primary">
            <span>Перейти в каталог</span>
            <ArrowRight size={18} />
          </Link>
        </div>
      ) : (
        <div className="products-grid">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
