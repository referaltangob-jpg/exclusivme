'use client'

import { useState, useEffect } from 'react'

type Lang = 'en' | 'ru'
type Role = 'buyer' | 'girl'
type BuyerTab = 'feed' | 'excl' | 'msg' | 'acc'
type CreatorTab = 'market' | 'orders' | 'msg' | 'acc'
type Screen = 'age' | 'buyer' | 'creator' | 'profile'
type RegStep = 1 | 2 | 3
type WithdrawMethod = 'card' | 'crypto' | 'bank'

interface Girl { id:number; name:string; stars:string; price:string; bg:string; online:boolean; badge:string }
interface CreatorProfile {
  username:string; displayName:string; email:string; password:string
  age:string; bio:string; height:string; weight:string; bust:string; hair:string; bodyType:string
}
interface MarketOrder {
  id:string; buyer:string; desc:string; tags:string[]; budget:string; budgetUsd:string; deadline:string; category:string
}
interface CreatorOrder {
  id:string; buyer:string; desc:string; budget:string; deadline:string; status:'new'|'active'|'done'
}

// ─── localStorage helpers ─────────────────────────────────────────────────────
const SEED_USERNAMES = ['sofia','alina','diana','mila','julia','anna','kira','anya','rita']

function getTakenUsernames(): string[] {
  if (typeof window==='undefined') return SEED_USERNAMES
  try { const s=localStorage.getItem('exclusivme_usernames'); const a:string[]=s?JSON.parse(s):[]; return [...new Set([...SEED_USERNAMES,...a])] } catch { return SEED_USERNAMES }
}
function reserveUsername(u:string) {
  if (typeof window==='undefined') return
  try { const s=localStorage.getItem('exclusivme_usernames'); const a:string[]=s?JSON.parse(s):[]; if(!a.includes(u.toLowerCase()))a.push(u.toLowerCase()); localStorage.setItem('exclusivme_usernames',JSON.stringify(a)) } catch {}
}
function releaseUsername(u:string) {
  if (typeof window==='undefined') return
  try { const s=localStorage.getItem('exclusivme_usernames'); const a:string[]=s?JSON.parse(s):[]; localStorage.setItem('exclusivme_usernames',JSON.stringify(a.filter(x=>x!==u.toLowerCase()))) } catch {}
}
function saveProfile(p:CreatorProfile) {
  if (typeof window==='undefined') return
  localStorage.setItem('exclusivme_creator',JSON.stringify(p))
}
function loadProfile():CreatorProfile|null {
  if (typeof window==='undefined') return null
  try { const s=localStorage.getItem('exclusivme_creator'); return s?JSON.parse(s):null } catch { return null }
}
function isValidUsername(u:string){ return /^[a-z0-9_]{3,20}$/.test(u) }

// ─── Mock data ────────────────────────────────────────────────────────────────
const newGirls: Girl[] = [
  {id:1,name:'Sofia', stars:'★★★★★',price:'250c',bg:'#1a1510',online:true, badge:'NEW'},
  {id:2,name:'Alina', stars:'★★★★☆',price:'90c', bg:'#12101a',online:false,badge:'NEW'},
  {id:3,name:'Anna',  stars:'★★★★★',price:'120c',bg:'#0f1a14',online:true, badge:'NEW'},
  {id:4,name:'Kira',  stars:'★★★☆☆',price:'80c', bg:'#1a100f',online:false,badge:'NEW'},
]
const allGirls: Girl[] = [
  {id:5,name:'Diana',stars:'★★★★★',price:'180c',bg:'#1a1510',online:true, badge:''},
  {id:6,name:'Mila', stars:'★★★★☆',price:'150c',bg:'#12101a',online:false,badge:''},
  {id:7,name:'Julia',stars:'★★★☆☆',price:'90c', bg:'#0f1a14',online:true, badge:''},
  {id:8,name:'Anya', stars:'★★★★☆',price:'110c',bg:'#1a100f',online:false,badge:''},
]
const topGirls: Girl[] = [
  {id:1,name:'Sofia',stars:'★★★★★',price:'250c',bg:'#1a1510',online:true, badge:'#1'},
  {id:2,name:'Diana',stars:'★★★★★',price:'180c',bg:'#12101a',online:false,badge:'#2'},
  {id:3,name:'Rita', stars:'★★★★★',price:'300c',bg:'#0f1a14',online:true, badge:'#3'},
]
const MARKET_ORDERS: MarketOrder[] = [
  {id:'#1042',buyer:'Alex_M',   desc:'Custom video in your style, min 3 minutes. I want something exclusive and unique.',tags:['Video','Custom','Exclusive'],budget:'800c',budgetUsd:'$80', deadline:'2 days',  category:'Video'},
  {id:'#1039',buyer:'Viktor99', desc:'Photo pack, lingerie theme, 20+ photos. High quality, no face needed.',             tags:['Photo','Pack','Lingerie'],  budget:'400c',budgetUsd:'$40', deadline:'5 days',  category:'Photo'},
  {id:'#1036',buyer:'max_k',    desc:'Short greeting video for my birthday, 30-60 sec, anything you like.',               tags:['Video','Short','Greeting'], budget:'150c',budgetUsd:'$15', deadline:'1 day',   category:'Video'},
  {id:'#1033',buyer:'dm_user',  desc:'Cosplay photo set, anime theme preferred, 15+ photos.',                             tags:['Photo','Cosplay','Anime'],  budget:'600c',budgetUsd:'$60', deadline:'7 days',  category:'Photo'},
  {id:'#1030',buyer:'rostov88', desc:'Custom selfie pack, 10 photos casual home style.',                                  tags:['Photo','Casual','Selfie'],  budget:'200c',budgetUsd:'$20', deadline:'3 days',  category:'Photo'},
  {id:'#1027',buyer:'user_j',   desc:'Vocal greeting video, say my name and happy birthday.',                             tags:['Video','Personal'],         budget:'100c',budgetUsd:'$10', deadline:'1 day',   category:'Video'},
]

// ─── Translations ─────────────────────────────────────────────────────────────
const T = {
  en: {
    age_title:'Are you 18 or older?', age_sub:'This website contains adult content\nintended for mature audiences only.',
    age_choose:'Choose your role:', rb_lbl:'Buyer', rb_sub:'Browse & order',
    rg_lbl:'Creator', rg_sub:'Sell content', age_yes:'Yes, I am 18+', age_no:'No, I am under 18',
    age_login:'Already have an account?', age_login_btn:'Log in',
    b_new:'New girls', b_see_new:'See all →', b_all:'All girls', b_see_all:'See all →', b_top:'Top rated',
    b_mkt:'Order Market', b_mkt_sub:'Post orders • Any girl can take',
    b_find:'Find a girl', b_find_sub:'Swipe to discover',
    bn_feed:'Feed', bn_excl:'Exclusive', bn_msg:'Chat', bn_acc:'Profile',
    b_excl_title:'My exclusive',
    ei_p:'Purchased', ei_ip:'In progress', ei_dl1:'Deadline: Jan 25',
    b_msgs:'Messages', b_coins:'Coins', b_purch:'Purchases', b_spent:'Spent',
    b_topup:'Top up balance', b_ranks:'Ranks & privileges', b_edit:'Edit profile', b_pay:'Payments',
    // creator nav
    cr_market:'Market', cr_orders:'Orders', cr_msg:'Chat', cr_profile:'Profile',
    // market
    mkt_title:'Order Market', mkt_subtitle:'Public orders • Take any that suits you',
    mkt_all:'All', mkt_take:'Take order', mkt_taken:'Order taken!',
    mkt_budget:'Budget', mkt_deadline:'Deadline', mkt_filter:'Filter',
    // orders
    ord_title:'My Orders', ord_new:'New', ord_active:'Active', ord_done:'Done',
    ord_accept:'Accept', ord_decline:'Decline', ord_markdone:'Mark as done ✓', ord_empty:'No orders yet',
    // profile
    prf_edit:'EDIT PROFILE', prf_nickname:'Nickname', prf_bio:'Bio',
    prf_params:'MY PARAMETERS', prf_age:'Age', prf_height:'Height (cm)',
    prf_weight:'Weight (kg)', prf_bust:'Bust size', prf_hair:'Hair color', prf_body:'Body type',
    prf_save:'Save changes', prf_saved:'Saved ✓',
    prf_earnings:'EARNINGS', prf_coins:'Coins', prf_usd:'as USD', prf_done:'Done',
    prf_withdraw:'WITHDRAW FUNDS', prf_amount:'Amount (coins)',
    prf_min:'Min. 100 coins = $10', prf_method:'Withdrawal method',
    prf_card:'Card', prf_crypto:'Crypto', prf_bank:'Bank',
    prf_cardnum:'Card number (last 4 digits)', prf_wallet:'Wallet address', prf_account:'Account number',
    prf_processing:'Processing: 1–3 business days  Fee: 0%  •  Min. $10  •  Max. $5,000/day',
    prf_withdraw_btn:'Withdraw coins',
    prf_packs:'MY PACKS', prf_add_pack:'Add new pack',
    prf_logout:'Log out',
    // registration
    reg_title:'Creator Registration', reg_step:'Step', reg_of:'of',
    reg_username:'Username', reg_username_ph:'your_username',
    reg_username_hint:'3–20 chars, letters, numbers, underscore',
    reg_username_ok:'Available ✓', reg_username_taken:'Already taken ✗', reg_username_invalid:'Invalid format',
    reg_email:'Email', reg_email_ph:'your@email.com',
    reg_pass:'Password', reg_pass_ph:'Min 6 characters',
    reg_pass2:'Confirm password', reg_pass2_ph:'Repeat password',
    reg_next:'Continue →', reg_back:'← Back', reg_skip:'Skip →',
    reg_displayname:'Display name', reg_displayname_ph:'How you appear on the platform',
    reg_age:'Your age', reg_age_ph:'Must be 18 or older',
    reg_bio:'Bio', reg_bio_ph:'Tell buyers about yourself...',
    reg_height:'Height (cm)', reg_weight:'Weight (kg)', reg_bust:'Bust size',
    reg_hair:'Hair color', reg_body:'Body type', reg_physical:'Physical details',
    reg_create:'Create account ✦', reg_optional:'(optional)',
    reg_err_required:'Fill in all required fields',
    reg_err_age:'You must be 18 or older',
    reg_err_pass:'Passwords do not match',
    reg_err_pass_len:'Password must be at least 6 characters',
    // login
    login_title:'Log in', login_username:'Username or email', login_username_ph:'your_username or email',
    login_pass:'Password', login_pass_ph:'Your password',
    login_btn:'Log in', login_err:'Wrong username or password',
    login_back:'← Back', login_no_acc:'No account?', login_register:'Register',
  },
  ru: {
    age_title:'Вам есть 18 лет?', age_sub:'Этот сайт содержит материалы\nтолько для взрослых.',
    age_choose:'Выберите роль:', rb_lbl:'Покупатель', rb_sub:'Смотреть и заказывать',
    rg_lbl:'Создатель', rg_sub:'Продавать контент', age_yes:'Да, мне есть 18', age_no:'Нет, мне нет 18',
    age_login:'Уже есть аккаунт?', age_login_btn:'Войти',
    b_new:'Новенькие', b_see_new:'Все →', b_all:'Все девушки', b_see_all:'Все →', b_top:'Топ рейтинг',
    b_mkt:'Биржа заказов', b_mkt_sub:'Публичные заказы • Любая может взять',
    b_find:'Найти девушку', b_find_sub:'Свайпай чтобы открыть',
    bn_feed:'Лента', bn_excl:'Эксклюзив', bn_msg:'Чат', bn_acc:'Профиль',
    b_excl_title:'Мой эксклюзив',
    ei_p:'Куплено', ei_ip:'В работе', ei_dl1:'Дедлайн: 25 янв',
    b_msgs:'Сообщения', b_coins:'Монеты', b_purch:'Покупки', b_spent:'Потрачено',
    b_topup:'Пополнить баланс', b_ranks:'Ранги и привилегии', b_edit:'Редактировать профиль', b_pay:'Платежи',
    cr_market:'Биржа', cr_orders:'Заказы', cr_msg:'Чат', cr_profile:'Профиль',
    mkt_title:'Биржа заказов', mkt_subtitle:'Публичные заказы • Возьми любой подходящий',
    mkt_all:'Все', mkt_take:'Взять заказ', mkt_taken:'Заказ принят!',
    mkt_budget:'Бюджет', mkt_deadline:'Дедлайн', mkt_filter:'Фильтр',
    ord_title:'Мои заказы', ord_new:'Новые', ord_active:'Активные', ord_done:'Завершённые',
    ord_accept:'Принять', ord_decline:'Отклонить', ord_markdone:'Отметить готовым ✓', ord_empty:'Заказов пока нет',
    prf_edit:'РЕДАКТИРОВАТЬ ПРОФИЛЬ', prf_nickname:'Никнейм', prf_bio:'О себе',
    prf_params:'МОИ ПАРАМЕТРЫ', prf_age:'Возраст', prf_height:'Рост (см)',
    prf_weight:'Вес (кг)', prf_bust:'Размер груди', prf_hair:'Цвет волос', prf_body:'Тип фигуры',
    prf_save:'Сохранить изменения', prf_saved:'Сохранено ✓',
    prf_earnings:'ЗАРАБОТОК', prf_coins:'Монеты', prf_usd:'в USD', prf_done:'Завершено',
    prf_withdraw:'ВЫВОД СРЕДСТВ', prf_amount:'Сумма (монеты)',
    prf_min:'Мин. 100 монет = $10', prf_method:'Метод вывода',
    prf_card:'Карта', prf_crypto:'Крипто', prf_bank:'Банк',
    prf_cardnum:'Номер карты (последние 4 цифры)', prf_wallet:'Адрес кошелька', prf_account:'Номер счёта',
    prf_processing:'Обработка: 1–3 дня  Комиссия: 0%  •  Мин. $10  •  Макс. $5,000/день',
    prf_withdraw_btn:'Вывести монеты',
    prf_packs:'МОИ ПАКИ', prf_add_pack:'Добавить пак',
    prf_logout:'Выйти',
    reg_title:'Регистрация создателя', reg_step:'Шаг', reg_of:'из',
    reg_username:'Имя пользователя', reg_username_ph:'твой_никнейм',
    reg_username_hint:'3–20 символов, буквы, цифры, подчёркивание',
    reg_username_ok:'Доступно ✓', reg_username_taken:'Уже занято ✗', reg_username_invalid:'Неверный формат',
    reg_email:'Email', reg_email_ph:'ваш@email.com',
    reg_pass:'Пароль', reg_pass_ph:'Минимум 6 символов',
    reg_pass2:'Подтвердите пароль', reg_pass2_ph:'Повторите пароль',
    reg_next:'Продолжить →', reg_back:'← Назад', reg_skip:'Пропустить →',
    reg_displayname:'Имя на платформе', reg_displayname_ph:'Как вас видят покупатели',
    reg_age:'Ваш возраст', reg_age_ph:'Должно быть 18 или больше',
    reg_bio:'О себе', reg_bio_ph:'Расскажите о себе покупателям...',
    reg_height:'Рост (см)', reg_weight:'Вес (кг)', reg_bust:'Размер груди',
    reg_hair:'Цвет волос', reg_body:'Тип фигуры', reg_physical:'Физические параметры',
    reg_create:'Создать аккаунт ✦', reg_optional:'(необязательно)',
    reg_err_required:'Заполните все обязательные поля',
    reg_err_age:'Вам должно быть 18 или старше',
    reg_err_pass:'Пароли не совпадают',
    reg_err_pass_len:'Пароль минимум 6 символов',
    login_title:'Вход', login_username:'Никнейм или email', login_username_ph:'никнейм или email',
    login_pass:'Пароль', login_pass_ph:'Ваш пароль',
    login_btn:'Войти', login_err:'Неверный никнейм или пароль',
    login_back:'← Назад', login_no_acc:'Нет аккаунта?', login_register:'Зарегистрироваться',
  },
} as const

