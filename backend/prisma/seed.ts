import 'dotenv/config'; // загружаем .env до создания PrismaClient
import { PrismaClient, Role, BookingStatus, BusinessCategory } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as bcrypt from 'bcryptjs';

// Prisma 7: создаём клиент через driver adapter
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// Вспомогательная функция: хешируем пароль перед сохранением в БД
async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10); // 10 rounds — стандарт для bcrypt
}

async function main() {
  console.log('Начинаем заполнение тестовыми данными...');

  // ==================== ОЧИСТКА ====================
  // Удаляем в порядке зависимостей (дочерние сначала)
  await prisma.review.deleteMany();
  await prisma.favorite.deleteMany();
  await prisma.bookingItem.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.schedule.deleteMany();
  await prisma.staffService.deleteMany();
  await prisma.service.deleteMany();
  await prisma.staff.deleteMany();
  await prisma.business.deleteMany();
  await prisma.user.deleteMany();

  console.log('База данных очищена');

  // ==================== SUPER ADMIN ====================
  const superAdmin = await prisma.user.create({
    data: {
      email: 'admin@liora.app',
      passwordHash: await hashPassword('Admin123!'),
      name: 'Администратор Liora',
      role: Role.SUPER_ADMIN,
      country: 'RU',
      city: 'Москва',
    },
  });

  // ==================== КЛИЕНТЫ ====================
  const clients = await Promise.all([
    prisma.user.create({
      data: {
        email: 'anna@example.com',
        passwordHash: await hashPassword('Client123!'),
        name: 'Анна Смирнова',
        phone: '+79001234567',
        role: Role.CLIENT,
        country: 'RU',
        city: 'Москва',
      },
    }),
    prisma.user.create({
      data: {
        email: 'maria@example.com',
        passwordHash: await hashPassword('Client123!'),
        name: 'Мария Иванова',
        phone: '+79007654321',
        role: Role.CLIENT,
        country: 'RU',
        city: 'Санкт-Петербург',
      },
    }),
    prisma.user.create({
      data: {
        email: 'elena@example.com',
        passwordHash: await hashPassword('Client123!'),
        name: 'Елена Козлова',
        phone: '+79001112233',
        role: Role.CLIENT,
        country: 'BY',
        city: 'Минск',
      },
    }),
    prisma.user.create({
      data: {
        email: 'olga@example.com',
        passwordHash: await hashPassword('Client123!'),
        name: 'Ольга Петрова',
        phone: '+79004445566',
        role: Role.CLIENT,
        country: 'RU',
        city: 'Москва',
      },
    }),
    prisma.user.create({
      data: {
        email: 'svetlana@example.com',
        passwordHash: await hashPassword('Client123!'),
        name: 'Светлана Новикова',
        phone: '+79007778899',
        role: Role.CLIENT,
        country: 'KZ',
        city: 'Алматы',
      },
    }),
  ]);

  console.log(`Создано ${clients.length} клиентов`);

  // ==================== БИЗНЕС 1: Салон красоты "Belle" ====================
  const belleOwner = await prisma.user.create({
    data: {
      email: 'owner.belle@example.com',
      passwordHash: await hashPassword('Business123!'),
      name: 'Наталья Белова',
      role: Role.BUSINESS_ADMIN,
      country: 'RU',
      city: 'Москва',
    },
  });

  const belleSalon = await prisma.business.create({
    data: {
      name: 'Belle Beauty Studio',
      slug: 'belle-beauty',
      description: 'Премиальный салон красоты в центре Москвы. Мастера с опытом от 5 лет.',
      address: 'ул. Тверская, 15',
      phone: '+74951234567',
      category: BusinessCategory.BEAUTY_SALON,
      country: 'RU',
      city: 'Москва',
      isActive: true,
      isVisible: true, // станет true после добавления мастеров и услуг
      maxAdvanceBookingDays: 30,
      ownerId: belleOwner.id,
    },
  });

  // Услуги Belle
  const belleServices = await Promise.all([
    prisma.service.create({
      data: {
        businessId: belleSalon.id,
        name: 'Стрижка женская',
        description: 'Модельная стрижка с укладкой',
        price: 2500,
        duration: 60,
      },
    }),
    prisma.service.create({
      data: {
        businessId: belleSalon.id,
        name: 'Окрашивание волос',
        description: 'Однотонное окрашивание, любая длина',
        price: 5000,
        duration: 120,
      },
    }),
    prisma.service.create({
      data: {
        businessId: belleSalon.id,
        name: 'Маникюр классический',
        description: 'Обработка ногтей + покрытие гель-лаком',
        price: 1800,
        duration: 90,
      },
    }),
    prisma.service.create({
      data: {
        businessId: belleSalon.id,
        name: 'Педикюр',
        description: 'Аппаратный педикюр + покрытие',
        price: 2200,
        duration: 90,
      },
    }),
  ]);

  // Мастера Belle
  const belleStaff1User = await prisma.user.create({
    data: {
      email: 'yulia.belle@example.com',
      passwordHash: await hashPassword('Staff123!'),
      name: 'Юлия Морозова',
      role: Role.STAFF,
      country: 'RU',
      city: 'Москва',
    },
  });

  const belleStaff1 = await prisma.staff.create({
    data: {
      userId: belleStaff1User.id,
      businessId: belleSalon.id,
      bio: 'Стилист-колорист с 7-летним опытом. Специализация: окрашивание и уход.',
      isActive: true,
    },
  });

  const belleStaff2User = await prisma.user.create({
    data: {
      email: 'ksenia.belle@example.com',
      passwordHash: await hashPassword('Staff123!'),
      name: 'Ксения Волкова',
      role: Role.STAFF,
      country: 'RU',
      city: 'Москва',
    },
  });

  const belleStaff2 = await prisma.staff.create({
    data: {
      userId: belleStaff2User.id,
      businessId: belleSalon.id,
      bio: 'Мастер маникюра и педикюра. Сертифицированный nail-технолог.',
      isActive: true,
    },
  });

  // Привязываем услуги к мастерам (M:N)
  await prisma.staffService.createMany({
    data: [
      { staffId: belleStaff1.id, serviceId: belleServices[0].id }, // стрижка
      { staffId: belleStaff1.id, serviceId: belleServices[1].id }, // окрашивание
      { staffId: belleStaff2.id, serviceId: belleServices[2].id }, // маникюр
      { staffId: belleStaff2.id, serviceId: belleServices[3].id }, // педикюр
    ],
  });

  // Расписание мастеров Belle (Пн-Пт 10:00-19:00, Сб 10:00-17:00)
  for (const staff of [belleStaff1, belleStaff2]) {
    await prisma.schedule.createMany({
      data: [
        { staffId: staff.id, dayOfWeek: 1, startTime: '10:00', endTime: '19:00', isWorking: true },
        { staffId: staff.id, dayOfWeek: 2, startTime: '10:00', endTime: '19:00', isWorking: true },
        { staffId: staff.id, dayOfWeek: 3, startTime: '10:00', endTime: '19:00', isWorking: true },
        { staffId: staff.id, dayOfWeek: 4, startTime: '10:00', endTime: '19:00', isWorking: true },
        { staffId: staff.id, dayOfWeek: 5, startTime: '10:00', endTime: '19:00', isWorking: true },
        { staffId: staff.id, dayOfWeek: 6, startTime: '10:00', endTime: '17:00', isWorking: true },
        { staffId: staff.id, dayOfWeek: 0, startTime: '00:00', endTime: '00:00', isWorking: false }, // воскресенье выходной
      ],
    });
  }

  // ==================== БИЗНЕС 2: Барбершоп "Kings" ====================
  const kingsOwner = await prisma.user.create({
    data: {
      email: 'owner.kings@example.com',
      passwordHash: await hashPassword('Business123!'),
      name: 'Артём Королёв',
      role: Role.BUSINESS_ADMIN,
      country: 'RU',
      city: 'Санкт-Петербург',
    },
  });

  const kingsBarber = await prisma.business.create({
    data: {
      name: 'Kings Barbershop',
      slug: 'kings-barbershop',
      description: 'Мужской барбершоп с атмосферой классики. Стрижки, бритьё, уход за бородой.',
      address: 'Невский проспект, 48',
      phone: '+78121234567',
      category: BusinessCategory.BARBERSHOP,
      country: 'RU',
      city: 'Санкт-Петербург',
      isActive: true,
      isVisible: true,
      maxAdvanceBookingDays: 14,
      ownerId: kingsOwner.id,
    },
  });

  const kingsServices = await Promise.all([
    prisma.service.create({
      data: {
        businessId: kingsBarber.id,
        name: 'Стрижка мужская',
        description: 'Классическая стрижка с укладкой',
        price: 1500,
        duration: 45,
      },
    }),
    prisma.service.create({
      data: {
        businessId: kingsBarber.id,
        name: 'Оформление бороды',
        description: 'Стрижка и моделирование бороды',
        price: 1000,
        duration: 30,
      },
    }),
    prisma.service.create({
      data: {
        businessId: kingsBarber.id,
        name: 'Стрижка + борода',
        description: 'Комплекс: стрижка и борода',
        price: 2200,
        duration: 70,
      },
    }),
  ]);

  const kingsStaff1User = await prisma.user.create({
    data: {
      email: 'dmitry.kings@example.com',
      passwordHash: await hashPassword('Staff123!'),
      name: 'Дмитрий Сидоров',
      role: Role.STAFF,
      country: 'RU',
      city: 'Санкт-Петербург',
    },
  });

  const kingsStaff1 = await prisma.staff.create({
    data: {
      userId: kingsStaff1User.id,
      businessId: kingsBarber.id,
      bio: 'Барбер с 5-летним стажем. Специализируюсь на классических и fade-стрижках.',
      isActive: true,
    },
  });

  const kingsStaff2User = await prisma.user.create({
    data: {
      email: 'alexey.kings@example.com',
      passwordHash: await hashPassword('Staff123!'),
      name: 'Алексей Попов',
      role: Role.STAFF,
      country: 'RU',
      city: 'Санкт-Петербург',
    },
  });

  const kingsStaff2 = await prisma.staff.create({
    data: {
      userId: kingsStaff2User.id,
      businessId: kingsBarber.id,
      bio: 'Мастер мужских стрижек и бритья опасной бритвой.',
      isActive: true,
    },
  });

  await prisma.staffService.createMany({
    data: [
      { staffId: kingsStaff1.id, serviceId: kingsServices[0].id },
      { staffId: kingsStaff1.id, serviceId: kingsServices[1].id },
      { staffId: kingsStaff1.id, serviceId: kingsServices[2].id },
      { staffId: kingsStaff2.id, serviceId: kingsServices[0].id },
      { staffId: kingsStaff2.id, serviceId: kingsServices[1].id },
      { staffId: kingsStaff2.id, serviceId: kingsServices[2].id },
    ],
  });

  // Барбершоп работает Пн-Сб 11:00-21:00
  for (const staff of [kingsStaff1, kingsStaff2]) {
    await prisma.schedule.createMany({
      data: [
        { staffId: staff.id, dayOfWeek: 1, startTime: '11:00', endTime: '21:00', isWorking: true },
        { staffId: staff.id, dayOfWeek: 2, startTime: '11:00', endTime: '21:00', isWorking: true },
        { staffId: staff.id, dayOfWeek: 3, startTime: '11:00', endTime: '21:00', isWorking: true },
        { staffId: staff.id, dayOfWeek: 4, startTime: '11:00', endTime: '21:00', isWorking: true },
        { staffId: staff.id, dayOfWeek: 5, startTime: '11:00', endTime: '21:00', isWorking: true },
        { staffId: staff.id, dayOfWeek: 6, startTime: '11:00', endTime: '20:00', isWorking: true },
        { staffId: staff.id, dayOfWeek: 0, startTime: '00:00', endTime: '00:00', isWorking: false },
      ],
    });
  }

  // ==================== БИЗНЕС 3: Nail-студия "Glow" ====================
  const glowOwner = await prisma.user.create({
    data: {
      email: 'owner.glow@example.com',
      passwordHash: await hashPassword('Business123!'),
      name: 'Виктория Глушкова',
      role: Role.BUSINESS_ADMIN,
      country: 'RU',
      city: 'Москва',
    },
  });

  const glowNail = await prisma.business.create({
    data: {
      name: 'Glow Nail Studio',
      slug: 'glow-nails',
      description: 'Nail-студия премиального уровня. Авторские дизайны, высококачественные материалы.',
      address: 'ул. Арбат, 22',
      phone: '+74959876543',
      category: BusinessCategory.NAIL_STUDIO,
      country: 'RU',
      city: 'Москва',
      isActive: true,
      isVisible: true,
      maxAdvanceBookingDays: 21,
      ownerId: glowOwner.id,
    },
  });

  const glowServices = await Promise.all([
    prisma.service.create({
      data: {
        businessId: glowNail.id,
        name: 'Маникюр + гель-лак',
        description: 'Классический маникюр с покрытием гель-лаком',
        price: 2000,
        duration: 75,
      },
    }),
    prisma.service.create({
      data: {
        businessId: glowNail.id,
        name: 'Наращивание ногтей',
        description: 'Акрил или гель, любая форма и длина',
        price: 4500,
        duration: 150,
      },
    }),
    prisma.service.create({
      data: {
        businessId: glowNail.id,
        name: 'Nail Art (1 ноготь)',
        description: 'Авторский дизайн на одном ногте',
        price: 300,
        duration: 15,
      },
    }),
  ]);

  const glowStaffUser = await prisma.user.create({
    data: {
      email: 'polina.glow@example.com',
      passwordHash: await hashPassword('Staff123!'),
      name: 'Полина Жукова',
      role: Role.STAFF,
      country: 'RU',
      city: 'Москва',
    },
  });

  const glowStaff = await prisma.staff.create({
    data: {
      userId: glowStaffUser.id,
      businessId: glowNail.id,
      bio: 'Nail-мастер, победитель регионального чемпионата. Специализация: nail art и наращивание.',
      isActive: true,
    },
  });

  await prisma.staffService.createMany({
    data: glowServices.map((s: { id: string }) => ({ staffId: glowStaff.id, serviceId: s.id })),
  });

  await prisma.schedule.createMany({
    data: [
      { staffId: glowStaff.id, dayOfWeek: 1, startTime: '10:00', endTime: '18:00', isWorking: true },
      { staffId: glowStaff.id, dayOfWeek: 2, startTime: '10:00', endTime: '18:00', isWorking: true },
      { staffId: glowStaff.id, dayOfWeek: 3, startTime: '00:00', endTime: '00:00', isWorking: false }, // среда выходной
      { staffId: glowStaff.id, dayOfWeek: 4, startTime: '10:00', endTime: '18:00', isWorking: true },
      { staffId: glowStaff.id, dayOfWeek: 5, startTime: '10:00', endTime: '18:00', isWorking: true },
      { staffId: glowStaff.id, dayOfWeek: 6, startTime: '10:00', endTime: '17:00', isWorking: true },
      { staffId: glowStaff.id, dayOfWeek: 0, startTime: '00:00', endTime: '00:00', isWorking: false },
    ],
  });

  // ==================== ЗАПИСИ (BOOKINGS) ====================
  // Создаём 12 записей с разными статусами для наглядности
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const futureDate = (daysAhead: number) => {
    const d = new Date(today);
    d.setDate(d.getDate() + daysAhead);
    return d;
  };

  const pastDate = (daysAgo: number) => {
    const d = new Date(today);
    d.setDate(d.getDate() - daysAgo);
    return d;
  };

  // Запись 1: Анна → Belle → Юлия → Стрижка (CONFIRMED)
  const booking1 = await prisma.booking.create({
    data: {
      clientId: clients[0].id,
      staffId: belleStaff1.id,
      businessId: belleSalon.id,
      date: futureDate(2),
      startTime: '11:00',
      endTime: '12:00',
      totalPrice: 2500,
      totalDuration: 60,
      status: BookingStatus.CONFIRMED,
      notes: 'Хочу немного подровнять концы',
    },
  });

  await prisma.bookingItem.create({
    data: {
      bookingId: booking1.id,
      serviceId: belleServices[0].id,
      price: 2500,
      duration: 60,
    },
  });

  // Запись 2: Анна → Belle → Юлия → Окрашивание (PENDING)
  const booking2 = await prisma.booking.create({
    data: {
      clientId: clients[0].id,
      staffId: belleStaff1.id,
      businessId: belleSalon.id,
      date: futureDate(7),
      startTime: '14:00',
      endTime: '16:00',
      totalPrice: 5000,
      totalDuration: 120,
      status: BookingStatus.PENDING,
    },
  });

  await prisma.bookingItem.create({
    data: {
      bookingId: booking2.id,
      serviceId: belleServices[1].id,
      price: 5000,
      duration: 120,
    },
  });

  // Запись 3: Мария → Kings → Дмитрий → Стрижка (COMPLETED) — для отзыва
  const booking3 = await prisma.booking.create({
    data: {
      clientId: clients[1].id,
      staffId: kingsStaff1.id,
      businessId: kingsBarber.id,
      date: pastDate(3),
      startTime: '13:00',
      endTime: '13:45',
      totalPrice: 1500,
      totalDuration: 45,
      status: BookingStatus.COMPLETED,
    },
  });

  await prisma.bookingItem.create({
    data: {
      bookingId: booking3.id,
      serviceId: kingsServices[0].id,
      price: 1500,
      duration: 45,
    },
  });

  // Запись 4: Елена → Glow → Полина → Маникюр (COMPLETED) — для отзыва
  const booking4 = await prisma.booking.create({
    data: {
      clientId: clients[2].id,
      staffId: glowStaff.id,
      businessId: glowNail.id,
      date: pastDate(5),
      startTime: '10:00',
      endTime: '11:15',
      totalPrice: 2000,
      totalDuration: 75,
      status: BookingStatus.COMPLETED,
    },
  });

  await prisma.bookingItem.create({
    data: {
      bookingId: booking4.id,
      serviceId: glowServices[0].id,
      price: 2000,
      duration: 75,
    },
  });

  // Запись 5: Ольга → Kings → Алексей → Стрижка + борода (CONFIRMED)
  const booking5 = await prisma.booking.create({
    data: {
      clientId: clients[3].id,
      staffId: kingsStaff2.id,
      businessId: kingsBarber.id,
      date: futureDate(1),
      startTime: '15:00',
      endTime: '16:10',
      totalPrice: 2200,
      totalDuration: 70,
      status: BookingStatus.CONFIRMED,
    },
  });

  await prisma.bookingItem.create({
    data: {
      bookingId: booking5.id,
      serviceId: kingsServices[2].id,
      price: 2200,
      duration: 70,
    },
  });

  // Запись 6: Светлана → Belle → Ксения → Маникюр + педикюр (PENDING)
  const booking6 = await prisma.booking.create({
    data: {
      clientId: clients[4].id,
      staffId: belleStaff2.id,
      businessId: belleSalon.id,
      date: futureDate(3),
      startTime: '12:00',
      endTime: '15:00',
      totalPrice: 4000,
      totalDuration: 180,
      status: BookingStatus.PENDING,
      notes: 'Предпочтительно нейтральные тона',
    },
  });

  await prisma.bookingItem.createMany({
    data: [
      { bookingId: booking6.id, serviceId: belleServices[2].id, price: 1800, duration: 90 },
      { bookingId: booking6.id, serviceId: belleServices[3].id, price: 2200, duration: 90 },
    ],
  });

  // Запись 7: Анна → Kings → Дмитрий → Стрижка (CANCELLED)
  const booking7 = await prisma.booking.create({
    data: {
      clientId: clients[0].id,
      staffId: kingsStaff1.id,
      businessId: kingsBarber.id,
      date: pastDate(1),
      startTime: '16:00',
      endTime: '16:45',
      totalPrice: 1500,
      totalDuration: 45,
      status: BookingStatus.CANCELLED,
    },
  });

  await prisma.bookingItem.create({
    data: {
      bookingId: booking7.id,
      serviceId: kingsServices[0].id,
      price: 1500,
      duration: 45,
    },
  });

  // Запись 8: Мария → Glow → Полина → Наращивание (PENDING)
  const booking8 = await prisma.booking.create({
    data: {
      clientId: clients[1].id,
      staffId: glowStaff.id,
      businessId: glowNail.id,
      date: futureDate(4),
      startTime: '10:00',
      endTime: '12:30',
      totalPrice: 4500,
      totalDuration: 150,
      status: BookingStatus.PENDING,
    },
  });

  await prisma.bookingItem.create({
    data: {
      bookingId: booking8.id,
      serviceId: glowServices[1].id,
      price: 4500,
      duration: 150,
    },
  });

  console.log('Записи созданы');

  // ==================== ОТЗЫВЫ ====================
  // Только для COMPLETED записей

  await prisma.review.create({
    data: {
      bookingId: booking3.id,
      clientId: clients[1].id,
      staffId: kingsStaff1.id,
      businessId: kingsBarber.id,
      rating: 5,
      comment: 'Отличная стрижка! Дмитрий настоящий мастер. Буду записываться снова.',
    },
  });

  await prisma.review.create({
    data: {
      bookingId: booking4.id,
      clientId: clients[2].id,
      staffId: glowStaff.id,
      businessId: glowNail.id,
      rating: 5,
      comment: 'Полина — невероятный мастер! Маникюр держится уже 3 недели.',
    },
  });

  // ==================== ИЗБРАННЫЕ ====================

  await prisma.favorite.createMany({
    data: [
      { clientId: clients[0].id, staffId: belleStaff1.id }, // Анна → Юлия
      { clientId: clients[0].id, staffId: glowStaff.id },   // Анна → Полина
      { clientId: clients[1].id, staffId: kingsStaff1.id }, // Мария → Дмитрий
      { clientId: clients[2].id, staffId: glowStaff.id },   // Елена → Полина
    ],
  });

  console.log('Отзывы и избранные созданы');
  console.log('\n✅ Тестовые данные успешно загружены!\n');
  console.log('Тестовые аккаунты:');
  console.log('  SUPER_ADMIN:    admin@liora.app / Admin123!');
  console.log('  BUSINESS_ADMIN: owner.belle@example.com / Business123!');
  console.log('  BUSINESS_ADMIN: owner.kings@example.com / Business123!');
  console.log('  BUSINESS_ADMIN: owner.glow@example.com / Business123!');
  console.log('  STAFF:          yulia.belle@example.com / Staff123!');
  console.log('  STAFF:          dmitry.kings@example.com / Staff123!');
  console.log('  CLIENT:         anna@example.com / Client123!');
  console.log('  CLIENT:         maria@example.com / Client123!');
}

main()
  .catch((e) => {
    console.error('Ошибка при заполнении:', e);
    process.exit(1);
  })
  .finally(async () => {
    // Обязательно закрываем соединение с БД после завершения seed
    await prisma.$disconnect();
  });
