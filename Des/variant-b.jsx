// Variant B — Quiet Luxury Minimal
// Near-mono palette, clean sans, tons of whitespace, Linear/Arc-like

const B_COLORS = {
  bg: '#FAFAF7',
  bgAlt: '#F0EEE8',
  ink: '#0A0A0A',
  inkSoft: '#3D3D3D',
  mute: '#8A8680',
  line: 'rgba(10,10,10,0.08)',
  lineStrong: 'rgba(10,10,10,0.14)',
  accent: '#0A0A0A',
};

const B_FONTS = {
  sans: '"TT Norms", "Inter Tight", "Inter", -apple-system, sans-serif',
  display: '"TT Norms", "Inter Tight", "Inter", -apple-system, sans-serif',
};

if (typeof document !== 'undefined' && !document.getElementById('variant-b-fonts')) {
  const l = document.createElement('link');
  l.id = 'variant-b-fonts';
  l.rel = 'stylesheet';
  l.href = 'https://fonts.googleapis.com/css2?family=Inter+Tight:wght@300;400;500;600;700&display=swap';
  document.head.appendChild(l);
}

const B_PHOTOS = {
  hero: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=1400&q=80',
  spa: 'https://images.unsplash.com/photo-1600334129128-685c5582fd35?w=800&q=80',
  nails: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=800&q=80',
  hair: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=800&q=80',
  face: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&q=80',
  lash: 'https://images.unsplash.com/photo-1583241800698-9c3e14a38acb?w=800&q=80',
  makeup: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80',
  master1: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&q=80',
  master2: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80',
  master3: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80',
  master4: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80',
};