// ─── SVG Icons ────────────────────────────────────────────────────────────────
const IconFlame   = () => (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 12c0-3 2.5-5 2.5-8a4.5 4.5 0 0 0-9 0c0 3 2.5 5 2.5 8a2.5 2.5 0 0 0 5 0z"/><path d="M12 12c0-3-2.5-5-2.5-8"/></svg>)
const IconStar    = () => (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>)
const IconMessage = () => (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>)
const IconUser    = () => (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>)
const IconSearch  = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>)
const IconBell    = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>)
const IconArrowLeft = () => (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>)
const IconShoppingBag = () => (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>)
const IconCards   = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"/><path d="M2 10h20"/></svg>)
const IconPackage = () => (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>)
const IconCamera  = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>)
const IconCard    = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"/><path d="M2 10h20"/></svg>)
const IconBitcoin = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11.767 19.089c4.924.868 6.14-6.025 1.216-6.894m-1.216 6.894L5.86 18.047m5.908 1.042-.347 1.97m1.563-8.864c4.924.869 6.14-6.025 1.215-6.893m-1.215 6.893-3.94-.694m5.155-6.2L8.29 4.26m5.908 1.042.348-1.97M7.48 20.364l3.126-17.727"/></svg>)
const IconBank    = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>)

// ─── Shared styles ────────────────────────────────────────────────────────────
const inp: React.CSSProperties = { width:'100%', background:'#111', border:'1px solid #2a2a2a', borderRadius:10, padding:'10px 12px', color:'#f0f0f0', fontSize:13, outline:'none', fontFamily:'-apple-system,BlinkMacSystemFont,sans-serif' }
const lbl: React.CSSProperties = { fontSize:11, color:'#888', marginBottom:5, display:'block' }
const goldBtn: React.CSSProperties = { width:'100%', background:'#c9a96e', color:'#0a0a0a', border:'none', borderRadius:50, padding:14, fontSize:14, fontWeight:600, cursor:'pointer', textAlign:'center', fontFamily:'-apple-system,BlinkMacSystemFont,sans-serif' }
const grayBtn: React.CSSProperties = { width:'100%', background:'#1a1a1a', color:'#888', border:'.5px solid #2a2a2a', borderRadius:50, padding:12, fontSize:13, cursor:'pointer', textAlign:'center', fontFamily:'-apple-system,BlinkMacSystemFont,sans-serif' }
const secTitle: React.CSSProperties = { fontSize:11, fontWeight:600, color:'#555', letterSpacing:1.2, textTransform:'uppercase', marginBottom:12 }

// ─── Chip select ──────────────────────────────────────────────────────────────
function ChipSelect({ options, value, onChange }: { options:string[]; value:string; onChange:(v:string)=>void }) {
  return (
    <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
      {options.map(o => (
        <div key={o} onClick={() => onChange(o)} style={{ background:value===o?'rgba(201,169,110,.12)':'#1a1a1a', border:`1px solid ${value===o?'#c9a96e':'#2a2a2a'}`, borderRadius:20, padding:'5px 12px', fontSize:12, color:value===o?'#c9a96e':'#888', cursor:'pointer' }}>{o}</div>
      ))}
    </div>
  )
}

