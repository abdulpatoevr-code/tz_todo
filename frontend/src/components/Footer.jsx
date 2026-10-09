import React from 'react';
import { Link } from 'react-router-dom';
import { Store, Phone, Mail, MapPin, ShieldCheck, Truck, RefreshCw } from 'lucide-react';

export default function Footer() {
  return (
    <footer style={{
      backgroundColor: '#0f172a',
      color: '#94a3b8',
      borderTop: '1px solid #1e293b',
      marginTop: 'auto',
      paddingTop: '50px',
      paddingBottom: '30px'
    }}>
      <div className="container">
        {/* Value props bar */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '24px',
          paddingBottom: '40px',
          borderBottom: '1px solid #1e293b',
          marginBottom: '40px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ backgroundColor: '#1e293b', padding: '12px', borderRadius: '12px', color: '#38bdf8' }}>
              <Truck size={24} />
            </div>
            <div>
              <div style={{ color: '#fff', fontWeight: '600' }}>Быстрая доставка</div>
              <div style={{ fontSize: '0.85rem' }}>Курьером до двери за 1-2 дня</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ backgroundColor: '#1e293b', padding: '12px', borderRadius: '12px', color: '#4ade80' }}>
              <ShieldCheck size={24} />
            </div>
            <div>
              <div style={{ color: '#fff', fontWeight: '600' }}>Гарантия качества</div>
              <div style={{ fontSize: '0.85rem' }}>100% оригинальная продукция</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ backgroundColor: '#1e293b', padding: '12px', borderRadius: '12px', color: '#f59e0b' }}>
              <RefreshCw size={24} />
            </div>
            <div>
              <div style={{ color: '#fff', fontWeight: '600' }}>Простой возврат</div>
              <div style={{ fontSize: '0.85rem' }}>14 дней на возврат товара</div>
            </div>
          </div>
        </div>

        {/* Footer grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '32px',
          marginBottom: '40px'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#fff', marginBottom: '16px' }}>
              <Store size={22} color="#38bdf8" />
              <span style={{ fontSize: '1.2rem', fontWeight: '800' }}>MARKET.KG</span>
            </div>
            <p style={{ fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '16px' }}>
              Удобный онлайн-магазин электроники, одежды, товаров для дома и спорта по выгодным ценам.
            </p>
          </div>

          <div>
            <h4 style={{ color: '#fff', fontSize: '1rem', fontWeight: '600', marginBottom: '16px' }}>Покупателям</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.9rem' }}>
              <li><Link to="/catalog" style={{ hover: { color: '#fff' } }}>Каталог товаров</Link></li>
              <li><Link to="/cart">Корзина</Link></li>
              <li><Link to="/profile">Личный кабинет</Link></li>
            </ul>
          </div>

          <div>
            <h4 style={{ color: '#fff', fontSize: '1rem', fontWeight: '600', marginBottom: '16px' }}>Контакты</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.9rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Phone size={16} color="#38bdf8" />
                <span>+996 (700) 123-456</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Mail size={16} color="#38bdf8" />
                <span>support@market.kg</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <MapPin size={16} color="#38bdf8" />
                <span>г. Бишкек, пр. Чуй, 1</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div style={{
          borderTop: '1px solid #1e293b',
          paddingTop: '20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
          fontSize: '0.85rem'
        }}>
          <div>© {new Date().getFullYear()} MARKET.KG. Все права защищены.</div>
          <div style={{ color: '#64748b' }}>Django REST Framework + React</div>
        </div>
      </div>
    </footer>
  );
}
