'use client'

import { useState } from 'react'

type Lang = 'en' | 'ru'
type Role = 'buyer' | 'girl'
type BuyerTab = 'feed' | 'excl' | 'msg' | 'acc'
type Screen = 'age' | 'buyer' | 'profile'

interface Girl {
  id: number
  name: string
  stars: string
  price: string
  bg: string
  online: boolean
  badge: string
}

const newGirls: Girl[] = [
  { id: 1, name: 'Sofia',  stars: '★★★★★', price: '250c', bg: '#1a1510', online: true,  badge: 'NEW' },
  { id: 2, name: 'Alina',  stars: '★★★★☆', price: '90c',  bg: '#12101a', online: false, badge: 'NEW' },
  { id: 3, name: 'Anna',   stars: '★★★★★', price: '120c', bg: '#0f1a14', online: true,  badge: 'NEW' },
  { id: 4, name: 'Kira',   stars: '★★★☆☆', price: '80c',  bg: '#1a100f', online: false, badge: 'NEW' },
]
const allGirls: Girl[] = [
  { id: 5, name: 'Diana', stars: '★★★★★', price: '180c', bg: '#1a1510', online: true,  badge: '' },
  { id: 6, name: 'Mila',  stars: '★★★★☆', price: '150c', bg: '#12101a', online: false, badge: '' },
  { id: 7, name: 'Julia', stars: '★★★☆☆', price: '90c',  bg: '#0f1a14', online: true,  badge: '' },
  { id: 8, name: 'Anya',  stars: '★★★★☆', price: '110c', bg: '#1a100f', online: false, badge: '' },
]
const topGirls: Girl[] = [
  { id: 1, name: 'Sofia', stars: '★★★★★', price: '250c', bg: '#1a1510', online: true,  badge: '#1' },
  { id: 2, name: 'Diana', stars: '★★★★★', price: '180c', bg: '#12101a', online: false, badge: '#2' },
  { id: 3, name: 'Rita',  stars: '★★★★★', price: '300c', bg: '#0f1a14', online: true,  badge: '#3' },
]

const T = {
  en: {
    age_title: 'Are you 18 or older?',
    age_sub: 'This website contains adult content\nintended for mature audiences only.',
    age_choose: 'Choose your role:',
    rb_lbl: 'Buyer', rb_sub: 'Browse & order',
    rg_lbl: 'Creator', rg_sub: 'Sell content',
    age_yes: 'Yes, I am 18+', age_no: 'No, I am under 18',
    b_new: 'New girls', b_see_new: 'See all →',
    b_all: 'All girls', b_see_all: 'See all →',
    b_top: 'Top rated',
    b_mkt: 'Order Market', b_mkt_sub: 'Post orders • Any girl can take',
    b_find: 'Find a girl', b_find_sub: 'Swipe to discover',
    bn_feed: 'Feed', bn_excl: 'Exclusive', bn_msg: 'Chat', bn_acc: 'Profile',
    b_excl_title: 'My exclusive',
    ei_p: 'Purchased', ei_ip: 'In progress', ei_dl1: 'Deadline: Jan 25',
    b_msgs: 'Messages',
    b_coins: 'Coins', b_purch: 'Purchases', b_spent: 'Spent',
    b_topup: 'Top up balance', b_ranks: 'Ranks & privileges',
    b_edit: 'Edit profile', b_pay: 'Payments', b_sec: 'Security',
  },
  ru: {
    age_title: 'Вам есть 18 лет?',
    age_sub: 'Этот сайт содержит материалы\nтолько для взрослых.',
    age_choose: 'Выберите роль:',
    rb_lbl: 'Покупатель', rb_sub: 'Смотреть и заказывать',
    rg_lbl: 'Создатель', rg_sub: 'Продавать контент',
    age_yes: 'Да, мне есть 18', age_no: 'Нет, мне нет 18',
    b_new: 'Новенькие', b_see_new: 'Все →',
    b_all: 'Все девушки', b_see_all: 'Все →',
    b_top: 'Топ рейтинг',
    b_mkt: 'Биржа заказов', b_mkt_sub: 'Публичные заказы • Любая может взять',
    b_find: 'Найти девушку', b_find_sub: 'Свайпай чтобы открыть',
    bn_feed: 'Лента', bn_excl: 'Эксклюзив', bn_msg: 'Чат', bn_acc: 'Профиль',
    b_excl_title: 'Мой эксклюзив',
    ei_p: 'Куплено', ei_ip: 'В работе', ei_dl1: 'Дедлайн: 25 янв',
    b_msgs: 'Сообщения',
    b_coins: 'Монеты', b_purch: 'Покупки', b_spent: 'Потрачено',
    b_topup: 'Пополнить баланс', b_ranks: 'Ранги и привилегии',
    b_edit: 'Редактировать профиль', b_pay: 'Платежи', b_sec: 'Безопасность',
  },
}

