// Liora for You (B2C) — v2
// Структура DIKIDI, но другие компоненты и тёплая палитра
// Кремовый + бутылочно-зелёный + терракота

const C_COLORS = {
  cream: '#F4EFE6',
  creamSoft: '#EAE3D5',
  paper: '#FBF8F2',
  ink: '#1F2A24',          // тёмный бутылочный вместо чёрного
  inkSoft: '#3A4540',
  forest: '#2D4A3E',       // основной акцент — бутылочно-зелёный
  forestDeep: '#1E332A',
  terra: '#B86A4B',        // терракота — вторичный акцент
  terraSoft: '#E8C9B5',
  sand: '#D9CBB0',
  mute: '#8A8578',
  line: 'rgba(31,42,36,0.12)',
};

const C_FONT_SANS = '"TT Norms", "Inter Tight", "Inter", -apple-system, sans-serif';
const C_FONT_SERIF = '"Cormorant Garamond", "Playfair Display", Georgia, serif';

const C_IMG = {
  hair: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=800&q=80',
  lash: 'https://images.unsplash.com/photo-1583241800698-9c3e14a38acb?w=800&q=80',
  fitness: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&q=80',
  nails: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=800&q=80',
  brows: 'https://images.unsplash.com/photo-1596704017254-9b121068fb31?w=800&q=80',
  barber: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=800&q=80',
  face: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&q=80',
  dental: 'https://images.unsplash.com/photo-1606811971618-4486d14f3f99?w=800&q=80',
  spa: 'https://images.unsplash.com/photo-1600334129128-685c5582fd35?w=800&q=80',
  m1: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80',
  m2: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&q=80',
  m3: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80',
  m5: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=400&q=80',
  m6: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=400&q=80',
};

// ---- small atoms ----
function C_Logo({ color = C_COLORS.ink }) {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, fontFamily: C_FONT_SERIF, fontSize: 26, fontWeight: 500, letterSpacing: -0.5, color }}>
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <circle cx="11" cy="11" r="10" stroke={color} strokeWidth="1"/>
        <path d="M6 14 Q11 4, 16 14" stroke={color} strokeWidth="1" fill="none"/>
      </svg>
      Liora
    </div>
  );
}

