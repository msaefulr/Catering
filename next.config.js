/** @type {import('next').NextConfig} */
const nextConfig = {
  // Hanya aktifkan jika Anda menggunakan external images
  // images: {
  //   domains: ['res.cloudinary.com', 'localhost'],
  // },
  
  // Hanya aktifkan jika Anda perlu allowedDevOrigins (sesuai warning sebelumnya)
  // experimental: {
  //   allowedDevOrigins: ['http://127.0.0.1:3000'],
  // },
  
  // React Strict Mode (opsional)
  reactStrictMode: true,
  
  // Environment variables (opsional)
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
};

module.exports = nextConfig;