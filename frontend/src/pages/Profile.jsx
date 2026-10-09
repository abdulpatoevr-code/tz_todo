import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Package, LogOut, Check, ChevronDown, ChevronUp, Save, Phone, Mail } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { ordersApi } from '../api/orders';

export default function Profile() {
  const { user, isAuthenticated, logout, updateProfile } = useAuthStore();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'profile'
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  // Edit profile form
  const [profileForm, setProfileForm] = useState({
    name: '',
    email: '',
    phone: '',
  });
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (user) {
      setProfileForm({
        name: user.name || user.first_name || '',
        email: user.email || '',
        phone: user.phone || '',
      });
    }

    const fetchOrders = async () => {
      try {
        setOrdersLoading(true);
        const data = await ordersApi.getOrders();
        setOrders(data.results || data || []);
      } catch (err) {
        console.error('Failed to load user orders', err);
      } finally {
        setOrdersLoading(false);
      }
    };

    fetchOrders();
  }, [isAuthenticated, user, navigate]);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaveError(null);
    setSaveSuccess(false);

    const res = await updateProfile(profileForm);
    setSaving(false);
    if (res.success) {
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } else {
      setSaveError(res.error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const toggleOrderExpand = (id) => {
    setExpandedOrderId(expandedOrderId === id ? null : id);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'delivered':
        return <span className="badge badge-success">Доставлен</span>;
      case 'shipped':
        return <span className="badge badge-primary">Отправлен</span>;
      case 'processing':
        return <span className="badge" style={{ backgroundColor: '#fef3c7', color: '#b45309' }}>В обработке</span>;
      case 'canceled':
        return <span className="badge badge-danger">Отменён</span>;
      default:
        return <span className="badge" style={{ backgroundColor: '#f1f5f9', color: '#475569' }}>Новый</span>;
    }
  };

  return (
    <div className="container" style={{ paddingTop: '32px' }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
        marginBottom: '32px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            backgroundColor: 'var(--primary-light)',
            color: 'var(--primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.4rem',
            fontWeight: '700'
          }}>
            {(user?.name || user?.first_name || user?.email || 'U')[0].toUpperCase()}
          </div>
          <div>
            <h1 style={{ fontSize: '1.6rem', fontWeight: '800' }}>
              {user?.name || user?.first_name || 'Личный кабинет'}
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              {user?.email}
            </p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="btn btn-outline"
          style={{ color: 'var(--danger)', borderColor: '#fca5a5' }}
        >
          <LogOut size={16} />
          <span>Выйти</span>
        </button>
      </div>

      {/* Tabs navigation */}
      <div style={{
        display: 'flex',
        borderBottom: '1px solid var(--border)',
        marginBottom: '32px',
        gap: '8px'
      }}>
        <button
          onClick={() => setActiveTab('orders')}
          style={{
            padding: '12px 20px',
            fontSize: '0.95rem',
            fontWeight: '600',
            color: activeTab === 'orders' ? 'var(--primary)' : 'var(--text-muted)',
            borderBottom: activeTab === 'orders' ? '2px solid var(--primary)' : '2px solid transparent',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <Package size={18} />
          <span>История заказов ({orders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          style={{
            padding: '12px 20px',
            fontSize: '0.95rem',
            fontWeight: '600',
            color: activeTab === 'profile' ? 'var(--primary)' : 'var(--text-muted)',
            borderBottom: activeTab === 'profile' ? '2px solid var(--primary)' : '2px solid transparent',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <User size={18} />
          <span>Мои данные</span>
        </button>
      </div>

      {/* Tab 1: Orders History */}
      {activeTab === 'orders' && (
        <div>
          {ordersLoading ? (
            <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>
              Загрузка заказов...
            </div>
          ) : orders.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '48px 20px' }}>
              <Package size={40} color="var(--text-muted)" style={{ margin: '0 auto 16px' }} />
              <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '8px' }}>
                У вас пока нет заказов
              </h3>
              <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>
                Когда вы оформите заказ, он появится на этой странице
              </p>
              <button onClick={() => navigate('/catalog')} className="btn btn-primary">
                Перейти в каталог
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {orders.map((ord) => {
                const isExpanded = expandedOrderId === ord.id;
                const formattedDate = new Date(ord.created_at).toLocaleDateString('ru-RU', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                });

                return (
                  <div key={ord.id} className="card" style={{ overflow: 'hidden' }}>
                    {/* Order header row */}
                    <div
                      onClick={() => toggleOrderExpand(ord.id)}
                      style={{
                        padding: '20px 24px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        gap: '16px',
                        backgroundColor: isExpanded ? '#f8fafc' : 'transparent',
                        borderBottom: isExpanded ? '1px solid var(--border)' : 'none'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div>
                          <span style={{ fontSize: '1.1rem', fontWeight: '800' }}>
                            Заказ #{ord.id}
                          </span>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                            от {formattedDate}
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <div>
                          {getStatusBadge(ord.status)}
                        </div>
                        <div style={{ fontSize: '1.15rem', fontWeight: '800', color: 'var(--text-main)' }}>
                          {parseFloat(ord.total).toLocaleString('ru-RU')} сом
                        </div>
                        <div style={{ color: 'var(--text-muted)' }}>
                          {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                        </div>
                      </div>
                    </div>

                    {/* Order details expansion */}
                    {isExpanded && (
                      <div style={{ padding: '24px' }}>
                        <div style={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                          gap: '16px',
                          marginBottom: '20px',
                          fontSize: '0.9rem',
                          backgroundColor: '#f8fafc',
                          padding: '16px',
                          borderRadius: '8px'
                        }}>
                          <div>
                            <span style={{ color: 'var(--text-muted)' }}>Получатель:</span>{' '}
                            <strong>{ord.full_name}</strong>
                          </div>
                          <div>
                            <span style={{ color: 'var(--text-muted)' }}>Телефон:</span>{' '}
                            <strong>{ord.phone}</strong>
                          </div>
                          <div>
                            <span style={{ color: 'var(--text-muted)' }}>Доставка:</span>{' '}
                            <strong>{ord.delivery_method === 'courier' ? 'Курьер' : 'Самовывоз'}</strong>
                          </div>
                          <div>
                            <span style={{ color: 'var(--text-muted)' }}>Оплата:</span>{' '}
                            <strong>{ord.payment_method === 'cash' ? 'Наличные' : 'Карта'}</strong>
                          </div>
                          <div style={{ gridColumn: '1 / -1' }}>
                            <span style={{ color: 'var(--text-muted)' }}>Адрес:</span>{' '}
                            <strong>{ord.address}</strong>
                          </div>
                          {ord.comment && (
                            <div style={{ gridColumn: '1 / -1' }}>
                              <span style={{ color: 'var(--text-muted)' }}>Комментарий:</span>{' '}
                              <span>{ord.comment}</span>
                            </div>
                          )}
                        </div>

                        {/* Order items table */}
                        <h4 style={{ fontSize: '0.95rem', fontWeight: '700', marginBottom: '12px' }}>
                          Товары в заказе:
                        </h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                          {ord.items && ord.items.map((item) => (
                            <div key={item.id} style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              padding: '10px 14px',
                              border: '1px solid var(--border)',
                              borderRadius: '8px',
                              fontSize: '0.9rem'
                            }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                {item.product_image && (
                                  <img
                                    src={item.product_image}
                                    alt=""
                                    style={{ width: '40px', height: '40px', borderRadius: '6px', objectFit: 'cover' }}
                                  />
                                )}
                                <div>
                                  <div style={{ fontWeight: '600' }}>{item.product_name}</div>
                                  <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                                    {item.quantity} шт. × {parseFloat(item.price).toLocaleString('ru-RU')} сом
                                  </div>
                                </div>
                              </div>
                              <div style={{ fontWeight: '700' }}>
                                {(parseFloat(item.price) * item.quantity).toLocaleString('ru-RU')} сом
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Profile Settings */}
      {activeTab === 'profile' && (
        <div className="card" style={{ maxWidth: '520px', padding: '32px' }}>
          <h2 style={{ fontSize: '1.3rem', fontWeight: '800', marginBottom: '20px' }}>
            Личные данные
          </h2>

          {saveSuccess && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: '#ecfdf5',
              color: 'var(--success)',
              padding: '12px 16px',
              borderRadius: '8px',
              marginBottom: '20px',
              fontSize: '0.9rem'
            }}>
              <Check size={18} />
              <span>Данные успешно обновлены!</span>
            </div>
          )}

          {saveError && (
            <div style={{
              backgroundColor: '#fee2e2',
              color: 'var(--danger)',
              padding: '12px 16px',
              borderRadius: '8px',
              marginBottom: '20px',
              fontSize: '0.9rem'
            }}>
              {saveError}
            </div>
          )}

          <form onSubmit={handleProfileSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '6px' }}>
                Имя
              </label>
              <input
                type="text"
                value={profileForm.name}
                onChange={(e) => setProfileForm((p) => ({ ...p, name: e.target.value }))}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  border: '1px solid var(--border)',
                  outline: 'none'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '6px' }}>
                Email
              </label>
              <input
                type="email"
                value={profileForm.email}
                onChange={(e) => setProfileForm((p) => ({ ...p, email: e.target.value }))}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  border: '1px solid var(--border)',
                  outline: 'none'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '6px' }}>
                Телефон
              </label>
              <input
                type="tel"
                placeholder="+996 700 123 456"
                value={profileForm.phone}
                onChange={(e) => setProfileForm((p) => ({ ...p, phone: e.target.value }))}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  border: '1px solid var(--border)',
                  outline: 'none'
                }}
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="btn btn-primary"
              style={{ width: '100%', padding: '12px', fontSize: '0.95rem', borderRadius: '10px' }}
            >
              <Save size={18} />
              <span>{saving ? 'Сохранение...' : 'Сохранить изменения'}</span>
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