// ---- DESKTOP ----
function LioraForYouDesktop() {
  return (
    <div style={{ fontFamily: C_FONT_SANS, color: C_COLORS.ink, background: C_COLORS.cream, width: '100%', minHeight: '100%' }}>

      {/* TOP BAR */}
      <nav style={{
        padding: '22px 48px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        borderBottom: `1px solid ${C_COLORS.line}`,
      }}>
        <C_Logo />
        <div style={{ display: 'flex', alignItems: 'center', gap: 28, fontSize: 13, color: C_COLORS.inkSoft }}>
          <a>Подборки</a><a>Каталог</a><a>На карте</a><a>Журнал</a>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 13 }}>
          <span style={{ color: C_COLORS.inkSoft, borderBottom: `1px dashed ${C_COLORS.mute}`, paddingBottom: 1 }}>Усть-Каменогорск ▾</span>
          <span style={{ color: C_COLORS.inkSoft }}>Войти</span>
          <button style={{
            background: C_COLORS.forest, color: C_COLORS.paper, border: 'none',
            padding: '10px 18px', borderRadius: 6, fontSize: 13, fontFamily: 'inherit', cursor: 'pointer',
          }}>Для бизнеса →</button>
        </div>
      </nav>

      {/* HERO — editorial, не плотный hero */}
      <section style={{ padding: '72px 48px 40px', position: 'relative' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 48, alignItems: 'end' }}>
          <div>
            <div style={{ fontSize: 12, letterSpacing: 2, textTransform: 'uppercase', color: C_COLORS.mute, marginBottom: 20 }}>
              — ваша запись, без звонков
            </div>
            <h1 style={{
              fontFamily: C_FONT_SERIF, fontSize: 88, fontWeight: 400, letterSpacing: -2.5, lineHeight: 0.98, margin: 0,
            }}>
              Мастера и салоны<br />
              <em style={{ color: C_COLORS.forest, fontStyle: 'italic' }}>вашего города</em>
            </h1>
            <p style={{ fontSize: 16, lineHeight: 1.6, color: C_COLORS.inkSoft, marginTop: 24, maxWidth: 440 }}>
              Записывайтесь к проверенным мастерам в несколько кликов.
              Рейтинг, живые работы и реальные отзывы — в одном месте.
            </p>
          </div>
          {/* Search card — не в hero-поле, а отдельным объектом */}
          <div style={{
            background: C_COLORS.forest, color: C_COLORS.paper, borderRadius: 14,
            padding: 24, boxShadow: `0 30px 60px -20px ${C_COLORS.forestDeep}55`,
          }}>
            <div style={{ fontSize: 12, letterSpacing: 1.5, textTransform: 'uppercase', opacity: 0.65, marginBottom: 14 }}>
              Найти запись
            </div>
            <div style={{ display: 'grid', gap: 10 }}>
              <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 8, padding: '14px 16px', fontSize: 14, color: C_COLORS.paper }}>
                <div style={{ fontSize: 10, opacity: 0.6, marginBottom: 4, letterSpacing: 0.5 }}>УСЛУГА ИЛИ МАСТЕР</div>
                стрижка, окрашивание, маникюр…
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 8, padding: '14px 16px', fontSize: 14 }}>
                  <div style={{ fontSize: 10, opacity: 0.6, marginBottom: 4, letterSpacing: 0.5 }}>КОГДА</div>
                  Сегодня вечером
                </div>
                <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 8, padding: '14px 16px', fontSize: 14 }}>
                  <div style={{ fontSize: 10, opacity: 0.6, marginBottom: 4, letterSpacing: 0.5 }}>ГДЕ</div>
                  Рядом со мной
                </div>
              </div>
              <button style={{
                background: C_COLORS.terra, color: C_COLORS.paper, border: 'none',
                padding: '14px', borderRadius: 8, fontSize: 14, fontWeight: 500, fontFamily: 'inherit', cursor: 'pointer', marginTop: 4,
              }}>Показать 142 варианта →</button>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIES — bento / asymmetric (не равные плитки) */}
      <section style={{ padding: '40px 48px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 24 }}>
          <h2 style={{ fontFamily: C_FONT_SERIF, fontSize: 36, fontWeight: 400, letterSpacing: -0.8, margin: 0 }}>
            Категории
          </h2>
          <span style={{ fontSize: 13, color: C_COLORS.mute }}>10 направлений · 840+ мест</span>
        </div>
        {/* bento grid */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gridAutoRows: 160, gap: 12,
        }}>
          {/* Big feature — Красота */}
          <div style={{
            gridColumn: 'span 3', gridRow: 'span 2', borderRadius: 16, overflow: 'hidden', position: 'relative',
            backgroundImage: `url(${C_IMG.hair})`, backgroundSize: 'cover', backgroundPosition: 'center',
          }}>
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(160deg, transparent 40%, rgba(31,42,36,0.7))' }} />
            <div style={{ position: 'absolute', left: 20, bottom: 20, color: C_COLORS.paper }}>
              <div style={{ fontFamily: C_FONT_SERIF, fontSize: 36, fontWeight: 400, letterSpacing: -0.5 }}>Красота</div>
              <div style={{ fontSize: 13, opacity: 0.8, marginTop: 4 }}>Парикмахерские, бровисты, визажисты · 312 мест</div>
            </div>
            <div style={{ position: 'absolute', right: 20, top: 20, background: C_COLORS.paper, color: C_COLORS.ink, fontSize: 11, fontWeight: 500, padding: '5px 10px', borderRadius: 999 }}>
              ⭐ Популярно
            </div>
          </div>

          {/* Small tiles */}
          {[
            { n: 'Ногти', c: 186, bg: C_COLORS.terraSoft, img: C_IMG.nails },
            { n: 'Ресницы', c: 94, bg: C_COLORS.creamSoft, img: C_IMG.lash },
          ].map((c, i) => (
            <div key={i} style={{
              gridColumn: 'span 3', background: c.bg, borderRadius: 16, overflow: 'hidden', position: 'relative', display: 'flex',
            }}>
              <div style={{ padding: 20, flex: 1 }}>
                <div style={{ fontFamily: C_FONT_SERIF, fontSize: 26, fontWeight: 400 }}>{c.n}</div>
                <div style={{ fontSize: 12, color: C_COLORS.inkSoft, marginTop: 4 }}>{c.c} мест</div>
              </div>
              <div style={{ width: 130, backgroundImage: `url(${c.img})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
            </div>
          ))}

          {/* row 3 — 6 маленьких */}
          {[
            { n: 'Брови', c: 72, img: C_IMG.brows },
            { n: 'Барбер', c: 58, img: C_IMG.barber },
            { n: 'Лицо', c: 104, img: C_IMG.face },
            { n: 'Стомато-\nлогия', c: 41, img: C_IMG.dental },
            { n: 'Фитнес', c: 68, img: C_IMG.fitness },
            { n: 'Спа', c: 29, img: C_IMG.spa },
          ].map((c, i) => (
            <div key={i} style={{
              gridColumn: 'span 1', background: C_COLORS.paper, borderRadius: 14, overflow: 'hidden',
              padding: 14, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', cursor: 'pointer',
              border: `1px solid ${C_COLORS.line}`,
            }}>
              <div style={{
                width: 44, height: 44, borderRadius: 22, backgroundImage: `url(${c.img})`, backgroundSize: 'cover', backgroundPosition: 'center',
              }} />
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, whiteSpace: 'pre-line', lineHeight: 1.2 }}>{c.n}</div>
                <div style={{ fontSize: 11, color: C_COLORS.mute, marginTop: 2 }}>{c.c} мест</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* EDITORIAL FEATURE — премиум как журнальный разворот */}
      <section style={{ padding: '64px 48px 40px' }}>
        <div style={{
          background: C_COLORS.forest, color: C_COLORS.paper, borderRadius: 20, overflow: 'hidden',
          display: 'grid', gridTemplateColumns: '1.1fr 1fr',
        }}>
          <div style={{ padding: '56px 48px' }}>
            <div style={{
              display: 'inline-block', fontSize: 11, letterSpacing: 2, textTransform: 'uppercase',
              padding: '4px 10px', border: `1px solid rgba(251,248,242,0.3)`, borderRadius: 999, marginBottom: 24,
            }}>
              Премиум · март
            </div>
            <h2 style={{
              fontFamily: C_FONT_SERIF, fontSize: 52, fontWeight: 400, letterSpacing: -1.2, lineHeight: 1.05, margin: '0 0 24px',
            }}>
              «Клиенты возвращаются<br />не за услугой —<br /><em style={{ color: C_COLORS.terraSoft }}>за чувством»</em>
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 32 }}>
              <div style={{ width: 48, height: 48, borderRadius: 24, backgroundImage: `url(${C_IMG.m1})`, backgroundSize: 'cover' }} />
              <div>
                <div style={{ fontSize: 14, fontWeight: 500 }}>Анна Соколова</div>
                <div style={{ fontSize: 12, opacity: 0.7 }}>Топ-колорист · студия «Орхидея»</div>
              </div>
            </div>
            {/* three appointment slots */}
            <div style={{ borderTop: `1px solid rgba(251,248,242,0.2)`, paddingTop: 20 }}>
              <div style={{ fontSize: 12, opacity: 0.65, marginBottom: 12 }}>Свободные окна на неделе</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                {['Ср · 14:30', 'Чт · 11:00', 'Пт · 18:00'].map((s) => (
                  <button key={s} style={{
                    background: 'rgba(251,248,242,0.1)', color: C_COLORS.paper,
                    border: `1px solid rgba(251,248,242,0.2)`, padding: '10px', borderRadius: 8,
                    fontSize: 12, fontFamily: 'inherit', cursor: 'pointer',
                  }}>{s}</button>
                ))}
              </div>
            </div>
          </div>
          <div style={{
            backgroundImage: `url(${C_IMG.m1})`, backgroundSize: 'cover', backgroundPosition: 'center',
            minHeight: 500,
          }} />
        </div>
      </section>

      {/* CATALOG — editorial list (не сетка карточек) */}
      <section style={{ padding: '40px 48px 64px' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 24 }}>
          <h2 style={{ fontFamily: C_FONT_SERIF, fontSize: 36, fontWeight: 400, letterSpacing: -0.8, margin: 0 }}>
            Журнал мастеров
          </h2>
          <div style={{ display: 'flex', gap: 8, fontSize: 12 }}>
            {['Все', 'Красота', 'Ногти', 'Ресницы', 'Лицо'].map((t, i) => (
              <button key={t} style={{
                padding: '6px 14px', borderRadius: 999,
                background: i === 0 ? C_COLORS.ink : 'transparent',
                color: i === 0 ? C_COLORS.paper : C_COLORS.inkSoft,
                border: i === 0 ? 'none' : `1px solid ${C_COLORS.line}`,
                fontFamily: 'inherit', cursor: 'pointer',
              }}>{t}</button>
            ))}
          </div>
        </div>

        {/* Table-like list, not card grid */}
        <div style={{ background: C_COLORS.paper, borderRadius: 16, border: `1px solid ${C_COLORS.line}`, overflow: 'hidden' }}>
          {[
            { n: 1, name: 'EYELASHES STUDIO', spec: 'Ресницы · Серикбаева 1/6', r: 5.0, rev: 20, img: C_IMG.lash, awd: null },
            { n: 2, name: 'Евгения Козачук', spec: 'Парикмахер-стилист · К.Кайсенова 82', r: 5.0, rev: 48, img: C_IMG.m1, awd: null },
            { n: 3, name: 'Assel Nails Studio', spec: 'Ногтевой сервис · Ауэзов 49а', r: 5.0, rev: 316, img: C_IMG.nails, awd: 'Awards 25' },
            { n: 4, name: 'Blinova Nails', spec: 'Ногтевой сервис · Шакарима 183', r: 5.0, rev: 71, img: C_IMG.m3, awd: null },
            { n: 5, name: 'Светлана Арикова', spec: 'Ногти, брови · Горького 50', r: 5.0, rev: 106, img: C_IMG.m5, awd: null },
            { n: 6, name: 'Ксения Вайцель', spec: 'Ногтевой сервис · К.Либкнехта 40/1', r: 5.0, rev: 40, img: C_IMG.m6, awd: null },
          ].map((r, i, arr) => (
            <div key={r.n} style={{
              display: 'grid', gridTemplateColumns: '40px 60px 1.5fr 1fr 120px 140px',
              alignItems: 'center', gap: 16, padding: '18px 24px',
              borderBottom: i < arr.length - 1 ? `1px solid ${C_COLORS.line}` : 'none',
              cursor: 'pointer',
            }}>
              <div style={{ fontFamily: C_FONT_SERIF, fontSize: 20, fontWeight: 400, color: C_COLORS.mute }}>
                {String(r.n).padStart(2, '0')}
              </div>
              <div style={{ width: 48, height: 48, borderRadius: 24, backgroundImage: `url(${r.img})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
              <div>
                <div style={{ fontSize: 15, fontWeight: 600, letterSpacing: -0.2 }}>{r.name}</div>
                <div style={{ fontSize: 12, color: C_COLORS.mute, marginTop: 3 }}>{r.spec}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {r.awd && <span style={{
                  fontSize: 10, padding: '3px 9px', background: C_COLORS.terraSoft, borderRadius: 999,
                  fontWeight: 600, color: C_COLORS.ink, letterSpacing: 0.3,
                }}>{r.awd}</span>}
              </div>
              <div style={{ fontSize: 13, color: C_COLORS.inkSoft }}>
                <span style={{ color: C_COLORS.terra }}>★</span> {r.r.toFixed(1)}
                <span style={{ color: C_COLORS.mute }}> · {r.rev} отзывов</span>
              </div>
              <button style={{
                background: C_COLORS.ink, color: C_COLORS.paper, border: 'none',
                padding: '9px 14px', borderRadius: 6, fontSize: 12, fontFamily: 'inherit', cursor: 'pointer',
              }}>Записаться →</button>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 28 }}>
          <button style={{
            background: 'transparent', color: C_COLORS.ink,
            border: `1px solid ${C_COLORS.ink}`, padding: '14px 36px', borderRadius: 999,
            fontSize: 14, fontFamily: 'inherit', cursor: 'pointer',
          }}>Показать ещё 834</button>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{
        padding: '48px', background: C_COLORS.forestDeep, color: C_COLORS.paper,
        display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 32,
      }}>
        <div>
          <C_Logo color={C_COLORS.paper} />
          <p style={{ fontSize: 13, opacity: 0.7, marginTop: 16, lineHeight: 1.6, maxWidth: 280 }}>
            Онлайн-запись к мастерам и в салоны. Без звонков и ожиданий.
          </p>
        </div>
        {[
          { t: 'Разделы', l: ['Подборки', 'Каталог', 'Журнал', 'На карте'] },
          { t: 'Компания', l: ['О нас', 'Для бизнеса', 'Карьера', 'Контакты'] },
          { t: 'Помощь', l: ['FAQ', 'Поддержка', 'Условия', 'Политика'] },
        ].map((col) => (
          <div key={col.t}>
            <div style={{ fontSize: 11, letterSpacing: 1.5, textTransform: 'uppercase', opacity: 0.55, marginBottom: 14 }}>{col.t}</div>
            {col.l.map((l) => <div key={l} style={{ fontSize: 13, opacity: 0.85, padding: '4px 0' }}>{l}</div>)}
          </div>
        ))}
      </footer>
    </div>
  );
}

// ---- MOBILE ----
function LioraForYouMobile() {
  return (
    <div style={{ fontFamily: C_FONT_SANS, color: C_COLORS.ink, background: C_COLORS.cream, width: '100%', minHeight: '100%' }}>
      <nav style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1px solid ${C_COLORS.line}` }}>
        <C_Logo />
        <div style={{ width: 34, height: 34, borderRadius: 8, border: `1px solid ${C_COLORS.line}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke={C_COLORS.ink} strokeWidth="1.5"><path d="M2 4h10M2 7h10M2 10h10"/></svg>
        </div>
      </nav>

      <section style={{ padding: '28px 20px 24px' }}>
        <div style={{ fontSize: 11, letterSpacing: 1.5, textTransform: 'uppercase', color: C_COLORS.mute, marginBottom: 14 }}>
          — ваша запись, без звонков
        </div>
        <h1 style={{ fontFamily: C_FONT_SERIF, fontSize: 44, fontWeight: 400, letterSpacing: -1.2, lineHeight: 1, margin: 0 }}>
          Мастера<br /><em style={{ color: C_COLORS.forest }}>вашего города</em>
        </h1>

        <div style={{
          marginTop: 24, background: C_COLORS.forest, color: C_COLORS.paper, borderRadius: 12, padding: 16,
        }}>
          <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 8, padding: '12px 14px', fontSize: 13, marginBottom: 8 }}>
            <div style={{ fontSize: 9, opacity: 0.6, letterSpacing: 0.5, marginBottom: 3 }}>УСЛУГА ИЛИ МАСТЕР</div>
            стрижка, маникюр…
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 8, padding: '12px 14px', fontSize: 12 }}>
              <div style={{ fontSize: 9, opacity: 0.6, marginBottom: 3 }}>КОГДА</div>
              Сегодня
            </div>
            <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 8, padding: '12px 14px', fontSize: 12 }}>
              <div style={{ fontSize: 9, opacity: 0.6, marginBottom: 3 }}>ГДЕ</div>
              Рядом
            </div>
          </div>
          <button style={{
            width: '100%', background: C_COLORS.terra, color: C_COLORS.paper, border: 'none',
            padding: '12px', borderRadius: 8, fontSize: 13, fontFamily: 'inherit', marginTop: 10,
          }}>142 варианта →</button>
        </div>
      </section>

      {/* Bento mobile */}
      <section style={{ padding: '8px 20px 16px' }}>
        <h2 style={{ fontFamily: C_FONT_SERIF, fontSize: 24, fontWeight: 400, letterSpacing: -0.4, margin: '12px 0 14px' }}>
          Категории
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gridAutoRows: 120, gap: 10 }}>
          <div style={{
            gridColumn: 'span 2', gridRow: 'span 2', borderRadius: 14, overflow: 'hidden', position: 'relative',
            backgroundImage: `url(${C_IMG.hair})`, backgroundSize: 'cover',
          }}>
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(160deg, transparent 40%, rgba(31,42,36,0.7))' }} />
            <div style={{ position: 'absolute', left: 16, bottom: 14, color: C_COLORS.paper }}>
              <div style={{ fontFamily: C_FONT_SERIF, fontSize: 26 }}>Красота</div>
              <div style={{ fontSize: 11, opacity: 0.8 }}>312 мест</div>
            </div>
          </div>
          {[
            { n: 'Ногти', c: 186, bg: C_COLORS.terraSoft, img: C_IMG.nails },
            { n: 'Ресницы', c: 94, bg: C_COLORS.creamSoft, img: C_IMG.lash },
            { n: 'Брови', c: 72, bg: C_COLORS.paper, img: C_IMG.brows },
            { n: 'Барбер', c: 58, bg: C_COLORS.paper, img: C_IMG.barber },
          ].map((c, i) => (
            <div key={i} style={{
              background: c.bg, borderRadius: 12, padding: 12, position: 'relative', overflow: 'hidden',
              display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
              border: `1px solid ${C_COLORS.line}`,
            }}>
              <div style={{ width: 36, height: 36, borderRadius: 18, backgroundImage: `url(${c.img})`, backgroundSize: 'cover' }} />
              <div>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{c.n}</div>
                <div style={{ fontSize: 10, color: C_COLORS.mute }}>{c.c} мест</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Premium feature */}
      <section style={{ padding: '16px 20px 20px' }}>
        <div style={{ background: C_COLORS.forest, color: C_COLORS.paper, borderRadius: 16, padding: 20 }}>
          <div style={{
            display: 'inline-block', fontSize: 10, letterSpacing: 1.5, textTransform: 'uppercase',
            padding: '3px 8px', border: `1px solid rgba(251,248,242,0.3)`, borderRadius: 999, marginBottom: 16,
          }}>Премиум</div>
          <h3 style={{ fontFamily: C_FONT_SERIF, fontSize: 26, fontWeight: 400, letterSpacing: -0.6, lineHeight: 1.1, margin: 0 }}>
            «Клиенты возвращаются<br />за <em style={{ color: C_COLORS.terraSoft }}>чувством</em>»
          </h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 16 }}>
            <div style={{ width: 40, height: 40, borderRadius: 20, backgroundImage: `url(${C_IMG.m1})`, backgroundSize: 'cover' }} />
            <div>
              <div style={{ fontSize: 13, fontWeight: 500 }}>Анна Соколова</div>
              <div style={{ fontSize: 11, opacity: 0.7 }}>Студия «Орхидея»</div>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6, marginTop: 16 }}>
            {['Ср 14:30', 'Чт 11:00', 'Пт 18:00'].map((s) => (
              <div key={s} style={{
                background: 'rgba(251,248,242,0.1)', border: `1px solid rgba(251,248,242,0.2)`,
                padding: '8px', borderRadius: 6, fontSize: 11, textAlign: 'center',
              }}>{s}</div>
            ))}
          </div>
        </div>
      </section>

      {/* Catalog list */}
      <section style={{ padding: '16px 20px 40px' }}>
        <h2 style={{ fontFamily: C_FONT_SERIF, fontSize: 24, fontWeight: 400, letterSpacing: -0.4, margin: '12px 0 14px' }}>
          Журнал мастеров
        </h2>
        <div style={{ background: C_COLORS.paper, borderRadius: 14, border: `1px solid ${C_COLORS.line}`, overflow: 'hidden' }}>
          {[
            { n: 1, name: 'Assel Nails', spec: 'Ногти · Ауэзов 49а', r: 5.0, rev: 316, img: C_IMG.nails },
            { n: 2, name: 'Евгения Козачук', spec: 'Стилист · К.Кайсенова', r: 5.0, rev: 48, img: C_IMG.m1 },
            { n: 3, name: 'Blinova Nails', spec: 'Ногти · Шакарима 183', r: 5.0, rev: 71, img: C_IMG.m3 },
            { n: 4, name: 'Светлана Арикова', spec: 'Ногти · Горького 50', r: 5.0, rev: 106, img: C_IMG.m5 },
          ].map((r, i, arr) => (
            <div key={r.n} style={{
              display: 'grid', gridTemplateColumns: '28px 40px 1fr auto', alignItems: 'center', gap: 10,
              padding: '14px 16px', borderBottom: i < arr.length - 1 ? `1px solid ${C_COLORS.line}` : 'none',
            }}>
              <div style={{ fontFamily: C_FONT_SERIF, fontSize: 16, color: C_COLORS.mute }}>0{r.n}</div>
              <div style={{ width: 40, height: 40, borderRadius: 20, backgroundImage: `url(${r.img})`, backgroundSize: 'cover' }} />
              <div>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{r.name}</div>
                <div style={{ fontSize: 11, color: C_COLORS.mute }}>{r.spec}</div>
                <div style={{ fontSize: 11, color: C_COLORS.inkSoft, marginTop: 2 }}>
                  <span style={{ color: C_COLORS.terra }}>★</span> {r.r.toFixed(1)} · {r.rev}
                </div>
              </div>
              <button style={{
                background: C_COLORS.ink, color: C_COLORS.paper, border: 'none',
                padding: '7px 10px', borderRadius: 6, fontSize: 11, fontFamily: 'inherit',
              }}>→</button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

Object.assign(window, { LioraForYouDesktop, LioraForYouMobile });
