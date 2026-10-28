/**
 * Database Seeder Script.
 * Populates initial data required for testing and development:
 * - Default system administrator account.
 * - Catalog of electronic and hardware accessories with stock and prices.
 * - Customer profiles across diverse demographics.
 * - Historical orders and order items spanning the past thirty days.
 *
 * Designed to be fully idempotent by clearing existing records prior to insertion.
 */

import { PrismaClient, Gender } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main(): Promise<void> {
  console.log('[Seeder] Starting database seeding...');

  // Reset database tables in reverse dependency order to satisfy foreign key constraints
  console.log('[Seeder] Cleaning existing records...');
  await prisma.orderItem.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.customer.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.user.deleteMany({});

  // Seed system administrator account
  console.log('[Seeder] Seeding admin user...');
  const hashedPassword = await bcrypt.hash('password123', 10);
  const adminUser = await prisma.user.create({
    data: {
      name: 'System Administrator',
      email: 'admin@example.com',
      password: hashedPassword,
    },
  });
  console.log(`[Seeder] Created Admin User: ${adminUser.email}`);

  // Seed product catalog with realistic stock quantities and pricing
  console.log('[Seeder] Seeding product catalog...');
  const productData = [
    { code: 'PRD-001', name: 'Logitech MX Master 3S Wireless Mouse', price: 1650000, stock: 45 },
    { code: 'PRD-002', name: 'Keychron K2 Mechanical Keyboard RGB', price: 1250000, stock: 30 },
    { code: 'PRD-003', name: 'Dell UltraSharp 27" 4K Monitor U2723QE', price: 8900000, stock: 15 },
    { code: 'PRD-004', name: 'Sony WH-1000XM5 Wireless Headphones', price: 4799000, stock: 25 },
    { code: 'PRD-005', name: 'Apple iPad Air M2 11" 128GB WiFi', price: 10499000, stock: 18 },
    { code: 'PRD-006', name: 'Anker PowerPort Atom III 65W GaN Charger', price: 450000, stock: 80 },
    { code: 'PRD-007', name: 'Samsung T7 Shield Portable SSD 1TB', price: 1850000, stock: 35 },
    { code: 'PRD-008', name: 'Baseus Metal Gleam 9-in-1 USB-C Hub', price: 520000, stock: 50 },
    { code: 'PRD-009', name: 'Ergotron LX Desk Monitor Arm', price: 2750000, stock: 20 },
    { code: 'PRD-010', name: 'BenQ ScreenBar Halo Monitor Light', price: 2390000, stock: 22 },
    { code: 'PRD-011', name: 'SteelSeries QcK Heavy XXL Mousepad', price: 420000, stock: 60 },
    { code: 'PRD-012', name: 'Elgato Stream Deck MK.2 15 Keys', price: 2450000, stock: 14 },
    { code: 'PRD-013', name: 'Shure MV7 USB Podcast Microphone', price: 3950000, stock: 12 },
    { code: 'PRD-014', name: 'Rode PSA1+ Professional Studio Boom Arm', price: 1850000, stock: 16 },
    { code: 'PRD-015', name: 'Ugreen Cat7 Gigabit Ethernet Cable 3M', price: 85000, stock: 120 },
    { code: 'PRD-016', name: 'Xiaomi Smart Air Purifier 4 Compact', price: 1199000, stock: 28 },
    { code: 'PRD-017', name: 'Belkin BoostCharge Pro 3-in-1 MagSafe', price: 2199000, stock: 19 },
    { code: 'PRD-018', name: 'Sandisk Extreme PRO SDXC 128GB 200MB/s', price: 480000, stock: 75 },
    { code: 'PRD-019', name: 'CalDigit TS4 Thunderbolt 4 Dock', price: 6890000, stock: 8 },
    { code: 'PRD-020', name: 'Secretlab TITAN Evo Gaming Chair', price: 7950000, stock: 10 },
  ];

  const createdProducts = [];
  for (const p of productData) {
    const product = await prisma.product.create({
      data: {
        productCode: p.code,
        productName: p.name,
        price: p.price,
        stock: p.stock,
      },
    });
    createdProducts.push(product);
  }
  console.log(`[Seeder] Seeded ${createdProducts.length} products`);

  // Seed customer database
  console.log('[Seeder] Seeding customers...');
  const customerData = [
    { customerName: 'Budi Santoso', customerAddress: 'Jl. Sudirman No. 45, Jakarta Selatan', gender: Gender.Pria, birthDate: new Date('1990-05-14'), phone: '081234567890' },
    { customerName: 'Siti Rahmawati', customerAddress: 'Jl. Malioboro No. 12, Yogyakarta', gender: Gender.Wanita, birthDate: new Date('1994-08-22'), phone: '081398765432' },
    { customerName: 'Ahmad Fauzi', customerAddress: 'Jl. Diponegoro No. 88, Bandung', gender: Gender.Pria, birthDate: new Date('1988-11-03'), phone: '082155566677' },
    { customerName: 'Dewi Lestari', customerAddress: 'Jl. Pemuda No. 101, Semarang', gender: Gender.Wanita, birthDate: new Date('1995-02-18'), phone: '085712348765' },
    { customerName: 'Rian Pratama', customerAddress: 'Jl. Basuki Rahmat No. 7, Surabaya', gender: Gender.Pria, birthDate: new Date('1992-07-30'), phone: '087899001122' },
    { customerName: 'Putri Handayani', customerAddress: 'Jl. Gatot Subroto No. 34, Medan', gender: Gender.Wanita, birthDate: new Date('1997-12-05'), phone: '081933445566' },
    { customerName: 'Eko Prasetyo', customerAddress: 'Jl. Gajah Mada No. 56, Solo', gender: Gender.Pria, birthDate: new Date('1985-04-12'), phone: '082211447788' },
    { customerName: 'Anisa Wulandari', customerAddress: 'Jl. Teuku Umar No. 90, Denpasar', gender: Gender.Wanita, birthDate: new Date('1996-09-25'), phone: '085699887766' },
    { customerName: 'Bambang Kusumo', customerAddress: 'Jl. Pahlawan No. 23, Malang', gender: Gender.Pria, birthDate: new Date('1989-03-15'), phone: '081244332211' },
    { customerName: 'Maya Anggraini', customerAddress: 'Jl. Ahmad Yani No. 67, Banjarmasin', gender: Gender.Wanita, birthDate: new Date('1993-06-19'), phone: '087788990011' },
    { customerName: 'Hendra Gunawan', customerAddress: 'Jl. Veteran No. 14, Palembang', gender: Gender.Pria, birthDate: new Date('1991-10-08'), phone: '081322110099' },
    { customerName: 'Rina Kartika', customerAddress: 'Jl. Hasanuddin No. 78, Makassar', gender: Gender.Wanita, birthDate: new Date('1998-01-27'), phone: '085233441122' },
    { customerName: 'Doni Saputra', customerAddress: 'Jl. R.E. Martadinata No. 5, Bogor', gender: Gender.Pria, birthDate: new Date('1994-04-03'), phone: '088812345678' },
    { customerName: 'Lia Novita', customerAddress: 'Jl. Cipto Mangunkusumo No. 42, Cirebon', gender: Gender.Wanita, birthDate: new Date('1996-11-16'), phone: '089677889900' },
    { customerName: 'Fajar Nugroho', customerAddress: 'Jl. Slamet Riyadi No. 19, Surakarta', gender: Gender.Pria, birthDate: new Date('1987-08-09'), phone: '082345678901' },
  ];

  const createdCustomers = [];
  for (const c of customerData) {
    const customer = await prisma.customer.create({ data: c });
    createdCustomers.push(customer);
  }
  console.log(`[Seeder] Seeded ${createdCustomers.length} customers`);

  // Seed historical orders spread over the past thirty days
  console.log('[Seeder] Seeding historical orders...');
  const now = new Date();

  for (let i = 1; i <= 30; i++) {
    const daysAgo = 30 - i;
    const orderDate = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000 - (i * 37 * 60 * 1000));
    
    // Construct sequential invoice number with format: INV-YYYYMMDD-XXXX
    const yyyy = orderDate.getFullYear();
    const mm = String(orderDate.getMonth() + 1).padStart(2, '0');
    const dd = String(orderDate.getDate()).padStart(2, '0');
    const seq = String(i).padStart(4, '0');
    const orderNumber = `INV-${yyyy}${mm}${dd}-${seq}`;

    const customer = createdCustomers[(i - 1) % createdCustomers.length]!;

    // Select distinct products for the order line items
    const numItems = (i % 3) + 1;
    const selectedProductIndices = new Set<number>();
    while (selectedProductIndices.size < numItems) {
      selectedProductIndices.add((i * 3 + selectedProductIndices.size * 7) % createdProducts.length);
    }

    let orderTotal = 0;
    const itemsToCreate = [];

    for (const prodIndex of selectedProductIndices) {
      const prod = createdProducts[prodIndex]!;
      const qty = ((i + prodIndex) % 3) + 1;
      const unitPrice = Number(prod.price);
      const subtotal = unitPrice * qty;
      orderTotal += subtotal;

      itemsToCreate.push({
        productId: prod.id,
        quantity: qty,
        unitPrice: unitPrice,
        subtotal: subtotal,
      });
    }

    // Persist order and nested order items in an atomic transaction
    await prisma.order.create({
      data: {
        orderNumber,
        customerId: customer.id,
        createdBy: adminUser.id,
        orderDate,
        totalAmount: orderTotal,
        items: {
          create: itemsToCreate,
        },
      },
    });
  }
  console.log('[Seeder] Seeded 30 orders successfully with historical timestamps');

  console.log('[Seeder] All seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('[Seeder Error]:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