// ─── Register Modal (3-step) ──────────────────────────────────────────────────
function RegisterModal({ lang, onSuccess, onClose }: { lang:Lang; onSuccess:(p:CreatorProfile)=>void; onClose:()=>void }) {
  const t = T[lang]
  const [step, setStep] = useState<RegStep>(1)
  const [error, setError] = useState('')
  const [username, setUsername]       = useState('')
  const [uStatus,  setUStatus]        = useState<'idle'|'valid'|'taken'|'invalid'>('idle')
  const [email,    setEmail]          = useState('')
  const [password, setPassword]       = useState('')
  const [password2,setPassword2]      = useState('')
  const [displayName,setDisplayName]  = useState('')
  const [age,      setAge]            = useState('')
  const [bio,      setBio]            = useState('')
  const [height,   setHeight]         = useState('')
  const [weight,   setWeight]         = useState('')
  const [bust,     setBust]           = useState('')
  const [hair,     setHair]           = useState('')
  const [bodyType, setBodyType]       = useState('')

  useEffect(() => {
    if (!username) { setUStatus('idle'); return }
    if (!isValidUsername(username)) { setUStatus('invalid'); return }
    setUStatus(getTakenUsernames().includes(username) ? 'taken' : 'valid')
  }, [username])

  const uColor = uStatus==='valid'?'#4caf50':uStatus==='taken'||uStatus==='invalid'?'#ef5350':'#555'
  const uMsg   = uStatus==='valid'?t.reg_username_ok:uStatus==='taken'?t.reg_username_taken:uStatus==='invalid'?t.reg_username_invalid:t.reg_username_hint

  const step1 = () => {
    if (!username||!email||!password||!password2){setError(t.reg_err_required);return}
    if (uStatus!=='valid'){setError(t.reg_username_taken);return}
    if (password.length<6){setError(t.reg_err_pass_len);return}
    if (password!==password2){setError(t.reg_err_pass);return}
    setError('');setStep(2)
  }
  const step2 = () => {
    if (!displayName||!age){setError(t.reg_err_required);return}
    if (parseInt(age)<18){setError(t.reg_err_age);return}
    setError('');setStep(3)
  }
  const finish = () => {
    const p:CreatorProfile = {username,displayName,email,password,age,bio,height,weight,bust,hair,bodyType}
    reserveUsername(username); saveProfile(p); onSuccess(p)
  }

  const dots = (
    <div style={{ display:'flex', gap:6, justifyContent:'center', marginBottom:18 }}>
      {[1,2,3].map(s => <div key={s} style={{ width:step===s?22:7, height:7, borderRadius:10, background:s<=step?'#c9a96e':'#2a2a2a', transition:'all .2s' }} />)}
    </div>
  )

  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,.88)', display:'flex', alignItems:'flex-end', zIndex:1000, fontFamily:'-apple-system,BlinkMacSystemFont,sans-serif' }}>
      <div style={{ background:'#141414', borderRadius:'20px 20px 0 0', width:'100%', maxWidth:480, margin:'0 auto', padding:'20px 20px 36px', borderTop:'.5px solid #2a2a2a', maxHeight:'92vh', overflowY:'auto' }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:14 }}>
          <span style={{ fontSize:16, fontWeight:500, color:'#c9a96e' }}>{t.reg_title}</span>
          <span onClick={onClose} style={{ fontSize:22, color:'#555', cursor:'pointer' }}>✕</span>
        </div>
        {dots}
        <div style={{ fontSize:10, color:'#444', marginBottom:16 }}>{t.reg_step} {step} {t.reg_of} 3</div>

        {step===1 && (
          <div style={{ display:'flex', flexDirection:'column', gap:13 }}>
            <div>
              <label style={lbl}>{t.reg_username}</label>
              <div style={{ position:'relative' }}>
                <span style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', color:'#555', fontSize:13 }}>@</span>
                <input style={{ ...inp, paddingLeft:24, borderColor:uStatus==='valid'?'rgba(76,175,80,.5)':uStatus==='taken'||uStatus==='invalid'?'rgba(239,83,80,.5)':'#2a2a2a' }}
                  placeholder={t.reg_username_ph} value={username}
                  onChange={e=>setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g,''))} maxLength={20} />
              </div>
              {username && <div style={{ fontSize:10, color:uColor, marginTop:3 }}>{uMsg}</div>}
              {!username && <div style={{ fontSize:10, color:'#555', marginTop:3 }}>{t.reg_username_hint}</div>}
            </div>
            <div><label style={lbl}>{t.reg_email}</label><input style={inp} type="email" placeholder={t.reg_email_ph} value={email} onChange={e=>setEmail(e.target.value)} /></div>
            <div><label style={lbl}>{t.reg_pass}</label><input style={inp} type="password" placeholder={t.reg_pass_ph} value={password} onChange={e=>setPassword(e.target.value)} /></div>
            <div><label style={lbl}>{t.reg_pass2}</label><input style={inp} type="password" placeholder={t.reg_pass2_ph} value={password2} onChange={e=>setPassword2(e.target.value)} /></div>
            {error && <div style={{ fontSize:12, color:'#ef5350', textAlign:'center' }}>{error}</div>}
            <button style={goldBtn} onClick={step1}>{t.reg_next}</button>
            <button style={grayBtn} onClick={onClose}>Cancel</button>
          </div>
        )}
        {step===2 && (
          <div style={{ display:'flex', flexDirection:'column', gap:13 }}>
            <div><label style={lbl}>{t.reg_displayname}</label><input style={inp} placeholder={t.reg_displayname_ph} value={displayName} onChange={e=>setDisplayName(e.target.value)} /></div>
            <div><label style={lbl}>{t.reg_age}</label><input style={inp} type="number" placeholder={t.reg_age_ph} value={age} onChange={e=>setAge(e.target.value)} min="18" max="99" /></div>
            <div>
              <label style={lbl}>{t.reg_bio}</label>
              <textarea style={{ ...inp, minHeight:80, resize:'none', lineHeight:1.5 }} placeholder={t.reg_bio_ph} value={bio} onChange={e=>setBio(e.target.value)} maxLength={300} />
              <div style={{ fontSize:10, color:'#444', textAlign:'right' }}>{bio.length}/300</div>
            </div>
            {error && <div style={{ fontSize:12, color:'#ef5350', textAlign:'center' }}>{error}</div>}
            <button style={goldBtn} onClick={step2}>{t.reg_next}</button>
            <button style={grayBtn} onClick={()=>{setError('');setStep(1)}}>{t.reg_back}</button>
          </div>
        )}
        {step===3 && (
          <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
            <div style={{ fontSize:12, color:'#888', textAlign:'center' }}>{t.reg_physical} {t.reg_optional}</div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
              <div><label style={lbl}>{t.reg_height}</label><input style={inp} type="number" placeholder="165" value={height} onChange={e=>setHeight(e.target.value)} /></div>
              <div><label style={lbl}>{t.reg_weight}</label><input style={inp} type="number" placeholder="52" value={weight} onChange={e=>setWeight(e.target.value)} /></div>
            </div>
            <div><label style={lbl}>{t.reg_bust}</label><ChipSelect options={['A (1)','B (2)','C (3)','D (4)','DD (5)','DDD+ (6)']} value={bust} onChange={setBust} /></div>
            <div><label style={lbl}>{t.reg_hair}</label><ChipSelect options={lang==='ru'?['Блондинка','Брюнетка','Чёрные','Рыжая','Другой']:['Blonde','Brunette','Black','Red','Other']} value={hair} onChange={setHair} /></div>
            <div><label style={lbl}>{t.reg_body}</label><ChipSelect options={lang==='ru'?['Стройная','Спортивная','Соблазнительная','Пышная']:['Slim','Athletic','Curvy','Plus size']} value={bodyType} onChange={setBodyType} /></div>
            <button style={goldBtn} onClick={finish}>{t.reg_create}</button>
            <button style={grayBtn} onClick={finish}>{t.reg_skip}</button>
            <button style={{ ...grayBtn, marginTop:-4 }} onClick={()=>{setError('');setStep(2)}}>{t.reg_back}</button>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Login Modal ──────────────────────────────────────────────────────────────
function LoginModal({ lang, onSuccess, onClose, onRegister }: { lang:Lang; onSuccess:(p:CreatorProfile)=>void; onClose:()=>void; onRegister:()=>void }) {
  const t = T[lang]
  const [login,    setLogin]    = useState('')
  const [password, setPassword] = useState('')
  const [error,    setError]    = useState('')

  const handleLogin = () => {
    if (!login||!password) { setError(t.reg_err_required); return }
    const saved = loadProfile()
    if (!saved) { setError(t.login_err); return }
    const matchLogin = saved.username===login.toLowerCase() || saved.email.toLowerCase()===login.toLowerCase()
    if (matchLogin && saved.password===password) { onSuccess(saved) }
    else { setError(t.login_err) }
  }

  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,.88)', display:'flex', alignItems:'flex-end', zIndex:1000, fontFamily:'-apple-system,BlinkMacSystemFont,sans-serif' }}>
      <div style={{ background:'#141414', borderRadius:'20px 20px 0 0', width:'100%', maxWidth:480, margin:'0 auto', padding:'24px 20px 40px', borderTop:'.5px solid #2a2a2a' }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:22 }}>
          <span style={{ fontSize:18, fontWeight:500, color:'#c9a96e' }}>{t.login_title}</span>
          <span onClick={onClose} style={{ fontSize:22, color:'#555', cursor:'pointer' }}>✕</span>
        </div>
        <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
          <div>
            <label style={lbl}>{t.login_username}</label>
            <input style={inp} placeholder={t.login_username_ph} value={login} onChange={e=>setLogin(e.target.value)} autoComplete="username" />
          </div>
          <div>
            <label style={lbl}>{t.login_pass}</label>
            <input style={inp} type="password" placeholder={t.login_pass_ph} value={password} onChange={e=>setPassword(e.target.value)} autoComplete="current-password" onKeyDown={e=>e.key==='Enter'&&handleLogin()} />
          </div>
          {error && <div style={{ fontSize:12, color:'#ef5350', textAlign:'center' }}>{error}</div>}
          <button style={goldBtn} onClick={handleLogin}>{t.login_btn}</button>
          <div style={{ textAlign:'center', fontSize:12, color:'#555', marginTop:4 }}>
            {t.login_no_acc}{' '}
            <span onClick={onRegister} style={{ color:'#c9a96e', cursor:'pointer', textDecoration:'underline' }}>{t.login_register}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Creator Market Tab ───────────────────────────────────────────────────────
function CreatorMarketTab({ t, onTakeOrder }: { t:typeof T['en']; onTakeOrder:(o:MarketOrder)=>void }) {
  const [filter, setFilter] = useState('All')
  const [taken,  setTaken]  = useState<string[]>([])
  const filters = ['All','Video','Photo']
  const visible = MARKET_ORDERS.filter(o => filter==='All' || o.category===filter)

  const take = (o: MarketOrder) => {
    setTaken(prev => [...prev, o.id])
    onTakeOrder(o)
  }

  return (
    <div style={{ flex:1, overflowY:'auto', background:'#0a0a0a' }}>
      {/* Header */}
      <div style={{ padding:'16px 12px 10px' }}>
        <div style={{ fontSize:18, fontWeight:500, color:'#f0f0f0', marginBottom:3 }}>{t.mkt_title}</div>
        <div style={{ fontSize:12, color:'#555' }}>{t.mkt_subtitle}</div>
      </div>

      {/* Filter chips */}
      <div style={{ display:'flex', gap:8, padding:'0 12px 12px', overflowX:'auto' }}>
        {filters.map(f => (
          <div key={f} onClick={() => setFilter(f)} style={{ flexShrink:0, padding:'6px 16px', borderRadius:20, fontSize:12, cursor:'pointer', background:filter===f?'#c9a96e':'#141414', color:filter===f?'#0a0a0a':'#888', border:filter===f?'none':'.5px solid #2a2a2a', fontWeight:filter===f?600:400 }}>{f==='All'?t.mkt_all:f}</div>
        ))}
      </div>

      {/* Orders */}
      <div style={{ padding:'0 12px 80px', display:'flex', flexDirection:'column', gap:10 }}>
        {visible.map(o => {
          const isTaken = taken.includes(o.id)
          return (
            <div key={o.id} style={{ background:'#141414', borderRadius:14, border:`.5px solid ${isTaken?'rgba(76,175,80,.25)':'#1e1e1e'}`, overflow:'hidden' }}>
              {/* Top row */}
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'10px 14px 6px' }}>
                <span style={{ fontSize:10, color:'#555' }}>{o.id}</span>
                <span style={{ fontSize:10, color:'#c9a96e' }}>⏱ {o.deadline}</span>
              </div>
              {/* Desc */}
              <div style={{ padding:'0 14px 8px', fontSize:13, color:'#ccc', lineHeight:1.55 }}>{o.desc}</div>
              {/* Tags */}
              <div style={{ display:'flex', flexWrap:'wrap', gap:5, padding:'0 14px 10px' }}>
                {o.tags.map(tag => <span key={tag} style={{ background:'#1e1e1e', borderRadius:20, padding:'2px 8px', fontSize:10, color:'#666' }}>{tag}</span>)}
              </div>
              {/* Footer */}
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'10px 14px', borderTop:'.5px solid #1e1e1e', background:'#111' }}>
                <div>
                  <div style={{ fontSize:15, fontWeight:500, color:'#c9a96e' }}>{o.budget}</div>
                  <div style={{ fontSize:10, color:'#555', marginTop:1 }}>{o.budgetUsd}</div>
                </div>
                <button
                  onClick={() => !isTaken && take(o)}
                  style={{ background:isTaken?'rgba(76,175,80,.12)':'#c9a96e', color:isTaken?'#4caf50':'#0a0a0a', border:isTaken?'.5px solid rgba(76,175,80,.3)':'none', borderRadius:20, padding:'7px 18px', fontSize:12, fontWeight:600, cursor:isTaken?'default':'pointer', fontFamily:'-apple-system,BlinkMacSystemFont,sans-serif', transition:'all .2s' }}>
                  {isTaken ? t.mkt_taken : t.mkt_take}
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── Creator Orders Tab ───────────────────────────────────────────────────────
function CreatorOrdersTab({ t, orders, setOrders }: { t:typeof T['en']; orders:CreatorOrder[]; setOrders:React.Dispatch<React.SetStateAction<CreatorOrder[]>> }) {
  const [filter, setFilter] = useState<'new'|'active'|'done'>('new')
  const visible = orders.filter(o => o.status===filter)

  const badge = (s:string) => s==='new'?{bg:'rgba(201,169,110,.15)',c:'#c9a96e',text:'NEW'}:s==='active'?{bg:'rgba(76,175,80,.12)',c:'#4caf50',text:'IN PROGRESS'}:{bg:'#1e1e1e',c:'#555',text:'DONE'}

  return (
    <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden' }}>
      {/* Sub-tabs */}
      <div style={{ display:'flex', borderBottom:'.5px solid #1e1e1e', flexShrink:0 }}>
        {(['new','active','done'] as const).map(s => (
          <div key={s} onClick={() => setFilter(s)} style={{ flex:1, padding:'10px 0', textAlign:'center', fontSize:11, cursor:'pointer', color:filter===s?'#c9a96e':'#555', borderBottom:`2px solid ${filter===s?'#c9a96e':'transparent'}` }}>
            {s==='new'?t.ord_new:s==='active'?t.ord_active:t.ord_done}
            <span style={{ marginLeft:5, fontSize:9, background:filter===s?'rgba(201,169,110,.15)':'#1a1a1a', color:filter===s?'#c9a96e':'#555', borderRadius:10, padding:'1px 6px' }}>{orders.filter(o=>o.status===s).length}</span>
          </div>
        ))}
      </div>
      <div style={{ flex:1, overflowY:'auto', padding:'12px 12px 80px' }}>
        {visible.length===0 && <div style={{ textAlign:'center', padding:40, color:'#444', fontSize:13 }}>{t.ord_empty}</div>}
        {visible.map(order => {
          const b = badge(order.status)
          return (
            <div key={order.id} style={{ background:'#141414', borderRadius:14, border:'.5px solid #1e1e1e', marginBottom:10, overflow:'hidden' }}>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'10px 12px 6px' }}>
                <span style={{ fontSize:10, color:'#555' }}>{order.id}</span>
                <span style={{ fontSize:9, fontWeight:600, padding:'2px 8px', borderRadius:20, background:b.bg, color:b.c }}>{b.text}</span>
              </div>
              <div style={{ padding:'0 12px 6px', fontSize:12, color:'#888' }}>@{order.buyer}</div>
              <div style={{ padding:'0 12px 8px', fontSize:13, color:'#e0e0e0', lineHeight:1.5 }}>{order.desc}</div>
              <div style={{ display:'flex', padding:'8px 12px', borderTop:'.5px solid #1e1e1e', gap:12 }}>
                <span style={{ fontSize:11, color:'#c9a96e' }}>💰 {order.budget}</span>
                <span style={{ fontSize:11, color:'#555' }}>⏱ {order.deadline}</span>
              </div>
              {order.status==='new' && (
                <div style={{ display:'flex', gap:8, padding:'0 12px 12px' }}>
                  <button onClick={()=>setOrders(o=>o.map(x=>x.id===order.id?{...x,status:'active' as const}:x))} style={{ flex:1, background:'rgba(76,175,80,.1)', border:'.5px solid rgba(76,175,80,.25)', borderRadius:20, padding:'8px 0', fontSize:12, color:'#4caf50', cursor:'pointer', fontFamily:'-apple-system,BlinkMacSystemFont,sans-serif' }}>{t.ord_accept}</button>
                  <button onClick={()=>setOrders(o=>o.filter(x=>x.id!==order.id))} style={{ flex:1, background:'rgba(239,83,80,.08)', border:'.5px solid rgba(239,83,80,.2)', borderRadius:20, padding:'8px 0', fontSize:12, color:'#ef5350', cursor:'pointer', fontFamily:'-apple-system,BlinkMacSystemFont,sans-serif' }}>{t.ord_decline}</button>
                </div>
              )}
              {order.status==='active' && (
                <div style={{ padding:'0 12px 12px' }}>
                  <button onClick={()=>setOrders(o=>o.map(x=>x.id===order.id?{...x,status:'done' as const}:x))} style={{ width:'100%', background:'rgba(201,169,110,.1)', border:'.5px solid rgba(201,169,110,.25)', borderRadius:20, padding:'8px 0', fontSize:12, color:'#c9a96e', cursor:'pointer', fontFamily:'-apple-system,BlinkMacSystemFont,sans-serif' }}>{t.ord_markdone}</button>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── Creator Msg Tab ──────────────────────────────────────────────────────────
function CreatorMsgTab({ t }: { t:typeof T['en'] }) {
  return (
    <div style={{ flex:1, overflowY:'auto', paddingTop:12 }}>
      <div style={{ padding:'0 12px', marginBottom:10 }}>
        <div style={{ fontSize:12, fontWeight:500, color:'#888', letterSpacing:1, textTransform:'uppercase' }}>{t.b_msgs}</div>
      </div>
      {[
        {name:'Alex_M',   msg:'Hey, I sent a new order request 🔥', time:'now',       online:true,  unread:true},
        {name:'Viktor99', msg:'When will my pack be ready?',         time:'2h ago',    online:true,  unread:true},
        {name:'user_k',   msg:'Thank you! 💛',                       time:'yesterday', online:false, unread:false},
      ].map((m,i) => (
        <div key={i} style={{ display:'flex', alignItems:'center', gap:9, padding:'9px 12px', background:'#141414', borderRadius:12, margin:'0 12px 6px', cursor:'pointer' }}>
          <div style={{ width:36, height:36, borderRadius:'50%', background:'#1e1e1e', display:'flex', alignItems:'center', justifyContent:'center', fontSize:9, color:'#555', flexShrink:0, position:'relative' }}>
            {m.name.slice(0,2)}
            {m.online && <div style={{ position:'absolute', bottom:0, right:0, width:9, height:9, background:'#4caf50', borderRadius:'50%', border:'2px solid #0a0a0a' }} />}
          </div>
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ fontSize:13, fontWeight:500, color:'#ddd' }}>{m.name}</div>
            <div style={{ fontSize:10, color:'#555', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', marginTop:2 }}>{m.msg}</div>
          </div>
          <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', gap:4 }}>
            <div style={{ fontSize:10, color:'#444' }}>{m.time}</div>
            {m.unread && <div style={{ width:7, height:7, background:'#c9a96e', borderRadius:'50%' }} />}
          </div>
        </div>
      ))}
    </div>
  )
}

// ─── Creator Profile Tab ──────────────────────────────────────────────────────
interface Pack { id:string; name:string; meta:string; price:string }

function CreatorAccTab({ t, lang, profile, onSave, onLogout }: { t:typeof T['en']; lang:Lang; profile:CreatorProfile; onSave:(p:CreatorProfile)=>void; onLogout:()=>void }) {
  // Edit state mirrors profile
  const [username,    setUsername]    = useState(profile.username)
  const [uStatus,     setUStatus]     = useState<'idle'|'valid'|'taken'|'invalid'|'same'>('same')
  const [displayName, setDisplayName] = useState(profile.displayName)
  const [bio,         setBio]         = useState(profile.bio)
  const [age,         setAge]         = useState(profile.age)
  const [height,      setHeight]      = useState(profile.height)
  const [weight,      setWeight]      = useState(profile.weight)
  const [bust,        setBust]        = useState(profile.bust)
  const [hair,        setHair]        = useState(profile.hair)
  const [bodyType,    setBodyType]    = useState(profile.bodyType)
  const [saveMsg,     setSaveMsg]     = useState('')

  // Withdraw state
  const [withdrawAmt,    setWithdrawAmt]    = useState('')
  const [withdrawMethod, setWithdrawMethod] = useState<WithdrawMethod>('card')
  const [methodField,    setMethodField]    = useState('')

  // Packs
  const [packs, setPacks] = useState<Pack[]>([
    {id:'1', name:'January pack', meta:'24 photos', price:'500 🪙'},
    {id:'2', name:'Video pack',   meta:'3 videos',  price:'1,200 🪙'},
  ])

  useEffect(() => {
    const lower = username.toLowerCase()
    if (lower===profile.username){setUStatus('same');return}
    if (!isValidUsername(lower)){setUStatus('invalid');return}
    setUStatus(getTakenUsernames().includes(lower)?'taken':'valid')
  }, [username, profile.username])

  const uColor = uStatus==='valid'?'#4caf50':uStatus==='taken'||uStatus==='invalid'?'#ef5350':'rgba(201,169,110,.6)'
  const uMsg   = uStatus==='same'?`@${profile.username}`:uStatus==='valid'?t.reg_username_ok:uStatus==='taken'?t.reg_username_taken:t.reg_username_invalid

  const handleSave = () => {
    if (uStatus==='taken'||uStatus==='invalid') return
    if (!displayName.trim()) return
    if (parseInt(age)<18) return
    if (username.toLowerCase()!==profile.username){ releaseUsername(profile.username); reserveUsername(username.toLowerCase()) }
    const updated:CreatorProfile = {...profile, username:username.toLowerCase(), displayName, bio, age, height, weight, bust, hair, bodyType}
    saveProfile(updated); onSave(updated); setSaveMsg(t.prf_saved)
    setTimeout(()=>setSaveMsg(''), 2500)
  }

  const withdrawUsd = withdrawAmt ? `= $${(parseInt(withdrawAmt)||0)/10}` : ''
  const methodLabel = withdrawMethod==='card'?t.prf_cardnum:withdrawMethod==='crypto'?t.prf_wallet:t.prf_account

  const bustShort = profile.bust ? profile.bust.split(' ')[0] : ''

  return (
    <div style={{ flex:1, overflowY:'auto', paddingBottom:80 }}>

      {/* ── Cover + Avatar (read-only) ─────────── */}
      <div style={{ width:'100%', height:110, background:'linear-gradient(135deg,#1a1510 0%,#1a1018 100%)', position:'relative', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
        <span style={{ fontSize:11, color:'#2a2a2a' }}>Cover photo</span>
      </div>
      <div style={{ padding:'0 16px', marginTop:-28, marginBottom:12 }}>
        <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between' }}>
          <div style={{ width:58, height:58, borderRadius:'50%', background:'#1e1e1e', border:'3px solid #0a0a0a', display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, color:'#c9a96e', fontWeight:500 }}>
            {profile.displayName.slice(0,1).toUpperCase()}
          </div>
        </div>
        <div style={{ marginTop:8 }}>
          <div style={{ display:'flex', alignItems:'center', gap:7 }}>
            <span style={{ fontSize:20, fontWeight:500, color:'#f0f0f0' }}>{profile.displayName}</span>
            <span style={{ background:'rgba(201,169,110,.1)', border:'.5px solid rgba(201,169,110,.3)', borderRadius:20, padding:'2px 8px', fontSize:9, color:'#c9a96e' }}>✓ Verified</span>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:5, marginTop:4 }}>
            <span style={{ color:'#c9a96e', fontSize:12 }}>★★★★★</span>
            <span style={{ fontSize:12, color:'#888' }}>4.9</span>
            <span style={{ fontSize:11, color:'#555' }}>(128 reviews)</span>
          </div>
        </div>
      </div>

      {/* Physical params display */}
      {(profile.age||profile.height||profile.bust) && (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:5, padding:'0 16px', marginBottom:10 }}>
          {[[profile.age,'Age'],[profile.height?`${profile.height}cm`:'','Height'],[profile.weight?`${profile.weight}kg`:'','Weight'],[bustShort,'Bust'],[profile.hair,'Hair'],[profile.bodyType,'Body']].filter(([v])=>v).map(([v,l])=>(
            <div key={l} style={{ background:'#141414', borderRadius:10, border:'.5px solid #1e1e1e', padding:8, textAlign:'center' }}>
              <div style={{ fontSize:12, fontWeight:500, color:'#f0f0f0' }}>{v}</div>
              <div style={{ fontSize:8, color:'#555', marginTop:1 }}>{l}</div>
            </div>
          ))}
        </div>
      )}

      {/* Stats row */}
      <div style={{ display:'flex', borderTop:'.5px solid #1e1e1e', borderBottom:'.5px solid #1e1e1e', marginBottom:18, flexShrink:0 }}>
        {[['1.2K',t.cr_stats_subs],['48','Packs'],['$324',t.cr_stats_earn]].map(([v,l],i)=>(
          <div key={l} style={{ flex:1, textAlign:'center', padding:'10px 0', borderLeft:i>0?'.5px solid #1e1e1e':'none' }}>
            <div style={{ fontSize:14, fontWeight:500, color:'#f0f0f0' }}>{v}</div>
            <div style={{ fontSize:9, color:'#555', marginTop:2 }}>{l}</div>
          </div>
        ))}
      </div>

      {/* ── EDIT PROFILE ─────────── */}
      <div style={{ padding:'0 16px', marginBottom:20 }}>
        <div style={secTitle}>{t.prf_edit}</div>

        {/* Avatar + Nickname row */}
        <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:14 }}>
          <div style={{ position:'relative', flexShrink:0 }}>
            <div style={{ width:52, height:52, borderRadius:'50%', background:'#1e1e1e', border:'2px solid #2a2a2a', display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, color:'#c9a96e' }}>
              {profile.displayName.slice(0,1).toUpperCase()}
            </div>
            <div style={{ position:'absolute', bottom:0, right:0, width:18, height:18, background:'#c9a96e', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer' }}>
              <IconCamera />
            </div>
          </div>
          <div style={{ flex:1 }}>
            <label style={lbl}>{t.prf_nickname}</label>
            <div style={{ position:'relative' }}>
              <span style={{ position:'absolute', left:10, top:'50%', transform:'translateY(-50%)', color:'#555', fontSize:12 }}>@</span>
              <input style={{ ...inp, paddingLeft:22, borderColor:uStatus==='same'?'rgba(201,169,110,.2)':uStatus==='valid'?'rgba(76,175,80,.4)':'rgba(239,83,80,.4)' }}
                value={username}
                onChange={e=>setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g,''))}
                maxLength={20} />
            </div>
            {<div style={{ fontSize:9, color:uColor, marginTop:3 }}>{uMsg}</div>}
          </div>
        </div>

        <div>
          <label style={lbl}>{t.prf_bio}</label>
          <textarea
            style={{ ...inp, minHeight:72, resize:'none', lineHeight:1.55, borderColor:'rgba(201,169,110,.15)' }}
            value={bio} onChange={e=>setBio(e.target.value)} maxLength={300}
            placeholder="Tell buyers about yourself..." />
        </div>
      </div>

      {/* ── MY PARAMETERS ─────────── */}
      <div style={{ padding:'0 16px', marginBottom:20 }}>
        <div style={secTitle}>{t.prf_params}</div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
          {[
            {label:t.prf_age,    value:age,    set:setAge,    type:'number', ph:'23'},
            {label:t.prf_height, value:height, set:setHeight, type:'number', ph:'165'},
            {label:t.prf_weight, value:weight, set:setWeight, type:'number', ph:'52'},
            {label:t.prf_bust,   value:bust,   set:setBust,   type:'text',   ph:'C'},
            {label:t.prf_hair,   value:hair,   set:setHair,   type:'text',   ph:'Blonde'},
            {label:t.prf_body,   value:bodyType,set:setBodyType,type:'text', ph:'Slim'},
          ].map(({label,value,set,type,ph}) => (
            <div key={label}>
              <label style={lbl}>{label}</label>
              <input style={inp} type={type} placeholder={ph} value={value} onChange={e=>set(e.target.value)} />
            </div>
          ))}
        </div>
      </div>

      {/* Save button */}
      <div style={{ padding:'0 16px', marginBottom:24 }}>
        <button onClick={handleSave} style={{ ...goldBtn, opacity: uStatus==='taken'||uStatus==='invalid'?0.5:1 }}>
          {saveMsg || t.prf_save}
        </button>
      </div>

      {/* ── EARNINGS ─────────── */}
      <div style={{ padding:'0 16px', marginBottom:16 }}>
        <div style={secTitle}>{t.prf_earnings}</div>
        <div style={{ display:'flex', gap:8, marginBottom:14 }}>
          {[['3,240',t.prf_coins,'#c9a96e'],['$324',t.prf_usd,'#4caf50'],['18',t.prf_done,'#c9a96e']].map(([v,l,c])=>(
            <div key={l} style={{ flex:1, background:'#141414', borderRadius:12, border:'.5px solid #1e1e1e', padding:'12px 8px', textAlign:'center' }}>
              <div style={{ fontSize:17, fontWeight:500, color:c }}>{v}</div>
              <div style={{ fontSize:9, color:'#555', marginTop:3 }}>{l}</div>
            </div>
          ))}
        </div>

        {/* Withdraw funds */}
        <div style={{ background:'#141414', borderRadius:14, border:'.5px solid #1e1e1e', padding:16 }}>
          <div style={{ fontSize:12, fontWeight:500, color:'#888', letterSpacing:.8, textTransform:'uppercase', marginBottom:14 }}>{t.prf_withdraw}</div>

          {/* Amount */}
          <label style={lbl}>{t.prf_amount}</label>
          <div style={{ position:'relative', marginBottom:5 }}>
            <input style={{ ...inp, paddingRight:60, borderColor:'rgba(201,169,110,.2)' }}
              type="number" placeholder="1000" value={withdrawAmt}
              onChange={e=>setWithdrawAmt(e.target.value)} />
            {withdrawUsd && <span style={{ position:'absolute', right:12, top:'50%', transform:'translateY(-50%)', fontSize:12, color:'#c9a96e' }}>{withdrawUsd}</span>}
          </div>
          <div style={{ fontSize:10, color:'#555', marginBottom:14 }}>{t.prf_min}</div>

          {/* Method */}
          <label style={lbl}>{t.prf_method}</label>
          <div style={{ display:'flex', gap:8, marginBottom:14 }}>
            {([['card',<IconCard key="c"/>,t.prf_card],['crypto',<IconBitcoin key="b"/>,t.prf_crypto],['bank',<IconBank key="bk"/>,t.prf_bank]] as [WithdrawMethod,React.ReactNode,string][]).map(([m,icon,label])=>(
              <div key={m} onClick={()=>setWithdrawMethod(m)} style={{ flex:1, padding:'10px 6px', borderRadius:12, border:`1px solid ${withdrawMethod===m?'#c9a96e':'#2a2a2a'}`, background:withdrawMethod===m?'rgba(201,169,110,.08)':'transparent', display:'flex', flexDirection:'column', alignItems:'center', gap:5, cursor:'pointer' }}>
                <div style={{ color:withdrawMethod===m?'#c9a96e':'#555' }}>{icon}</div>
                <span style={{ fontSize:10, color:withdrawMethod===m?'#c9a96e':'#888' }}>{label}</span>
              </div>
            ))}
          </div>

          {/* Method-specific field */}
          <label style={lbl}>{methodLabel}</label>
          <input style={{ ...inp, marginBottom:10, borderColor:'rgba(201,169,110,.15)' }}
            placeholder={withdrawMethod==='card'?'**** **** **** 4242':withdrawMethod==='crypto'?'0x...':'Account number'}
            value={methodField} onChange={e=>setMethodField(e.target.value)} />

          <div style={{ fontSize:10, color:'#444', lineHeight:1.7, marginBottom:14 }}>{t.prf_processing}</div>
          <button style={goldBtn}>{t.prf_withdraw_btn}</button>
        </div>
      </div>

      {/* ── MY PACKS ─────────── */}
      <div style={{ padding:'0 16px', marginBottom:20 }}>
        <div style={secTitle}>{t.prf_packs}</div>

        {/* Add new pack */}
        <div style={{ background:'#141414', borderRadius:14, border:'1px dashed #2a2a2a', padding:'18px 0', display:'flex', flexDirection:'column', alignItems:'center', gap:6, cursor:'pointer', marginBottom:10 }}>
          <div style={{ width:36, height:36, borderRadius:'50%', background:'#1e1e1e', display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, color:'#555' }}>+</div>
          <span style={{ fontSize:12, color:'#555' }}>{t.prf_add_pack}</span>
        </div>

        {packs.map(pack => (
          <div key={pack.id} style={{ background:'#141414', borderRadius:14, border:'.5px solid #1e1e1e', marginBottom:10, overflow:'hidden' }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'11px 14px' }}>
              <div>
                <div style={{ fontSize:13, fontWeight:500, color:'#f0f0f0' }}>{pack.name}</div>
                <div style={{ fontSize:10, color:'#555', marginTop:2 }}>{pack.meta}</div>
              </div>
              <div style={{ fontSize:13, fontWeight:500, color:'#c9a96e' }}>{pack.price}</div>
            </div>
            <div style={{ display:'flex', gap:5, padding:'0 14px 12px' }}>
              {[...Array(3)].map((_,i) => (
                <div key={i} style={{ width:48, height:48, background:'#1e1e1e', borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center', fontSize:16, color:'#444' }}>
                  📷
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Logout */}
      <div style={{ padding:'0 16px 4px' }}>
        <button onClick={onLogout} style={{ ...grayBtn, color:'#ef5350', background:'rgba(239,83,80,.06)', border:'.5px solid rgba(239,83,80,.18)' }}>
          {t.prf_logout}
        </button>
      </div>
    </div>
  )
}

// ─── Creator Bottom Nav ───────────────────────────────────────────────────────
function CreatorBottomNav({ active, onChange, t }: { active:CreatorTab; onChange:(t:CreatorTab)=>void; t:typeof T['en'] }) {
  const tabs: [CreatorTab, React.ReactNode, string][] = [
    ['market', <IconShoppingBag key="m" />, t.cr_market],
    ['orders', <IconPackage     key="o" />, t.cr_orders],
    ['msg',    <IconMessage     key="c" />, t.cr_msg],
    ['acc',    <IconUser        key="a" />, t.cr_profile],
  ]
  return (
    <div style={{ background:'#0f0f0f', borderTop:'.5px solid #1e1e1e', display:'flex', padding:'8px 0 10px', flexShrink:0 }}>
      {tabs.map(([tab,icon,label])=>(
        <div key={tab} onClick={()=>onChange(tab)} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:3, cursor:'pointer', color:active===tab?'#c9a96e':'#444' }}>
          {icon}<span style={{ fontSize:9 }}>{label}</span>
        </div>
      ))}
    </div>
  )
}

// ─── Creator App ──────────────────────────────────────────────────────────────
function CreatorApp({ lang, setLang, profile, setProfile, onLogout }:
  { lang:Lang; setLang:(l:Lang)=>void; profile:CreatorProfile; setProfile:(p:CreatorProfile)=>void; onLogout:()=>void }) {
  const t = T[lang]
  const [tab, setTab] = useState<CreatorTab>('market')
  const [orders, setOrders] = useState<CreatorOrder[]>([
    {id:'#1042',buyer:'Alex_M',   desc:'Custom video in your style, min 3 minutes.',      budget:'800c',deadline:'2 days',status:'new'},
    {id:'#1039',buyer:'Viktor99', desc:'Photo pack, lingerie theme, 20+ photos.',          budget:'400c',deadline:'5 days',status:'active'},
    {id:'#1031',buyer:'user_k',   desc:'Short greeting video.',                            budget:'200c',deadline:'done',  status:'done'},
  ])

  const handleTakeOrder = (o: MarketOrder) => {
    const newOrd: CreatorOrder = { id:o.id+'-m', buyer:o.buyer, desc:o.desc, budget:o.budget, deadline:o.deadline, status:'new' }
    setOrders(prev => [newOrd, ...prev])
    setTab('orders')
  }

  // Unread counts
  const newOrdersCount = orders.filter(o=>o.status==='new').length

  return (
    <div style={{ background:'#0a0a0a', height:'100vh', display:'flex', justifyContent:'center', fontFamily:'-apple-system,BlinkMacSystemFont,sans-serif' }}>
      <div style={{ width:'100%', maxWidth:480, display:'flex', flexDirection:'column', height:'100vh' }}>
        {/* Topbar */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'14px 16px 10px', borderBottom:'.5px solid #1e1e1e', flexShrink:0, background:'rgba(10,10,10,.97)', backdropFilter:'blur(10px)' }}>
          <div>
            <div style={{ fontSize:16, fontWeight:500, color:'#c9a96e', letterSpacing:1 }}>ExclusivMe</div>
            <div style={{ fontSize:9, color:'#555', marginTop:1 }}>@{profile.username}</div>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <div style={{ display:'flex', background:'#141414', borderRadius:20, overflow:'hidden', border:'.5px solid #2a2a2a' }}>
              {(['en','ru'] as Lang[]).map(l=>(
                <button key={l} onClick={()=>setLang(l)} style={{ padding:'4px 10px', fontSize:10, color:lang===l?'#0a0a0a':'#555', cursor:'pointer', border:'none', background:lang===l?'#c9a96e':'transparent', borderRadius:20, fontFamily:'-apple-system,BlinkMacSystemFont,sans-serif' }}>{l.toUpperCase()}</button>
              ))}
            </div>
            <div style={{ position:'relative', cursor:'pointer', color:'#666' }}>
              <IconBell />
              {newOrdersCount>0 && <div style={{ position:'absolute', top:-4, right:-4, width:14, height:14, background:'#c9a96e', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:8, color:'#0a0a0a', fontWeight:700 }}>{newOrdersCount}</div>}
            </div>
          </div>
        </div>

        {/* Content */}
        <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden' }}>
          {tab==='market' && <CreatorMarketTab t={t} onTakeOrder={handleTakeOrder} />}
          {tab==='orders' && <CreatorOrdersTab t={t} orders={orders} setOrders={setOrders} />}
          {tab==='msg'    && <CreatorMsgTab t={t} />}
          {tab==='acc'    && <CreatorAccTab t={t} lang={lang} profile={profile} onSave={setProfile} onLogout={onLogout} />}
        </div>

        <CreatorBottomNav active={tab} onChange={setTab} t={t} />
      </div>
    </div>
  )
}

// ─── Buyer components ─────────────────────────────────────────────────────────
const scrollStyle: React.CSSProperties = { display:'flex', gap:8, overflowX:'auto', padding:'0 12px 12px', scrollbarWidth:'none', msOverflowStyle:'none' as unknown as undefined }

function GirlCard({ girl, onClick }: { girl:Girl; onClick:()=>void }) {
  return (
    <div onClick={onClick} style={{ background:'#141414', borderRadius:12, overflow:'hidden', border:'.5px solid #1e1e1e', cursor:'pointer', flexShrink:0, width:120 }}>
      <div style={{ width:'100%', height:90, position:'relative', display:'flex', alignItems:'center', justifyContent:'center', background:girl.bg }}>
        {girl.badge && <div style={{ position:'absolute', top:6, left:6, background:'#c9a96e', color:'#0a0a0a', fontSize:8, fontWeight:600, padding:'1px 6px', borderRadius:20 }}>{girl.badge}</div>}
        {girl.online && <div style={{ position:'absolute', top:6, right:6, width:7, height:7, background:'#4caf50', borderRadius:'50%' }} />}
        <div style={{ width:44, height:44, borderRadius:'50%', border:'2px solid rgba(201,169,110,.2)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:9, color:'#555' }}>Photo</div>
      </div>
      <div style={{ padding:'6px 8px 8px' }}>
        <div style={{ fontSize:12, fontWeight:500, color:'#f0f0f0' }}>{girl.name}</div>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginTop:2 }}>
          <span style={{ color:'#c9a96e', fontSize:9 }}>{girl.stars}</span>
          <span style={{ fontSize:10, color:'#666' }}>{girl.price}</span>
        </div>
      </div>
    </div>
  )
}
function SectionHeader({ title, action }: { title:string; action:string }) {
  return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 12px', marginBottom:10 }}>
      <h2 style={{ fontSize:12, fontWeight:500, color:'#888', letterSpacing:1, textTransform:'uppercase', margin:0 }}>{title}</h2>
      <span style={{ fontSize:11, color:'#c9a96e', cursor:'pointer' }}>{action}</span>
    </div>
  )
}
const Divider = () => <div style={{ height:.5, background:'#1e1e1e', margin:'4px 12px' }} />

function FeedTab({ t, onOpenProfile }: { t:typeof T['en']; onOpenProfile:()=>void }) {
  return (
    <div style={{ flex:1, overflowY:'auto', overflowX:'hidden' }}>
      <div style={{ paddingTop:14 }}><SectionHeader title={t.b_new} action={t.b_see_new} /></div>
      <div style={scrollStyle}>{newGirls.map(g=><GirlCard key={g.id} girl={g} onClick={onOpenProfile}/>)}</div>
      <Divider />
      <div style={{ paddingTop:4 }}><SectionHeader title={t.b_all} action={t.b_see_all} /></div>
      <div style={scrollStyle}>{allGirls.map(g=><GirlCard key={g.id} girl={g} onClick={onOpenProfile}/>)}</div>
      <Divider />
      <div style={{ borderRadius:20, padding:14, display:'flex', alignItems:'center', gap:12, cursor:'pointer', margin:'8px 12px', background:'rgba(201,169,110,.1)', border:'1px solid rgba(201,169,110,.2)' }}>
        <div style={{ width:42, height:42, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, background:'rgba(201,169,110,.13)', border:'1px solid rgba(201,169,110,.27)', color:'#c9a96e' }}><IconShoppingBag /></div>
        <div><div style={{ fontSize:14, fontWeight:500, color:'#c9a96e' }}>{t.b_mkt}</div><div style={{ fontSize:11, color:'#888', marginTop:2 }}>{t.b_mkt_sub}</div></div>
        <div style={{ marginLeft:'auto', color:'#c9a96e', fontSize:18 }}>›</div>
      </div>
      <Divider />
      <div style={{ borderRadius:20, padding:14, display:'flex', alignItems:'center', gap:12, cursor:'pointer', margin:'8px 12px', background:'#141414', border:'1px solid rgba(201,169,110,.15)' }}>
        <div style={{ width:42, height:42, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, background:'rgba(201,169,110,.1)', border:'1px solid rgba(201,169,110,.2)', color:'#c9a96e' }}><IconCards /></div>
        <div><div style={{ fontSize:14, fontWeight:500, color:'#f0f0f0' }}>{t.b_find}</div><div style={{ fontSize:11, color:'#555', marginTop:2 }}>{t.b_find_sub}</div></div>
        <div style={{ marginLeft:'auto', color:'#555', fontSize:18 }}>›</div>
      </div>
      <Divider />
      <div style={{ paddingTop:4 }}><SectionHeader title={t.b_top} action="Top 10" /></div>
      <div style={scrollStyle}>{topGirls.map(g=><GirlCard key={g.id} girl={g} onClick={onOpenProfile}/>)}</div>
    </div>
  )
}
function ExclTab({ t }: { t:typeof T['en'] }) {
  return (
    <div style={{ flex:1, overflowY:'auto', padding:'12px 0' }}>
      <div style={{ padding:'0 12px', marginBottom:12 }}><div style={{ fontSize:12, fontWeight:500, color:'#888', letterSpacing:1, textTransform:'uppercase' }}>{t.b_excl_title}</div></div>
      <div>
        <div style={{ display:'flex', alignItems:'center', gap:8, padding:'9px 12px 7px', background:'#141414', borderRadius:'12px 12px 0 0', border:'.5px solid #1e1e1e', borderBottom:'none' }}>
          <div style={{ width:26, height:26, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, color:'#c9a96e', border:'1px solid rgba(201,169,110,.27)', background:'#1a1510', flexShrink:0 }}>A</div>
          <div style={{ fontSize:13, fontWeight:500, color:'#ddd', flex:1 }}>Alina</div>
          <div style={{ fontSize:10, color:'#555' }}>2 items</div>
        </div>
        {[{icon:'📷',title:'Alina — Pack #1',sub:t.ei_p,price:'90c',deadline:''},{icon:'🎬',title:'Alina — Custom video',sub:t.ei_ip,price:'400c',deadline:t.ei_dl1}].map((item,i)=>(
          <div key={i} style={{ display:'flex', alignItems:'center', gap:9, padding:'9px 12px', background:'#141414', border:'.5px solid #1e1e1e', borderTop:'none', ...(i===1?{borderRadius:'0 0 12px 12px'}:{}) }}>
            <div style={{ width:32, height:32, background:'#1e1e1e', borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center', fontSize:14, flexShrink:0 }}>{item.icon}</div>
            <div style={{ flex:1, minWidth:0 }}><div style={{ fontSize:12, fontWeight:500, color:'#ddd', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{item.title}</div><div style={{ fontSize:10, color:'#555', marginTop:1 }}>{item.sub}</div></div>
            <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', gap:3, flexShrink:0 }}>
              <div style={{ fontSize:12, color:'#c9a96e' }}>{item.price}</div>
              {item.deadline&&<div style={{ fontSize:9, padding:'2px 6px', borderRadius:8, background:'#1e1e1e', color:'#888', border:'.5px solid #2a2a2a', whiteSpace:'nowrap' }}>{item.deadline}</div>}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
function MsgTab({ t }: { t:typeof T['en'] }) {
  return (
    <div style={{ flex:1, overflowY:'auto', paddingTop:12 }}>
      <div style={{ padding:'0 12px', marginBottom:10 }}><div style={{ fontSize:12, fontWeight:500, color:'#888', letterSpacing:1, textTransform:'uppercase' }}>{t.b_msgs}</div></div>
      {[{name:'Sofia',msg:'Your video is ready! 🎬',time:'14:32',online:true,unread:true},{name:'Alina',msg:'Thank you for your order! 💛',time:'yesterday',online:false,unread:false}].map((m,i)=>(
        <div key={i} style={{ display:'flex', alignItems:'center', gap:9, padding:'9px 12px', background:'#141414', borderRadius:12, margin:'0 12px 6px', cursor:'pointer' }}>
          <div style={{ width:36, height:36, borderRadius:'50%', background:'#1e1e1e', display:'flex', alignItems:'center', justifyContent:'center', fontSize:9, color:'#555', flexShrink:0, position:'relative' }}>
            Ph
            {m.online&&<div style={{ position:'absolute', bottom:0, right:0, width:9, height:9, background:'#4caf50', borderRadius:'50%', border:'2px solid #0a0a0a' }}/>}
          </div>
          <div style={{ flex:1, minWidth:0 }}><div style={{ fontSize:13, fontWeight:500, color:'#ddd' }}>{m.name}</div><div style={{ fontSize:10, color:'#555', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', marginTop:2 }}>{m.msg}</div></div>
          <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', gap:4 }}><div style={{ fontSize:10, color:'#444' }}>{m.time}</div>{m.unread&&<div style={{ width:7, height:7, background:'#c9a96e', borderRadius:'50%' }}/>}</div>
        </div>
      ))}
    </div>
  )
}
function AccTab({ t }: { t:typeof T['en'] }) {
  return (
    <div style={{ flex:1, overflowY:'auto', paddingTop:12 }}>
      <div style={{ background:'#141414', borderRadius:14, border:'.5px solid #1e1e1e', padding:14, margin:'0 12px 10px' }}>
        <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:12 }}>
          <div style={{ position:'relative' }}>
            <div style={{ width:50, height:50, borderRadius:'50%', background:'#1e1e1e', display:'flex', alignItems:'center', justifyContent:'center', color:'#c9a96e', border:'2px solid #aaa' }}><IconUser/></div>
            <div style={{ position:'absolute', bottom:-3, right:-3, width:17, height:17, background:'#141414', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:9 }}>🎩</div>
          </div>
          <div><div style={{ fontSize:14, fontWeight:500, color:'#f0f0f0' }}>@username</div><div style={{ marginTop:3, fontSize:9, fontWeight:500, padding:'2px 8px', borderRadius:20, display:'inline-block', background:'#2a2a2a', color:'#aaa' }}>🎩 Gentleman</div></div>
        </div>
        <div style={{ display:'flex', gap:8, marginBottom:12 }}>
          {[['220',t.b_coins],['5',t.b_purch],['$134',t.b_spent]].map(([v,l])=>(
            <div key={l} style={{ flex:1, background:'#0f0f0f', borderRadius:10, padding:9, textAlign:'center' }}><div style={{ fontSize:15, fontWeight:500, color:'#c9a96e' }}>{v}</div><div style={{ fontSize:9, color:'#555', marginTop:2 }}>{l}</div></div>
          ))}
        </div>
        <div style={{ background:'#0f0f0f', borderRadius:12, padding:12 }}>
          <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}><span style={{ fontSize:11, color:'#aaa' }}>🎩 Gentleman</span><span style={{ fontSize:11, color:'#c9a96e' }}>👑 Noble</span></div>
          <div style={{ height:6, background:'#1e1e1e', borderRadius:10, overflow:'hidden', margin:'8px 0' }}><div style={{ height:6, borderRadius:10, background:'#c9a96e', width:'27%' }}/></div>
          <div style={{ fontSize:10, color:'#555', textAlign:'right' }}>$134 of $500 • $366 to Noble</div>
        </div>
      </div>
      <div style={{ background:'#141414', borderRadius:14, border:'.5px solid #1e1e1e', margin:'0 12px' }}>
        {[{icon:'🪙',label:t.b_topup,right:'220c ↗'},{icon:'🏆',label:t.b_ranks,right:'›'},{icon:'✎',label:t.b_edit,right:'›'},{icon:'💳',label:t.b_pay,right:'›'}].map((item,i,arr)=>(
          <div key={i}>
            <div style={{ display:'flex', alignItems:'center', gap:10, color:'#aaa', fontSize:13, cursor:'pointer', padding:'13px 14px' }}>
              <span style={{ fontSize:16, color:'#c9a96e', width:20, textAlign:'center' }}>{item.icon}</span>
              <span>{item.label}</span>
              <span style={{ marginLeft:'auto', fontSize:11, color:'#c9a96e' }}>{item.right}</span>
            </div>
            {i<arr.length-1&&<div style={{ height:.5, background:'#1e1e1e', margin:'0 14px' }}/>}
          </div>
        ))}
      </div>
    </div>
  )
}
function GirlProfileScreen({ onBack }: { onBack:()=>void }) {
  const [activeTab, setActiveTab] = useState<'packs'|'posts'>('packs')
  return (
    <div style={{ display:'flex', flexDirection:'column', height:'100%', background:'#0a0a0a', overflowY:'auto' }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'14px 16px 10px', borderBottom:'.5px solid #1e1e1e', background:'#0a0a0a', flexShrink:0 }}>
        <div onClick={onBack} style={{ color:'#c9a96e', cursor:'pointer' }}><IconArrowLeft/></div>
        <div style={{ fontSize:15, fontWeight:500, color:'#f0f0f0' }}>Sofia</div>
        <div style={{ color:'#666', fontSize:20 }}>⋮</div>
      </div>
      <div style={{ width:'100%', height:130, background:'#1a1510', position:'relative', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
        <div style={{ fontSize:11, color:'#333' }}>Cover photo</div>
        <div style={{ position:'absolute', bottom:-28, left:16 }}>
          <div style={{ width:62, height:62, borderRadius:'50%', background:'#141414', border:'3px solid #0a0a0a', display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, color:'#555', position:'relative' }}>
            Photo<div style={{ position:'absolute', bottom:2, right:2, width:12, height:12, background:'#4caf50', borderRadius:'50%', border:'2px solid #0a0a0a' }}/>
          </div>
        </div>
      </div>
      <div style={{ padding:'36px 16px 12px', flexShrink:0 }}>
        <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:4 }}><span style={{ fontSize:18, fontWeight:500, color:'#f0f0f0' }}>Sofia</span><span style={{ background:'rgba(201,169,110,.1)', border:'.5px solid rgba(201,169,110,.27)', borderRadius:20, padding:'2px 7px', fontSize:9, color:'#c9a96e' }}>✓ Verified</span></div>
        <div style={{ display:'flex', alignItems:'center', gap:5, marginBottom:7 }}><span style={{ color:'#c9a96e', fontSize:12 }}>★★★★★</span><span style={{ fontSize:12, color:'#888' }}>4.9</span><span style={{ fontSize:11, color:'#555' }}>(128 reviews)</span></div>
        <div style={{ fontSize:12, color:'#999', lineHeight:1.5, marginBottom:10 }}>Exclusive photos and custom videos. Fast delivery, always online 💛</div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:5 }}>
          {[['23','Age'],['165cm','Height'],['52kg','Weight'],['C (3)','Bust'],['Blonde','Hair'],['Slim','Body']].map(([v,l])=>(
            <div key={l} style={{ background:'#141414', borderRadius:10, border:'.5px solid #1e1e1e', padding:7, textAlign:'center' }}><div style={{ fontSize:11, fontWeight:500, color:'#f0f0f0' }}>{v}</div><div style={{ fontSize:8, color:'#555', marginTop:1 }}>{l}</div></div>
          ))}
        </div>
      </div>
      <div style={{ display:'flex', borderTop:'.5px solid #1e1e1e', borderBottom:'.5px solid #1e1e1e', flexShrink:0 }}>
        {[['1.2K','Subscribers'],['48','Packs'],['342','Orders']].map(([v,l],i)=>(
          <div key={l} style={{ flex:1, textAlign:'center', padding:'9px 0', borderLeft:i>0?'.5px solid #1e1e1e':'none' }}><div style={{ fontSize:13, fontWeight:500, color:'#f0f0f0' }}>{v}</div><div style={{ fontSize:9, color:'#555', marginTop:2 }}>{l}</div></div>
        ))}
      </div>
      <div style={{ display:'flex', gap:8, padding:'12px 16px', flexShrink:0 }}>
        <div style={{ flex:1, background:'#c9a96e', color:'#0a0a0a', borderRadius:50, padding:'10px 8px', fontSize:12, fontWeight:500, cursor:'pointer', textAlign:'center' }}>Order ✦</div>
        <div style={{ flex:1, background:'#141414', color:'#f0f0f0', border:'.5px solid #2a2a2a', borderRadius:50, padding:'10px 8px', fontSize:12, cursor:'pointer', textAlign:'center' }}>Subscribe 399🪙</div>
        <div style={{ width:42, height:42, background:'#141414', border:'.5px solid #2a2a2a', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', color:'#c9a96e', cursor:'pointer', flexShrink:0 }}><IconMessage/></div>
      </div>
      <div style={{ display:'flex', borderTop:'.5px solid #1e1e1e', borderBottom:'.5px solid #1e1e1e', flexShrink:0 }}>
        {(['packs','posts'] as const).map(tab=>(
          <div key={tab} onClick={()=>setActiveTab(tab)} style={{ flex:1, padding:'9px 0', textAlign:'center', fontSize:10, color:activeTab===tab?'#c9a96e':'#555', cursor:'pointer', borderBottom:`2px solid ${activeTab===tab?'#c9a96e':'transparent'}` }}>{tab==='packs'?'Packs':'Posts'}</div>
        ))}
        <div style={{ flex:1, padding:'9px 0', textAlign:'center', fontSize:10, color:'#555', cursor:'pointer', borderBottom:'2px solid transparent' }}>Market</div>
      </div>
      {activeTab==='packs' && (
        <div style={{ padding:'12px 0 40px', flexShrink:0 }}>
          <div style={{ fontSize:11, fontWeight:500, color:'#666', letterSpacing:1, textTransform:'uppercase', padding:'0 16px', marginBottom:8 }}>Free packs</div>
          <div style={{ background:'#141414', borderRadius:12, border:'.5px solid rgba(76,175,80,.2)', margin:'0 16px 8px' }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'10px 12px' }}><div><div style={{ fontSize:13, fontWeight:500, color:'#f0f0f0' }}>Preview pack</div><div style={{ fontSize:10, color:'#555', marginTop:2 }}>5 photos • Free</div></div><div style={{ fontSize:10, fontWeight:500, color:'#4caf50', background:'#0a2a0a', border:'.5px solid #1a4a1a', borderRadius:20, padding:'2px 8px' }}>FREE</div></div>
            <div style={{ display:'flex', gap:4, padding:'0 12px 8px' }}>{[...Array(5)].map((_,i)=><div key={i} style={{ width:46, height:46, background:'#1e1e1e', borderRadius:7, display:'flex', alignItems:'center', justifyContent:'center', fontSize:13 }}>📷</div>)}</div>
            <div style={{ margin:'0 12px 10px', padding:9, borderRadius:30, textAlign:'center', fontSize:11, fontWeight:500, cursor:'pointer', background:'#0a2a0a', color:'#4caf50', border:'.5px solid #1a4a1a' }}>View free pack</div>
          </div>
          <div style={{ height:.5, background:'#1e1e1e', margin:'12px 16px' }}/>
          <div style={{ fontSize:11, fontWeight:500, color:'#666', letterSpacing:1, textTransform:'uppercase', padding:'0 16px', marginBottom:8 }}>Paid packs</div>
          {[{name:'January pack',meta:'24 photos',price:'500 🪙'},{name:'Video pack',meta:'3 videos',price:'1,200 🪙'},{name:'Exclusive set',meta:'15 photos + 1 video',price:'2,000 🪙'}].map(pack=>(
            <div key={pack.name} style={{ background:'#141414', borderRadius:12, border:'.5px solid #1e1e1e', margin:'0 16px 8px' }}>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'10px 12px' }}><div><div style={{ fontSize:13, fontWeight:500, color:'#f0f0f0' }}>{pack.name}</div><div style={{ fontSize:10, color:'#555', marginTop:2 }}>{pack.meta}</div></div><div style={{ fontSize:12, fontWeight:500, color:'#c9a96e' }}>{pack.price}</div></div>
              <div style={{ display:'flex', gap:4, padding:'0 12px 8px' }}>{[...Array(3)].map((_,i)=><div key={i} style={{ width:46, height:46, background:'#1e1e1e', borderRadius:7, display:'flex', alignItems:'center', justifyContent:'center', fontSize:i===0?13:11 }}>{i===0?'📷':'🔒'}</div>)}</div>
              <div style={{ margin:'0 12px 10px', padding:9, borderRadius:30, textAlign:'center', fontSize:11, fontWeight:500, cursor:'pointer', background:'rgba(201,169,110,.1)', color:'#c9a96e', border:'.5px solid rgba(201,169,110,.27)' }}>Buy pack — {pack.price}</div>
            </div>
          ))}
        </div>
      )}
      {activeTab==='posts' && (
        <div style={{ padding:'14px 16px 40px' }}>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:4 }}>
            {[['#1a1510',''],['#12101a',''],['#0f1a14',''],['#1a100f','🔒'],['#10121a','🔒'],['#1a1218','🔒']].map(([bg,lock],i)=>(
              <div key={i} style={{ aspectRatio:'1', background:bg, borderRadius:6, display:'flex', alignItems:'center', justifyContent:'center', position:'relative', overflow:'hidden' }}>
                {lock&&<div style={{ position:'absolute', inset:0, background:'rgba(0,0,0,.7)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:20 }}>🔒</div>}
                {!lock&&<span style={{ fontSize:10, color:'#333' }}>Post</span>}
              </div>
            ))}
          </div>
          <div style={{ textAlign:'center', padding:16, fontSize:12, color:'#555' }}>Subscribe to see all posts</div>
        </div>
      )}
    </div>
  )
}
function BottomNav({ active, onChange, t }: { active:BuyerTab; onChange:(t:BuyerTab)=>void; t:typeof T['en'] }) {
  const tabs: [BuyerTab, React.ReactNode, string][] = [['feed',<IconFlame key="f"/>,t.bn_feed],['excl',<IconStar key="e"/>,t.bn_excl],['msg',<IconMessage key="m"/>,t.bn_msg],['acc',<IconUser key="a"/>,t.bn_acc]]
  return (
    <div style={{ background:'#0f0f0f', borderTop:'.5px solid #1e1e1e', display:'flex', padding:'8px 0 10px', flexShrink:0 }}>
      {tabs.map(([tab,icon,label])=>(
        <div key={tab} onClick={()=>onChange(tab)} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:3, cursor:'pointer', color:active===tab?'#c9a96e':'#444' }}>{icon}<span style={{ fontSize:9 }}>{label}</span></div>
      ))}
    </div>
  )
}

// ─── Main ─────────────────────────────────────────────────────────────────────
type Modal = 'none' | 'register' | 'login'

export default function Home() {
  const [lang,           setLang]           = useState<Lang>('en')
  const [role,           setRole]           = useState<Role>('buyer')
  const [screen,         setScreen]         = useState<Screen>('age')
  const [buyerTab,       setBuyerTab]       = useState<BuyerTab>('feed')
  const [modal,          setModal]          = useState<Modal>('none')
  const [creatorProfile, setCreatorProfile] = useState<CreatorProfile | null>(null)
  const t = T[lang]

  useEffect(() => {
    const saved = loadProfile()
    if (saved) { setCreatorProfile(saved); setScreen('creator') }
  }, [])

  const handleEnterSite = () => {
    if (role==='girl') setModal('register')
    else setScreen('buyer')
  }
  const handleRegistered = (p: CreatorProfile) => { setCreatorProfile(p); setModal('none'); setScreen('creator') }
  const handleLoggedIn   = (p: CreatorProfile) => { setCreatorProfile(p); setModal('none'); setScreen('creator') }
  const handleLogout = () => {
    if (creatorProfile) releaseUsername(creatorProfile.username)
    if (typeof window!=='undefined') localStorage.removeItem('exclusivme_creator')
    setCreatorProfile(null); setScreen('age'); setRole('buyer')
  }

  // ── CREATOR APP ──
  if (screen==='creator' && creatorProfile) {
    return <CreatorApp lang={lang} setLang={setLang} profile={creatorProfile} setProfile={p=>setCreatorProfile(p)} onLogout={handleLogout} />
  }

  // ── GIRL PROFILE (buyer side) ──
  if (screen==='profile') {
    return (
      <div style={{ background:'#0a0a0a', height:'100vh', display:'flex', justifyContent:'center', fontFamily:'-apple-system,BlinkMacSystemFont,sans-serif' }}>
        <div style={{ width:'100%', maxWidth:480, height:'100vh', overflowY:'auto' }}>
          <GirlProfileScreen onBack={()=>setScreen('buyer')} />
        </div>
      </div>
    )
  }

  // ── BUYER APP ──
  if (screen==='buyer') {
    return (
      <div style={{ background:'#0a0a0a', height:'100vh', display:'flex', justifyContent:'center', fontFamily:'-apple-system,BlinkMacSystemFont,sans-serif' }}>
        <div style={{ width:'100%', maxWidth:480, display:'flex', flexDirection:'column', height:'100vh' }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'14px 16px 10px', borderBottom:'.5px solid #1e1e1e', flexShrink:0, background:'rgba(10,10,10,.95)', backdropFilter:'blur(10px)' }}>
            <div style={{ fontSize:16, fontWeight:500, color:'#c9a96e', letterSpacing:1 }}>ExclusivMe</div>
            <div style={{ display:'flex', alignItems:'center', gap:10 }}>
              <div style={{ display:'flex', background:'#141414', borderRadius:20, overflow:'hidden', border:'.5px solid #2a2a2a' }}>
                {(['en','ru'] as Lang[]).map(l=>(
                  <button key={l} onClick={()=>setLang(l)} style={{ padding:'4px 10px', fontSize:10, color:lang===l?'#0a0a0a':'#555', cursor:'pointer', border:'none', background:lang===l?'#c9a96e':'transparent', borderRadius:20, fontFamily:'-apple-system,BlinkMacSystemFont,sans-serif' }}>{l.toUpperCase()}</button>
                ))}
              </div>
              <div style={{ display:'flex', gap:12, color:'#666' }}>
                <span style={{ cursor:'pointer' }}><IconSearch/></span>
                <div style={{ position:'relative', cursor:'pointer' }}><IconBell/><div style={{ position:'absolute', top:-2, right:-2, width:7, height:7, background:'#c9a96e', borderRadius:'50%' }}/></div>
              </div>
            </div>
          </div>
          <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden' }}>
            {buyerTab==='feed' && <FeedTab t={t} onOpenProfile={()=>setScreen('profile')} />}
            {buyerTab==='excl' && <ExclTab t={t} />}
            {buyerTab==='msg'  && <MsgTab t={t} />}
            {buyerTab==='acc'  && <AccTab t={t} />}
          </div>
          <BottomNav active={buyerTab} onChange={setBuyerTab} t={t} />
        </div>
      </div>
    )
  }

  // ── AGE GATE ──
  return (
    <div style={{ background:'#0a0a0a', minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', padding:'2rem', fontFamily:'-apple-system,BlinkMacSystemFont,sans-serif', position:'relative' }}>
      <div style={{ maxWidth:360, width:'100%', textAlign:'center' }}>
        <div style={{ fontSize:26, fontWeight:500, color:'#c9a96e', letterSpacing:3, marginBottom:6 }}>ExclusivMe</div>
        <div style={{ fontSize:10, color:'#555', letterSpacing:3, textTransform:'uppercase', marginBottom:'2rem' }}>Private Content Platform</div>

        {/* Language */}
        <div style={{ display:'flex', gap:8, marginBottom:'2rem' }}>
          {(['en','ru'] as Lang[]).map(l=>(
            <button key={l} onClick={()=>setLang(l)} style={{ flex:1, padding:8, borderRadius:20, border:`1px solid ${lang===l?'#c9a96e':'#444'}`, background:lang===l?'rgba(201,169,110,.1)':'transparent', color:lang===l?'#c9a96e':'#aaa', fontSize:12, cursor:'pointer', fontFamily:'-apple-system,BlinkMacSystemFont,sans-serif' }}>{l.toUpperCase()}</button>
          ))}
        </div>

        <div style={{ fontSize:17, color:'#fff', fontWeight:500, marginBottom:8 }}>{t.age_title}</div>
        <div style={{ fontSize:12, color:'#bbb', marginBottom:'1.5rem', lineHeight:1.6, whiteSpace:'pre-line' }}>{t.age_sub}</div>
        <div style={{ fontSize:13, color:'#888', marginBottom:10 }}>{t.age_choose}</div>

        {/* Role selector */}
        <div style={{ display:'flex', gap:8, marginBottom:14 }}>
          {([['buyer','👨',t.rb_lbl,t.rb_sub],['girl','👩',t.rg_lbl,t.rg_sub]] as [Role,string,string,string][]).map(([r,emoji,label,sub])=>(
            <button key={r} onClick={()=>setRole(r)} style={{ flex:1, background:'#141414', border:`1px solid ${role===r?'#c9a96e':'#2a2a2a'}`, borderRadius:14, padding:'14px 8px', cursor:'pointer', textAlign:'center', fontFamily:'-apple-system,BlinkMacSystemFont,sans-serif' }}>
              <div style={{ fontSize:22, marginBottom:6 }}>{emoji}</div>
              <div style={{ fontSize:13, fontWeight:500, color:'#f0f0f0' }}>{label}</div>
              <div style={{ fontSize:10, color:'#555', marginTop:3 }}>{sub}</div>
            </button>
          ))}
        </div>

        <button onClick={handleEnterSite} style={{ width:'100%', background:'#c9a96e', color:'#0a0a0a', border:'none', borderRadius:50, padding:14, fontSize:15, fontWeight:500, cursor:'pointer', marginBottom:10, fontFamily:'-apple-system,BlinkMacSystemFont,sans-serif' }}>{t.age_yes}</button>
        <button style={{ width:'100%', background:'transparent', color:'#fff', border:'2px solid #fff', borderRadius:50, padding:12, fontSize:14, cursor:'pointer', fontFamily:'-apple-system,BlinkMacSystemFont,sans-serif', marginBottom:16 }}>{t.age_no}</button>

        {/* Log in link */}
        <div style={{ fontSize:12, color:'#555' }}>
          {t.age_login}{' '}
          <span onClick={()=>setModal('login')} style={{ color:'#c9a96e', cursor:'pointer', textDecoration:'underline', fontWeight:500 }}>{t.age_login_btn}</span>
        </div>

        <div style={{ fontSize:10, color:'#666', marginTop:'1rem', lineHeight:1.6 }}>By entering you agree to our Terms and Privacy Policy</div>
      </div>

      {/* Modals */}
      {modal==='register' && (
        <RegisterModal lang={lang} onSuccess={handleRegistered} onClose={()=>setModal('none')} />
      )}
      {modal==='login' && (
        <LoginModal lang={lang} onSuccess={handleLoggedIn} onClose={()=>setModal('none')} onRegister={()=>setModal('register')} />
      )}
    </div>
  )
}

// ─── Type helpers ─────────────────────────────────────────────────────────────
declare const cr_stats_subs: string
declare const cr_stats_earn: string
