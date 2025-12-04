import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Check if barbers already exist
  const existingBarbers = await prisma.barber.count();

  if (existingBarbers > 0) {
    console.log('✅ Barbers already exist, skipping seed');
    return;
  }

  // Create the 3 barbers
  const barber1 = await prisma.barber.create({
    data: {
      name: 'Barbero 1',
      isOwner: true,
      isActive: true,
    },
  });

  const barber2 = await prisma.barber.create({
    data: {
      name: 'Barbero 2',
      isOwner: false,
      isActive: true,
    },
  });

  const barber3 = await prisma.barber.create({
    data: {
      name: 'Barbero 3',
      isOwner: false,
      isActive: true,
    },
  });

  console.log('✅ Created barbers:');
  console.log(`   - ${barber1.name} (Owner)`);
  console.log(`   - ${barber2.name}`);
  console.log(`   - ${barber3.name}`);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
