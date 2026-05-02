// Liora Business (B2B) — v2
// Структура DIKIDI Business, но с другими компонентами и тёплой палитрой
// Кремовый фон, бутылочно-зелёный как "dark", терракота как акцент

const D_COLORS = {
  cream: '#F4EFE6',
  creamSoft: '#EAE3D5',
  paper: '#FBF8F2',
  ink: '#1F2A24',
  inkSoft: '#3A4540',
  forest: '#2D4A3E',
  forestDeep: '#1E332A',
  terra: '#B86A4B',
  terraSoft: '#E8C9B5',
  sand: '#D9CBB0',
  mute: '#8A8578',
  line: 'rgba(31,42,36,0.12)',
  lineLight: 'rgba(251,248,242,0.14)',
};

const D_FONT_SANS = '"TT Norms", "Inter Tight", "Inter", -apple-system, sans-serif';
const D_FONT_SERIF = '"Cormorant Garamond", "Playfair Display", Georgia, serif';

function D_Logo({ color = D_COLORS.ink, showBusiness = true }) {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, fontFamily: D_FONT_SERIF, fontSize: 24, fontWeight: 500, letterSpacing: -0.5, color }}>
      <svg width="20" height="20" viewBox="0 0 22 22" fill="none">
        <circle cx="11" cy="11" r="10" stroke={color} strokeWidth="1"/>
        <path d="M6 14 Q11 4, 16 14" stroke={color} strokeWidth="1" fill="none"/>
      </svg>
      Liora {showBusiness && <span style={{ fontFamily: D_FONT_SANS, fontSize: 12, fontWeight: 500, letterSpacing: 2, textTransform: 'uppercase', opacity: 0.65, marginLeft: 2 }}>Business</span>}
    </div>
  );
}

