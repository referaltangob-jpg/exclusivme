'use client'

import { useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
)

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLogin, setIsLogin] = useState(true)
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const handleAuth = async () => {
    setLoading(true)
    setMessage('')
    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) setMessage(error.message)
      else setMessage('Вход выполнен! ✅')
    } else {
      const { error } = await supabase.auth.signUp({ email, password })
      if (error) setMessage(error.message)
      else setMessage('Проверь email — отправили ссылку подтверждения! 📧')
    }
    setLoading(false)
  }

  return (
    <div style={{ background: '#0a0a0a', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif' }}>
      <div style={{ maxWidth: '360px', width: '100%' }}>
        <div style={{ fontSize: '24px', fontWeight: 500, color: '#c9a96e', letterSpacing: '3px', marginBottom: '6px', textAlign: 'center' }}>ExclusivMe</div>
        <div style={{ fontSize: '13px', color: '#666', textAlign: 'center', marginBottom: '2rem' }}>{isLogin ? 'Вход в аккаунт' : 'Регистрация'}</div>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          style={{ width: '100%', background: '#141414', border: '1px solid #2a2a2a', borderRadius: '12px', padding: '12px 14px', color: '#fff', fontSize: '14px', marginBottom: '10px', outline: 'none' }}
        />
        <input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={e => setPassword(e.target.value)}
          style={{ width: '100%', background: '#141414', border: '1px solid #2a2a2a', borderRadius: '12px', padding: '12px 14px', color: '#fff', fontSize: '14px', marginBottom: '16px', outline: 'none' }}
        />

        <button
          onClick={handleAuth}
          disabled={loading}
          style={{ width: '100%', background: '#c9a96e', color: '#0a0a0a', border: 'none', borderRadius: '50px', padding: '14px', fontSize: '15px', fontWeight: 500, cursor: 'pointer', marginBottom: '12px', opacity: loading ? 0.7 : 1 }}
        >
          {loading ? 'Загрузка...' : isLogin ? 'Войти' : 'Зарегистрироваться'}
        </button>

        <button
          onClick={() => setIsLogin(!isLogin)}
          style={{ width: '100%', background: 'transparent', color: '#888', border: '1px solid #2a2a2a', borderRadius: '50px', padding: '12px', fontSize: '13px', cursor: 'pointer' }}
        >
          {isLogin ? 'Нет аккаунта? Зарегистрироваться' : 'Уже есть аккаунт? Войти'}
        </button>

        {message && <div style={{ marginTop: '16px', padding: '12px', background: '#141414', borderRadius: '12px', color: '#c9a96e', fontSize: '13px', textAlign: 'center' }}>{message}</div>}
      </div>
    </div>
  )
}