// ─────────── DESKTOP ───────────
function VariantBDesktop() {
  return (
    <div style={{
      fontFamily: B_FONTS.sans, color: B_COLORS.ink,
      background: B_COLORS.bg, width: '100%', minHeight: '100%',
      fontFeatureSettings: '"ss01", "cv11"',
    }}>
      {/* NAV */}
      <nav style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '20px 40px', borderBottom: `1px solid ${B_COLORS.line}`,
        position: 'sticky', top: 0, background: 'rgba(250,250,247,0.85)', backdropFilter: 'blur(10px)', zIndex: 10,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 48 }}>
          <div style={{ fontSize: 17, fontWeight: 600, letterSpacing: -0.5 }}>
            <span style={{ display: 'inline-block', width: 8, height: 8, background: B_COLORS.ink, borderRadius: '50%', marginRight: 8, verticalAlign: 'middle' }} />
            Liora
          </div>
          <div style={{ display: 'flex', gap: 28, fontSize: 13, fontWeight: 500, color: B_COLORS.inkSoft }}>
            <a>Мастера</a><a>Услуги</a><a>Города</a><a>Для бизнеса</a>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 13 }}>
          <span style={{ color: B_COLORS.inkSoft, fontWeight: 500 }}>Войти</span>
          <button style={{
            background: B_COLORS.ink, color: B_COLORS.bg, border: 'none',
            padding: '9px 16px', borderRadius: 8, fontSize: 13, fontWeight: 500,
            fontFamily: 'inherit', cursor: 'pointer',
          }}>Записаться →</button>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ padding: '120px 40px 80px', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 10,
          padding: '6px 12px', border: `1px solid ${B_COLORS.lineStrong}`,
          borderRadius: 999, fontSize: 12, fontWeight: 500, color: B_COLORS.inkSoft,
          marginBottom: 40,
        }}>
          <span style={{ width: 6, height: 6, borderRadius: 3, background: '#2F9E6B' }} />
          2 400+ мастеров онлайн сейчас
        </div>

        <h1 style={{
          fontSize: 88, lineHeight: 0.98, fontWeight: 600, letterSpacing: -3.5,
          margin: 0, maxWidth: 980,
        }}>
          Запись к лучшим мастерам —<br />
          <span style={{ color: B_COLORS.mute }}>без звонков, ожидания и хаоса.</span>
        </h1>

        <p style={{
          fontSize: 18, lineHeight: 1.5, color: B_COLORS.inkSoft,
          maxWidth: 560, margin: '40px 0 44px', fontWeight: 400,
        }}>
          Liora — спокойный способ заботиться о себе. Живое расписание,
          проверенные салоны, запись за минуту.
        </p>

        <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 72 }}>
          <button style={{
            background: B_COLORS.ink, color: B_COLORS.bg, border: 'none',
            padding: '14px 22px', borderRadius: 10, fontSize: 14, fontWeight: 500,
            fontFamily: 'inherit', cursor: 'pointer',
          }}>Найти мастера</button>
          <button style={{
            background: 'transparent', color: B_COLORS.ink,
            border: `1px solid ${B_COLORS.lineStrong}`,
            padding: '14px 22px', borderRadius: 10, fontSize: 14, fontWeight: 500,
            fontFamily: 'inherit', cursor: 'pointer',
          }}>Я — владелец салона</button>
          <span style={{ fontSize: 13, color: B_COLORS.mute, marginLeft: 12 }}>
            Бесплатно · Без звонков · 60 секунд
          </span>
        </div>

        {/* Booking card preview */}
        <div style={{
          background: '#fff', border: `1px solid ${B_COLORS.line}`, borderRadius: 16,
          padding: 10, boxShadow: '0 1px 3px rgba(0,0,0,0.02), 0 40px 80px -20px rgba(10,10,10,0.12)',
          display: 'grid', gridTemplateColumns: '320px 1fr', gap: 10,
        }}>
          <div style={{
            borderRadius: 10, height: 360,
            backgroundImage: `url(${B_PHOTOS.hero})`, backgroundSize: 'cover', backgroundPosition: 'center',
          }} />
          <div style={{ padding: '24px 24px 20px', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
              <div>
                <div style={{ fontSize: 11, fontWeight: 500, color: B_COLORS.mute, letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 8 }}>
                  Доступно сегодня
                </div>
                <div style={{ fontSize: 26, fontWeight: 600, letterSpacing: -0.8 }}>
                  Маникюр · Studio Sezon
                </div>
                <div style={{ fontSize: 14, color: B_COLORS.inkSoft, marginTop: 4 }}>
                  Арбат, 12 · 2 мин пешком
                </div>
              </div>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 6,
                background: B_COLORS.bgAlt, padding: '6px 10px', borderRadius: 6,
                fontSize: 13, fontWeight: 500,
              }}>
                ★ 4.98 <span style={{ color: B_COLORS.mute, fontWeight: 400 }}>· 240 отзывов</span>
              </div>
            </div>

            <div style={{ fontSize: 12, fontWeight: 500, color: B_COLORS.mute, letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 12 }}>
              Свободные слоты
            </div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
              {['14:00', '15:30', '16:15', '17:00', '18:30'].map((t, i) => (
                <div key={t} style={{
                  padding: '10px 14px',
                  border: `1px solid ${i === 1 ? B_COLORS.ink : B_COLORS.line}`,
                  background: i === 1 ? B_COLORS.ink : 'transparent',
                  color: i === 1 ? B_COLORS.bg : B_COLORS.ink,
                  borderRadius: 8, fontSize: 13, fontWeight: 500, fontVariantNumeric: 'tabular-nums',
                }}>{t}</div>
              ))}
            </div>

            <div style={{ marginTop: 'auto', paddingTop: 20, borderTop: `1px solid ${B_COLORS.line}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: 20, fontWeight: 600, letterSpacing: -0.5 }}>3 200 ₽</div>
                <div style={{ fontSize: 12, color: B_COLORS.mute, marginTop: 2 }}>~90 мин · с покрытием</div>
              </div>
              <button style={{
                background: B_COLORS.ink, color: B_COLORS.bg, border: 'none',
                padding: '12px 18px', borderRadius: 8, fontSize: 13, fontWeight: 500, fontFamily: 'inherit',
              }}>Записаться на 15:30 →</button>
            </div>
          </div>
        </div>

        {/* Trust bar */}
        <div style={{ display: 'flex', gap: 64, marginTop: 72, paddingTop: 32, borderTop: `1px solid ${B_COLORS.line}` }}>
          {[
            ['2 400+', 'Мастеров'],
            ['180', 'Салонов'],
            ['4,9', 'Средний рейтинг'],
            ['60 сек', 'На запись'],
          ].map(([v, l]) => (
            <div key={l}>
              <div style={{ fontSize: 32, fontWeight: 600, letterSpacing: -1 }}>{v}</div>
              <div style={{ fontSize: 13, color: B_COLORS.mute, marginTop: 4 }}>{l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ padding: '100px 40px', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ fontSize: 13, fontWeight: 500, color: B_COLORS.mute, marginBottom: 16 }}>— Как это работает</div>
        <h2 style={{ fontSize: 48, fontWeight: 600, letterSpacing: -2, lineHeight: 1.05, margin: '0 0 72px', maxWidth: 700 }}>
          Запись за минуту.<br />
          <span style={{ color: B_COLORS.mute }}>Без приложения, без регистрации.</span>
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 0 }}>
          {[
            { n: '01', t: 'Выберите мастера', d: 'Фильтры по услуге, району, цене и рейтингу. Настоящие портфолио и отзывы.' },
            { n: '02', t: 'Выберите время', d: 'Живое расписание обновляется в реальном времени. Никаких «перезвоним».' },
            { n: '03', t: 'Готово', d: 'Напомним за день и за час. Перенести или отменить — в один клик.' },
          ].map((s, i) => (
            <div key={s.n} style={{
              padding: '0 32px 0 0',
              borderLeft: i === 0 ? 'none' : `1px solid ${B_COLORS.line}`,
              paddingLeft: i === 0 ? 0 : 32,
            }}>
              <div style={{ fontSize: 12, fontWeight: 500, color: B_COLORS.mute, marginBottom: 80, letterSpacing: 0.5 }}>
                {s.n} / 03
              </div>
              <h3 style={{ fontSize: 22, fontWeight: 600, letterSpacing: -0.5, margin: '0 0 12px' }}>{s.t}</h3>
              <p style={{ fontSize: 15, lineHeight: 1.55, color: B_COLORS.inkSoft, margin: 0 }}>{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CATEGORIES */}
      <section style={{ padding: '80px 40px 100px', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 40 }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 500, color: B_COLORS.mute, marginBottom: 12 }}>— Категории</div>
            <h2 style={{ fontSize: 40, fontWeight: 600, letterSpacing: -1.5, margin: 0 }}>
              Всё для заботы о себе
            </h2>
          </div>
          <a style={{ fontSize: 13, color: B_COLORS.ink, fontWeight: 500 }}>Все 24 категории →</a>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
          {[
            { n: 'Маникюр', c: 820, img: B_PHOTOS.nails },
            { n: 'Парикмахерская', c: 340, img: B_PHOTOS.hair },
            { n: 'Косметология', c: 410, img: B_PHOTOS.face },
            { n: 'Массаж', c: 290, img: B_PHOTOS.spa },
            { n: 'Ресницы', c: 520, img: B_PHOTOS.lash },
            { n: 'Макияж', c: 140, img: B_PHOTOS.makeup },
            { n: 'Эпиляция', c: 180 },
            { n: 'SPA', c: 96 },
          ].map((cat, i) => (
            <div key={i} style={{
              border: `1px solid ${B_COLORS.line}`, borderRadius: 12, overflow: 'hidden',
              background: '#fff', cursor: 'pointer', transition: 'all .15s',
            }}>
              {cat.img ? (
                <div style={{ height: 140, backgroundImage: `url(${cat.img})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
              ) : (
                <div style={{ height: 140, background: B_COLORS.bgAlt, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={B_COLORS.mute} strokeWidth="1.5"><circle cx="12" cy="12" r="9"/><path d="M12 3v18M3 12h18"/></svg>
                </div>
              )}
              <div style={{ padding: '14px 16px' }}>
                <div style={{ fontSize: 15, fontWeight: 600, letterSpacing: -0.2 }}>{cat.n}</div>
                <div style={{ fontSize: 12, color: B_COLORS.mute, marginTop: 3 }}>{cat.c} мастеров</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* MASTERS */}
      <section style={{ padding: '40px 40px 100px', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 32 }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 500, color: B_COLORS.mute, marginBottom: 12 }}>— Мастера недели</div>
            <h2 style={{ fontSize: 40, fontWeight: 600, letterSpacing: -1.5, margin: 0 }}>
              Проверенные, с хорошими отзывами
            </h2>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
          {[
            { name: 'Анна Соколова', spec: 'Маникюр', rating: '4.98', revs: '240', price: 'от 2 800 ₽', img: B_PHOTOS.master1 },
            { name: 'Мария Волкова', spec: 'Косметология', rating: '5.00', revs: '186', price: 'от 4 500 ₽', img: B_PHOTOS.master2 },
            { name: 'Екатерина Рей', spec: 'Стрижка, окрашивание', rating: '4.96', revs: '312', price: 'от 3 200 ₽', img: B_PHOTOS.master3 },
            { name: 'София Дан', spec: 'Ресницы, брови', rating: '4.97', revs: '198', price: 'от 2 400 ₽', img: B_PHOTOS.master4 },
          ].map((m, i) => (
            <div key={i} style={{
              border: `1px solid ${B_COLORS.line}`, borderRadius: 12,
              padding: 10, background: '#fff',
            }}>
              <div style={{
                height: 220, borderRadius: 8,
                backgroundImage: `url(${m.img})`, backgroundSize: 'cover', backgroundPosition: 'center',
                marginBottom: 12,
              }} />
              <div style={{ padding: '4px 6px 8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <div style={{ fontSize: 15, fontWeight: 600, letterSpacing: -0.3 }}>{m.name}</div>
                  <div style={{ fontSize: 12, color: B_COLORS.inkSoft, fontVariantNumeric: 'tabular-nums' }}>
                    ★ {m.rating}
                  </div>
                </div>
                <div style={{ fontSize: 13, color: B_COLORS.inkSoft, marginTop: 4 }}>{m.spec}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12, paddingTop: 12, borderTop: `1px solid ${B_COLORS.line}` }}>
                  <div style={{ fontSize: 13, fontWeight: 500 }}>{m.price}</div>
                  <div style={{ fontSize: 11, color: B_COLORS.mute }}>{m.revs} отзывов</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* BUSINESS CTA */}
      <section style={{ padding: '40px 40px 100px', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{
          background: B_COLORS.ink, color: B_COLORS.bg, borderRadius: 20,
          padding: '72px 64px', display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 64, alignItems: 'center',
        }}>
          <div>
            <div style={{ fontSize: 12, letterSpacing: 1, textTransform: 'uppercase', color: 'rgba(250,250,247,0.6)', marginBottom: 20 }}>
              Для бизнеса
            </div>
            <h2 style={{ fontSize: 48, fontWeight: 600, letterSpacing: -2, lineHeight: 1.05, margin: 0 }}>
              Подключите салон<br />
              <span style={{ color: 'rgba(250,250,247,0.55)' }}>за 12 минут.</span>
            </h2>
            <p style={{ fontSize: 16, lineHeight: 1.55, color: 'rgba(250,250,247,0.7)', margin: '24px 0 32px', maxWidth: 460 }}>
              Живое расписание, автонапоминания клиентам, учёт мастеров.
              Бесплатно — без комиссий с записей.
            </p>
            <div style={{ display: 'flex', gap: 10 }}>
              <button style={{
                background: B_COLORS.bg, color: B_COLORS.ink, border: 'none',
                padding: '14px 22px', borderRadius: 10, fontSize: 14, fontWeight: 500, fontFamily: 'inherit', cursor: 'pointer',
              }}>Подключить бесплатно →</button>
              <button style={{
                background: 'transparent', color: B_COLORS.bg,
                border: `1px solid rgba(250,250,247,0.25)`,
                padding: '14px 22px', borderRadius: 10, fontSize: 14, fontWeight: 500, fontFamily: 'inherit', cursor: 'pointer',
              }}>Посмотреть демо</button>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            {[
              ['+38%', 'Рост загрузки мастеров за первый месяц'],
              ['0 ₽', 'Комиссий с ваших записей. Никогда.'],
              ['24/7', 'Клиенты записываются даже ночью'],
              ['12 мин', 'Среднее время на подключение'],
            ].map(([v, d]) => (
              <div key={v} style={{ padding: 20, background: 'rgba(250,250,247,0.04)', borderRadius: 12, border: `1px solid rgba(250,250,247,0.08)` }}>
                <div style={{ fontSize: 30, fontWeight: 600, letterSpacing: -1, marginBottom: 8 }}>{v}</div>
                <div style={{ fontSize: 13, color: 'rgba(250,250,247,0.6)', lineHeight: 1.4 }}>{d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer style={{ padding: '40px 40px 32px', borderTop: `1px solid ${B_COLORS.line}` }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: 15, fontWeight: 600 }}>
            <span style={{ display: 'inline-block', width: 7, height: 7, background: B_COLORS.ink, borderRadius: '50%', marginRight: 7, verticalAlign: 'middle' }} />
            Liora
          </div>
          <div style={{ display: 'flex', gap: 28, fontSize: 13, color: B_COLORS.inkSoft }}>
            <a>О нас</a><a>Для бизнеса</a><a>Журнал</a><a>Поддержка</a><a>Telegram</a>
          </div>
          <div style={{ fontSize: 12, color: B_COLORS.mute }}>© 2026 Liora</div>
        </div>
      </footer>
    </div>
  );
}

// ─────────── MOBILE ───────────
function VariantBMobile() {
  return (
    <div style={{
      fontFamily: B_FONTS.sans, color: B_COLORS.ink,
      background: B_COLORS.bg, width: '100%', minHeight: '100%',
    }}>
      <nav style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '16px 20px', borderBottom: `1px solid ${B_COLORS.line}`,
      }}>
        <div style={{ fontSize: 16, fontWeight: 600, letterSpacing: -0.3 }}>
          <span style={{ display: 'inline-block', width: 7, height: 7, background: B_COLORS.ink, borderRadius: '50%', marginRight: 7, verticalAlign: 'middle' }} />
          Liora
        </div>
        <div style={{ width: 36, height: 36, borderRadius: 8, border: `1px solid ${B_COLORS.line}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke={B_COLORS.ink} strokeWidth="1.5"><path d="M2 4h10M2 7h10M2 10h10"/></svg>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ padding: '36px 20px 32px' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          padding: '5px 10px', border: `1px solid ${B_COLORS.lineStrong}`,
          borderRadius: 999, fontSize: 11, fontWeight: 500, color: B_COLORS.inkSoft,
          marginBottom: 28,
        }}>
          <span style={{ width: 5, height: 5, borderRadius: 3, background: '#2F9E6B' }} />
          2 400+ мастеров онлайн
        </div>

        <h1 style={{
          fontSize: 44, lineHeight: 0.98, fontWeight: 600, letterSpacing: -2,
          margin: 0,
        }}>
          Запись к лучшим мастерам — <span style={{ color: B_COLORS.mute }}>без звонков и хаоса.</span>
        </h1>
        <p style={{ fontSize: 15, lineHeight: 1.5, color: B_COLORS.inkSoft, margin: '24px 0 28px' }}>
          Живое расписание, проверенные салоны, запись за 60 секунд.
        </p>
        <button style={{
          width: '100%', background: B_COLORS.ink, color: B_COLORS.bg, border: 'none',
          padding: '15px', borderRadius: 10, fontSize: 14, fontWeight: 500, fontFamily: 'inherit', marginBottom: 8,
        }}>Найти мастера</button>
        <button style={{
          width: '100%', background: 'transparent', color: B_COLORS.ink,
          border: `1px solid ${B_COLORS.lineStrong}`,
          padding: '15px', borderRadius: 10, fontSize: 14, fontWeight: 500, fontFamily: 'inherit',
        }}>Я — владелец салона</button>
      </section>

      {/* Booking preview card */}
      <div style={{ padding: '0 20px 48px' }}>
        <div style={{
          background: '#fff', border: `1px solid ${B_COLORS.line}`, borderRadius: 14,
          padding: 8, boxShadow: '0 20px 40px -12px rgba(10,10,10,0.1)',
        }}>
          <div style={{
            height: 180, borderRadius: 8, marginBottom: 12,
            backgroundImage: `url(${B_PHOTOS.hero})`, backgroundSize: 'cover', backgroundPosition: 'center',
          }} />
          <div style={{ padding: '4px 10px 10px' }}>
            <div style={{ fontSize: 10, fontWeight: 500, color: B_COLORS.mute, letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 6 }}>
              Доступно сегодня
            </div>
            <div style={{ fontSize: 18, fontWeight: 600, letterSpacing: -0.5 }}>
              Маникюр · Studio Sezon
            </div>
            <div style={{ fontSize: 12, color: B_COLORS.inkSoft, marginTop: 4, marginBottom: 16 }}>
              Арбат · ★ 4.98 · 240 отзывов
            </div>
            <div style={{ display: 'flex', gap: 6, marginBottom: 14, overflowX: 'auto' }}>
              {['14:00', '15:30', '16:15', '17:00'].map((t, i) => (
                <div key={t} style={{
                  padding: '8px 12px',
                  border: `1px solid ${i === 1 ? B_COLORS.ink : B_COLORS.line}`,
                  background: i === 1 ? B_COLORS.ink : 'transparent',
                  color: i === 1 ? B_COLORS.bg : B_COLORS.ink,
                  borderRadius: 7, fontSize: 12, fontWeight: 500, fontVariantNumeric: 'tabular-nums',
                  flexShrink: 0,
                }}>{t}</div>
              ))}
            </div>
            <div style={{ paddingTop: 14, borderTop: `1px solid ${B_COLORS.line}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: 16, fontWeight: 600 }}>3 200 ₽</div>
                <div style={{ fontSize: 11, color: B_COLORS.mute }}>~90 мин</div>
              </div>
              <button style={{
                background: B_COLORS.ink, color: B_COLORS.bg, border: 'none',
                padding: '10px 14px', borderRadius: 7, fontSize: 12, fontWeight: 500, fontFamily: 'inherit',
              }}>Записаться →</button>
            </div>
          </div>
        </div>
      </div>

      {/* Steps */}
      <section style={{ padding: '40px 20px 48px', borderTop: `1px solid ${B_COLORS.line}` }}>
        <div style={{ fontSize: 12, fontWeight: 500, color: B_COLORS.mute, marginBottom: 10 }}>— Как это работает</div>
        <h2 style={{ fontSize: 32, fontWeight: 600, letterSpacing: -1.2, lineHeight: 1.05, margin: '0 0 36px' }}>
          Запись за минуту. <span style={{ color: B_COLORS.mute }}>Без приложения.</span>
        </h2>
        {[
          { n: '01', t: 'Выберите мастера', d: 'Фильтры по услуге, району, цене и рейтингу.' },
          { n: '02', t: 'Выберите время', d: 'Живое расписание в реальном времени.' },
          { n: '03', t: 'Готово', d: 'Напомним за день и за час. Перенос — в клик.' },
        ].map((s) => (
          <div key={s.n} style={{ borderTop: `1px solid ${B_COLORS.line}`, paddingTop: 18, marginBottom: 20 }}>
            <div style={{ fontSize: 11, color: B_COLORS.mute, marginBottom: 40, letterSpacing: 0.5 }}>{s.n} / 03</div>
            <h3 style={{ fontSize: 18, fontWeight: 600, margin: '0 0 8px' }}>{s.t}</h3>
            <p style={{ fontSize: 14, lineHeight: 1.5, color: B_COLORS.inkSoft, margin: 0 }}>{s.d}</p>
          </div>
        ))}
      </section>

      {/* Categories */}
      <section style={{ padding: '48px 20px' }}>
        <div style={{ fontSize: 12, fontWeight: 500, color: B_COLORS.mute, marginBottom: 10 }}>— Категории</div>
        <h2 style={{ fontSize: 28, fontWeight: 600, letterSpacing: -1, margin: '0 0 24px' }}>
          Всё для заботы о себе
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {[
            { n: 'Маникюр', c: 820, img: B_PHOTOS.nails },
            { n: 'Парикмахер', c: 340, img: B_PHOTOS.hair },
            { n: 'Косметология', c: 410, img: B_PHOTOS.face },
            { n: 'Массаж', c: 290, img: B_PHOTOS.spa },
            { n: 'Ресницы', c: 520, img: B_PHOTOS.lash },
            { n: 'Макияж', c: 140, img: B_PHOTOS.makeup },
          ].map((cat, i) => (
            <div key={i} style={{
              border: `1px solid ${B_COLORS.line}`, borderRadius: 10, overflow: 'hidden', background: '#fff',
            }}>
              <div style={{ height: 100, backgroundImage: `url(${cat.img})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
              <div style={{ padding: '10px 12px' }}>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{cat.n}</div>
                <div style={{ fontSize: 11, color: B_COLORS.mute, marginTop: 2 }}>{cat.c}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Business */}
      <section style={{ padding: '40px 20px 60px' }}>
        <div style={{
          background: B_COLORS.ink, color: B_COLORS.bg, borderRadius: 16,
          padding: 32,
        }}>
          <div style={{ fontSize: 11, letterSpacing: 1, textTransform: 'uppercase', color: 'rgba(250,250,247,0.6)', marginBottom: 16 }}>
            Для бизнеса
          </div>
          <h2 style={{ fontSize: 32, fontWeight: 600, letterSpacing: -1.2, lineHeight: 1.05, margin: 0 }}>
            Подключите салон <span style={{ color: 'rgba(250,250,247,0.55)' }}>за 12 минут.</span>
          </h2>
          <p style={{ fontSize: 14, lineHeight: 1.5, color: 'rgba(250,250,247,0.7)', margin: '20px 0 24px' }}>
            Живое расписание, автонапоминания, учёт мастеров. Бесплатно — без комиссий.
          </p>
          <button style={{
            width: '100%', background: B_COLORS.bg, color: B_COLORS.ink, border: 'none',
            padding: '14px', borderRadius: 10, fontSize: 14, fontWeight: 500, fontFamily: 'inherit',
          }}>Подключить бесплатно →</button>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 24 }}>
            {[['+38%', 'Рост загрузки'], ['0 ₽', 'Комиссий']].map(([v, d]) => (
              <div key={v} style={{ padding: 14, background: 'rgba(250,250,247,0.05)', borderRadius: 10 }}>
                <div style={{ fontSize: 20, fontWeight: 600, letterSpacing: -0.5 }}>{v}</div>
                <div style={{ fontSize: 11, color: 'rgba(250,250,247,0.6)', marginTop: 4 }}>{d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer style={{ padding: '24px 20px 32px', borderTop: `1px solid ${B_COLORS.line}`, textAlign: 'center' }}>
        <div style={{ fontSize: 12, color: B_COLORS.mute }}>© 2026 Liora · Москва</div>
      </footer>
    </div>
  );
}

Object.assign(window, { VariantBDesktop, VariantBMobile });
