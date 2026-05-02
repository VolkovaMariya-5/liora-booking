// Variant A — Editorial Spa
// Warm cream palette, large serif editorial typography, real photography

const A_COLORS = {
  bg: '#FAFAF7',
  bgAlt: '#F0EEE8',
  ink: '#0A0A0A',
  inkSoft: '#3D3D3D',
  mute: '#8A8680',
  accent: '#0A0A0A',
  accentDark: '#0A0A0A',
  line: 'rgba(10,10,10,0.10)',
  card: '#FFFFFF',
};

const A_FONTS = {
  serif: '"Cormorant Garamond", "Playfair Display", Georgia, serif',
  sans: '"TT Norms", "Inter Tight", "Inter", -apple-system, sans-serif',
};

// Inject fonts once
if (typeof document !== 'undefined' && !document.getElementById('variant-a-fonts')) {
  const l = document.createElement('link');
  l.id = 'variant-a-fonts';
  l.rel = 'stylesheet';
  l.href = 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400&family=Inter+Tight:wght@400;500;600&display=swap';
  document.head.appendChild(l);
}

// Real salon/spa photos from Unsplash
const A_PHOTOS = {
  hero: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1200&q=80',
  masseuse: 'https://images.unsplash.com/photo-1600334129128-685c5582fd35?w=800&q=80',
  nails: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=800&q=80',
  hair: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=800&q=80',
  face: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&q=80',
  spa: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&q=80',
  lash: 'https://images.unsplash.com/photo-1583241800698-9c3e14a38acb?w=800&q=80',
  makeup: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80',
  fitness: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&q=80',
  master1: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&q=80',
  master2: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80',
  master3: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80',
};