function LioraBusinessDesktop() {
  return (
    <div style={{ fontFamily: D_FONT_SANS, color: D_COLORS.ink, background: D_COLORS.cream, width: '100%', minHeight: '100%' }}>
      {/* TOP BAR — cream, не тёмный */}
      <nav style={{
        padding: '22px 48px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        borderBottom: `1px solid ${D_COLORS.line}`,
      }}>
        <D_Logo />
        <div style={{ display: 'flex', alignItems: 'center', gap: 28, fontSize: 13, color: D_COLORS.inkSoft }}>
          <a>Возможности</a><a>Тарифы</a><a>Кейсы</a><a>Интеграции</a><a>Поддержка</a>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontSize: 13 }}>
          <span style={{ color: D_COLORS.inkSoft }}>Войти</span>
          <button style={{
            background: D_COLORS.forest, color: D_COLORS.paper, border: 'none',
            padding: '10px 18px', borderRadius: 6, fontSize: 13, fontFamily: 'inherit', cursor: 'pointer',
          }}>Попробовать бесплатно</button>
        </div>
      </nav>

      {/* HERO — split, не стековый */}
      <section style={{ padding: '56px 48px 40px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.15fr', gap: 56, alignItems: 'center' }}>
          <div>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '5px 12px', background: D_COLORS.creamSoft, borderRadius: 999,
              fontSize: 11, color: D_COLORS.inkSoft, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 28,
            }}>
              <span style={{ width: 6, height: 6, borderRadius: 3, background: D_COLORS.forest }} />
              Бесплатно для мастеров
            </div>
            <h1 style={{
              fontFamily: D_FONT_SERIF, fontSize: 72, fontWeight: 400, letterSpacing: -2, lineHeight: 1, margin: 0,
            }}>
              Расписание,<br />клиенты и <em style={{ color: D_COLORS.forest }}>финансы</em><br />в одном месте
            </h1>
            <p style={{ fontSize: 16, lineHeight: 1.6, color: D_COLORS.inkSoft, margin: '28px 0 32px', maxWidth: 480 }}>
              Liora Business — операционная система для салонов и частных мастеров.
              Живое расписание, клиентская база, напоминания и отчёты — без технических знаний.
            </p>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 36 }}>
              <button style={{
                background: D_COLORS.ink, color: D_COLORS.paper, border: 'none',
                padding: '14px 24px', borderRadius: 8, fontSize: 14, fontFamily: 'inherit', cursor: 'pointer',
              }}>Настроить за 10 минут →</button>
              <button style={{
                background: 'transparent', color: D_COLORS.ink, border: `1px solid ${D_COLORS.ink}`,
                padding: '14px 22px', borderRadius: 8, fontSize: 14, fontFamily: 'inherit', cursor: 'pointer',
              }}>Смотреть демо · 2 мин</button>
            </div>
            {/* Пункты вместо голого абзаца */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
              {[
                ['14 дней', 'бесплатного теста'],
                ['0 ₽', 'комиссии с записей'],
                ['25 минут', 'средняя настройка'],
                ['24/7', 'поддержка на рус.'],
              ].map(([v, l]) => (
                <div key={v} style={{ borderLeft: `2px solid ${D_COLORS.terra}`, paddingLeft: 12 }}>
                  <div style={{ fontFamily: D_FONT_SERIF, fontSize: 22, fontWeight: 500, letterSpacing: -0.3 }}>{v}</div>
                  <div style={{ fontSize: 12, color: D_COLORS.mute, marginTop: 2 }}>{l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Calendar preview — светлый, не дашборд-слоп */}
          <div style={{ position: 'relative' }}>
            <div style={{
              background: D_COLORS.paper, borderRadius: 16, border: `1px solid ${D_COLORS.line}`,
              padding: 20, boxShadow: `0 30px 60px -20px ${D_COLORS.forestDeep}33`,
            }}>
              {/* header like real cal */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, paddingBottom: 14, borderBottom: `1px solid ${D_COLORS.line}` }}>
                <div>
                  <div style={{ fontFamily: D_FONT_SERIF, fontSize: 20, fontWeight: 500 }}>Март 2026</div>
                  <div style={{ fontSize: 11, color: D_COLORS.mute, marginTop: 2 }}>Неделя 12 · 4 мастера</div>
                </div>
                <div style={{ display: 'flex', gap: 4 }}>
                  {['День', 'Неделя', 'Месяц'].map((t, i) => (
                    <div key={t} style={{
                      fontSize: 11, padding: '6px 10px', borderRadius: 6,
                      background: i === 1 ? D_COLORS.ink : 'transparent',
                      color: i === 1 ? D_COLORS.paper : D_COLORS.inkSoft,
                    }}>{t}</div>
                  ))}
                </div>
              </div>

              {/* mini weekdays */}
              <div style={{ display: 'grid', gridTemplateColumns: '48px repeat(5, 1fr)', gap: 4, fontSize: 10, marginBottom: 6 }}>
                <div />
                {['ПН 23', 'ВТ 24', 'СР 25', 'ЧТ 26', 'ПТ 27'].map((d, i) => (
                  <div key={d} style={{
                    padding: '6px 8px', textAlign: 'center',
                    background: i === 2 ? D_COLORS.creamSoft : 'transparent',
                    borderRadius: 5, color: D_COLORS.inkSoft, fontWeight: 500,
                  }}>{d}</div>
                ))}
              </div>

              {[10, 11, 12, 13, 14, 15].map((h, row) => (
                <div key={h} style={{
                  display: 'grid', gridTemplateColumns: '48px repeat(5, 1fr)', gap: 4, height: 34, marginBottom: 3,
                }}>
                  <div style={{ fontSize: 10, color: D_COLORS.mute, paddingTop: 6 }}>{h}:00</div>
                  {[0, 1, 2, 3, 4].map((col) => {
                    const appts = [
                      { row: 0, col: 0, h: 2, c: D_COLORS.terraSoft, n: 'Маникюр · Мария' },
                      { row: 1, col: 1, h: 2, c: D_COLORS.sand, n: 'Окрашивание' },
                      { row: 2, col: 2, h: 1, c: D_COLORS.creamSoft, n: 'Брови' },
                      { row: 0, col: 3, h: 3, c: D_COLORS.terraSoft, n: 'Коррекция' },
                      { row: 3, col: 0, h: 2, c: D_COLORS.sand, n: 'Стрижка' },
                      { row: 2, col: 4, h: 2, c: D_COLORS.creamSoft, n: 'Консультация' },
                      { row: 4, col: 2, h: 1, c: D_COLORS.terraSoft, n: 'Уход' },
                    ];
                    const a = appts.find((x) => x.row === row && x.col === col);
                    if (!a) return <div key={col} style={{ background: D_COLORS.cream, borderRadius: 4 }} />;
                    return (
                      <div key={col} style={{
                        gridRow: `span ${a.h}`, background: a.c, color: D_COLORS.ink,
                        borderRadius: 6, padding: '5px 9px', fontSize: 10, fontWeight: 500,
                        overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis',
                        borderLeft: `3px solid ${D_COLORS.forest}`,
                      }}>{a.n}</div>
                    );
                  })}
                </div>
              ))}

              {/* bottom bar with live metrics */}
              <div style={{
                marginTop: 16, paddingTop: 14, borderTop: `1px solid ${D_COLORS.line}`,
                display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16,
              }}>
                {[
                  ['23', 'записи сегодня'],
                  ['87%', 'загрузка'],
                  ['42 470 ₽', 'ожидаемая выручка'],
                ].map(([v, l]) => (
                  <div key={l}>
                    <div style={{ fontFamily: D_FONT_SERIF, fontSize: 20, fontWeight: 500 }}>{v}</div>
                    <div style={{ fontSize: 10, color: D_COLORS.mute, marginTop: 2 }}>{l}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* floating tag — новая запись */}
            <div style={{
              position: 'absolute', top: -14, right: -14, background: D_COLORS.forest, color: D_COLORS.paper,
              padding: '10px 14px', borderRadius: 10, fontSize: 12,
              boxShadow: `0 10px 30px -5px ${D_COLORS.forestDeep}88`,
            }}>
              <div style={{ fontSize: 10, opacity: 0.7, letterSpacing: 0.5, marginBottom: 2 }}>НОВАЯ ЗАПИСЬ</div>
              <div style={{ fontWeight: 500 }}>Ольга К. · завтра 15:00</div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS strip — ticker style, не равные колонки */}
      <section style={{
        padding: '40px 48px', background: D_COLORS.forest, color: D_COLORS.paper, margin: '20px 0',
      }}>
        <div style={{ display: 'flex', gap: 48, alignItems: 'baseline', flexWrap: 'wrap' }}>
          <div style={{ fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', opacity: 0.7 }}>— Цифры Liora</div>
          {[
            ['120 000+', 'компаний'],
            ['95', 'стран'],
            ['15M+', 'записей / мес'],
            ['4.8', '★ средний рейтинг'],
          ].map(([v, l], i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
              <span style={{ fontFamily: D_FONT_SERIF, fontSize: 38, fontWeight: 400, letterSpacing: -1 }}>{v}</span>
              <span style={{ fontSize: 13, opacity: 0.75 }}>{l}</span>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES — не сетка одинаковых карточек, а разбивка на зоны */}
      <section style={{ padding: '40px 48px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 40, alignItems: 'start', marginBottom: 32 }}>
          <div style={{ position: 'sticky', top: 20 }}>
            <div style={{ fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', color: D_COLORS.mute, marginBottom: 14 }}>— Возможности</div>
            <h2 style={{ fontFamily: D_FONT_SERIF, fontSize: 48, fontWeight: 400, letterSpacing: -1.5, lineHeight: 1.05, margin: 0 }}>
              Ведёте бизнес,<br />а не софт
            </h2>
            <p style={{ fontSize: 14, color: D_COLORS.inkSoft, lineHeight: 1.6, marginTop: 20 }}>
              Все инструменты, которые раньше требовали трёх разных подписок, — в одном кабинете.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {[
              { t: 'Живое расписание', d: 'Мастера, кабинеты, онлайн-запись. Drag-and-drop, конфликты, заметки.', big: true },
              { t: 'Клиентская база', d: 'История визитов, предпочтения, бонусы. Автонапоминания.' },
              { t: 'Финансы', d: 'Выручка, расходы, зарплаты мастеров. Касса и отчёты.' },
              { t: 'Онлайн-оплата', d: 'Предоплата сокращает отмены в 3 раза.' },
              { t: 'Маркетинг', d: 'Промо, рассылки, программа лояльности.' },
              { t: 'iOS и Android', d: 'Для мастера и для клиента — отдельные приложения.' },
            ].map((f, i) => (
              <div key={i} style={{
                background: f.big ? D_COLORS.forest : D_COLORS.paper,
                color: f.big ? D_COLORS.paper : D_COLORS.ink,
                border: f.big ? 'none' : `1px solid ${D_COLORS.line}`,
                borderRadius: 14, padding: 22,
                gridColumn: f.big ? 'span 2' : 'span 1',
                display: 'flex', flexDirection: 'column', gap: 12,
                minHeight: f.big ? 180 : 140,
              }}>
                <div style={{
                  fontFamily: D_FONT_SERIF, fontSize: f.big ? 28 : 20, fontWeight: 400, letterSpacing: -0.3,
                }}>{f.t}</div>
                <div style={{ fontSize: 13, lineHeight: 1.55, opacity: f.big ? 0.85 : 1, color: f.big ? 'inherit' : D_COLORS.inkSoft, flex: 1 }}>
                  {f.d}
                </div>
                {f.big && (
                  <div style={{ fontSize: 12, opacity: 0.75, marginTop: 8 }}>→ Подробнее</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIAL / CASE */}
      <section style={{ padding: '40px 48px' }}>
        <div style={{
          background: D_COLORS.paper, border: `1px solid ${D_COLORS.line}`,
          borderRadius: 20, padding: '48px 56px', display: 'grid', gridTemplateColumns: '1fr 1.3fr', gap: 40,
        }}>
          <div>
            <div style={{ fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', color: D_COLORS.mute, marginBottom: 14 }}>— Кейс</div>
            <div style={{ fontFamily: D_FONT_SERIF, fontSize: 20, marginBottom: 24 }}>Салон «Орхидея»</div>
            <div style={{ display: 'grid', gap: 18 }}>
              {[
                ['+34%', 'выручка за 3 месяца'],
                ['−62%', 'отмены записей'],
                ['×2.1', 'повторные визиты'],
              ].map(([v, l]) => (
                <div key={l} style={{ borderBottom: `1px solid ${D_COLORS.line}`, paddingBottom: 16 }}>
                  <div style={{ fontFamily: D_FONT_SERIF, fontSize: 40, fontWeight: 400, color: D_COLORS.forest, letterSpacing: -1 }}>{v}</div>
                  <div style={{ fontSize: 13, color: D_COLORS.inkSoft, marginTop: 4 }}>{l}</div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <svg width="28" height="20" viewBox="0 0 28 20" fill={D_COLORS.terra} style={{ marginBottom: 12 }}>
              <path d="M0 20V10c0-5.5 4.5-10 10-10v4C6.7 4 4 6.7 4 10h6v10H0zm18 0V10c0-5.5 4.5-10 10-10v4c-3.3 0-6 2.7-6 6h6v10H18z"/>
            </svg>
            <p style={{ fontFamily: D_FONT_SERIF, fontSize: 30, fontWeight: 400, letterSpacing: -0.5, lineHeight: 1.25, margin: 0 }}>
              Раньше три девочки на ресепшене принимали звонки весь день. Теперь записываются
              <em style={{ color: D_COLORS.forest }}> сами — через Liora. </em>
              Мы занимаемся клиентами, а не телефоном.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 32 }}>
              <div style={{ width: 48, height: 48, borderRadius: 24, backgroundImage: 'url(https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200)', backgroundSize: 'cover' }} />
              <div>
                <div style={{ fontSize: 14, fontWeight: 500 }}>Мария Величко</div>
                <div style={{ fontSize: 12, color: D_COLORS.mute, marginTop: 2 }}>Владелица салона «Орхидея»</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PRICING — таблица, не три карточки */}
      <section style={{ padding: '40px 48px 64px' }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', color: D_COLORS.mute, marginBottom: 12 }}>— Тарифы</div>
          <h2 style={{ fontFamily: D_FONT_SERIF, fontSize: 48, fontWeight: 400, letterSpacing: -1.5, margin: 0 }}>
            Прозрачно, без <em style={{ color: D_COLORS.forest }}>комиссий</em>
          </h2>
        </div>

        <div style={{
          background: D_COLORS.paper, border: `1px solid ${D_COLORS.line}`, borderRadius: 18, overflow: 'hidden',
        }}>
          {/* head */}
          <div style={{
            display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr',
            padding: '24px 32px', borderBottom: `1px solid ${D_COLORS.line}`,
          }}>
            <div />
            {[
              { n: 'Старт', p: '0 ₽', s: 'навсегда' },
              { n: 'Салон', p: '1 490 ₽', s: '/ мес', best: true },
              { n: 'Сеть', p: 'от 4 900 ₽', s: '/ мес' },
            ].map((t) => (
              <div key={t.n} style={{
                textAlign: 'center', padding: '0 12px', position: 'relative',
                background: t.best ? D_COLORS.creamSoft : 'transparent',
                borderRadius: t.best ? 10 : 0, margin: t.best ? '-12px 0' : 0, paddingTop: t.best ? 12 : 0, paddingBottom: t.best ? 12 : 0,
              }}>
                {t.best && <div style={{ fontSize: 10, color: D_COLORS.terra, fontWeight: 600, letterSpacing: 1.2, marginBottom: 8 }}>ПОПУЛЯРНО</div>}
                <div style={{ fontSize: 13, color: D_COLORS.inkSoft, marginBottom: 6 }}>{t.n}</div>
                <div style={{ fontFamily: D_FONT_SERIF, fontSize: 32, fontWeight: 400, letterSpacing: -0.8 }}>{t.p}</div>
                <div style={{ fontSize: 11, color: D_COLORS.mute, marginTop: 2 }}>{t.s}</div>
              </div>
            ))}
          </div>

          {/* rows */}
          {[
            ['Мастера в штате', '3', '20', 'Без лимита'],
            ['Клиентская база', '500', 'Без лимита', 'Без лимита'],
            ['Онлайн-запись', '✓', '✓', '✓'],
            ['Финансы и отчёты', '—', '✓', '✓ + API'],
            ['Маркетинг и рассылки', '—', '✓', '✓'],
            ['Онлайн-оплата', '—', '✓', '✓'],
            ['Несколько филиалов', '—', '—', '✓'],
            ['Выделенный менеджер', '—', '—', '✓'],
          ].map(([name, a, b, c], i, arr) => (
            <div key={name} style={{
              display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr',
              padding: '14px 32px', fontSize: 13,
              borderBottom: i < arr.length - 1 ? `1px solid ${D_COLORS.line}` : 'none',
              alignItems: 'center',
            }}>
              <div style={{ color: D_COLORS.ink }}>{name}</div>
              {[a, b, c].map((v, j) => (
                <div key={j} style={{
                  textAlign: 'center', color: v === '—' ? D_COLORS.mute : D_COLORS.ink,
                  fontWeight: v === '✓' ? 500 : 400,
                }}>{v}</div>
              ))}
            </div>
          ))}
          <div style={{
            display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr',
            padding: '20px 32px', borderTop: `1px solid ${D_COLORS.line}`, background: D_COLORS.cream,
          }}>
            <div />
            <button style={{ background: 'transparent', color: D_COLORS.ink, border: `1px solid ${D_COLORS.ink}`, padding: '10px', borderRadius: 8, fontSize: 12, fontFamily: 'inherit' }}>Начать</button>
            <button style={{ background: D_COLORS.ink, color: D_COLORS.paper, border: 'none', padding: '10px', borderRadius: 8, fontSize: 12, fontFamily: 'inherit' }}>14 дней free</button>
            <button style={{ background: 'transparent', color: D_COLORS.ink, border: `1px solid ${D_COLORS.ink}`, padding: '10px', borderRadius: 8, fontSize: 12, fontFamily: 'inherit' }}>Связаться</button>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '40px 48px 64px' }}>
        <div style={{
          background: D_COLORS.forest, color: D_COLORS.paper, borderRadius: 20,
          padding: '64px 56px', display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: 40, alignItems: 'center',
        }}>
          <div>
            <h2 style={{ fontFamily: D_FONT_SERIF, fontSize: 52, fontWeight: 400, letterSpacing: -1.5, lineHeight: 1.05, margin: 0 }}>
              Настройте Liora<br />за <em style={{ color: D_COLORS.terraSoft }}>10 минут</em>
            </h2>
            <p style={{ fontSize: 15, opacity: 0.8, marginTop: 20, maxWidth: 480, lineHeight: 1.6 }}>
              Без договоров и менеджеров. Импортируйте базу клиентов и расписание — и начинайте работать сегодня.
            </p>
          </div>
          <div style={{ display: 'grid', gap: 10 }}>
            <button style={{
              background: D_COLORS.paper, color: D_COLORS.ink, border: 'none',
              padding: '16px 24px', borderRadius: 8, fontSize: 14, fontFamily: 'inherit', cursor: 'pointer',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
              <span>Попробовать бесплатно</span>
              <span>→</span>
            </button>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {['App Store', 'Google Play', 'AppGallery', 'RuStore'].map((s) => (
                <div key={s} style={{
                  padding: '12px 14px', border: `1px solid ${D_COLORS.lineLight}`, borderRadius: 8,
                  fontSize: 11, display: 'flex', alignItems: 'center', gap: 8,
                }}>
                  <div style={{ width: 20, height: 20, background: 'rgba(255,255,255,0.12)', borderRadius: 4 }} />
                  {s}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <footer style={{ padding: '32px 48px', borderTop: `1px solid ${D_COLORS.line}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <D_Logo />
        <div style={{ display: 'flex', gap: 24, fontSize: 13, color: D_COLORS.inkSoft }}>
          <a>Возможности</a><a>Тарифы</a><a>Для клиентов</a><a>Поддержка</a>
        </div>
        <div style={{ fontSize: 12, color: D_COLORS.mute }}>© 2026 Liora</div>
      </footer>
    </div>
  );
}

function LioraBusinessMobile() {
  return (
    <div style={{ fontFamily: D_FONT_SANS, color: D_COLORS.ink, background: D_COLORS.cream, width: '100%', minHeight: '100%' }}>
      <nav style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1px solid ${D_COLORS.line}` }}>
        <D_Logo />
        <div style={{ width: 34, height: 34, borderRadius: 8, border: `1px solid ${D_COLORS.line}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke={D_COLORS.ink} strokeWidth="1.5"><path d="M2 4h10M2 7h10M2 10h10"/></svg>
        </div>
      </nav>

      <section style={{ padding: '24px 20px 20px' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          padding: '4px 10px', background: D_COLORS.creamSoft, borderRadius: 999,
          fontSize: 10, color: D_COLORS.inkSoft, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 20,
        }}>
          <span style={{ width: 5, height: 5, borderRadius: 3, background: D_COLORS.forest }} />
          Бесплатно для мастеров
        </div>
        <h1 style={{ fontFamily: D_FONT_SERIF, fontSize: 40, fontWeight: 400, letterSpacing: -1.2, lineHeight: 1, margin: 0 }}>
          Расписание, клиенты и <em style={{ color: D_COLORS.forest }}>финансы</em>
        </h1>
        <p style={{ fontSize: 14, color: D_COLORS.inkSoft, lineHeight: 1.55, margin: '18px 0 20px' }}>
          Операционная система для салонов и мастеров. Всё в одном кабинете.
        </p>
        <button style={{
          width: '100%', background: D_COLORS.ink, color: D_COLORS.paper, border: 'none',
          padding: '14px', borderRadius: 8, fontSize: 14, fontFamily: 'inherit',
        }}>Настроить за 10 минут →</button>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginTop: 24 }}>
          {[['14 дней', 'free'], ['0 ₽', 'комиссии'], ['25 мин', 'настройка'], ['24/7', 'поддержка']].map(([v, l]) => (
            <div key={v} style={{ borderLeft: `2px solid ${D_COLORS.terra}`, paddingLeft: 10 }}>
              <div style={{ fontFamily: D_FONT_SERIF, fontSize: 18, fontWeight: 500 }}>{v}</div>
              <div style={{ fontSize: 11, color: D_COLORS.mute }}>{l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* mini cal */}
      <section style={{ padding: '8px 20px 20px' }}>
        <div style={{ background: D_COLORS.paper, borderRadius: 14, border: `1px solid ${D_COLORS.line}`, padding: 14 }}>
          <div style={{ fontFamily: D_FONT_SERIF, fontSize: 16, marginBottom: 10 }}>Март · Неделя 12</div>
          {[
            { t: '10:00', n: 'Маникюр · Мария', c: D_COLORS.terraSoft },
            { t: '11:30', n: 'Окрашивание', c: D_COLORS.sand },
            { t: '14:00', n: 'Коррекция бровей', c: D_COLORS.creamSoft },
            { t: '15:30', n: 'Стрижка', c: D_COLORS.terraSoft },
          ].map((a) => (
            <div key={a.t} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '8px 10px', background: a.c, borderLeft: `3px solid ${D_COLORS.forest}`,
              borderRadius: 6, marginBottom: 4, fontSize: 12,
            }}>
              <div style={{ fontWeight: 600, minWidth: 38 }}>{a.t}</div>
              <div>{a.n}</div>
            </div>
          ))}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginTop: 12, paddingTop: 12, borderTop: `1px solid ${D_COLORS.line}` }}>
            {[['23', 'записи'], ['87%', 'загрузка'], ['42К ₽', 'выручка']].map(([v, l]) => (
              <div key={l}>
                <div style={{ fontFamily: D_FONT_SERIF, fontSize: 16, fontWeight: 500 }}>{v}</div>
                <div style={{ fontSize: 10, color: D_COLORS.mute }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ticker */}
      <section style={{ padding: '20px', background: D_COLORS.forest, color: D_COLORS.paper }}>
        <div style={{ fontSize: 10, letterSpacing: 1.5, textTransform: 'uppercase', opacity: 0.7, marginBottom: 14 }}>— Цифры Liora</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {[['120K+', 'компаний'], ['95', 'стран'], ['15M+', 'записей / мес'], ['4.8 ★', 'рейтинг']].map(([v, l]) => (
            <div key={v}>
              <div style={{ fontFamily: D_FONT_SERIF, fontSize: 26, letterSpacing: -0.5 }}>{v}</div>
              <div style={{ fontSize: 11, opacity: 0.75 }}>{l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* testimonial */}
      <section style={{ padding: '20px' }}>
        <div style={{ background: D_COLORS.paper, border: `1px solid ${D_COLORS.line}`, borderRadius: 14, padding: 18 }}>
          <div style={{ fontSize: 10, letterSpacing: 1.5, textTransform: 'uppercase', color: D_COLORS.mute, marginBottom: 8 }}>— Кейс · Орхидея</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 16 }}>
            {[['+34%', 'выручка'], ['−62%', 'отмены'], ['×2.1', 'повторы']].map(([v, l]) => (
              <div key={l}>
                <div style={{ fontFamily: D_FONT_SERIF, fontSize: 20, color: D_COLORS.forest, fontWeight: 500 }}>{v}</div>
                <div style={{ fontSize: 10, color: D_COLORS.mute }}>{l}</div>
              </div>
            ))}
          </div>
          <p style={{ fontFamily: D_FONT_SERIF, fontSize: 18, fontWeight: 400, lineHeight: 1.3, margin: 0 }}>
            «Мы занимаемся клиентами, а не телефоном»
          </p>
          <div style={{ fontSize: 11, color: D_COLORS.mute, marginTop: 8 }}>— Мария Величко, салон «Орхидея»</div>
        </div>
      </section>

      {/* pricing mini */}
      <section style={{ padding: '10px 20px 32px' }}>
        <h2 style={{ fontFamily: D_FONT_SERIF, fontSize: 24, fontWeight: 400, letterSpacing: -0.5, margin: '12px 0 14px' }}>Тарифы</h2>
        {[
          { n: 'Старт', p: '0 ₽', s: 'навсегда', f: 'До 3 мастеров' },
          { n: 'Салон', p: '1 490 ₽', s: '/мес', f: 'До 20 мастеров + финансы', best: true },
          { n: 'Сеть', p: 'от 4 900 ₽', s: '/мес', f: 'Без лимита + филиалы' },
        ].map((t) => (
          <div key={t.n} style={{
            background: t.best ? D_COLORS.creamSoft : D_COLORS.paper,
            border: `1px solid ${D_COLORS.line}`, borderRadius: 12, padding: 14, marginBottom: 8,
            display: 'flex', alignItems: 'center', gap: 12,
          }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, color: D_COLORS.mute }}>{t.n}{t.best && <span style={{ marginLeft: 8, fontSize: 10, color: D_COLORS.terra, fontWeight: 600 }}>ПОПУЛЯРНО</span>}</div>
              <div style={{ fontFamily: D_FONT_SERIF, fontSize: 22, fontWeight: 500, letterSpacing: -0.4 }}>
                {t.p} <span style={{ fontSize: 12, color: D_COLORS.mute, fontFamily: D_FONT_SANS }}>{t.s}</span>
              </div>
              <div style={{ fontSize: 11, color: D_COLORS.inkSoft, marginTop: 2 }}>{t.f}</div>
            </div>
            <button style={{
              background: t.best ? D_COLORS.ink : 'transparent',
              color: t.best ? D_COLORS.paper : D_COLORS.ink,
              border: t.best ? 'none' : `1px solid ${D_COLORS.ink}`,
              padding: '8px 14px', borderRadius: 6, fontSize: 11, fontFamily: 'inherit',
            }}>Выбрать</button>
          </div>
        ))}
      </section>
    </div>
  );
}

Object.assign(window, { LioraBusinessDesktop, LioraBusinessMobile });