// ─── SVG Icons (Tabler style) ────────────────────────────────────────────────
const IconFlame = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 12c0-3 2.5-5 2.5-8a4.5 4.5 0 0 0-9 0c0 3 2.5 5 2.5 8a2.5 2.5 0 0 0 5 0z"/>
    <path d="M12 12c0-3-2.5-5-2.5-8"/>
  </svg>
)
const IconStar = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
)
const IconMessage = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
  </svg>
)
const IconUser = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
)
const IconSearch = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
  </svg>
)
const IconBell = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
  </svg>
)
const IconArrowLeft = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m12 19-7-7 7-7"/><path d="M19 12H5"/>
  </svg>
)
const IconShoppingBag = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/>
  </svg>
)
const IconCards = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="14" x="2" y="5" rx="2"/><path d="M2 10h20"/>
  </svg>
)

// ─── Scrollable row (hides scrollbar) ────────────────────────────────────────
const scrollStyle: React.CSSProperties = {
  display: 'flex', gap: 8, overflowX: 'auto', padding: '0 12px 12px',
  scrollbarWidth: 'none', msOverflowStyle: 'none' as unknown as undefined,
}

// ─── Girl Card ────────────────────────────────────────────────────────────────
function GirlCard({ girl, onClick }: { girl: Girl; onClick: () => void }) {
  return (
    <div onClick={onClick} style={{ background: '#141414', borderRadius: 12, overflow: 'hidden', border: '.5px solid #1e1e1e', cursor: 'pointer', flexShrink: 0, width: 120 }}>
      <div style={{ width: '100%', height: 90, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', background: girl.bg }}>
        {girl.badge && (
          <div style={{ position: 'absolute', top: 6, left: 6, background: '#c9a96e', color: '#0a0a0a', fontSize: 8, fontWeight: 600, padding: '1px 6px', borderRadius: 20 }}>
            {girl.badge}
          </div>
        )}
        {girl.online && (
          <div style={{ position: 'absolute', top: 6, right: 6, width: 7, height: 7, background: '#4caf50', borderRadius: '50%' }} />
        )}
        <div style={{ width: 44, height: 44, borderRadius: '50%', border: '2px solid rgba(201,169,110,.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, color: '#555' }}>
          Photo
        </div>
      </div>
      <div style={{ padding: '6px 8px 8px' }}>
        <div style={{ fontSize: 12, fontWeight: 500, color: '#f0f0f0' }}>{girl.name}</div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 2 }}>
          <span style={{ color: '#c9a96e', fontSize: 9 }}>{girl.stars}</span>
          <span style={{ fontSize: 10, color: '#666' }}>{girl.price}</span>
        </div>
      </div>
    </div>
  )
}

// ─── Section Header ───────────────────────────────────────────────────────────
function SectionHeader({ title, action }: { title: string; action: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 12px', marginBottom: 10 }}>
      <h2 style={{ fontSize: 12, fontWeight: 500, color: '#888', letterSpacing: 1, textTransform: 'uppercase', margin: 0 }}>{title}</h2>
      <span style={{ fontSize: 11, color: '#c9a96e', cursor: 'pointer' }}>{action}</span>
    </div>
  )
}
const Divider = () => <div style={{ height: .5, background: '#1e1e1e', margin: '4px 12px' }} />

// ─── Feed Tab ─────────────────────────────────────────────────────────────────
function FeedTab({ t, onOpenProfile }: { t: typeof T['en']; onOpenProfile: () => void }) {
  return (
    <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>
      <div style={{ paddingTop: 14 }}>
        <SectionHeader title={t.b_new} action={t.b_see_new} />
      </div>
      <div style={scrollStyle}>
        {newGirls.map(g => <GirlCard key={g.id} girl={g} onClick={onOpenProfile} />)}
      </div>

      <Divider />

      <div style={{ paddingTop: 4 }}>
        <SectionHeader title={t.b_all} action={t.b_see_all} />
      </div>
      <div style={scrollStyle}>
        {allGirls.map(g => <GirlCard key={g.id} girl={g} onClick={onOpenProfile} />)}
      </div>

      <Divider />

      {/* Order Market */}
      <div style={{ borderRadius: 20, padding: 14, display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', margin: '8px 12px', background: 'rgba(201,169,110,.1)', border: '1px solid rgba(201,169,110,.2)' }}>
        <div style={{ width: 42, height: 42, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, background: 'rgba(201,169,110,.13)', border: '1px solid rgba(201,169,110,.27)', color: '#c9a96e' }}>
          <IconShoppingBag />
        </div>
        <div>
          <div style={{ fontSize: 14, fontWeight: 500, color: '#c9a96e' }}>{t.b_mkt}</div>
          <div style={{ fontSize: 11, color: '#888', marginTop: 2 }}>{t.b_mkt_sub}</div>
        </div>
        <div style={{ marginLeft: 'auto', color: '#c9a96e', fontSize: 18 }}>›</div>
      </div>

      <Divider />

      {/* Find a girl */}
      <div style={{ borderRadius: 20, padding: 14, display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', margin: '8px 12px', background: '#141414', border: '1px solid rgba(201,169,110,.15)' }}>
        <div style={{ width: 42, height: 42, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, background: 'rgba(201,169,110,.1)', border: '1px solid rgba(201,169,110,.2)', color: '#c9a96e' }}>
          <IconCards />
        </div>
        <div>
          <div style={{ fontSize: 14, fontWeight: 500, color: '#f0f0f0' }}>{t.b_find}</div>
          <div style={{ fontSize: 11, color: '#555', marginTop: 2 }}>{t.b_find_sub}</div>
        </div>
        <div style={{ marginLeft: 'auto', color: '#555', fontSize: 18 }}>›</div>
      </div>

      <Divider />

      <div style={{ paddingTop: 4 }}>
        <SectionHeader title={t.b_top} action="Top 10" />
      </div>
      <div style={scrollStyle}>
        {topGirls.map(g => <GirlCard key={g.id} girl={g} onClick={onOpenProfile} />)}
      </div>
    </div>
  )
}

// ─── Excl Tab ─────────────────────────────────────────────────────────────────
function ExclTab({ t }: { t: typeof T['en'] }) {
  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '12px 0' }}>
      <div style={{ padding: '0 12px', marginBottom: 12 }}>
        <div style={{ fontSize: 12, fontWeight: 500, color: '#888', letterSpacing: 1, textTransform: 'uppercase' }}>{t.b_excl_title}</div>
      </div>
      <div style={{ marginBottom: 6 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 12px 7px', background: '#141414', borderRadius: '12px 12px 0 0', border: '.5px solid #1e1e1e', borderBottom: 'none' }}>
          <div style={{ width: 26, height: 26, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: '#c9a96e', border: '1px solid rgba(201,169,110,.27)', background: '#1a1510', flexShrink: 0 }}>A</div>
          <div style={{ fontSize: 13, fontWeight: 500, color: '#ddd', flex: 1 }}>Alina</div>
          <div style={{ fontSize: 10, color: '#555' }}>2 items</div>
        </div>
        {[
          { icon: '📷', title: 'Alina — Pack #1', sub: t.ei_p, price: '90c', deadline: '' },
          { icon: '🎬', title: 'Alina — Custom video', sub: t.ei_ip, price: '400c', deadline: t.ei_dl1 },
        ].map((item, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '9px 12px', background: '#141414', border: '.5px solid #1e1e1e', borderTop: 'none', ...(i === 1 ? { borderRadius: '0 0 12px 12px' } : {}) }}>
            <div style={{ width: 32, height: 32, background: '#1e1e1e', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, flexShrink: 0 }}>{item.icon}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 12, fontWeight: 500, color: '#ddd', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.title}</div>
              <div style={{ fontSize: 10, color: '#555', marginTop: 1 }}>{item.sub}</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 3, flexShrink: 0 }}>
              <div style={{ fontSize: 12, color: '#c9a96e' }}>{item.price}</div>
              {item.deadline && <div style={{ fontSize: 9, padding: '2px 6px', borderRadius: 8, background: '#1e1e1e', color: '#888', border: '.5px solid #2a2a2a', whiteSpace: 'nowrap' }}>{item.deadline}</div>}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Msg Tab ──────────────────────────────────────────────────────────────────
function MsgTab({ t }: { t: typeof T['en'] }) {
  return (
    <div style={{ flex: 1, overflowY: 'auto', paddingTop: 12 }}>
      <div style={{ padding: '0 12px', marginBottom: 10 }}>
        <div style={{ fontSize: 12, fontWeight: 500, color: '#888', letterSpacing: 1, textTransform: 'uppercase' }}>{t.b_msgs}</div>
      </div>
      {[
        { name: 'Sofia', msg: 'Your video is ready! 🎬', time: '14:32', online: true, unread: true },
        { name: 'Alina', msg: 'Thank you for your order! 💛', time: 'yesterday', online: false, unread: false },
      ].map((m, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '9px 12px', background: '#141414', borderRadius: 12, margin: '0 12px 6px', cursor: 'pointer' }}>
          <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#1e1e1e', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, color: '#555', flexShrink: 0, position: 'relative' }}>
            Ph
            {m.online && <div style={{ position: 'absolute', bottom: 0, right: 0, width: 9, height: 9, background: '#4caf50', borderRadius: '50%', border: '2px solid #0a0a0a' }} />}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 500, color: '#ddd' }}>{m.name}</div>
            <div style={{ fontSize: 10, color: '#555', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginTop: 2 }}>{m.msg}</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
            <div style={{ fontSize: 10, color: '#444' }}>{m.time}</div>
            {m.unread && <div style={{ width: 7, height: 7, background: '#c9a96e', borderRadius: '50%' }} />}
          </div>
        </div>
      ))}
    </div>
  )
}

// ─── Acc Tab ──────────────────────────────────────────────────────────────────
function AccTab({ t }: { t: typeof T['en'] }) {
  return (
    <div style={{ flex: 1, overflowY: 'auto', paddingTop: 12 }}>
      <div style={{ background: '#141414', borderRadius: 14, border: '.5px solid #1e1e1e', padding: 14, margin: '0 12px 10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
          <div style={{ position: 'relative' }}>
            <div style={{ width: 50, height: 50, borderRadius: '50%', background: '#1e1e1e', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#c9a96e', border: '2px solid #aaa' }}>
              <IconUser />
            </div>
            <div style={{ position: 'absolute', bottom: -3, right: -3, width: 17, height: 17, background: '#141414', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9 }}>🎩</div>
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 500, color: '#f0f0f0' }}>@username</div>
            <div style={{ marginTop: 3, fontSize: 9, fontWeight: 500, padding: '2px 8px', borderRadius: 20, display: 'inline-block', background: '#2a2a2a', color: '#aaa' }}>🎩 Gentleman</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
          {[['220', t.b_coins], ['5', t.b_purch], ['$134', t.b_spent]].map(([v, l]) => (
            <div key={l} style={{ flex: 1, background: '#0f0f0f', borderRadius: 10, padding: 9, textAlign: 'center' }}>
              <div style={{ fontSize: 15, fontWeight: 500, color: '#c9a96e' }}>{v}</div>
              <div style={{ fontSize: 9, color: '#555', marginTop: 2 }}>{l}</div>
            </div>
          ))}
        </div>
        <div style={{ background: '#0f0f0f', borderRadius: 12, padding: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ fontSize: 11, color: '#aaa' }}>🎩 Gentleman</span>
            <span style={{ fontSize: 11, color: '#c9a96e' }}>👑 Noble</span>
          </div>
          <div style={{ height: 6, background: '#1e1e1e', borderRadius: 10, overflow: 'hidden', margin: '8px 0' }}>
            <div style={{ height: 6, borderRadius: 10, background: '#c9a96e', width: '27%' }} />
          </div>
          <div style={{ fontSize: 10, color: '#555', textAlign: 'right' }}>$134 of $500 • $366 to Noble</div>
        </div>
      </div>
      <div style={{ background: '#141414', borderRadius: 14, border: '.5px solid #1e1e1e', margin: '0 12px' }}>
        {[
          { icon: '🪙', label: t.b_topup, right: '220c ↗' },
          { icon: '🏆', label: t.b_ranks, right: '›' },
          { icon: '✎', label: t.b_edit, right: '›' },
          { icon: '💳', label: t.b_pay, right: '›' },
          { icon: '🔒', label: t.b_sec, right: '›' },
        ].map((item, i, arr) => (
          <div key={i}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#aaa', fontSize: 13, cursor: 'pointer', padding: '13px 14px' }}>
              <span style={{ fontSize: 16, color: '#c9a96e', width: 20, textAlign: 'center' }}>{item.icon}</span>
              <span>{item.label}</span>
              <span style={{ marginLeft: 'auto', fontSize: 11, color: '#c9a96e' }}>{item.right}</span>
            </div>
            {i < arr.length - 1 && <div style={{ height: .5, background: '#1e1e1e', margin: '0 14px' }} />}
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Girl Profile Screen ──────────────────────────────────────────────────────
function GirlProfileScreen({ onBack }: { onBack: () => void }) {
  const [activeTab, setActiveTab] = useState<'packs' | 'posts'>('packs')
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#0a0a0a', overflowY: 'auto' }}>
      {/* Topbar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px 10px', borderBottom: '.5px solid #1e1e1e', background: '#0a0a0a', flexShrink: 0 }}>
        <div onClick={onBack} style={{ color: '#c9a96e', cursor: 'pointer' }}><IconArrowLeft /></div>
        <div style={{ fontSize: 15, fontWeight: 500, color: '#f0f0f0' }}>Sofia</div>
        <div style={{ color: '#666', fontSize: 20 }}>⋮</div>
      </div>
      {/* Cover */}
      <div style={{ width: '100%', height: 130, background: '#1a1510', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <div style={{ fontSize: 11, color: '#333' }}>Cover photo</div>
        <div style={{ position: 'absolute', bottom: -28, left: 16 }}>
          <div style={{ width: 62, height: 62, borderRadius: '50%', background: '#141414', border: '3px solid #0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: '#555', position: 'relative' }}>
            Photo
            <div style={{ position: 'absolute', bottom: 2, right: 2, width: 12, height: 12, background: '#4caf50', borderRadius: '50%', border: '2px solid #0a0a0a' }} />
          </div>
        </div>
      </div>
      {/* Info */}
      <div style={{ padding: '36px 16px 12px', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <span style={{ fontSize: 18, fontWeight: 500, color: '#f0f0f0' }}>Sofia</span>
          <span style={{ background: 'rgba(201,169,110,.1)', border: '.5px solid rgba(201,169,110,.27)', borderRadius: 20, padding: '2px 7px', fontSize: 9, color: '#c9a96e' }}>✓ Verified</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 7 }}>
          <span style={{ color: '#c9a96e', fontSize: 12 }}>★★★★★</span>
          <span style={{ fontSize: 12, color: '#888' }}>4.9</span>
          <span style={{ fontSize: 11, color: '#555' }}>(128 reviews)</span>
        </div>
        <div style={{ fontSize: 12, color: '#999', lineHeight: 1.5, marginBottom: 10 }}>Exclusive photos and custom videos. Fast delivery, always online 💛</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 5, marginBottom: 0 }}>
          {[['23','Age'],['165cm','Height'],['52kg','Weight'],['C (3)','Bust'],['Blonde','Hair'],['Slim','Body']].map(([v,l]) => (
            <div key={l} style={{ background: '#141414', borderRadius: 10, border: '.5px solid #1e1e1e', padding: 7, textAlign: 'center' }}>
              <div style={{ fontSize: 11, fontWeight: 500, color: '#f0f0f0' }}>{v}</div>
              <div style={{ fontSize: 8, color: '#555', marginTop: 1 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>
      {/* Stats */}
      <div style={{ display: 'flex', borderTop: '.5px solid #1e1e1e', borderBottom: '.5px solid #1e1e1e', flexShrink: 0 }}>
        {[['1.2K','Subscribers'],['48','Packs'],['342','Orders']].map(([v,l],i) => (
          <div key={l} style={{ flex: 1, textAlign: 'center', padding: '9px 0', borderLeft: i > 0 ? '.5px solid #1e1e1e' : 'none' }}>
            <div style={{ fontSize: 13, fontWeight: 500, color: '#f0f0f0' }}>{v}</div>
            <div style={{ fontSize: 9, color: '#555', marginTop: 2 }}>{l}</div>
          </div>
        ))}
      </div>
      {/* Buttons */}
      <div style={{ display: 'flex', gap: 8, padding: '12px 16px', flexShrink: 0 }}>
        <div style={{ flex: 1, background: '#c9a96e', color: '#0a0a0a', borderRadius: 50, padding: '10px 8px', fontSize: 12, fontWeight: 500, cursor: 'pointer', textAlign: 'center' }}>Order ✦</div>
        <div style={{ flex: 1, background: '#141414', color: '#f0f0f0', border: '.5px solid #2a2a2a', borderRadius: 50, padding: '10px 8px', fontSize: 12, cursor: 'pointer', textAlign: 'center' }}>Subscribe 399🪙</div>
        <div style={{ width: 42, height: 42, background: '#141414', border: '.5px solid #2a2a2a', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#c9a96e', cursor: 'pointer', flexShrink: 0 }}>
          <IconMessage />
        </div>
      </div>
      {/* Tabs */}
      <div style={{ display: 'flex', borderTop: '.5px solid #1e1e1e', borderBottom: '.5px solid #1e1e1e', flexShrink: 0 }}>
        {(['packs','posts'] as const).map(tab => (
          <div key={tab} onClick={() => setActiveTab(tab)} style={{ flex: 1, padding: '9px 0', textAlign: 'center', fontSize: 10, color: activeTab === tab ? '#c9a96e' : '#555', cursor: 'pointer', borderBottom: `2px solid ${activeTab === tab ? '#c9a96e' : 'transparent'}` }}>
            {tab === 'packs' ? 'Packs' : 'Posts'}
          </div>
        ))}
        <div style={{ flex: 1, padding: '9px 0', textAlign: 'center', fontSize: 10, color: '#555', cursor: 'pointer', borderBottom: '2px solid transparent' }}>Market</div>
      </div>
      {/* Packs */}
      {activeTab === 'packs' && (
        <div style={{ padding: '12px 0 40px', flexShrink: 0 }}>
          <div style={{ fontSize: 11, fontWeight: 500, color: '#666', letterSpacing: 1, textTransform: 'uppercase', padding: '0 16px', marginBottom: 8 }}>Free packs</div>
          <div style={{ background: '#141414', borderRadius: 12, border: '.5px solid rgba(76,175,80,.2)', margin: '0 16px 8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px' }}>
              <div><div style={{ fontSize: 13, fontWeight: 500, color: '#f0f0f0' }}>Preview pack</div><div style={{ fontSize: 10, color: '#555', marginTop: 2 }}>5 photos • Free</div></div>
              <div style={{ fontSize: 10, fontWeight: 500, color: '#4caf50', background: '#0a2a0a', border: '.5px solid #1a4a1a', borderRadius: 20, padding: '2px 8px' }}>FREE</div>
            </div>
            <div style={{ display: 'flex', gap: 4, padding: '0 12px 8px' }}>
              {[...Array(5)].map((_,i) => <div key={i} style={{ width: 46, height: 46, background: '#1e1e1e', borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13 }}>📷</div>)}
            </div>
            <div style={{ margin: '0 12px 10px', padding: 9, borderRadius: 30, textAlign: 'center', fontSize: 11, fontWeight: 500, cursor: 'pointer', background: '#0a2a0a', color: '#4caf50', border: '.5px solid #1a4a1a' }}>View free pack</div>
          </div>
          <div style={{ height: .5, background: '#1e1e1e', margin: '12px 16px' }} />
          <div style={{ fontSize: 11, fontWeight: 500, color: '#666', letterSpacing: 1, textTransform: 'uppercase', padding: '0 16px', marginBottom: 8 }}>Paid packs</div>
          {[
            { name: 'January pack', meta: '24 photos', price: '500 🪙' },
            { name: 'Video pack', meta: '3 videos', price: '1,200 🪙' },
            { name: 'Exclusive set', meta: '15 photos + 1 video', price: '2,000 🪙' },
          ].map(pack => (
            <div key={pack.name} style={{ background: '#141414', borderRadius: 12, border: '.5px solid #1e1e1e', margin: '0 16px 8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px' }}>
                <div><div style={{ fontSize: 13, fontWeight: 500, color: '#f0f0f0' }}>{pack.name}</div><div style={{ fontSize: 10, color: '#555', marginTop: 2 }}>{pack.meta}</div></div>
                <div style={{ fontSize: 12, fontWeight: 500, color: '#c9a96e' }}>{pack.price}</div>
              </div>
              <div style={{ display: 'flex', gap: 4, padding: '0 12px 8px' }}>
                {[...Array(3)].map((_,i) => <div key={i} style={{ width: 46, height: 46, background: '#1e1e1e', borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: i === 0 ? 13 : 11 }}>{i === 0 ? '📷' : '🔒'}</div>)}
              </div>
              <div style={{ margin: '0 12px 10px', padding: 9, borderRadius: 30, textAlign: 'center', fontSize: 11, fontWeight: 500, cursor: 'pointer', background: 'rgba(201,169,110,.1)', color: '#c9a96e', border: '.5px solid rgba(201,169,110,.27)' }}>
                Buy pack — {pack.price}
              </div>
            </div>
          ))}
        </div>
      )}
      {activeTab === 'posts' && (
        <div style={{ padding: '14px 16px 40px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 4 }}>
            {[['#1a1510',''],['#12101a',''],['#0f1a14',''],['#1a100f','🔒'],['#10121a','🔒'],['#1a1218','🔒']].map(([bg,lock],i) => (
              <div key={i} style={{ aspectRatio: '1', background: bg, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
                {lock && <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>🔒</div>}
                {!lock && <span style={{ fontSize: 10, color: '#333' }}>Post</span>}
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', padding: 16, fontSize: 12, color: '#555' }}>Subscribe to see all posts</div>
        </div>
      )}
    </div>
  )
}

// ─── Bottom Nav ───────────────────────────────────────────────────────────────
function BottomNav({ active, onChange, t }: { active: BuyerTab; onChange: (t: BuyerTab) => void; t: typeof T['en'] }) {
  const tabs: [BuyerTab, React.ReactNode, string][] = [
    ['feed', <IconFlame key="f" />, t.bn_feed],
    ['excl', <IconStar  key="e" />, t.bn_excl],
    ['msg',  <IconMessage key="m" />, t.bn_msg],
    ['acc',  <IconUser  key="a" />, t.bn_acc],
  ]
  return (
    <div style={{ background: '#0f0f0f', borderTop: '.5px solid #1e1e1e', display: 'flex', padding: '8px 0 10px', flexShrink: 0 }}>
      {tabs.map(([tab, icon, label]) => (
        <div key={tab} onClick={() => onChange(tab)} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, cursor: 'pointer', color: active === tab ? '#c9a96e' : '#444' }}>
          {icon}
          <span style={{ fontSize: 9 }}>{label}</span>
        </div>
      ))}
    </div>
  )
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function Home() {
  const [lang, setLang] = useState<Lang>('en')
  const [role, setRole] = useState<Role>('buyer')
  const [screen, setScreen] = useState<Screen>('age')
  const [buyerTab, setBuyerTab] = useState<BuyerTab>('feed')
  const t = T[lang]

  // ── AGE GATE ────────────────────────────────────────────────────────────────
  if (screen === 'age') {
    return (
      <div style={{ background: '#0a0a0a', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif' }}>
        <div style={{ maxWidth: 360, width: '100%', textAlign: 'center' }}>
          <div style={{ fontSize: 26, fontWeight: 500, color: '#c9a96e', letterSpacing: 3, marginBottom: 6 }}>ExclusivMe</div>
          <div style={{ fontSize: 10, color: '#555', letterSpacing: 3, textTransform: 'uppercase', marginBottom: '2rem' }}>Private Content Platform</div>
          <div style={{ display: 'flex', gap: 8, marginBottom: '2rem' }}>
            {(['en','ru'] as Lang[]).map(l => (
              <button key={l} onClick={() => setLang(l)} style={{ flex: 1, padding: 8, borderRadius: 20, border: `1px solid ${lang===l?'#c9a96e':'#444'}`, background: lang===l?'rgba(201,169,110,.1)':'transparent', color: lang===l?'#c9a96e':'#aaa', fontSize: 12, cursor: 'pointer' }}>
                {l.toUpperCase()}
              </button>
            ))}
          </div>
          <div style={{ fontSize: 17, color: '#fff', fontWeight: 500, marginBottom: 8 }}>{t.age_title}</div>
          <div style={{ fontSize: 12, color: '#bbb', marginBottom: '1.5rem', lineHeight: 1.6, whiteSpace: 'pre-line' }}>{t.age_sub}</div>
          <div style={{ fontSize: 13, color: '#888', marginBottom: 10 }}>{t.age_choose}</div>
          <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
            {([['buyer','👨',t.rb_lbl,t.rb_sub],['girl','👩',t.rg_lbl,t.rg_sub]] as [Role,string,string,string][]).map(([r,emoji,label,sub]) => (
              <button key={r} onClick={() => setRole(r)} style={{ flex: 1, background: '#141414', border: `1px solid ${role===r?'#c9a96e':'#2a2a2a'}`, borderRadius: 14, padding: '14px 8px', cursor: 'pointer', textAlign: 'center' }}>
                <div style={{ fontSize: 22, marginBottom: 6 }}>{emoji}</div>
                <div style={{ fontSize: 13, fontWeight: 500, color: '#f0f0f0' }}>{label}</div>
                <div style={{ fontSize: 10, color: '#555', marginTop: 3 }}>{sub}</div>
              </button>
            ))}
          </div>
          <button onClick={() => setScreen('buyer')} style={{ width: '100%', background: '#c9a96e', color: '#0a0a0a', border: 'none', borderRadius: 50, padding: 14, fontSize: 15, fontWeight: 500, cursor: 'pointer', marginBottom: 10 }}>{t.age_yes}</button>
          <button style={{ width: '100%', background: 'transparent', color: '#fff', border: '2px solid #fff', borderRadius: 50, padding: 12, fontSize: 14, cursor: 'pointer' }}>{t.age_no}</button>
          <div style={{ fontSize: 10, color: '#666', marginTop: '1rem', lineHeight: 1.6 }}>By entering you agree to our Terms and Privacy Policy</div>
        </div>
      </div>
    )
  }

  // ── GIRL PROFILE ─────────────────────────────────────────────────────────────
  if (screen === 'profile') {
    return (
      <div style={{ background: '#0a0a0a', height: '100vh', display: 'flex', justifyContent: 'center', fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif' }}>
        <div style={{ width: '100%', maxWidth: 480, height: '100vh', overflowY: 'auto' }}>
          <GirlProfileScreen onBack={() => setScreen('buyer')} />
        </div>
      </div>
    )
  }

  // ── BUYER APP ────────────────────────────────────────────────────────────────
  return (
    <div style={{ background: '#0a0a0a', height: '100vh', display: 'flex', justifyContent: 'center', fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif' }}>
      <div style={{ width: '100%', maxWidth: 480, display: 'flex', flexDirection: 'column', height: '100vh' }}>
        {/* Topbar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px 10px', borderBottom: '.5px solid #1e1e1e', flexShrink: 0, background: 'rgba(10,10,10,.95)', backdropFilter: 'blur(10px)' }}>
          <div style={{ fontSize: 16, fontWeight: 500, color: '#c9a96e', letterSpacing: 1 }}>ExclusivMe</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ display: 'flex', background: '#141414', borderRadius: 20, overflow: 'hidden', border: '.5px solid #2a2a2a' }}>
              {(['en','ru'] as Lang[]).map(l => (
                <button key={l} onClick={() => setLang(l)} style={{ padding: '4px 10px', fontSize: 10, color: lang===l?'#0a0a0a':'#555', cursor: 'pointer', border: 'none', background: lang===l?'#c9a96e':'transparent', borderRadius: 20 }}>{l.toUpperCase()}</button>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 12, color: '#666' }}>
              <span style={{ cursor: 'pointer' }}><IconSearch /></span>
              <div style={{ position: 'relative', cursor: 'pointer' }}>
                <IconBell />
                <div style={{ position: 'absolute', top: -2, right: -2, width: 7, height: 7, background: '#c9a96e', borderRadius: '50%' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {buyerTab === 'feed' && <FeedTab t={t} onOpenProfile={() => setScreen('profile')} />}
          {buyerTab === 'excl' && <ExclTab t={t} />}
          {buyerTab === 'msg'  && <MsgTab t={t} />}
          {buyerTab === 'acc'  && <AccTab t={t} />}
        </div>

        {/* Bottom Nav */}
        <BottomNav active={buyerTab} onChange={setBuyerTab} t={t} />
      </div>
    </div>
  )
}
