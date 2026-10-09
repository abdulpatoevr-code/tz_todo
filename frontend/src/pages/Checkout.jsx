import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Truck, Store, CreditCard, Banknote, ShieldCheck, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import { ordersApi } from '../api/orders';

export default function Checkout() {
  const { items, getTotalPrice, getTotalItems, clearCart } = useCartStore();
  const { user, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    email: '',
    address: '',
    comment: '',
    delivery_method: 'courier',
    payment_method: 'cash',
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (items.length === 0) {
      navigate('/cart');
    }
  }, [items, navigate]);

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        full_name: user.name || user.first_name || prev.full_name,
        email: user.email || prev.email,
        phone: user.phone || prev.phone,
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const errs = {};
    if (!formData.full_name.trim()) errs.full_name = 'Введите ваше ФИО';
    if (!formData.phone.trim()) errs.phone = 'Укажите номер телефона';
    if (!formData.email.trim()) errs.email = 'Укажите email для подтверждения';
    if (formData.delivery_method === 'courier' && !formData.address.trim()) {
      errs.address = 'Укажите адрес доставки';
    }
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        full_name: formData.full_name,
        phone: formData.phone,
        email: formData.email,
        address: formData.delivery_method === 'pickup' ? 'Самовывоз (пункт выдачи)' : formData.address,
        comment: formData.comment,
        delivery_method: formData.delivery_method,
        payment_method: formData.payment_method,
        items: items.map((item) => ({
          product: item.product.id,
          quantity: item.quantity,
        })),
      };

      const createdOrder = await ordersApi.createOrder(payload);
      clearCart();
      navigate(`/order-success/${createdOrder.id}`, { state: { order: createdOrder } });
    } catch (err) {
      console.error('Failed to create order', err);
      setErrors({ form: err.response?.data?.detail || 'Не удалось оформить заказ. Попробуйте снова.' });
    } finally {
      setSubmitting(false);
    }
  };

  const totalPrice = getTotalPrice();
  const totalItems = getTotalItems();

  return (
    <div className="container" style={{ paddingTop: '32px' }}>
      <div style={{ marginBottom: '24px' }}>
        <Link to="/cart" style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          color: 'var(--text-muted)',
          fontSize: '0.9rem',
          marginBottom: '8px'
        }}>
          <ArrowLeft size={16} />
          <span>Вернуться в корзину</span>
        </Link>
        <h1 style={{ fontSize: '1.8rem', fontWeight: '800' }}>Оформление заказа</h1>
      </div>

      {errors.form && (
        <div style={{
          backgroundColor: '#fee2e2',
          color: 'var(--danger)',
          padding: '12px 16px',
          borderRadius: '8px',
          marginBottom: '20px',
          fontSize: '0.95rem'
        }}>
          {errors.form}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '32px',
          alignItems: 'flex-start'
        }}>
          {/* Main Checkout Form */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Step 1: Контактные данные */}
            <div className="card" style={{ padding: '24px' }}>
              <h2 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '16px' }}>
                1. Контактные данные
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '6px' }}>
                    ФИО получателя *
                  </label>
                  <input
                    type="text"
                    name="full_name"
                    placeholder="Иван Иванов"
                    value={formData.full_name}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      border: errors.full_name ? '1px solid var(--danger)' : '1px solid var(--border)',
                      outline: 'none'
                    }}
                  />
                  {errors.full_name && (
                    <div style={{ color: 'var(--danger)', fontSize: '0.8rem', marginTop: '4px' }}>{errors.full_name}</div>
                  )}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '6px' }}>
                      Телефон *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      placeholder="+996 700 123 456"
                      value={formData.phone}
                      onChange={handleChange}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        borderRadius: '8px',
                        border: errors.phone ? '1px solid var(--danger)' : '1px solid var(--border)',
                        outline: 'none'
                      }}
                    />
                    {errors.phone && (
                      <div style={{ color: 'var(--danger)', fontSize: '0.8rem', marginTop: '4px' }}>{errors.phone}</div>
                    )}
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '6px' }}>
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      placeholder="ivan@mail.com"
                      value={formData.email}
                      onChange={handleChange}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        borderRadius: '8px',
                        border: errors.email ? '1px solid var(--danger)' : '1px solid var(--border)',
                        outline: 'none'
                      }}
                    />
                    {errors.email && (
                      <div style={{ color: 'var(--danger)', fontSize: '0.8rem', marginTop: '4px' }}>{errors.email}</div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Step 2: Доставка */}
            <div className="card" style={{ padding: '24px' }}>
              <h2 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '16px' }}>
                2. Способ доставки
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
                <label style={{
                  border: formData.delivery_method === 'courier' ? '2px solid var(--primary)' : '1px solid var(--border)',
                  backgroundColor: formData.delivery_method === 'courier' ? 'var(--primary-light)' : 'var(--surface)',
                  padding: '16px',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}>
                  <input
                    type="radio"
                    name="delivery_method"
                    value="courier"
                    checked={formData.delivery_method === 'courier'}
                    onChange={handleChange}
                    style={{ accentColor: 'var(--primary)' }}
                  />
                  <div>
                    <div style={{ fontWeight: '700', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Truck size={18} color="var(--primary)" />
                      Курьер
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>1-2 дня, до двери</div>
                  </div>
                </label>

                <label style={{
                  border: formData.delivery_method === 'pickup' ? '2px solid var(--primary)' : '1px solid var(--border)',
                  backgroundColor: formData.delivery_method === 'pickup' ? 'var(--primary-light)' : 'var(--surface)',
                  padding: '16px',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}>
                  <input
                    type="radio"
                    name="delivery_method"
                    value="pickup"
                    checked={formData.delivery_method === 'pickup'}
                    onChange={handleChange}
                    style={{ accentColor: 'var(--primary)' }}
                  />
                  <div>
                    <div style={{ fontWeight: '700', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Store size={18} color="var(--primary)" />
                      Самовывоз
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Бесплатно, сегодня</div>
                  </div>
                </label>
              </div>

              {formData.delivery_method === 'courier' && (
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '6px' }}>
                    Адрес доставки *
                  </label>
                  <input
                    type="text"
                    name="address"
                    placeholder="г. Бишкек, ул. Чуй 1, кв. 10"
                    value={formData.address}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      border: errors.address ? '1px solid var(--danger)' : '1px solid var(--border)',
                      outline: 'none'
                    }}
                  />
                  {errors.address && (
                    <div style={{ color: 'var(--danger)', fontSize: '0.8rem', marginTop: '4px' }}>{errors.address}</div>
                  )}
                </div>
              )}

              <div style={{ marginTop: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '6px' }}>
                  Комментарий к заказу (необязательно)
                </label>
                <textarea
                  name="comment"
                  rows={3}
                  placeholder="Код домофона, удобное время доставки и др."
                  value={formData.comment}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    border: '1px solid var(--border)',
                    outline: 'none'
                  }}
                />
              </div>
            </div>

            {/* Step 3: Оплата */}
            <div className="card" style={{ padding: '24px' }}>
              <h2 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '16px' }}>
                3. Способ оплаты
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <label style={{
                  border: formData.payment_method === 'cash' ? '2px solid var(--primary)' : '1px solid var(--border)',
                  backgroundColor: formData.payment_method === 'cash' ? 'var(--primary-light)' : 'var(--surface)',
                  padding: '16px',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}>
                  <input
                    type="radio"
                    name="payment_method"
                    value="cash"
                    checked={formData.payment_method === 'cash'}
                    onChange={handleChange}
                    style={{ accentColor: 'var(--primary)' }}
                  />
                  <div>
                    <div style={{ fontWeight: '700', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Banknote size={18} color="var(--primary)" />
                      Наличными
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>При получении курьеру</div>
                  </div>
                </label>

                <label style={{
                  border: formData.payment_method === 'card' ? '2px solid var(--primary)' : '1px solid var(--border)',
                  backgroundColor: formData.payment_method === 'card' ? 'var(--primary-light)' : 'var(--surface)',
                  padding: '16px',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}>
                  <input
                    type="radio"
                    name="payment_method"
                    value="card"
                    checked={formData.payment_method === 'card'}
                    onChange={handleChange}
                    style={{ accentColor: 'var(--primary)' }}
                  />
                  <div>
                    <div style={{ fontWeight: '700', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <CreditCard size={18} color="var(--primary)" />
                      Картой
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Терминалом при получении</div>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Step 4: Сводка заказа */}
          <div style={{ position: 'sticky', top: '100px' }}>
            <div className="card" style={{ padding: '24px' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '16px' }}>
                Сводка заказа
              </h3>

              <div style={{
                maxHeight: '260px',
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                marginBottom: '20px',
                paddingRight: '4px'
              }}>
                {items.map(({ product, quantity }) => (
                  <div key={product.id} style={{ display: 'flex', justifyContent: 'space-between', gap: '10px', fontSize: '0.9rem' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: '600' }}>{product.name}</div>
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{quantity} × {parseFloat(product.price).toLocaleString('ru-RU')} сом</div>
                    </div>
                    <div style={{ fontWeight: '700', whiteSpace: 'nowrap' }}>
                      {(parseFloat(product.price) * quantity).toLocaleString('ru-RU')} сом
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ borderTop: '1px solid var(--border)', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.95rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Товаров:</span>
                  <span>{totalItems} шт.</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Доставка:</span>
                  <span style={{ color: 'var(--success)', fontWeight: '600' }}>Бесплатно</span>
                </div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'baseline',
                  borderTop: '1px solid var(--border)',
                  paddingTop: '14px',
                  marginTop: '6px'
                }}>
                  <span style={{ fontSize: '1.1rem', fontWeight: '700' }}>К оплате:</span>
                  <span style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--primary)' }}>
                    {totalPrice.toLocaleString('ru-RU')} сом
                  </span>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="btn btn-primary"
                style={{
                  width: '100%',
                  padding: '14px',
                  fontSize: '1rem',
                  borderRadius: '12px',
                  marginTop: '24px'
                }}
              >
                {submitting ? 'Оформление заказа...' : 'Подтвердить заказ'}
              </button>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginTop: '16px',
                fontSize: '0.8rem',
                color: 'var(--text-muted)',
                justifyContent: 'center'
              }}>
                <ShieldCheck size={16} color="var(--success)" />
                <span>Безопасная обработка персональных данных</span>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
