import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Search, Store, LogOut, Menu, X } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useCartStore } from '../store/cartStore';

export default function Header() {
  const [searchTerm, setSearchTerm] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const { user, isAuthenticated, logout } = useAuthStore();
  const totalItems = useCartStore((state) => state.getTotalItems());

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
      setMobileMenuOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  return (
    <header style={{
      backgroundColor: 'var(--surface)',
      borderBottom: '1px solid var(--border)',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      boxShadow: 'var(--shadow-sm)'
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '74px',
        gap: '20px'
      }}>
        {/* Brand Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <div style={{
            background: 'linear-gradient(135deg, var(--primary), #3b82f6)',
            color: '#fff',
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 10px rgba(37, 99, 235, 0.3)'
          }}>
            <Store size={24} />
          </div>
          <div>
            <span style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-main)', letterSpacing: '-0.5px' }}>
              MARKET<span style={{ color: 'var(--primary)' }}>.KG</span>
            </span>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '-4px', fontWeight: '500' }}>
              ИНТЕРНЕТ-МАГАЗИН
            </div>
          </div>
        </Link>

        {/* Navigation Link to Catalog */}
        <nav style={{ display: 'flex', gap: '15px' }} className="desktop-nav">
          <Link to="/" style={{ fontWeight: 600, color: 'var(--text-main)', padding: '8px 12px', borderRadius: '6px' }}>
            Главная
          </Link>
          <Link to="/catalog" style={{
            fontWeight: 600,
            color: 'var(--primary)',
            backgroundColor: 'var(--primary-light)',
            padding: '8px 16px',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            Каталог
          </Link>
        </nav>

        {/* Search Bar */}
        <form onSubmit={handleSearch} style={{
          flex: '1',
          maxWidth: '460px',
          display: 'flex',
          position: 'relative'
        }}>
          <input
            type="text"
            placeholder="Поиск товаров (например, Nike, Смартфон)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 42px 10px 16px',
              borderRadius: '9999px',
              border: '1px solid var(--border)',
              backgroundColor: '#f8fafc',
              outline: 'none',
              transition: 'border-color 0.2s',
            }}
            onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
            onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
          />
          <button type="submit" style={{
            position: 'absolute',
            right: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'var(--text-muted)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Search size={18} />
          </button>
        </form>

        {/* User & Cart Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {/* Cart Icon with Counter */}
          <Link to="/cart" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 14px',
            borderRadius: '10px',
            backgroundColor: '#f1f5f9',
            position: 'relative',
            color: 'var(--text-main)',
            fontWeight: 600
          }}>
            <ShoppingCart size={20} color="var(--primary)" />
            <span>Корзина</span>
            {totalItems > 0 && (
              <span style={{
                position: 'absolute',
                top: '-6px',
                right: '-6px',
                backgroundColor: 'var(--accent)',
                color: '#fff',
                fontSize: '0.75rem',
                fontWeight: 'bold',
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 4px rgba(249, 115, 22, 0.4)'
              }}>
                {totalItems}
              </span>
            )}
          </Link>

          {/* Profile / Auth Controls */}
          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Link to="/profile" style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 12px',
                borderRadius: '8px',
                backgroundColor: '#f8fafc',
                border: '1px solid var(--border)',
                fontWeight: 600,
                color: 'var(--text-main)',
                fontSize: '0.9rem'
              }}>
                <div style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--primary-light)',
                  color: 'var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <User size={16} />
                </div>
                <span>{user?.name || user?.first_name || user?.email?.split('@')[0] || 'Профиль'}</span>
              </Link>
              <button
                onClick={handleLogout}
                title="Выйти"
                style={{
                  padding: '8px',
                  borderRadius: '8px',
                  color: 'var(--text-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <Link to="/login" className="btn btn-outline" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>
              <User size={16} />
              <span>Войти</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
