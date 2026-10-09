import React, { useEffect, useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { CheckCircle2, Package, ArrowRight, Home } from 'lucide-react';
import { ordersApi } from '../api/orders';
import { useAuthStore } from '../store/authStore';

export default function OrderSuccess() {
  const { id } = useParams();
  const location = useLocation();
  const { isAuthenticated } = useAuthStore();
  const [order, setOrder] = useState(location.state?.order || null);

  useEffect(() => {
    if (!order && isAuthenticated) {
      ordersApi.getOrder(id).then(setOrder).catch(console.error);
    }
  }, [id, order, isAuthenticated]);

  return (
    <div className="container" style={{ paddingTop: '60px', paddingBottom: '60px' }}>
      <div className="card" style={{
        maxWidth: '600px',
        margin: '0 auto',
        padding: '48px 32px',
        textAlign: 'center'
      }}>
        <div style={{
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          backgroundColor: '#ecfdf5',
          color: 'var(--success)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 20px'
        }}>
          <CheckCircle2 size={48} />
        </div>

        <h1 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '8px' }}>
          Спасибо за заказ!
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginBottom: '24px' }}>
          Ваш заказ <strong style={{ color: 'var(--text-main)' }}>#{id}</strong> успешно принят в обработку.
        </p>

        {order && (
          <div style={{
            backgroundColor: '#f8fafc',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-md)',
            padding: '20px',
            textAlign: 'left',
            marginBottom: '32px'
          }}>
            <h3 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '12px', borderBottom: '1px solid var(--border)', paddingBottom: '8px' }}>
              Детали заказа #{order.id}
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.9rem' }}>
              <div><strong>Получатель:</strong> {order.full_name}</div>
              <div><strong>Телефон:</strong> {order.phone}</div>
              <div><strong>Email:</strong> {order.email}</div>
              <div><strong>Адрес:</strong> {order.address}</div>
              <div><strong>Сумма к оплате:</strong> {parseFloat(order.total).toLocaleString('ru-RU')} сом</div>
              <div><strong>Статус:</strong> <span className="badge badge-primary">{order.status_display || order.status}</span></div>
            </div>
          </div>
        )}

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/catalog" className="btn btn-primary" style={{ padding: '12px 24px' }}>
            <span>Продолжить покупки</span>
            <ArrowRight size={18} />
          </Link>
          {isAuthenticated && (
            <Link to="/profile" className="btn btn-outline" style={{ padding: '12px 24px' }}>
              <Package size={18} />
              <span>Мои заказы</span>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
