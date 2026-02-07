import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

async function main() {
  const pw = await bcrypt.hash("password123", 10);

  await prisma.users.upsert({
    where: { email: "admin@catering.test" },
    update: {},
    create: { name: "Admin", email: "admin@catering.test", password: pw, level: "admin" },
  });

  await prisma.users.upsert({
    where: { email: "owner@catering.test" },
    update: {},
    create: { name: "Owner", email: "owner@catering.test", password: pw, level: "owner" },
  });

  await prisma.users.upsert({
    where: { email: "kurir@catering.test" },
    update: {},
    create: { name: "Kurir", email: "kurir@catering.test", password: pw, level: "kurir" },
  });

  // pelanggan demo biar order bisa jalan cepat
  await prisma.pelanggans.upsert({
    where: { email: "pelanggan@demo.test" },
    update: {},
    create: {
      nama_pelanggan: "Pelanggan Demo",
      email: "pelanggan@demo.test",
      password: pw,
      tgl_lahir: null,
      telepon: null,
      alamat1: null,
      alamat2: null,
      alamat3: null,
      kartu_id: null,
      foto: null,
    },
  });

  // jenis pembayaran
  const transfer = await prisma.jenis_pembayarans.upsert({
    where: { metode_pembayaran: "Transfer Bank" },
    update: {},
    create: { metode_pembayaran: "Transfer Bank" },
  });

  await prisma.jenis_pembayarans.upsert({
    where: { metode_pembayaran: "Cash" },
    update: {},
    create: { metode_pembayaran: "Cash" },
  });

  await prisma.detail_jenis_pembayarans.createMany({
    data: [
      { id_jenis_pembayaran: transfer.id as unknown as bigint, no_rek: "1234567890", tempat_bayar: "BCA - A/N Catering P1", logo: "bca.png" },
      { id_jenis_pembayaran: transfer.id as unknown as bigint, no_rek: "9876543210", tempat_bayar: "BRI - A/N Catering P1", logo: "bri.png" },
    ],
    skipDuplicates: true,
  });

  // paket
  await prisma.pakets.createMany({
    data: [
      {
        nama_paket: "Prasmanan Hemat",
        jenis: "Prasmanan",
        kategori: "Rapat",
        jumlah_pax: 50,
        harga_paket: 15000000,
        deskripsi: "Paket prasmanan hemat untuk event rapat.",
      },
      {
        nama_paket: "Prasmanan Premium",
        jenis: "Prasmanan",
        kategori: "Pernikahan",
        jumlah_pax: 200,
        harga_paket: 85000000,
        deskripsi: "Prasmanan premium lengkap untuk wedding.",
      },
      {
        nama_paket: "Box Meeting",
        jenis: "Box",
        kategori: "Rapat",
        jumlah_pax: 30,
        harga_paket: 4500000,
        deskripsi: "Nasi box untuk meeting (30 pax).",
      },
      {
        nama_paket: "Box Selamatan",
        jenis: "Box",
        kategori: "Selamatan",
        jumlah_pax: 60,
        harga_paket: 9000000,
        deskripsi: "Nasi box untuk selamatan (60 pax).",
      },
      {
        nama_paket: "Prasmanan Ulang Tahun",
        jenis: "Prasmanan",
        kategori: "Ulang_Tahun",
        jumlah_pax: 80,
        harga_paket: 26000000,
        deskripsi: "Prasmanan komplit untuk ulang tahun.",
      },
    ],
    skipDuplicates: true,
  });

  console.log("✅ Seed OK");
}

main()
  .catch(console.error)
  .finally(async () => prisma.$disconnect());
