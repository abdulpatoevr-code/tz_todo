import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, SlidersHorizontal, ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';
import { catalogApi } from '../api/catalog';
import ProductCard from '../components/ProductCard';

export default function Catalog() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // Filter and sort state from URL
  const selectedCategory = searchParams.get('category') || '';
  const minPrice = searchParams.get('min_price') || '';
  const maxPrice = searchParams.get('max_price') || '';
  const inStock = searchParams.get('in_stock') === 'true';
  const ordering = searchParams.get('ordering') || '-created_at';
  const page = parseInt(searchParams.get('page') || '1', 10);

  // Local filter inputs for price
  const [localMinPrice, setLocalMinPrice] = useState(minPrice);
  const [localMaxPrice, setLocalMaxPrice] = useState(maxPrice);

  useEffect(() => {
    catalogApi.getCategories().then(setCategories).catch(console.error);
  }, []);

  useEffect(() => {
    setLocalMinPrice(minPrice);
    setLocalMaxPrice(maxPrice);
  }, [minPrice, maxPrice]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const params = {
          page,
          ordering,
        };
        if (selectedCategory) params.category = selectedCategory;
        if (minPrice) params.min_price = minPrice;
        if (maxPrice) params.max_price = maxPrice;
        if (inStock) params.in_stock = 'true';

        const data = await catalogApi.getProducts(params);
        setProducts(data.results || []);
        setTotalCount(data.count || 0);
      } catch (err) {
        console.error('Failed to fetch catalog products', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategory, minPrice, maxPrice, inStock, ordering, page]);

  const updateParam = (key, value) => {
    const nextParams = new URLSearchParams(searchParams);
    if (value === '' || value === null || value === undefined) {
      nextParams.delete(key);
    } else {
      nextParams.set(key, value);
    }
    // reset to page 1 on filter change
    if (key !== 'page') {
      nextParams.delete('page');
    }
    setSearchParams(nextParams);
  };

  const handleApplyPrice = (e) => {
    e.preventDefault();
    const nextParams = new URLSearchParams(searchParams);
    if (localMinPrice) nextParams.set('min_price', localMinPrice);
    else nextParams.delete('min_price');
    if (localMaxPrice) nextParams.set('max_price', localMaxPrice);
    else nextParams.delete('max_price');
    nextParams.delete('page');
    setSearchParams(nextParams);
  };

  const handleResetFilters = () => {
    setSearchParams({});
    setLocalMinPrice('');
    setLocalMaxPrice('');
  };

  const totalPages = Math.ceil(totalCount / 12);

  return (
    <div className="container" style={{ paddingTop: '32px' }}>
      {/* Title & Sorting bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
        marginBottom: '24px'
      }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: '800' }}>Каталог товаров</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '4px' }}>
            Найдено товаров: {totalCount}
          </p>
        </div>

        {/* Sorting Dropdown */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <SlidersHorizontal size={18} color="var(--text-muted)" />
          <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: '500' }}>Сортировка:</span>
          <select
            value={ordering}
            onChange={(e) => updateParam('ordering', e.target.value)}
            style={{
              padding: '8px 12px',
              borderRadius: '8px',
              border: '1px solid var(--border)',
              backgroundColor: 'var(--surface)',
              fontWeight: '500',
              outline: 'none'
            }}
          >
            <option value="-created_at">По новизне</option>
            <option value="price">По возрастанию цены</option>
            <option value="-price">По убыванию цены</option>
            <option value="name">По названию (А-Я)</option>
          </select>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '32px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
        {/* Боковая панель фильтров (Sidebar) */}
        <aside style={{
          width: '260px',
          flexShrink: 0,
          backgroundColor: 'var(--surface)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border)',
          padding: '20px',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '20px',
            paddingBottom: '12px',
            borderBottom: '1px solid var(--border)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '700' }}>
              <Filter size={18} color="var(--primary)" />
              <span>Фильтры</span>
            </div>
            {(selectedCategory || minPrice || maxPrice || inStock) && (
              <button
                onClick={handleResetFilters}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '0.8rem',
                  color: 'var(--primary)',
                  fontWeight: '600'
                }}
              >
                <RotateCcw size={14} />
                <span>Сбросить</span>
              </button>
            )}
          </div>

          {/* Фильтр по категории */}
          <div style={{ marginBottom: '24px' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: '700', marginBottom: '12px' }}>Категории</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <button
                onClick={() => updateParam('category', '')}
                style={{
                  textAlign: 'left',
                  padding: '6px 10px',
                  borderRadius: '6px',
                  fontSize: '0.9rem',
                  fontWeight: selectedCategory === '' ? '700' : '400',
                  color: selectedCategory === '' ? 'var(--primary)' : 'var(--text-main)',
                  backgroundColor: selectedCategory === '' ? 'var(--primary-light)' : 'transparent',
                }}
              >
                Все категории
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => updateParam('category', cat.slug)}
                  style={{
                    textAlign: 'left',
                    padding: '6px 10px',
                    borderRadius: '6px',
                    fontSize: '0.9rem',
                    fontWeight: selectedCategory === cat.slug ? '700' : '400',
                    color: selectedCategory === cat.slug ? 'var(--primary)' : 'var(--text-main)',
                    backgroundColor: selectedCategory === cat.slug ? 'var(--primary-light)' : 'transparent',
                  }}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Фильтр по цене */}
          <div style={{ marginBottom: '24px' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: '700', marginBottom: '12px' }}>Цена (сом)</h4>
            <form onSubmit={handleApplyPrice} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="number"
                  placeholder="От"
                  value={localMinPrice}
                  onChange={(e) => setLocalMinPrice(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '6px 10px',
                    borderRadius: '6px',
                    border: '1px solid var(--border)',
                    outline: 'none'
                  }}
                />
                <input
                  type="number"
                  placeholder="До"
                  value={localMaxPrice}
                  onChange={(e) => setLocalMaxPrice(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '6px 10px',
                    borderRadius: '6px',
                    border: '1px solid var(--border)',
                    outline: 'none'
                  }}
                />
              </div>
              <button type="submit" className="btn btn-secondary" style={{ width: '100%', padding: '6px 12px', fontSize: '0.85rem' }}>
                Применить
              </button>
            </form>
          </div>

          {/* Фильтр по наличию */}
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: '700', marginBottom: '12px' }}>Наличие</h4>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.9rem' }}>
              <input
                type="checkbox"
                checked={inStock}
                onChange={(e) => updateParam('in_stock', e.target.checked ? 'true' : '')}
                style={{ width: '16px', height: '16px' }}
              />
              <span>Только в наличии</span>
            </label>
          </div>
        </aside>

        {/* Сетка товаров и пагинация */}
        <main style={{ flex: '1', minWidth: '280px' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '80px', color: 'var(--text-muted)' }}>
              Загрузка каталога...
            </div>
          ) : products.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '60px 20px' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '8px' }}>
                Товары не найдены
              </h3>
              <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>
                Попробуйте изменить параметры фильтрации
              </p>
              <button onClick={handleResetFilters} className="btn btn-primary">
                Сбросить фильтры
              </button>
            </div>
          ) : (
            <>
              <div className="products-grid">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* Пагинация (12 товаров на страницу) */}
              {totalPages > 1 && (
                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: '8px',
                  marginTop: '40px'
                }}>
                  <button
                    onClick={() => updateParam('page', page - 1)}
                    disabled={page <= 1}
                    className="btn btn-outline"
                    style={{ padding: '8px 12px', opacity: page <= 1 ? 0.4 : 1 }}
                  >
                    <ChevronLeft size={18} />
                    <span>Назад</span>
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => updateParam('page', p)}
                      style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '8px',
                        border: '1px solid var(--border)',
                        backgroundColor: p === page ? 'var(--primary)' : 'var(--surface)',
                        color: p === page ? '#fff' : 'var(--text-main)',
                        fontWeight: '600',
                        fontSize: '0.9rem'
                      }}
                    >
                      {p}
                    </button>
                  ))}

                  <button
                    onClick={() => updateParam('page', page + 1)}
                    disabled={page >= totalPages}
                    className="btn btn-outline"
                    style={{ padding: '8px 12px', opacity: page >= totalPages ? 0.4 : 1 }}
                  >
                    <span>Вперед</span>
                    <ChevronRight size={18} />
                  </button>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
