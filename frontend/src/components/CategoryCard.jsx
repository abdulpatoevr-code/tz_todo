import React from 'react';
import { Link } from 'react-router-dom';
import { Layers } from 'lucide-react';

export default function CategoryCard({ category }) {
  const imageSrc = category.image
    ? (category.image.startsWith('http') ? category.image : `http://127.0.0.1:8000${category.image.startsWith('/') ? '' : '/'}${category.image}`)
    : 'https://placehold.co/400x300/3b82f6/ffffff?text=Категория';

  return (
    <Link
      to={`/catalog?category=${category.slug}`}
      className="card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        transition: 'transform 0.2s, box-shadow 0.2s',
        position: 'relative',
        textDecoration: 'none'
      }}
      onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
      onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
    >
      <div style={{
        height: '140px',
        backgroundColor: '#e2e8f0',
        overflow: 'hidden',
        position: 'relative'
      }}>
        <img
          src={imageSrc}
          alt={category.name}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
          onError={(e) => {
            e.currentTarget.src = 'https://placehold.co/400x300/3b82f6/ffffff?text=' + encodeURIComponent(category.name);
          }}
        />
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 70%)'
        }} />
        <div style={{
          position: 'absolute',
          bottom: '12px',
          left: '12px',
          right: '12px',
          color: '#fff'
        }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: '700', textShadow: '0 1px 2px rgba(0,0,0,0.8)' }}>
            {category.name}
          </h3>
          {category.products_count !== undefined && (
            <div style={{ fontSize: '0.75rem', opacity: 0.9 }}>
              {category.products_count} товаров
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