// ─────────── DESKTOP ───────────
function VariantADesktop() {
  const css = {
    root: {
      fontFamily: A_FONTS.sans,
      color: A_COLORS.ink,
      background: A_COLORS.bg,
      width: '100%',
      minHeight: '100%',
      overflow: 'hidden',
    },
  };

  return (
    <div style={css.root}>
      {/* NAV */}
      <nav style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '28px 64px', borderBottom: `1px solid ${A_COLORS.line}`,
      }}>
        <div style={{ fontFamily: A_FONTS.serif, fontSize: 28, fontStyle: 'italic', fontWeight: 500, letterSpacing: -0.5 }}>
          Liora
        </div>
        <div style={{ display: 'flex', gap: 40, fontSize: 14, fontWeight: 500, color: A_COLORS.inkSoft }}>
          <a>Мастера</a><a>Услуги</a><a>Журнал</a><a>Для бизнеса</a>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 14 }}>
          <span style={{ color: A_COLORS.inkSoft }}>Войти</span>
          <button style={{
            background: A_COLORS.ink, color: A_COLORS.bg, border: 'none',
            padding: '10px 18px', borderRadius: 999, fontSize: 13, fontWeight: 500,
            fontFamily: 'inherit', cursor: 'pointer',
          }}>Записаться</button>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ padding: '48px 64px 64px', position: 'relative' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.05fr 1fr', gap: 56, alignItems: 'center' }}>
          <div>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              fontSize: 11, letterSpacing: 2, textTransform: 'uppercase',
              color: A_COLORS.mute, marginBottom: 20,
            }}>
              <span style={{ width: 20, height: 1, background: A_COLORS.mute }} />
              Запись без звонков
            </div>
            <h1 style={{
              fontFamily: A_FONTS.serif,
              fontSize: 64, lineHeight: 1, fontWeight: 400,
              letterSpacing: -1.5, margin: 0, color: A_COLORS.ink,
            }}>
              Красота, <em style={{ fontStyle: 'italic', fontWeight: 400 }}>созданная</em> для вас
            </h1>
            <p style={{
              fontSize: 15, lineHeight: 1.55, color: A_COLORS.inkSoft,
              maxWidth: 440, margin: '20px 0 28px',
            }}>
              Лучшие мастера города, проверенные салоны и живое расписание.
              Запись за минуту — без звонков.
            </p>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <button style={{
                background: A_COLORS.ink, color: A_COLORS.bg, border: 'none',
                padding: '14px 22px', borderRadius: 999, fontSize: 14, fontWeight: 500,
                fontFamily: 'inherit', cursor: 'pointer',
              }}>Найти мастера →</button>
              <button style={{
                background: 'transparent', color: A_COLORS.ink,
                border: `1px solid ${A_COLORS.ink}`,
                padding: '14px 22px', borderRadius: 999, fontSize: 14, fontWeight: 500,
                fontFamily: 'inherit', cursor: 'pointer',
              }}>Я — владелец салона</button>
            </div>

            <div style={{ display: 'flex', gap: 32, marginTop: 36, paddingTop: 20, borderTop: `1px solid ${A_COLORS.line}` }}>
              <div>
                <div style={{ fontFamily: A_FONTS.serif, fontSize: 28, fontWeight: 400, letterSpacing: -0.5 }}>2 400+</div>
                <div style={{ fontSize: 11, letterSpacing: 1.2, textTransform: 'uppercase', color: A_COLORS.mute, marginTop: 2 }}>Мастеров</div>
              </div>
              <div>
                <div style={{ fontFamily: A_FONTS.serif, fontSize: 28, fontWeight: 400, letterSpacing: -0.5 }}>180</div>
                <div style={{ fontSize: 11, letterSpacing: 1.2, textTransform: 'uppercase', color: A_COLORS.mute, marginTop: 2 }}>Салонов</div>
              </div>
              <div>
                <div style={{ fontFamily: A_FONTS.serif, fontSize: 28, fontWeight: 400, letterSpacing: -0.5 }}>4,9</div>
                <div style={{ fontSize: 11, letterSpacing: 1.2, textTransform: 'uppercase', color: A_COLORS.mute, marginTop: 2 }}>Рейтинг</div>
              </div>
            </div>
          </div>

          {/* Hero photo collage */}
          <div style={{ position: 'relative', height: 460 }}>
            <div style={{
              position: 'absolute', top: 0, right: 0, width: '72%', height: '78%',
              backgroundImage: `url(${A_PHOTOS.hero})`,
              backgroundSize: 'cover', backgroundPosition: 'center',
            }} />
            <div style={{
              position: 'absolute', bottom: 0, left: 0, width: '52%', height: '48%',
              backgroundImage: `url(${A_PHOTOS.face})`,
              backgroundSize: 'cover', backgroundPosition: 'center',
              border: `8px solid ${A_COLORS.bg}`,
            }} />
            <div style={{
              position: 'absolute', bottom: 24, right: 24,
              background: A_COLORS.bg, padding: '16px 20px',
              maxWidth: 220,
            }}>
              <div style={{ fontSize: 11, letterSpacing: 1.5, textTransform: 'uppercase', color: A_COLORS.mute, marginBottom: 6 }}>
                Сегодня, 15:30
              </div>
              <div style={{ fontFamily: A_FONTS.serif, fontSize: 20, fontStyle: 'italic', lineHeight: 1.2 }}>
                Анна · Маникюр
              </div>
              <div style={{ fontSize: 13, color: A_COLORS.inkSoft, marginTop: 4 }}>
                Studio Sezon, Арбат
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ padding: '64px 64px', background: A_COLORS.bgAlt }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 40 }}>
          <h2 style={{
            fontFamily: A_FONTS.serif, fontSize: 40, fontWeight: 400,
            letterSpacing: -1, lineHeight: 1.05, margin: 0,
          }}>
            Три шага до <em style={{ fontStyle: 'italic' }}>вашего</em> ритуала
          </h2>
          <div style={{ fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', color: A_COLORS.mute }}>
            Как это работает
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 32 }}>
          {[
            { n: '01', t: 'Выберите мастера', d: 'Портфолио, отзывы и цены. Все специалисты проверены Liora.' },
            { n: '02', t: 'Выберите время', d: 'Живое расписание в реальном времени. Без звонков.' },
            { n: '03', t: 'Приходите', d: 'Напомним за день и за час. Перенос — в один клик.' },
          ].map((s) => (
            <div key={s.n} style={{ borderTop: `1px solid ${A_COLORS.ink}`, paddingTop: 16 }}>
              <div style={{ fontFamily: A_FONTS.serif, fontSize: 13, fontStyle: 'italic', color: A_COLORS.accent, marginBottom: 16 }}>
                {s.n}
              </div>
              <h3 style={{ fontFamily: A_FONTS.serif, fontSize: 24, fontWeight: 400, letterSpacing: -0.3, margin: '0 0 8px' }}>
                {s.t}
              </h3>
              <p style={{ fontSize: 14, lineHeight: 1.55, color: A_COLORS.inkSoft, margin: 0 }}>
                {s.d}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CATEGORIES */}
      <section style={{ padding: '72px 64px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 32 }}>
          <div>
            <div style={{ fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', color: A_COLORS.mute, marginBottom: 12 }}>
              Категории
            </div>
            <h2 style={{
              fontFamily: A_FONTS.serif, fontSize: 40, fontWeight: 400,
              letterSpacing: -1, lineHeight: 1, margin: 0,
            }}>
              Всё для <em style={{ fontStyle: 'italic' }}>красоты</em> и заботы
            </h2>
          </div>
          <a style={{ fontSize: 14, color: A_COLORS.ink, borderBottom: `1px solid ${A_COLORS.ink}`, paddingBottom: 2 }}>
            Смотреть все →
          </a>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
          {[
            { n: 'Барбершоп', c: '340 мастеров', img: A_PHOTOS.hair, big: true },
            { n: 'Маникюр', c: '820 мастеров', img: A_PHOTOS.nails },
            { n: 'Косметология', c: '410 мастеров', img: A_PHOTOS.face },
            { n: 'Массаж', c: '290 мастеров', img: A_PHOTOS.masseuse },
            { n: 'Ресницы & брови', c: '520 мастеров', img: A_PHOTOS.lash },
            { n: 'Салоны красоты', c: '180 студий', img: A_PHOTOS.spa },
            { n: 'Макияж', c: '140 мастеров', img: A_PHOTOS.makeup },
            { n: 'Фитнес & йога', c: '96 студий', img: A_PHOTOS.fitness },
          ].map((cat, i) => (
            <div key={i} style={{
              position: 'relative', height: 320,
              backgroundImage: `url(${cat.img})`, backgroundSize: 'cover', backgroundPosition: 'center',
              cursor: 'pointer', overflow: 'hidden',
            }}>
              <div style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(to top, rgba(26,22,18,0.7) 0%, rgba(26,22,18,0.1) 50%, rgba(26,22,18,0) 100%)',
              }} />
              <div style={{
                position: 'absolute', bottom: 20, left: 20, right: 20, color: '#fff',
              }}>
                <div style={{ fontFamily: A_FONTS.serif, fontSize: 24, fontWeight: 400, letterSpacing: -0.3 }}>
                  {cat.n}
                </div>
                <div style={{ fontSize: 12, opacity: 0.85, marginTop: 4, letterSpacing: 0.3 }}>
                  {cat.c}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURED MASTERS */}
      <section style={{ padding: '40px 64px 120px' }}>
        <div style={{ marginBottom: 48 }}>
          <div style={{ fontSize: 12, letterSpacing: 2, textTransform: 'uppercase', color: A_COLORS.mute, marginBottom: 20 }}>
            Избранные мастера
          </div>
          <h2 style={{
            fontFamily: A_FONTS.serif, fontSize: 56, fontWeight: 400,
            letterSpacing: -1, lineHeight: 1, margin: 0,
          }}>
            Те, кому <em style={{ fontStyle: 'italic' }}>доверяют</em>
          </h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 32 }}>
          {[
            { name: 'Анна Соколова', spec: 'Маникюр · Педикюр', rating: '4.98', count: 'Studio Sezon', img: A_PHOTOS.master1 },
            { name: 'Мария Волкова', spec: 'Косметология', rating: '5.00', count: 'Clinic Aura', img: A_PHOTOS.master2 },
            { name: 'Екатерина Рей', spec: 'Стрижка · Окрашивание', rating: '4.96', count: 'Parlour 8', img: A_PHOTOS.master3 },
          ].map((m, i) => (
            <div key={i}>
              <div style={{
                height: 400,
                backgroundImage: `url(${m.img})`, backgroundSize: 'cover', backgroundPosition: 'center',
                marginBottom: 20,
              }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <h3 style={{ fontFamily: A_FONTS.serif, fontSize: 24, fontWeight: 400, margin: 0 }}>
                  {m.name}
                </h3>
                <div style={{ fontSize: 13, color: A_COLORS.inkSoft, fontVariantNumeric: 'tabular-nums' }}>
                  ★ {m.rating}
                </div>
              </div>
              <div style={{ fontSize: 14, color: A_COLORS.inkSoft, marginTop: 6 }}>
                {m.spec}
              </div>
              <div style={{ fontSize: 12, color: A_COLORS.mute, marginTop: 4, letterSpacing: 0.5 }}>
                {m.count}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* BUSINESS CTA */}
      <section style={{
        padding: '120px 64px',
        background: A_COLORS.ink, color: A_COLORS.bg,
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: 12, letterSpacing: 2, textTransform: 'uppercase', color: A_COLORS.accent, marginBottom: 24 }}>
              Для владельцев салонов
            </div>
            <h2 style={{
              fontFamily: A_FONTS.serif, fontSize: 72, fontWeight: 400,
              letterSpacing: -1.5, lineHeight: 1, margin: 0,
            }}>
              Ваш салон<br />
              <em style={{ fontStyle: 'italic' }}>заслуживает</em><br />
              большего
            </h2>
            <p style={{
              fontSize: 17, lineHeight: 1.6, color: 'rgba(245,241,236,0.7)',
              maxWidth: 440, margin: '36px 0 40px',
            }}>
              Управляйте записями, мастерами и расписанием из одного кабинета.
              Без комиссий и скрытых платежей.
            </p>
            <button style={{
              background: A_COLORS.bg, color: A_COLORS.ink, border: 'none',
              padding: '18px 32px', borderRadius: 999, fontSize: 15, fontWeight: 500,
              fontFamily: 'inherit', cursor: 'pointer',
            }}>Подключить салон →</button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
            {[
              { t: 'Бесплатно', d: 'Никаких комиссий с ваших записей. Никогда.' },
              { t: '12 минут', d: 'Среднее время на подключение салона к Liora.' },
              { t: '+38%', d: 'Рост загрузки мастеров в первый месяц.' },
              { t: '24/7', d: 'Клиенты записываются даже ночью — без вас.' },
            ].map((s, i) => (
              <div key={i} style={{ borderTop: `1px solid rgba(245,241,236,0.2)`, paddingTop: 20 }}>
                <div style={{ fontFamily: A_FONTS.serif, fontSize: 44, fontWeight: 400, letterSpacing: -1, lineHeight: 1 }}>
                  {s.t}
                </div>
                <div style={{ fontSize: 14, color: 'rgba(245,241,236,0.6)', marginTop: 12, lineHeight: 1.5 }}>
                  {s.d}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ padding: '64px 64px 40px', background: A_COLORS.bg }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 56 }}>
          <div style={{ fontFamily: A_FONTS.serif, fontSize: 72, fontStyle: 'italic', fontWeight: 400, letterSpacing: -2, lineHeight: 1 }}>
            Liora
          </div>
          <div style={{ display: 'flex', gap: 80, fontSize: 13 }}>
            <div>
              <div style={{ color: A_COLORS.mute, marginBottom: 16, letterSpacing: 1, textTransform: 'uppercase', fontSize: 11 }}>Клиентам</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, color: A_COLORS.inkSoft }}>
                <a>Найти мастера</a><a>Категории</a><a>Мои записи</a>
              </div>
            </div>
            <div>
              <div style={{ color: A_COLORS.mute, marginBottom: 16, letterSpacing: 1, textTransform: 'uppercase', fontSize: 11 }}>Бизнесу</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, color: A_COLORS.inkSoft }}>
                <a>Подключить салон</a><a>Тарифы</a><a>База знаний</a>
              </div>
            </div>
            <div>
              <div style={{ color: A_COLORS.mute, marginBottom: 16, letterSpacing: 1, textTransform: 'uppercase', fontSize: 11 }}>Компания</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, color: A_COLORS.inkSoft }}>
                <a>О нас</a><a>Журнал</a><a>Контакты</a>
              </div>
            </div>
          </div>
        </div>
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          paddingTop: 24, borderTop: `1px solid ${A_COLORS.line}`,
          fontSize: 12, color: A_COLORS.mute,
        }}>
          <div>© 2026 Liora. Запись без звонков.</div>
          <div>Москва · Санкт-Петербург · Казань</div>
        </div>
      </footer>
    </div>
  );
}

