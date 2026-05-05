import 'dotenv/config';
import { PrismaClient, Role, BookingStatus, BusinessCategory } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as bcrypt from 'bcryptjs';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

async function main() {
  console.log('Начинаем заполнение тестовыми данными...');

  // Очистка в порядке зависимостей
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
  await prisma.user.create({
    data: {
      email: 'admin@liora.app',
      passwordHash: await hashPassword('Admin123!'),
      name: 'Администратор Liora',
      role: Role.SUPER_ADMIN,
      country: 'KZ',
      city: 'Усть-Каменогорск',
    },
  });

  // ==================== КЛИЕНТЫ ====================
  const clients = await Promise.all([
    prisma.user.create({
      data: {
        email: 'anna@example.com',
        passwordHash: await hashPassword('Client123!'),
        name: 'Анна Смирнова',
        phone: '+77771234567',
        role: Role.CLIENT,
        country: 'KZ',
        city: 'Усть-Каменогорск',
      },
    }),
    prisma.user.create({
      data: {
        email: 'maria@example.com',
        passwordHash: await hashPassword('Client123!'),
        name: 'Мария Иванова',
        phone: '+77777654321',
        role: Role.CLIENT,
        country: 'KZ',
        city: 'Усть-Каменогорск',
      },
    }),
    prisma.user.create({
      data: {
        email: 'elena@example.com',
        passwordHash: await hashPassword('Client123!'),
        name: 'Елена Козлова',
        phone: '+77771112233',
        role: Role.CLIENT,
        country: 'KZ',
        city: 'Алматы',
      },
    }),
    prisma.user.create({
      data: {
        email: 'olga@example.com',
        passwordHash: await hashPassword('Client123!'),
        name: 'Ольга Петрова',
        phone: '+77774445566',
        role: Role.CLIENT,
        country: 'KZ',
        city: 'Усть-Каменогорск',
      },
    }),
    prisma.user.create({
      data: {
        email: 'svetlana@example.com',
        passwordHash: await hashPassword('Client123!'),
        name: 'Светлана Новикова',
        phone: '+77777778899',
        role: Role.CLIENT,
        country: 'KZ',
        city: 'Астана',
      },
    }),
  ]);

  console.log(`Создано ${clients.length} клиентов`);

  // ==================== БИЗНЕС 1: Салон красоты "Belle" — Усть-Каменогорск ====================
  const belleOwner = await prisma.user.create({
    data: {
      email: 'owner.belle@example.com',
      passwordHash: await hashPassword('Business123!'),
      name: 'Наталья Белова',
      role: Role.BUSINESS_ADMIN,
      country: 'KZ',
      city: 'Усть-Каменогорск',
    },
  });

  const belleSalon = await prisma.business.create({
    data: {
      name: 'Belle Beauty Studio',
      slug: 'belle-beauty',
      description: 'Премиальный салон красоты. Мастера с опытом от 5 лет. Работаем для вас каждый день.',
      address: 'пр. Независимости, 15',
      phone: '+77712345678',
      category: BusinessCategory.BEAUTY_SALON,
      country: 'KZ',
      city: 'Усть-Каменогорск',
      isActive: true,
      isVisible: true,
      maxAdvanceBookingDays: 30,
      ownerId: belleOwner.id,
    },
  });

  const belleServices = await Promise.all([
    prisma.service.create({
      data: { businessId: belleSalon.id, name: 'Стрижка женская', description: 'Модельная стрижка с укладкой', price: 7000, duration: 60 },
    }),
    prisma.service.create({
      data: { businessId: belleSalon.id, name: 'Окрашивание волос', description: 'Однотонное окрашивание, любая длина', price: 15000, duration: 120 },
    }),
    prisma.service.create({
      data: { businessId: belleSalon.id, name: 'Маникюр классический', description: 'Обработка ногтей + покрытие гель-лаком', price: 5000, duration: 90 },
    }),
    prisma.service.create({
      data: { businessId: belleSalon.id, name: 'Педикюр', description: 'Аппаратный педикюр + покрытие', price: 6000, duration: 90 },
    }),
  ]);

  const belleStaff1User = await prisma.user.create({
    data: { email: 'yulia.belle@example.com', passwordHash: await hashPassword('Staff123!'), name: 'Юлия Морозова', role: Role.STAFF, country: 'KZ', city: 'Усть-Каменогорск' },
  });
  const belleStaff1 = await prisma.staff.create({
    data: { userId: belleStaff1User.id, businessId: belleSalon.id, bio: 'Стилист-колорист с 7-летним опытом. Специализация: окрашивание и уход.', isActive: true },
  });

  const belleStaff2User = await prisma.user.create({
    data: { email: 'ksenia.belle@example.com', passwordHash: await hashPassword('Staff123!'), name: 'Ксения Волкова', role: Role.STAFF, country: 'KZ', city: 'Усть-Каменогорск' },
  });
  const belleStaff2 = await prisma.staff.create({
    data: { userId: belleStaff2User.id, businessId: belleSalon.id, bio: 'Мастер маникюра и педикюра. Сертифицированный nail-технолог.', isActive: true },
  });

  await prisma.staffService.createMany({
    data: [
      { staffId: belleStaff1.id, serviceId: belleServices[0].id },
      { staffId: belleStaff1.id, serviceId: belleServices[1].id },
      { staffId: belleStaff2.id, serviceId: belleServices[2].id },
      { staffId: belleStaff2.id, serviceId: belleServices[3].id },
    ],
  });

  for (const staff of [belleStaff1, belleStaff2]) {
    await prisma.schedule.createMany({
      data: [
        { staffId: staff.id, dayOfWeek: 1, startTime: '10:00', endTime: '19:00', isWorking: true },
        { staffId: staff.id, dayOfWeek: 2, startTime: '10:00', endTime: '19:00', isWorking: true },
        { staffId: staff.id, dayOfWeek: 3, startTime: '10:00', endTime: '19:00', isWorking: true },
        { staffId: staff.id, dayOfWeek: 4, startTime: '10:00', endTime: '19:00', isWorking: true },
        { staffId: staff.id, dayOfWeek: 5, startTime: '10:00', endTime: '19:00', isWorking: true },
        { staffId: staff.id, dayOfWeek: 6, startTime: '10:00', endTime: '17:00', isWorking: true },
        { staffId: staff.id, dayOfWeek: 0, startTime: '00:00', endTime: '00:00', isWorking: false },
      ],
    });
  }

  // ==================== БИЗНЕС 2: Барбершоп "Kings" — Усть-Каменогорск ====================
  const kingsOwner = await prisma.user.create({
    data: { email: 'owner.kings@example.com', passwordHash: await hashPassword('Business123!'), name: 'Артём Королёв', role: Role.BUSINESS_ADMIN, country: 'KZ', city: 'Усть-Каменогорск' },
  });

  const kingsBarber = await prisma.business.create({
    data: {
      name: 'Kings Barbershop',
      slug: 'kings-barbershop',
      description: 'Мужской барбершоп с атмосферой классики. Стрижки, бритьё, уход за бородой.',
      address: 'ул. Протозанова, 48',
      phone: '+77713456789',
      category: BusinessCategory.BARBERSHOP,
      country: 'KZ',
      city: 'Усть-Каменогорск',
      isActive: true,
      isVisible: true,
      maxAdvanceBookingDays: 14,
      ownerId: kingsOwner.id,
    },
  });

  const kingsServices = await Promise.all([
    prisma.service.create({ data: { businessId: kingsBarber.id, name: 'Стрижка мужская', description: 'Классическая стрижка с укладкой', price: 4000, duration: 45 } }),
    prisma.service.create({ data: { businessId: kingsBarber.id, name: 'Оформление бороды', description: 'Стрижка и моделирование бороды', price: 3000, duration: 30 } }),
    prisma.service.create({ data: { businessId: kingsBarber.id, name: 'Стрижка + борода', description: 'Комплекс: стрижка и борода', price: 6000, duration: 70 } }),
  ]);

  const kingsStaff1User = await prisma.user.create({
    data: { email: 'dmitry.kings@example.com', passwordHash: await hashPassword('Staff123!'), name: 'Дмитрий Сидоров', role: Role.STAFF, country: 'KZ', city: 'Усть-Каменогорск' },
  });
  const kingsStaff1 = await prisma.staff.create({
    data: { userId: kingsStaff1User.id, businessId: kingsBarber.id, bio: 'Барбер с 5-летним стажем. Специализируюсь на классических и fade-стрижках.', isActive: true },
  });

  const kingsStaff2User = await prisma.user.create({
    data: { email: 'alexey.kings@example.com', passwordHash: await hashPassword('Staff123!'), name: 'Алексей Попов', role: Role.STAFF, country: 'KZ', city: 'Усть-Каменогорск' },
  });
  const kingsStaff2 = await prisma.staff.create({
    data: { userId: kingsStaff2User.id, businessId: kingsBarber.id, bio: 'Мастер мужских стрижек. Работаю быстро и качественно.', isActive: true },
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

  // ==================== БИЗНЕС 3: Nail-студия "Thai Mariya Spa" — Усть-Каменогорск ====================
  const glowOwner = await prisma.user.create({
    data: { email: 'owner.glow@example.com', passwordHash: await hashPassword('Business123!'), name: 'Виктория Глушкова', role: Role.BUSINESS_ADMIN, country: 'KZ', city: 'Усть-Каменогорск' },
  });

  const glowNail = await prisma.business.create({
    data: {
      name: 'Glow Nail Studio',
      slug: 'glow-nails',
      description: 'Nail-студия премиального уровня. Авторские дизайны, высококачественные материалы.',
      address: 'ул. Ауэзова, 10',
      phone: '+77719876543',
      category: BusinessCategory.NAIL_STUDIO,
      country: 'KZ',
      city: 'Усть-Каменогорск',
      isActive: true,
      isVisible: true,
      maxAdvanceBookingDays: 21,
      ownerId: glowOwner.id,
    },
  });

  const glowServices = await Promise.all([
    prisma.service.create({ data: { businessId: glowNail.id, name: 'Маникюр + гель-лак', description: 'Классический маникюр с покрытием гель-лаком', price: 6000, duration: 75 } }),
    prisma.service.create({ data: { businessId: glowNail.id, name: 'Наращивание ногтей', description: 'Акрил или гель, любая форма и длина', price: 12000, duration: 150 } }),
    prisma.service.create({ data: { businessId: glowNail.id, name: 'Nail Art', description: 'Авторский дизайн', price: 1000, duration: 20 } }),
  ]);

  const glowStaffUser = await prisma.user.create({
    data: { email: 'polina.glow@example.com', passwordHash: await hashPassword('Staff123!'), name: 'Полина Жукова', role: Role.STAFF, country: 'KZ', city: 'Усть-Каменогорск' },
  });
  const glowStaff = await prisma.staff.create({
    data: { userId: glowStaffUser.id, businessId: glowNail.id, bio: 'Nail-мастер, победитель городского чемпионата. Специализация: nail art и наращивание.', isActive: true },
  });

  await prisma.staffService.createMany({
    data: glowServices.map((s: { id: string }) => ({ staffId: glowStaff.id, serviceId: s.id })),
  });

  await prisma.schedule.createMany({
    data: [
      { staffId: glowStaff.id, dayOfWeek: 1, startTime: '10:00', endTime: '18:00', isWorking: true },
      { staffId: glowStaff.id, dayOfWeek: 2, startTime: '10:00', endTime: '18:00', isWorking: true },
      { staffId: glowStaff.id, dayOfWeek: 3, startTime: '00:00', endTime: '00:00', isWorking: false },
      { staffId: glowStaff.id, dayOfWeek: 4, startTime: '10:00', endTime: '18:00', isWorking: true },
      { staffId: glowStaff.id, dayOfWeek: 5, startTime: '10:00', endTime: '18:00', isWorking: true },
      { staffId: glowStaff.id, dayOfWeek: 6, startTime: '10:00', endTime: '17:00', isWorking: true },
      { staffId: glowStaff.id, dayOfWeek: 0, startTime: '00:00', endTime: '00:00', isWorking: false },
    ],
  });

  // ==================== ЗАПИСИ ====================
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const futureDate = (d: number) => { const dt = new Date(today); dt.setDate(dt.getDate() + d); return dt; };
  const pastDate = (d: number) => { const dt = new Date(today); dt.setDate(dt.getDate() - d); return dt; };

  const booking1 = await prisma.booking.create({
    data: { clientId: clients[0].id, staffId: belleStaff1.id, businessId: belleSalon.id, date: futureDate(2), startTime: '11:00', endTime: '12:00', totalPrice: 7000, totalDuration: 60, status: BookingStatus.CONFIRMED, notes: 'Хочу немного подровнять концы' },
  });
  await prisma.bookingItem.create({ data: { bookingId: booking1.id, serviceId: belleServices[0].id, price: 7000, duration: 60 } });

  const booking2 = await prisma.booking.create({
    data: { clientId: clients[0].id, staffId: belleStaff1.id, businessId: belleSalon.id, date: futureDate(7), startTime: '14:00', endTime: '16:00', totalPrice: 15000, totalDuration: 120, status: BookingStatus.PENDING },
  });
  await prisma.bookingItem.create({ data: { bookingId: booking2.id, serviceId: belleServices[1].id, price: 15000, duration: 120 } });

  const booking3 = await prisma.booking.create({
    data: { clientId: clients[1].id, staffId: kingsStaff1.id, businessId: kingsBarber.id, date: pastDate(3), startTime: '13:00', endTime: '13:45', totalPrice: 4000, totalDuration: 45, status: BookingStatus.COMPLETED },
  });
  await prisma.bookingItem.create({ data: { bookingId: booking3.id, serviceId: kingsServices[0].id, price: 4000, duration: 45 } });

  const booking4 = await prisma.booking.create({
    data: { clientId: clients[2].id, staffId: glowStaff.id, businessId: glowNail.id, date: pastDate(5), startTime: '10:00', endTime: '11:15', totalPrice: 6000, totalDuration: 75, status: BookingStatus.COMPLETED },
  });
  await prisma.bookingItem.create({ data: { bookingId: booking4.id, serviceId: glowServices[0].id, price: 6000, duration: 75 } });

  const booking5 = await prisma.booking.create({
    data: { clientId: clients[3].id, staffId: kingsStaff2.id, businessId: kingsBarber.id, date: futureDate(1), startTime: '15:00', endTime: '16:10', totalPrice: 6000, totalDuration: 70, status: BookingStatus.CONFIRMED },
  });
  await prisma.bookingItem.create({ data: { bookingId: booking5.id, serviceId: kingsServices[2].id, price: 6000, duration: 70 } });

  const booking6 = await prisma.booking.create({
    data: { clientId: clients[4].id, staffId: belleStaff2.id, businessId: belleSalon.id, date: futureDate(3), startTime: '12:00', endTime: '15:00', totalPrice: 11000, totalDuration: 180, status: BookingStatus.PENDING, notes: 'Нейтральные тона' },
  });
  await prisma.bookingItem.createMany({
    data: [
      { bookingId: booking6.id, serviceId: belleServices[2].id, price: 5000, duration: 90 },
      { bookingId: booking6.id, serviceId: belleServices[3].id, price: 6000, duration: 90 },
    ],
  });

  console.log('Записи созданы');

  // ==================== ОТЗЫВЫ ====================
  await prisma.review.create({
    data: { bookingId: booking3.id, clientId: clients[1].id, staffId: kingsStaff1.id, businessId: kingsBarber.id, rating: 5, comment: 'Отличная стрижка! Дмитрий настоящий мастер. Буду записываться снова.' },
  });
  await prisma.review.create({
    data: { bookingId: booking4.id, clientId: clients[2].id, staffId: glowStaff.id, businessId: glowNail.id, rating: 5, comment: 'Полина — невероятный мастер! Маникюр держится уже 3 недели.' },
  });

  // ==================== ИЗБРАННЫЕ ====================
  await prisma.favorite.createMany({
    data: [
      { clientId: clients[0].id, staffId: belleStaff1.id },
      { clientId: clients[0].id, staffId: glowStaff.id },
      { clientId: clients[1].id, staffId: kingsStaff1.id },
    ],
  });

  console.log('\n✅ Тестовые данные успешно загружены!');
  console.log('\nАккаунты:');
  console.log('  SUPER_ADMIN:    admin@liora.app / Admin123!');
  console.log('  BUSINESS_ADMIN: owner.belle@example.com / Business123!');
  console.log('  BUSINESS_ADMIN: owner.kings@example.com / Business123!');
  console.log('  BUSINESS_ADMIN: owner.glow@example.com / Business123!');
  console.log('  STAFF:          yulia.belle@example.com / Staff123!');
  console.log('  CLIENT:         anna@example.com / Client123!');
}

main()
  .catch((e) => { console.error('Ошибка при заполнении:', e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
