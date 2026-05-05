import { PrismaClient, StoreStatus, UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const ids = {
  dough: {
    branca: '11111111-1111-4111-8111-111111111111',
    chocolate: '11111111-1111-4111-8111-111111111112',
    mista: '11111111-1111-4111-8111-111111111113',
  },
  cakeSize: {
    slices15: '22222222-2222-4222-8222-222222222215',
    slices20: '22222222-2222-4222-8222-222222222220',
    slices30: '22222222-2222-4222-8222-222222222230',
    slices40: '22222222-2222-4222-8222-222222222240',
  },
  sweetType: {
    traditional: '44444444-4444-4444-8444-444444444441',
    gourmet: '44444444-4444-4444-8444-444444444442',
  },
};

async function main() {
  await prisma.settings.deleteMany();
  await prisma.settings.create({
    data: {
      whatsappNumber: process.env.SEED_WHATSAPP_NUMBER ?? '5599999999999',
      storeStatus: StoreStatus.OPEN,
    },
  });

  const passwordHash = await bcrypt.hash(
    requireEnv('SEED_ADMIN_PASSWORD'),
    10,
  );

  await prisma.user.upsert({
    where: { email: process.env.SEED_ADMIN_EMAIL ?? 'admin@annameyrecakes.local' },
    update: {
      name: 'Anna Meyre',
      passwordHash,
      role: UserRole.OWNER,
    },
    create: {
      name: 'Anna Meyre',
      email: process.env.SEED_ADMIN_EMAIL ?? 'admin@annameyrecakes.local',
      passwordHash,
      role: UserRole.OWNER,
    },
  });

  await Promise.all([
    prisma.dough.upsert({
      where: { id: ids.dough.branca },
      update: { name: 'Branca', colorHex: '#f6dfbd', isActive: true },
      create: { id: ids.dough.branca, name: 'Branca', colorHex: '#f6dfbd' },
    }),
    prisma.dough.upsert({
      where: { id: ids.dough.chocolate },
      update: { name: 'Chocolate', colorHex: '#6f3d2e', isActive: true },
      create: {
        id: ids.dough.chocolate,
        name: 'Chocolate',
        colorHex: '#6f3d2e',
      },
    }),
    prisma.dough.upsert({
      where: { id: ids.dough.mista },
      update: { name: 'Mista', colorHex: '#c99566', isActive: true },
      create: { id: ids.dough.mista, name: 'Mista', colorHex: '#c99566' },
    }),
  ]);

  await Promise.all([
    upsertCakeSize(ids.cakeSize.slices15, 15, 140),
    upsertCakeSize(ids.cakeSize.slices20, 20, 180),
    upsertCakeSize(ids.cakeSize.slices30, 30, 220),
    upsertCakeSize(ids.cakeSize.slices40, 40, 260),
  ]);

  await Promise.all([
    upsertFilling('33333333-3333-4333-8333-333333333301', 'Brigadeiro branco', 0, '#fff3d6'),
    upsertFilling('33333333-3333-4333-8333-333333333302', 'Brigadeiro chocolate', 0, '#553022'),
    upsertFilling('33333333-3333-4333-8333-333333333303', 'Brigadeiro de oreo', 0, '#d8d4cc'),
    upsertFilling('33333333-3333-4333-8333-333333333304', 'Brigadeiro de coco', 0, '#fffafa'),
    upsertFilling('33333333-3333-4333-8333-333333333305', 'Brigadeiro de limao', 0, '#e4f19f'),
    upsertFilling('33333333-3333-4333-8333-333333333306', 'Brigadeiro castanha', 0, '#b98b56'),
    upsertFilling('33333333-3333-4333-8333-333333333307', 'Brigadeiro de ninho', 0, '#f8efd9'),
    upsertFilling('33333333-3333-4333-8333-333333333308', 'Pacoca de amendoim', 0, '#d4a15f'),
    upsertFilling('33333333-3333-4333-8333-333333333309', 'Romeu e Julieta', 0, '#db6671'),
    upsertFilling('33333333-3333-4333-8333-333333333310', 'Nutella', 30, '#4a281a'),
    upsertFilling('33333333-3333-4333-8333-333333333311', 'Morango', 30, '#df4b57'),
    upsertFilling('33333333-3333-4333-8333-333333333312', 'Geleia de morango', 30, '#c92c45'),
  ]);

  await Promise.all([
    upsertTopping('55555555-5555-4555-8555-555555555551', 'Acetato', '#f9e0c8'),
    upsertTopping('55555555-5555-4555-8555-555555555552', 'Brigadeiro de chocolate', '#553022'),
    upsertTopping('55555555-5555-4555-8555-555555555553', 'Brigadeiro de ninho', '#f8efd9'),
  ]);

  const traditional = await prisma.sweetType.upsert({
    where: { id: ids.sweetType.traditional },
    update: { name: 'Docinhos tradicionais', pricePer100: 140 },
    create: {
      id: ids.sweetType.traditional,
      name: 'Docinhos tradicionais',
      pricePer100: 140,
    },
  });

  const gourmet = await prisma.sweetType.upsert({
    where: { id: ids.sweetType.gourmet },
    update: { name: 'Docinhos gourmet', pricePer100: 180 },
    create: {
      id: ids.sweetType.gourmet,
      name: 'Docinhos gourmet',
      pricePer100: 180,
    },
  });

  await seedSweetFlavors(traditional.id, [
    'ninho',
    'brigadeiro',
    'beijinho',
    'casadinho',
  ]);
  await seedSweetFlavors(gourmet.id, [
    'castanha',
    'ninho com Nutella',
    'Romeu e Julieta',
    'torta de limao',
    'uvinha',
    'brigadeiro meio amargo',
  ]);
}

function requireEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

function upsertCakeSize(id: string, slices: number, price: number) {
  return prisma.cakeSize.upsert({
    where: { id },
    update: { slices, price, isActive: true },
    create: { id, slices, price },
  });
}

function upsertFilling(
  id: string,
  name: string,
  extraPrice: number,
  colorHex: string,
) {
  return prisma.filling.upsert({
    where: { id },
    update: { name, extraPrice, colorHex, isActive: true },
    create: { id, name, extraPrice, colorHex },
  });
}

function upsertTopping(id: string, name: string, colorHex: string) {
  return prisma.topping.upsert({
    where: { id },
    update: { name, colorHex, isActive: true },
    create: { id, name, colorHex },
  });
}

async function seedSweetFlavors(sweetTypeId: string, names: string[]) {
  for (const [index, name] of names.entries()) {
    const existing = await prisma.sweetFlavor.findFirst({
      where: { sweetTypeId, name },
    });

    if (!existing) {
      await prisma.sweetFlavor.create({
        data: {
          id: `66666666-6666-4666-8666-${sweetTypeId.slice(-6)}${String(index + 1).padStart(6, '0')}`,
          sweetTypeId,
          name,
        },
      });
    }
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
