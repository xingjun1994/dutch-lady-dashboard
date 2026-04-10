'use client';

import { useState } from 'react';

export default function Login({ onSuccess }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (data.success) {
        onSuccess();
      } else {
        setError('Incorrect password. Please try again.');
      }
    } catch {
      setError('Something went wrong. Please try again.');
    }
    setLoading(false);
  }

  return (
    <div style={{
      minHeight: '100vh', background: '#F4F7FD',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div style={{
        background: '#fff', borderRadius: 16,
        border: '0.5px solid #E2E8F5',
        padding: '40px 44px', width: 360, textAlign: 'center',
      }}>
        <div style={{
          width: 48, height: 48, background: '#003DA5', borderRadius: 12,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 16, fontWeight: 700, color: '#FFD100', margin: '0 auto 16px',
        }}>DL</div>
        <div style={{ fontSize: 20, fontWeight: 700, color: '#003DA5', marginBottom: 4 }}>
          Dutch Lady
        </div>
        <div style={{ fontSize: 13, color: '#9AA5C0', marginBottom: 28 }}>
          Media Hub · Enter password to continue
        </div>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            style={{
              width: '100%', padding: '10px 14px', fontSize: 13,
              border: '1px solid #E2E8F5', borderRadius: 8,
              outline: 'none', marginBottom: 12,
              color: '#1A2340', background: '#F8FAFF',
            }}
          />
          {error && (
            <div style={{
              fontSize: 11, color: '#E8334A', marginBottom: 12,
              padding: '8px 12px', background: 'rgba(232,51,74,0.06)', borderRadius: 6,
            }}>
              {error}
            </div>
          )}
          <button
            type="submit"
            disabled={loading || !password}
            style={{
              width: '100%', padding: '11px', fontSize: 13, fontWeight: 600,
              background: loading || !password ? '#B5D4F4' : '#003DA5',
              color: '#fff', border: 'none', borderRadius: 8,
              cursor: loading || !password ? 'not-allowed' : 'pointer',
            }}
          >
            {loading ? 'Checking...' : 'Enter Dashboard'}
          </button>
        </form>
      </div>
    </div>
  );
}