// Список стран для выпадающих списков при регистрации и в профиле
// Код страны используется для персонализации контента (показывать бизнесы из своей страны)
export const COUNTRIES = [
  { code: 'RU', name: 'Россия' },
  { code: 'BY', name: 'Беларусь' },
  { code: 'KZ', name: 'Казахстан' },
  { code: 'UA', name: 'Украина' },
  { code: 'UZ', name: 'Узбекистан' },
  { code: 'AM', name: 'Армения' },
  { code: 'GE', name: 'Грузия' },
  { code: 'AZ', name: 'Азербайджан' },
  { code: 'KG', name: 'Кыргызстан' },
  { code: 'MD', name: 'Молдова' },
] as const;

// Города для выпадающих списков, сгруппированные по странам
// При выборе страны показываются только города этой страны
export const CITIES_BY_COUNTRY: Record<string, string[]> = {
  RU: [
    'Москва',
    'Санкт-Петербург',
    'Новосибирск',
    'Екатеринбург',
    'Казань',
    'Нижний Новгород',
    'Челябинск',
    'Самара',
    'Омск',
    'Ростов-на-Дону',
    'Уфа',
    'Красноярск',
    'Пермь',
    'Воронеж',
    'Волгоград',
  ],
  BY: ['Минск', 'Гомель', 'Могилёв', 'Витебск', 'Гродно', 'Брест'],
  KZ: ['Алматы', 'Астана', 'Шымкент', 'Актобе', 'Тараз', 'Павлодар'],
  UA: ['Киев', 'Харьков', 'Одесса', 'Днепр', 'Запорожье', 'Львов'],
  UZ: ['Ташкент', 'Самарканд', 'Наманган', 'Андижан', 'Фергана'],
  AM: ['Ереван', 'Гюмри', 'Ванадзор'],
  GE: ['Тбилиси', 'Батуми', 'Кутаиси', 'Рустави'],
  AZ: ['Баку', 'Гянджа', 'Сумгайыт'],
  KG: ['Бишкек', 'Ош', 'Джалал-Абад'],
  MD: ['Кишинёв', 'Тирасполь', 'Бельцы'],
};

// Категории бизнесов — соответствуют enum BusinessCategory в Prisma schema
// label — для отображения в UI, value — для отправки на сервер
export const BUSINESS_CATEGORIES = [
  { value: 'BARBERSHOP', label: 'Барбершоп', icon: '✂️' },
  { value: 'BEAUTY_SALON', label: 'Салон красоты', icon: '💅' },
  { value: 'NAIL_STUDIO', label: 'Nail-студия', icon: '💅' },
  { value: 'LASH_STUDIO', label: 'Lash-студия', icon: '👁️' },
  { value: 'MASSAGE', label: 'Массаж', icon: '💆' },
  { value: 'COSMETOLOGY', label: 'Косметология', icon: '✨' },
  { value: 'FITNESS', label: 'Фитнес', icon: '💪' },
  { value: 'OTHER', label: 'Другое', icon: '🏪' },
] as const;

// Статусы записей — для отображения бейджей и фильтров
export const BOOKING_STATUS_LABELS: Record<string, { label: string; color: string }> = {
  PENDING: { label: 'Ожидает', color: 'yellow' },
  CONFIRMED: { label: 'Подтверждено', color: 'green' },
  CANCELLED: { label: 'Отменено', color: 'red' },
  COMPLETED: { label: 'Завершено', color: 'purple' },
};

// За сколько часов до записи нельзя отменить (бизнес-правило из ТЗ раздел 8.3)
export const CANCELLATION_HOURS_LIMIT = 2;
