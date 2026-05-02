"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const client_1 = require("@prisma/client");
const adapter_pg_1 = require("@prisma/adapter-pg");
const pg_1 = require("pg");
const bcrypt = __importStar(require("bcryptjs"));
const pool = new pg_1.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new adapter_pg_1.PrismaPg(pool);
const prisma = new client_1.PrismaClient({ adapter });
async function hashPassword(password) {
    return bcrypt.hash(password, 10);
}
async function main() {
    console.log('Начинаем заполнение тестовыми данными...');
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
    const superAdmin = await prisma.user.create({
        data: {
            email: 'admin@liora.app',
            passwordHash: await hashPassword('Admin123!'),
            name: 'Администратор Liora',
            role: client_1.Role.SUPER_ADMIN,
            country: 'RU',
            city: 'Москва',
        },
    });
    const clients = await Promise.all([
        prisma.user.create({
            data: {
                email: 'anna@example.com',
                passwordHash: await hashPassword('Client123!'),
                name: 'Анна Смирнова',
                phone: '+79001234567',
                role: client_1.Role.CLIENT,
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
                role: client_1.Role.CLIENT,
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
                role: client_1.Role.CLIENT,
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
                role: client_1.Role.CLIENT,
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
                role: client_1.Role.CLIENT,
                country: 'KZ',
                city: 'Алматы',
            },
        }),
    ]);
    console.log(`Создано ${clients.length} клиентов`);
    const belleOwner = await prisma.user.create({
        data: {
            email: 'owner.belle@example.com',
            passwordHash: await hashPassword('Business123!'),
            name: 'Наталья Белова',
            role: client_1.Role.BUSINESS_ADMIN,
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
            category: client_1.BusinessCategory.BEAUTY_SALON,
            country: 'RU',
            city: 'Москва',
            isActive: true,
            isVisible: true,
            maxAdvanceBookingDays: 30,
            ownerId: belleOwner.id,
        },
    });
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
    const belleStaff1User = await prisma.user.create({
        data: {
            email: 'yulia.belle@example.com',
            passwordHash: await hashPassword('Staff123!'),
            name: 'Юлия Морозова',
            role: client_1.Role.STAFF,
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
            role: client_1.Role.STAFF,
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
    const kingsOwner = await prisma.user.create({
        data: {
            email: 'owner.kings@example.com',
            passwordHash: await hashPassword('Business123!'),
            name: 'Артём Королёв',
            role: client_1.Role.BUSINESS_ADMIN,
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
            category: client_1.BusinessCategory.BARBERSHOP,
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
            role: client_1.Role.STAFF,
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
            role: client_1.Role.STAFF,
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
    const glowOwner = await prisma.user.create({
        data: {
            email: 'owner.glow@example.com',
            passwordHash: await hashPassword('Business123!'),
            name: 'Виктория Глушкова',
            role: client_1.Role.BUSINESS_ADMIN,
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
            category: client_1.BusinessCategory.NAIL_STUDIO,
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
            role: client_1.Role.STAFF,
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
        data: glowServices.map((s) => ({ staffId: glowStaff.id, serviceId: s.id })),
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
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const futureDate = (daysAhead) => {
        const d = new Date(today);
        d.setDate(d.getDate() + daysAhead);
        return d;
    };
    const pastDate = (daysAgo) => {
        const d = new Date(today);
        d.setDate(d.getDate() - daysAgo);
        return d;
    };
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
            status: client_1.BookingStatus.CONFIRMED,
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
            status: client_1.BookingStatus.PENDING,
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
            status: client_1.BookingStatus.COMPLETED,
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
            status: client_1.BookingStatus.COMPLETED,
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
            status: client_1.BookingStatus.CONFIRMED,
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
            status: client_1.BookingStatus.PENDING,
            notes: 'Предпочтительно нейтральные тона',
        },
    });
    await prisma.bookingItem.createMany({
        data: [
            { bookingId: booking6.id, serviceId: belleServices[2].id, price: 1800, duration: 90 },
            { bookingId: booking6.id, serviceId: belleServices[3].id, price: 2200, duration: 90 },
        ],
    });
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
            status: client_1.BookingStatus.CANCELLED,
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
            status: client_1.BookingStatus.PENDING,
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
    await prisma.favorite.createMany({
        data: [
            { clientId: clients[0].id, staffId: belleStaff1.id },
            { clientId: clients[0].id, staffId: glowStaff.id },
            { clientId: clients[1].id, staffId: kingsStaff1.id },
            { clientId: clients[2].id, staffId: glowStaff.id },
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
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map