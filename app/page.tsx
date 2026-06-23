'use client'

import { useState } from 'react'

export default function Home() {
  const [lang, setLang] = useState('en')
  const [role, setRole] = useState<'buyer' | 'girl' | null>(null)
  const [entered, setEntered] = useState(false)

  const t: Record<string, Record<string, string>> = {
    en: { title: 'Are you 18 or older?', sub: 'This website contains adult content\nfor mature audiences only.', choose: 'Choose your role:', buyer: 'Buyer', buyerSub: 'Browse & order', creator: 'Creator', creatorSub: 'Sell content', yes: 'Yes, I am 18+', no: 'No, I am under 18' },
    ru: { title: 'Вам есть 18 лет?', sub: 'Этот сайт содержит контент для взрослых,\nтолько для совершеннолетних.', choose: 'Выберите роль:', buyer: 'Покупатель', buyerSub: 'Смотреть и заказывать', creator: 'Создатель', creatorSub: 'Продавать контент', yes: 'Да, мне есть 18', no: 'Нет, мне нет 18' }
  }
  const tx = t[lang]

  if (entered) {
    return (
      <div style={{ background: '#0a0a0a', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '26px', fontWeight: 500, color: '#c9a96e', letterSpacing: '3px', marginBottom: '8px' }}>ExclusivMe</div>
          <div style={{ fontSize: '13px', color: '#888' }}>Скоро здесь будет главная страница 🚀</div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ background: '#0a0a0a', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif' }}>
      <div style={{ maxWidth: '360px', width: '100%', textAlign: 'center' }}>
        <div style={{ fontSize: '26px', fontWeight: 500, color: '#c9a96e', letterSpacing: '3px', marginBottom: '6px' }}>ExclusivMe</div>
        <div style={{ fontSize: '10px', color: '#555', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '2rem' }}>Private Content Platform</div>

        <div style={{ display: 'flex', gap: '8px', marginBottom: '2rem' }}>
          {['en','ru'].map(l => (
            <button key={l} onClick={() => setLang(l)} style={{ flex: 1, padding: '8px', borderRadius: '20px', border: `1px solid ${lang===l?'#c9a96e':'#444'}`, background: lang===l?'rgba(201,169,110,.1)':'transparent', color: lang===l?'#c9a96e':'#aaa', fontSize: '12px', cursor: 'pointer' }}>{l.toUpperCase()}</button>
          ))}
        </div>

        <div style={{ fontSize: '17px', color: '#fff', fontWeight: 500, marginBottom: '8px' }}>{tx.title}</div>
        <div style={{ fontSize: '12px', color: '#bbb', marginBottom: '1.5rem', lineHeight: 1.6, whiteSpace: 'pre-line' }}>{tx.sub}</div>
        <div style={{ fontSize: '13px', color: '#888', marginBottom: '10px' }}>{tx.choose}</div>

        <div style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
          {([['buyer','👨',tx.buyer,tx.buyerSub],['girl','👩',tx.creator,tx.creatorSub]] as string[][]).map(([r,emoji,label,sub]) => (
            <button key={r} onClick={() => setRole(r as 'buyer'|'girl')} style={{ flex: 1, background: '#141414', border: `1px solid ${role===r?'#c9a96e':'#2a2a2a'}`, borderRadius: '14px', padding: '14px 8px', cursor: 'pointer', textAlign: 'center' }}>
              <div style={{ fontSize: '22px', marginBottom: '6px' }}>{emoji}</div>
              <div style={{ fontSize: '13px', fontWeight: 500, color: '#f0f0f0' }}>{label}</div>
              <div style={{ fontSize: '10px', color: '#555', marginTop: '3px' }}>{sub}</div>
            </button>
          ))}
        </div>

        <button onClick={() => setEntered(true)} style={{ width: '100%', background: '#c9a96e', color: '#0a0a0a', border: 'none', borderRadius: '50px', padding: '14px', fontSize: '15px', fontWeight: 500, cursor: 'pointer', marginBottom: '10px' }}>{tx.yes}</button>
        <button style={{ width: '100%', background: 'transparent', color: '#fff', border: '2px solid #fff', borderRadius: '50px', padding: '12px', fontSize: '14px', cursor: 'pointer' }}>{tx.no}</button>
        <div style={{ fontSize: '10px', color: '#666', marginTop: '1rem', lineHeight: 1.6 }}>By entering you agree to our Terms and Privacy Policy</div>
      </div>
    </div>
  )
}