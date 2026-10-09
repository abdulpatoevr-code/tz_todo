import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, Mail, User, ArrowRight, AlertCircle } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirm: '',
  });
  const [clientErrors, setClientErrors] = useState({});

  const { register, loading, error } = useAuthStore();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
    if (clientErrors[name]) {
      setClientErrors((p) => ({ ...p, [name]: null }));
    }
  };

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Введите ваше имя';
    if (!formData.email.trim()) errs.email = 'Введите email';
    if (!formData.password) errs.password = 'Придумайте пароль (мин. 6 символов)';
    else if (formData.password.length < 6) errs.password = 'Пароль должен быть не менее 6 символов';
    if (formData.password !== formData.password_confirm) errs.password_confirm = 'Пароли не совпадают';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setClientErrors(errs);
      return;
    }
    setClientErrors({});

    const result = await register(formData);
    if (result.success) {
      navigate('/profile');
    }
  };

  return (
    <div className="container" style={{ paddingTop: '50px', paddingBottom: '60px' }}>
      <div className="card" style={{
        maxWidth: '460px',
        margin: '0 auto',
        padding: '40px 32px'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '8px' }}>
            Регистрация
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Создайте аккаунт для удобных покупок
          </p>
        </div>

        {error && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            backgroundColor: '#fee2e2',
            color: 'var(--danger)',
            padding: '12px 16px',
            borderRadius: '8px',
            marginBottom: '24px',
            fontSize: '0.9rem'
          }}>
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '6px' }}>
              Имя *
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                name="name"
                placeholder="Иван"
                value={formData.name}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '10px 14px 10px 40px',
                  borderRadius: '8px',
                  border: clientErrors.name ? '1px solid var(--danger)' : '1px solid var(--border)',
                  outline: 'none'
                }}
              />
              <User size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
            {clientErrors.name && (
              <div style={{ color: 'var(--danger)', fontSize: '0.8rem', marginTop: '4px' }}>{clientErrors.name}</div>
            )}
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '6px' }}>
              Email *
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="email"
                name="email"
                placeholder="ivan@mail.com"
                value={formData.email}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '10px 14px 10px 40px',
                  borderRadius: '8px',
                  border: clientErrors.email ? '1px solid var(--danger)' : '1px solid var(--border)',
                  outline: 'none'
                }}
              />
              <Mail size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
            {clientErrors.email && (
              <div style={{ color: 'var(--danger)', fontSize: '0.8rem', marginTop: '4px' }}>{clientErrors.email}</div>
            )}
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '6px' }}>
              Пароль *
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="password"
                name="password"
                placeholder="Минимум 6 символов"
                value={formData.password}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '10px 14px 10px 40px',
                  borderRadius: '8px',
                  border: clientErrors.password ? '1px solid var(--danger)' : '1px solid var(--border)',
                  outline: 'none'
                }}
              />
              <Lock size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
            {clientErrors.password && (
              <div style={{ color: 'var(--danger)', fontSize: '0.8rem', marginTop: '4px' }}>{clientErrors.password}</div>
            )}
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '6px' }}>
              Подтверждение пароля *
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="password"
                name="password_confirm"
                placeholder="Повторите пароль"
                value={formData.password_confirm}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '10px 14px 10px 40px',
                  borderRadius: '8px',
                  border: clientErrors.password_confirm ? '1px solid var(--danger)' : '1px solid var(--border)',
                  outline: 'none'
                }}
              />
              <Lock size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
            {clientErrors.password_confirm && (
              <div style={{ color: 'var(--danger)', fontSize: '0.8rem', marginTop: '4px' }}>{clientErrors.password_confirm}</div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ width: '100%', padding: '12px', fontSize: '1rem', borderRadius: '10px', marginTop: '8px' }}
          >
            <span>{loading ? 'Создание аккаунта...' : 'Зарегистрироваться'}</span>
            <ArrowRight size={18} />
          </button>
        </form>

        <div style={{
          textAlign: 'center',
          marginTop: '28px',
          paddingTop: '20px',
          borderTop: '1px solid var(--border)',
          fontSize: '0.9rem',
          color: 'var(--text-muted)'
        }}>
          Уже есть аккаунт?{' '}
          <Link to="/login" style={{ color: 'var(--primary)', fontWeight: '600' }}>
            Войти
          </Link>
        </div>
      </div>
    </div>
  );
}