// ─────────── MOBILE ───────────
function VariantAMobile() {
  return (
    <div style={{
      fontFamily: A_FONTS.sans, color: A_COLORS.ink,
      background: A_COLORS.bg, width: '100%', minHeight: '100%',
    }}>
      {/* Status + nav */}
      <div style={{ padding: '18px 20px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontFamily: A_FONTS.serif, fontSize: 24, fontStyle: 'italic', fontWeight: 500 }}>Liora</div>
        <div style={{ width: 40, height: 40, borderRadius: 20, border: `1px solid ${A_COLORS.line}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke={A_COLORS.ink} strokeWidth="1.5"><path d="M2 4h12M2 8h12M2 12h12"/></svg>
        </div>
      </div>

      {/* Hero */}
      <section style={{ padding: '32px 20px 40px' }}>
        <div style={{ fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: A_COLORS.mute, marginBottom: 20 }}>
          — Запись без звонков
        </div>
        <h1 style={{
          fontFamily: A_FONTS.serif, fontSize: 52, lineHeight: 0.95,
          fontWeight: 400, letterSpacing: -1, margin: 0,
        }}>
          Красота,<br />
          <em style={{ fontStyle: 'italic' }}>созданная</em><br />
          для вас
        </h1>
        <p style={{ fontSize: 15, lineHeight: 1.55, color: A_COLORS.inkSoft, margin: '24px 0 28px' }}>
          Лучшие мастера города и живое расписание. Запись за минуту.
        </p>
        <button style={{
          width: '100%', background: A_COLORS.ink, color: A_COLORS.bg, border: 'none',
          padding: '18px', borderRadius: 999, fontSize: 15, fontWeight: 500,
          fontFamily: 'inherit', marginBottom: 10,
        }}>Найти мастера →</button>
        <button style={{
          width: '100%', background: 'transparent', color: A_COLORS.ink,
          border: `1px solid ${A_COLORS.ink}`,
          padding: '18px', borderRadius: 999, fontSize: 15, fontWeight: 500,
          fontFamily: 'inherit',
        }}>Я — владелец салона</button>
      </section>

      {/* Hero photo */}
      <div style={{
        margin: '0 20px 16px', height: 340,
        backgroundImage: `url(${A_PHOTOS.hero})`,
        backgroundSize: 'cover', backgroundPosition: 'center',
      }} />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, margin: '0 20px 60px' }}>
        <div style={{ height: 180, backgroundImage: `url(${A_PHOTOS.face})`, backgroundSize: 'cover' }} />
        <div style={{ height: 180, backgroundImage: `url(${A_PHOTOS.nails})`, backgroundSize: 'cover' }} />
      </div>

      {/* Steps */}
      <section style={{ padding: '48px 20px', background: A_COLORS.bgAlt }}>
        <h2 style={{ fontFamily: A_FONTS.serif, fontSize: 36, fontWeight: 400, letterSpacing: -0.8, lineHeight: 1.05, margin: '0 0 40px' }}>
          Три шага до <em style={{ fontStyle: 'italic' }}>вашего</em> ритуала
        </h2>
        {[
          { n: '01', t: 'Выберите мастера', d: 'Портфолио, отзывы, цены. Проверенные специалисты.' },
          { n: '02', t: 'Выберите время', d: 'Живое расписание. Без звонков и ожидания.' },
          { n: '03', t: 'Приходите', d: 'Напомним за день и за час. Перенос — в клик.' },
        ].map((s, i) => (
          <div key={i} style={{ borderTop: `1px solid ${A_COLORS.ink}`, paddingTop: 16, marginBottom: 28 }}>
            <div style={{ fontFamily: A_FONTS.serif, fontSize: 13, fontStyle: 'italic', color: A_COLORS.accent, marginBottom: 20 }}>{s.n}</div>
            <h3 style={{ fontFamily: A_FONTS.serif, fontSize: 24, fontWeight: 400, margin: '0 0 10px' }}>{s.t}</h3>
            <p style={{ fontSize: 14, lineHeight: 1.55, color: A_COLORS.inkSoft, margin: 0 }}>{s.d}</p>
          </div>
        ))}
      </section>

      {/* Categories */}
      <section style={{ padding: '60px 20px' }}>
        <h2 style={{ fontFamily: A_FONTS.serif, fontSize: 36, fontWeight: 400, letterSpacing: -0.8, lineHeight: 1.05, margin: '0 0 32px' }}>
          Всё для <em style={{ fontStyle: 'italic' }}>красоты</em>
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {[
            { n: 'Барбершоп', c: '340', img: A_PHOTOS.hair },
            { n: 'Маникюр', c: '820', img: A_PHOTOS.nails },
            { n: 'Косметология', c: '410', img: A_PHOTOS.face },
            { n: 'Массаж', c: '290', img: A_PHOTOS.masseuse },
            { n: 'Ресницы', c: '520', img: A_PHOTOS.lash },
            { n: 'Салоны', c: '180', img: A_PHOTOS.spa },
          ].map((cat, i) => (
            <div key={i} style={{
              position: 'relative', height: 180,
              backgroundImage: `url(${cat.img})`, backgroundSize: 'cover', backgroundPosition: 'center',
            }}>
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(26,22,18,0.7), transparent 60%)' }} />
              <div style={{ position: 'absolute', bottom: 14, left: 14, right: 14, color: '#fff' }}>
                <div style={{ fontFamily: A_FONTS.serif, fontSize: 18 }}>{cat.n}</div>
                <div style={{ fontSize: 11, opacity: 0.85, marginTop: 2 }}>{cat.c} мастеров</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Business CTA */}
      <section style={{ padding: '60px 20px', background: A_COLORS.ink, color: A_COLORS.bg }}>
        <div style={{ fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: A_COLORS.accent, marginBottom: 20 }}>
          Для владельцев салонов
        </div>
        <h2 style={{ fontFamily: A_FONTS.serif, fontSize: 44, fontWeight: 400, letterSpacing: -1, lineHeight: 1, margin: 0 }}>
          Ваш салон<br /><em style={{ fontStyle: 'italic' }}>заслуживает</em><br />большего
        </h2>
        <p style={{ fontSize: 15, lineHeight: 1.6, color: 'rgba(245,241,236,0.7)', margin: '28px 0 32px' }}>
          Управляйте записями и расписанием из одного кабинета. Без комиссий.
        </p>
        <button style={{
          width: '100%', background: A_COLORS.bg, color: A_COLORS.ink, border: 'none',
          padding: '18px', borderRadius: 999, fontSize: 15, fontWeight: 500, fontFamily: 'inherit',
        }}>Подключить салон →</button>
      </section>

      <footer style={{ padding: '40px 20px 32px', background: A_COLORS.bg }}>
        <div style={{ fontFamily: A_FONTS.serif, fontSize: 48, fontStyle: 'italic', letterSpacing: -1.5, marginBottom: 24 }}>Liora</div>
        <div style={{ fontSize: 12, color: A_COLORS.mute }}>© 2026 · Москва · СПб · Казань</div>
      </footer>
    </div>
  );
}

Object.assign(window, { VariantADesktop, VariantAMobile });
