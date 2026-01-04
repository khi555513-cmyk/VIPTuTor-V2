

import { TutorMode, AccountTier } from './types';

// --- CONFIG ---
export const ZALO_CONSULTATION_URL = 'https://zalo.me/0368132628';

// --- LIMITS & PACKAGES ---

export const TIER_LIMITS: Record<AccountTier, { messages: number; tests: number; games: number }> = {
  basic: {
    messages: 15,
    tests: 0,
    games: 1
  },
  pro: {
    messages: 100,
    tests: 5,
    games: 10
  },
  vip: {
    messages: 9999, // Unlimited effectively
    tests: 9999,
    games: 9999
  }
};

export interface SubscriptionPackage {
  id: string;
  name: string;
  durationMonths: number;
  tier: AccountTier;
  priceVND: number;
  isLifetime?: boolean;
  features: string[];
  isPopular?: boolean;
}

export const SUBSCRIPTION_PACKAGES: SubscriptionPackage[] = [
  {
    id: 'pack_basic',
    name: 'Gói Cơ Bản',
    durationMonths: 0,
    tier: 'basic',
    priceVND: 0,
    features: ['15 tin nhắn/ngày', '1 Game/ngày', 'Lưu bài học']
  },
  {
    id: 'pack_1_month',
    name: 'Gói 1 Tháng',
    durationMonths: 1,
    tier: 'pro',
    priceVND: 49000,
    features: ['100 tin nhắn/ngày', '5 đề thi/ngày', '10 Games/ngày']
  },
  {
    id: 'pack_5_months',
    name: 'Gói 5 Tháng',
    durationMonths: 5,
    tier: 'pro',
    priceVND: 199000,
    features: ['Tiết kiệm 20%', 'Mở khóa Test Prep', 'Hỗ trợ 24/7'],
    isPopular: true
  },
  {
    id: 'pack_1_year',
    name: 'Gói 1 Năm',
    durationMonths: 12,
    tier: 'vip',
    priceVND: 499000,
    features: ['Không giới hạn tính năng', 'Ưu tiên phản hồi', 'Huy hiệu VIP']
  },
  {
    id: 'pack_lifetime',
    name: 'Gói Vĩnh Viễn',
    durationMonths: 999,
    tier: 'vip',
    priceVND: 999000,
    isLifetime: true,
    features: ['Thanh toán 1 lần', 'Sở hữu trọn đời', 'Full quyền năng AI']
  }
];

// --- ACTIVATION CODES ---
// 1 = 1 month, 5 = 5 months, 12 = 1 year, 999 = Lifetime
export const ACTIVATION_CODES: Record<string, { tier: AccountTier, months: number }> = {
  // Demo
  "DEMO": { tier: 'pro', months: 0.17 }, // ~5 days

  // PRO - 1 Month
  "PRO-AX7D9Q": { tier: 'pro', months: 1 }, "PRO-BN6P3T": { tier: 'pro', months: 1 },
  "PRO-PG7R4M": { tier: 'pro', months: 1 }, "PRO-RC8M5J": { tier: 'pro', months: 1 },
  "PRO-MQ9F2W": { tier: 'pro', months: 1 }, "PRO-XH5P9C": { tier: 'pro', months: 1 },
  "PRO-HP4X7S": { tier: 'pro', months: 1 }, "PRO-YM6W2F": { tier: 'pro', months: 1 },
  "PRO-GK9S3Q": { tier: 'pro', months: 1 }, "PRO-JP8V2D": { tier: 'pro', months: 1 },
  "PRO-BC9H3X": { tier: 'pro', months: 1 }, "PRO-PR5N7H": { tier: 'pro', months: 1 },
  "PRO-RK8P3F": { tier: 'pro', months: 1 }, "PRO-MX9D4K": { tier: 'pro', months: 1 },
  "PRO-XG6S8R": { tier: 'pro', months: 1 }, "PRO-HR3X9C": { tier: 'pro', months: 1 },
  "PRO-YM2W9N": { tier: 'pro', months: 1 }, "PRO-GK5S2V": { tier: 'pro', months: 1 },
  "PRO-JP2V6X": { tier: 'pro', months: 1 }, "PRO-BD9H2P": { tier: 'pro', months: 1 },
  "PRO-PR1N4X": { tier: 'pro', months: 1 }, "PRO-RK7P1L": { tier: 'pro', months: 1 },
  "PRO-MX1D8S": { tier: 'pro', months: 1 }, "PRO-XG3S9K": { tier: 'pro', months: 1 },
  "PRO-HR9X1V": { tier: 'pro', months: 1 }, "PRO-YM1W3K": { tier: 'pro', months: 1 },
  "PRO-GK7S1L": { tier: 'pro', months: 1 }, "PRO-JP5V7B": { tier: 'pro', months: 1 },
  "PRO-BD1H5V": { tier: 'pro', months: 1 }, "PRO-PR7N9C": { tier: 'pro', months: 1 },
  "PRO-RK3P9N": { tier: 'pro', months: 1 }, "PRO-MX7D1V": { tier: 'pro', months: 1 },
  "PRO-XG7S5B": { tier: 'pro', months: 1 }, "PRO-HR1X7K": { tier: 'pro', months: 1 },
  "PRO-YM9W7C": { tier: 'pro', months: 1 }, "PRO-GK3S7P": { tier: 'pro', months: 1 },
  "PRO-JP9V3L": { tier: 'pro', months: 1 }, "PRO-BD5H9K": { tier: 'pro', months: 1 },
  "PRO-A7X9D3Q": { tier: 'pro', months: 1 }, "PRO-B8N5P4T": { tier: 'pro', months: 1 },
  "PRO-P4G8R2M": { tier: 'pro', months: 1 }, "PRO-R9C3M7J": { tier: 'pro', months: 1 },
  "PRO-M2Q9F1W": { tier: 'pro', months: 1 }, "PRO-X5H9P3C": { tier: 'pro', months: 1 },
  "PRO-H9P4X7S": { tier: 'pro', months: 1 }, "PRO-Y2M6W1F": { tier: 'pro', months: 1 },
  "PRO-G8K3S2Q": { tier: 'pro', months: 1 }, "PRO-J8P2V6D": { tier: 'pro', months: 1 },
  "PRO-B9C3H8X": { tier: 'pro', months: 1 }, "PRO-P7R1N5H": { tier: 'pro', months: 1 },
  "PRO-R4K7P9F": { tier: 'pro', months: 1 }, "PRO-M1X7D5K": { tier: 'pro', months: 1 },
  "PRO-X7S1H3G": { tier: 'pro', months: 1 }, "PRO-H3X8P2L": { tier: 'pro', months: 1 },
  "PRO-Y3F9W7K": { tier: 'pro', months: 1 }, "PRO-G9N2S6C": { tier: 'pro', months: 1 },
  "PRO-J9V5C3K": { tier: 'pro', months: 1 }, "PRO-C9D1P7V": { tier: 'pro', months: 1 },
  "PRO-U1C2G9R": { tier: 'pro', months: 1 }, "PRO-A2L8C7F": { tier: 'pro', months: 1 },
  "PRO-P6S9B4W": { tier: 'pro', months: 1 }, "PRO-W9B4D6X": { tier: 'pro', months: 1 },
  "PRO-M9D6Q8Y": { tier: 'pro', months: 1 },

  // PRO - 5 Months
  "PRO-ZM3L8R": { tier: 'pro', months: 5 }, "PRO-HR2Z7K": { tier: 'pro', months: 5 },
  "PRO-SX1V8Q": { tier: 'pro', months: 5 }, "PRO-WN2Q9F": { tier: 'pro', months: 5 },
  "PRO-FV1K7Z": { tier: 'pro', months: 5 }, "PRO-DB7V1L": { tier: 'pro', months: 5 },
  "PRO-KT9D5V": { tier: 'pro', months: 5 }, "PRO-RB8K4Z": { tier: 'pro', months: 5 },
  "PRO-CN1M8Y": { tier: 'pro', months: 5 }, "PRO-TA6K1G": { tier: 'pro', months: 5 },
  "PRO-HL7T5B": { tier: 'pro', months: 5 }, "PRO-SV9C2K": { tier: 'pro', months: 5 },
  "PRO-WP1L6Z": { tier: 'pro', months: 5 }, "PRO-FQ5W9P": { tier: 'pro', months: 5 },
  "PRO-DB2V3X": { tier: 'pro', months: 5 }, "PRO-KT1D6W": { tier: 'pro', months: 5 },
  "PRO-RB6K3C": { tier: 'pro', months: 5 }, "PRO-CN9M4H": { tier: 'pro', months: 5 },
  "PRO-TA8K4N": { tier: 'pro', months: 5 }, "PRO-HL5T8L": { tier: 'pro', months: 5 },
  "PRO-SV5C9B": { tier: 'pro', months: 5 }, "PRO-WP9L3C": { tier: 'pro', months: 5 },
  "PRO-FQ9W6N": { tier: 'pro', months: 5 }, "PRO-DB7V4P": { tier: 'pro', months: 5 },
  "PRO-KT3D7P": { tier: 'pro', months: 5 }, "PRO-RB5K7G": { tier: 'pro', months: 5 },
  "PRO-CN3M5V": { tier: 'pro', months: 5 }, "PRO-TA9K9W": { tier: 'pro', months: 5 },
  "PRO-HL9T3C": { tier: 'pro', months: 5 }, "PRO-SV1C3K": { tier: 'pro', months: 5 },
  "PRO-WP7L1H": { tier: 'pro', months: 5 }, "PRO-FQ1W5C": { tier: 'pro', months: 5 },
  "PRO-DB1V9G": { tier: 'pro', months: 5 }, "PRO-KT5D9C": { tier: 'pro', months: 5 },
  "PRO-RB3K3L": { tier: 'pro', months: 5 }, "PRO-CN7M1C": { tier: 'pro', months: 5 },
  "PRO-TA3K7C": { tier: 'pro', months: 5 }, "PRO-HL1T1N": { tier: 'pro', months: 5 },
  "PRO-Z4M2L8R": { tier: 'pro', months: 5 }, "PRO-H2R7Z9K": { tier: 'pro', months: 5 },
  "PRO-S1X7V5Q": { tier: 'pro', months: 5 }, "PRO-W3N1Q6F": { tier: 'pro', months: 5 },
  "PRO-F7V1K5Z": { tier: 'pro', months: 5 }, "PRO-D1B7V6L": { tier: 'pro', months: 5 },
  "PRO-K1T6D2V": { tier: 'pro', months: 5 }, "PRO-R8B5K3Z": { tier: 'pro', months: 5 },
  "PRO-C2N9M4Y": { tier: 'pro', months: 5 }, "PRO-T6A1K3G": { tier: 'pro', months: 5 },
  "PRO-H7L5T2B": { tier: 'pro', months: 5 }, "PRO-S9V2C8K": { tier: 'pro', months: 5 },
  "PRO-W8P3L2Z": { tier: 'pro', months: 5 }, "PRO-F5Q2W8R": { tier: 'pro', months: 5 },
  "PRO-D5V3B7P": { tier: 'pro', months: 5 }, "PRO-K7D2T9C": { tier: 'pro', months: 5 },
  "PRO-R1C4D8M": { tier: 'pro', months: 5 }, "PRO-C1W7M5Y": { tier: 'pro', months: 5 },
  "PRO-T1G2L7X": { tier: 'pro', months: 5 }, "PRO-N5X3H2G": { tier: 'pro', months: 5 },
  "PRO-Q7N1W6P": { tier: 'pro', months: 5 }, "PRO-Z6M5V9K": { tier: 'pro', months: 5 },
  "PRO-L8Q3H1G": { tier: 'pro', months: 5 }, "PRO-S1M7C5N": { tier: 'pro', months: 5 },
  "PRO-F1G3X2K": { tier: 'pro', months: 5 },

  // PRO - 1 Year
  "PRO-QC4N7B": { tier: 'pro', months: 12 }, "PRO-YT9C2V": { tier: 'pro', months: 12 },
  "PRO-LD9K2C": { tier: 'pro', months: 12 }, "PRO-JK4Z1T": { tier: 'pro', months: 12 },
  "PRO-CZ6H4P": { tier: 'pro', months: 12 }, "PRO-UF2C6R": { tier: 'pro', months: 12 },
  "PRO-AG3L9K": { tier: 'pro', months: 12 }, "PRO-PV2H9X": { tier: 'pro', months: 12 },
  "PRO-WD5F6L": { tier: 'pro', months: 12 }, "PRO-MF4Q9W": { tier: 'pro', months: 12 },
  "PRO-YQ1D8V": { tier: 'pro', months: 12 }, "PRO-LA2X9M": { tier: 'pro', months: 12 },
  "PRO-JC7F8Y": { tier: 'pro', months: 12 }, "PRO-CH1K7V": { tier: 'pro', months: 12 },
  "PRO-UH8C5G": { tier: 'pro', months: 12 }, "PRO-AP9L2B": { tier: 'pro', months: 12 },
  "PRO-PV8H1L": { tier: 'pro', months: 12 }, "PRO-WF3F7P": { tier: 'pro', months: 12 },
  "PRO-MF6Q3C": { tier: 'pro', months: 12 }, "PRO-YQ3D1G": { tier: 'pro', months: 12 },
  "PRO-LA9X6G": { tier: 'pro', months: 12 }, "PRO-JC3F5K": { tier: 'pro', months: 12 },
  "PRO-CH5K4R": { tier: 'pro', months: 12 }, "PRO-UH1C2L": { tier: 'pro', months: 12 },
  "PRO-AP7L3N": { tier: 'pro', months: 12 }, "PRO-PV9H5B": { tier: 'pro', months: 12 },
  "PRO-WF7F9C": { tier: 'pro', months: 12 }, "PRO-MF3Q1H": { tier: 'pro', months: 12 },
  "PRO-YQ5D7L": { tier: 'pro', months: 12 }, "PRO-LA5X5B": { tier: 'pro', months: 12 },
  "PRO-JC1F3L": { tier: 'pro', months: 12 }, "PRO-CH9K9N": { tier: 'pro', months: 12 },
  "PRO-UH5C1P": { tier: 'pro', months: 12 }, "PRO-AP3L1G": { tier: 'pro', months: 12 },
  "PRO-PV7H7K": { tier: 'pro', months: 12 }, "PRO-WF1F5L": { tier: 'pro', months: 12 },
  "PRO-MF7Q5P": { tier: 'pro', months: 12 }, "PRO-Q9C6N2B": { tier: 'pro', months: 12 },
  "PRO-Y5T3C8V": { tier: 'pro', months: 12 }, "PRO-L6D9K3C": { tier: 'pro', months: 12 },
  "PRO-J5K8Z2T": { tier: 'pro', months: 12 }, "PRO-C4Z6H9P": { tier: 'pro', months: 12 },
  "PRO-U6F2C5R": { tier: 'pro', months: 12 }, "PRO-A3G9L5K": { tier: 'pro', months: 12 },
  "PRO-P1V9H4X": { tier: 'pro', months: 12 }, "PRO-W6D5F7L": { tier: 'pro', months: 12 },
  "PRO-M4F9Q2W": { tier: 'pro', months: 12 }, "PRO-Y1Q8D4V": { tier: 'pro', months: 12 },
  "PRO-L2A9X6M": { tier: 'pro', months: 12 }, "PRO-J2C6F9Y": { tier: 'pro', months: 12 },
  "PRO-C7H9K1V": { tier: 'pro', months: 12 }, "PRO-U9G4C2N": { tier: 'pro', months: 12 },
  "PRO-A5M1G4V": { tier: 'pro', months: 12 }, "PRO-P9K8H2S": { tier: 'pro', months: 12 },
  "PRO-W3H6F1P": { tier: 'pro', months: 12 }, "PRO-M7Q4X1D": { tier: 'pro', months: 12 },
  "PRO-X9K7S5B": { tier: 'pro', months: 12 }, "PRO-H5P6D3Y": { tier: 'pro', months: 12 },
  "PRO-Y4D7X3N": { tier: 'pro', months: 12 }, "PRO-G1X5M8V": { tier: 'pro', months: 12 },
  "PRO-J3H9F2P": { tier: 'pro', months: 12 }, "PRO-C3L5N9H": { tier: 'pro', months: 12 },

  // PRO - Lifetime
  "PRO-VD8K1W": { tier: 'pro', months: 999 }, "PRO-KL5X9H": { tier: 'pro', months: 999 },
  "PRO-GF3W6Y": { tier: 'pro', months: 999 }, "PRO-TA7L3X": { tier: 'pro', months: 999 },
  "PRO-NE3T8D": { tier: 'pro', months: 999 }, "PRO-QL8N3Y": { tier: 'pro', months: 999 },
  "PRO-ZS1Q8M": { tier: 'pro', months: 999 }, "PRO-LE7C1N": { tier: 'pro', months: 999 },
  "PRO-SH3R7P": { tier: 'pro', months: 999 }, "PRO-XR2Z6C": { tier: 'pro', months: 999 },
  "PRO-KG3W4N": { tier: 'pro', months: 999 }, "PRO-GD6M1Q": { tier: 'pro', months: 999 },
  "PRO-TN3Q2C": { tier: 'pro', months: 999 }, "PRO-NA4H2L": { tier: 'pro', months: 999 },
  "PRO-QM7N1P": { tier: 'pro', months: 999 }, "PRO-ZS4Q7G": { tier: 'pro', months: 999 },
  "PRO-LD1C8T": { tier: 'pro', months: 999 }, "PRO-SH7R1K": { tier: 'pro', months: 999 },
  "PRO-XR4Z8B": { tier: 'pro', months: 999 }, "PRO-KG7W5R": { tier: 'pro', months: 999 },
  "PRO-GD3M2V": { tier: 'pro', months: 999 }, "PRO-TN7Q9H": { tier: 'pro', months: 999 },
  "PRO-NA9H7C": { tier: 'pro', months: 999 }, "PRO-QM5N6G": { tier: 'pro', months: 999 },
  "PRO-ZS9Q5C": { tier: 'pro', months: 999 }, "PRO-LD3C9R": { tier: 'pro', months: 999 },
  "PRO-SH1R3L": { tier: 'pro', months: 999 }, "PRO-XR7Z3K": { tier: 'pro', months: 999 },
  "PRO-KG1W1P": { tier: 'pro', months: 999 }, "PRO-GD9M7H": { tier: 'pro', months: 999 },
  "PRO-TN5Q7K": { tier: 'pro', months: 999 }, "PRO-NA3H3P": { tier: 'pro', months: 999 },
  "PRO-QM9N3L": { tier: 'pro', months: 999 }, "PRO-ZS7Q9V": { tier: 'pro', months: 999 },
  "PRO-LD9C5B": { tier: 'pro', months: 999 }, "PRO-SH5R9C": { tier: 'pro', months: 999 },
  "PRO-XR1Z1L": { tier: 'pro', months: 999 }, "PRO-V3D1K7W": { tier: 'pro', months: 999 },
  "PRO-K9L1X6H": { tier: 'pro', months: 999 }, "PRO-G2F4W8Y": { tier: 'pro', months: 999 },
  "PRO-T7A4L9X": { tier: 'pro', months: 999 }, "PRO-N8E3T2D": { tier: 'pro', months: 999 },
  "PRO-Q3L8N1Y": { tier: 'pro', months: 999 }, "PRO-Z7S2Q8M": { tier: 'pro', months: 999 },
  "PRO-L4E1C8N": { tier: 'pro', months: 999 }, "PRO-S3H7R1P": { tier: 'pro', months: 999 },
  "PRO-X2R6Z4C": { tier: 'pro', months: 999 }, "PRO-K3G4W9N": { tier: 'pro', months: 999 },
  "PRO-G6D1M3Q": { tier: 'pro', months: 999 }, "PRO-T8N4Q1C": { tier: 'pro', months: 999 },
  "PRO-N3Z8S4L": { tier: 'pro', months: 999 }, "PRO-Q1L5F6H": { tier: 'pro', months: 999 },
  "PRO-Z9R6N3B": { tier: 'pro', months: 999 }, "PRO-L5B3X9Q": { tier: 'pro', months: 999 },
  "PRO-S7P9R4L": { tier: 'pro', months: 999 }, "PRO-F3L6K8H": { tier: 'pro', months: 999 },
  "PRO-D3F8N1C": { tier: 'pro', months: 999 }, "PRO-K9H4T2L": { tier: 'pro', months: 999 },
  "PRO-R2F1K8C": { tier: 'pro', months: 999 }, "PRO-C5K2R7B": { tier: 'pro', months: 999 },
  "PRO-T5P1L4C": { tier: 'pro', months: 999 }, "PRO-N7V8S1Q": { tier: 'pro', months: 999 },

  // VIP - 1 Month
  "VIP-KQ5Z2M": { tier: 'vip', months: 1 }, "VIP-WG1F8R": { tier: 'vip', months: 1 },
  "VIP-CN6D3Z": { tier: 'vip', months: 1 }, "VIP-XL9T2H": { tier: 'vip', months: 1 },
  "VIP-KS3N8B": { tier: 'vip', months: 1 }, "VIP-LB7Q3V": { tier: 'vip', months: 1 },
  "VIP-VK9L1C": { tier: 'vip', months: 1 }, "VIP-CQ7P5H": { tier: 'vip', months: 1 },
  "VIP-QP5X2W": { tier: 'vip', months: 1 }, "VIP-MG2L9X": { tier: 'vip', months: 1 },
  "VIP-VE1P7K": { tier: 'vip', months: 1 }, "VIP-HC8S1G": { tier: 'vip', months: 1 },
  "VIP-XW1D9C": { tier: 'vip', months: 1 }, "VIP-KL6P1R": { tier: 'vip', months: 1 },
  "VIP-LQ1F4P": { tier: 'vip', months: 1 }, "VIP-VP2Q8K": { tier: 'vip', months: 1 },
  "VIP-CP1P6R": { tier: 'vip', months: 1 }, "VIP-QP9X7B": { tier: 'vip', months: 1 },
  "VIP-MG5L3H": { tier: 'vip', months: 1 }, "VIP-VE3P1L": { tier: 'vip', months: 1 },
  "VIP-HC3S7Q": { tier: 'vip', months: 1 }, "VIP-XW9D4G": { tier: 'vip', months: 1 },
  "VIP-KL5P9C": { tier: 'vip', months: 1 }, "VIP-LQ7F1M": { tier: 'vip', months: 1 },
  "VIP-VP5Q2P": { tier: 'vip', months: 1 }, "VIP-CP5P2L": { tier: 'vip', months: 1 },
  "VIP-QP3X6K": { tier: 'vip', months: 1 }, "VIP-MG1L2K": { tier: 'vip', months: 1 },
  "VIP-VE5P9B": { tier: 'vip', months: 1 }, "VIP-HC1S4L": { tier: 'vip', months: 1 },
  "VIP-XW7D2C": { tier: 'vip', months: 1 }, "VIP-KL1P4B": { tier: 'vip', months: 1 },
  "VIP-LQ3F9C": { tier: 'vip', months: 1 }, "VIP-VP9Q3D": { tier: 'vip', months: 1 },
  "VIP-CP3P1G": { tier: 'vip', months: 1 }, "VIP-QP7X4B": { tier: 'vip', months: 1 },
  "VIP-MG9L5P": { tier: 'vip', months: 1 }, "VIP-VE9P3C": { tier: 'vip', months: 1 },
  "VIP-K4Q7Z1M": { tier: 'vip', months: 1 }, "VIP-W1G5F8R": { tier: 'vip', months: 1 },
  "VIP-C6N2D5Z": { tier: 'vip', months: 1 }, "VIP-X9L4T2H": { tier: 'vip', months: 1 },
  "VIP-K3S8N5B": { tier: 'vip', months: 1 }, "VIP-L7B3Q9V": { tier: 'vip', months: 1 },
  "VIP-V9K1L3C": { tier: 'vip', months: 1 }, "VIP-C7Q5P2H": { tier: 'vip', months: 1 },
  "VIP-Q5P2X9W": { tier: 'vip', months: 1 }, "VIP-M2G9L4X": { tier: 'vip', months: 1 },
  "VIP-V1E7P9K": { tier: 'vip', months: 1 }, "VIP-H8C1S6G": { tier: 'vip', months: 1 },
  "VIP-X1W9D3C": { tier: 'vip', months: 1 }, "VIP-K6L1P9R": { tier: 'vip', months: 1 },
  "VIP-L1Q4F8P": { tier: 'vip', months: 1 }, "VIP-V5P2Q8K": { tier: 'vip', months: 1 },
  "VIP-H3P1F6R": { tier: 'vip', months: 1 }, "VIP-Y9L5F1C": { tier: 'vip', months: 1 },
  "VIP-K9B6M3P": { tier: 'vip', months: 1 }, "VIP-C5S9G1L": { tier: 'vip', months: 1 },
  "VIP-Q9C4G2R": { tier: 'vip', months: 1 }, "VIP-M3S5B9W": { tier: 'vip', months: 1 },
  "VIP-V7H3N5D": { tier: 'vip', months: 1 }, "VIP-H9G2D6X": { tier: 'vip', months: 1 },
  "VIP-Y2P9X5K": { tier: 'vip', months: 1 },

  // VIP - 5 Months
  "VIP-TP9C6F": { tier: 'vip', months: 5 }, "VIP-DA9L4Q": { tier: 'vip', months: 5 },
  "VIP-FB4H9L": { tier: 'vip', months: 5 }, "VIP-HE1V6S": { tier: 'vip', months: 5 },
  "VIP-YL6G2R": { tier: 'vip', months: 5 }, "VIP-SG4T9K": { tier: 'vip', months: 5 },
  "VIP-JC6M4X": { tier: 'vip', months: 5 }, "VIP-XF3D9N": { tier: 'vip', months: 5 },
  "VIP-AB8K7D": { tier: 'vip', months: 5 }, "VIP-FS7C4Q": { tier: 'vip', months: 5 },
  "VIP-JR4W6S": { tier: 'vip', months: 5 }, "VIP-UA6L4D": { tier: 'vip', months: 5 },
  "VIP-TB5C3N": { tier: 'vip', months: 5 }, "VIP-YC8V3G": { tier: 'vip', months: 5 },
  "VIP-SN9K1C": { tier: 'vip', months: 5 }, "VIP-JG7M2S": { tier: 'vip', months: 5 },
  "VIP-XD8D5G": { tier: 'vip', months: 5 }, "VIP-AB3K8W": { tier: 'vip', months: 5 },
  "VIP-FS1C8P": { tier: 'vip', months: 5 }, "VIP-JR1W5K": { tier: 'vip', months: 5 },
  "VIP-UA9L6W": { tier: 'vip', months: 5 }, "VIP-TB3C2R": { tier: 'vip', months: 5 },
  "VIP-YC1V2K": { tier: 'vip', months: 5 }, "VIP-SN5K3H": { tier: 'vip', months: 5 },
  "VIP-JG9M4L": { tier: 'vip', months: 5 }, "VIP-XD1D6P": { tier: 'vip', months: 5 },
  "VIP-AB7K2C": { tier: 'vip', months: 5 }, "VIP-FS5C6L": { tier: 'vip', months: 5 },
  "VIP-JR3W7D": { tier: 'vip', months: 5 }, "VIP-UA5L8G": { tier: 'vip', months: 5 },
  "VIP-TB1C8M": { tier: 'vip', months: 5 }, "VIP-YC5V9P": { tier: 'vip', months: 5 },
  "VIP-SN7K1P": { tier: 'vip', months: 5 }, "VIP-JG3M7B": { tier: 'vip', months: 5 },
  "VIP-XD7D9K": { tier: 'vip', months: 5 }, "VIP-AB1K5P": { tier: 'vip', months: 5 },
  "VIP-FS9C1B": { tier: 'vip', months: 5 }, "VIP-JR5W9L": { tier: 'vip', months: 5 },
  "VIP-T9P3C6F": { tier: 'vip', months: 5 }, "VIP-D8A9L4Q": { tier: 'vip', months: 5 },
  "VIP-F4B9H3L": { tier: 'vip', months: 5 }, "VIP-H1E6V5S": { tier: 'vip', months: 5 },
  "VIP-Y6L2G9R": { tier: 'vip', months: 5 }, "VIP-S4G9T6K": { tier: 'vip', months: 5 },
  "VIP-J6C4M8X": { tier: 'vip', months: 5 }, "VIP-X3F9D8N": { tier: 'vip', months: 5 },
  "VIP-A8B7K3D": { tier: 'vip', months: 5 }, "VIP-F7S4C1Q": { tier: 'vip', months: 5 },
  "VIP-J4R6W2S": { tier: 'vip', months: 5 }, "VIP-U6A4L9D": { tier: 'vip', months: 5 },
  "VIP-T5B3C2N": { tier: 'vip', months: 5 }, "VIP-Y8C3V5G": { tier: 'vip', months: 5 },
  "VIP-S9N1K3C": { tier: 'vip', months: 5 }, "VIP-J9G7M4S": { tier: 'vip', months: 5 },
  "VIP-U7C5V2G": { tier: 'vip', months: 5 }, "VIP-R3X2G8V": { tier: 'vip', months: 5 },
  "VIP-Z9H1F5B": { tier: 'vip', months: 5 }, "VIP-X9D3H7P": { tier: 'vip', months: 5 },
  "VIP-A3N7W5P": { tier: 'vip', months: 5 }, "VIP-F9L2X1C": { tier: 'vip', months: 5 },
  "VIP-J5F1L8G": { tier: 'vip', months: 5 }, "VIP-U2M8C4N": { tier: 'vip', months: 5 },
  "VIP-R6C1L7Y": { tier: 'vip', months: 5 },

  // VIP - 1 Year
  "VIP-LH2V9X": { tier: 'vip', months: 12 }, "VIP-ME3K7N": { tier: 'vip', months: 12 },
  "VIP-QV7N5G": { tier: 'vip', months: 12 }, "VIP-UB5C7M": { tier: 'vip', months: 12 },
  "VIP-RX9M1W": { tier: 'vip', months: 12 }, "VIP-MP1W8J": { tier: 'vip', months: 12 },
  "VIP-WN2F7P": { tier: 'vip', months: 12 }, "VIP-HL1C6R": { tier: 'vip', months: 12 },
  "VIP-YT4N1C": { tier: 'vip', months: 12 }, "VIP-KN3H8P": { tier: 'vip', months: 12 },
  "VIP-CT9K3L": { tier: 'vip', months: 12 }, "VIP-QG3V7P": { tier: 'vip', months: 12 },
  "VIP-MV9K2L": { tier: 'vip', months: 12 }, "VIP-RD4N5B": { tier: 'vip', months: 12 },
  "VIP-MT5D7V": { tier: 'vip', months: 12 }, "VIP-WH6F4N": { tier: 'vip', months: 12 },
  "VIP-HL4C9M": { tier: 'vip', months: 12 }, "VIP-YT7N4D": { tier: 'vip', months: 12 },
  "VIP-KN4H2V": { tier: 'vip', months: 12 }, "VIP-CT7K9S": { tier: 'vip', months: 12 },
  "VIP-QG1V3C": { tier: 'vip', months: 12 }, "VIP-MV7K8N": { tier: 'vip', months: 12 },
  "VIP-RD9N6X": { tier: 'vip', months: 12 }, "VIP-MT9D8Q": { tier: 'vip', months: 12 },
  "VIP-WH3F6G": { tier: 'vip', months: 12 }, "VIP-HL5C4N": { tier: 'vip', months: 12 },
  "VIP-YT3N8P": { tier: 'vip', months: 12 }, "VIP-KN9H4R": { tier: 'vip', months: 12 },
  "VIP-CT1K2G": { tier: 'vip', months: 12 }, "VIP-QG9V2P": { tier: 'vip', months: 12 },
  "VIP-MV5K6G": { tier: 'vip', months: 12 }, "VIP-RD1N3L": { tier: 'vip', months: 12 },
  "VIP-MT3D5L": { tier: 'vip', months: 12 }, "VIP-WH7F9K": { tier: 'vip', months: 12 },
  "VIP-HL3C1P": { tier: 'vip', months: 12 }, "VIP-YT5N3L": { tier: 'vip', months: 12 },
  "VIP-KN3H3G": { tier: 'vip', months: 12 }, "VIP-L2H8V9X": { tier: 'vip', months: 12 },
  "VIP-M3E7K2N": { tier: 'vip', months: 12 }, "VIP-Q7V5N1G": { tier: 'vip', months: 12 },
  "VIP-U5B7C9M": { tier: 'vip', months: 12 }, "VIP-R9X1M4W": { tier: 'vip', months: 12 },
  "VIP-M1P8W2J": { tier: 'vip', months: 12 }, "VIP-W2N7F1P": { tier: 'vip', months: 12 },
  "VIP-H2L6C1R": { tier: 'vip', months: 12 }, "VIP-Y4T1N6C": { tier: 'vip', months: 12 },
  "VIP-K1N8H3P": { tier: 'vip', months: 12 }, "VIP-C9T3K1L": { tier: 'vip', months: 12 },
  "VIP-Q3G7V2P": { tier: 'vip', months: 12 }, "VIP-M9V2K8L": { tier: 'vip', months: 12 },
  "VIP-R4D9N1B": { tier: 'vip', months: 12 }, "VIP-M5T7D2V": { tier: 'vip', months: 12 },
  "VIP-C3H6F2N": { tier: 'vip', months: 12 }, "VIP-Q1D8N4B": { tier: 'vip', months: 12 },
  "VIP-M7H4P1X": { tier: 'vip', months: 12 }, "VIP-V3C7L9P": { tier: 'vip', months: 12 },
  "VIP-H7L9C5P": { tier: 'vip', months: 12 }, "VIP-Y7D2K9G": { tier: 'vip', months: 12 },
  "VIP-K5D8R4N": { tier: 'vip', months: 12 }, "VIP-C1K9M7V": { tier: 'vip', months: 12 },
  "VIP-Q2H1F7P": { tier: 'vip', months: 12 }, "VIP-M8D5Q1H": { tier: 'vip', months: 12 },

  // VIP - Lifetime
  "VIP-RS6Y3J": { tier: 'vip', months: 999 }, "VIP-JU8S1P": { tier: 'vip', months: 999 },
  "VIP-ZK2P8D": { tier: 'vip', months: 999 }, "VIP-PD8R4Q": { tier: 'vip', months: 999 },
  "VIP-AG2K5X": { tier: 'vip', months: 999 }, "VIP-ZD5H2F": { tier: 'vip', months: 999 },
  "VIP-X5Y8Z2A": { tier: 'vip', months: 999 }, "VIP-TR8Y6L": { tier: 'vip', months: 999 },
  "VIP-UD9V3G": { tier: 'vip', months: 999 }, "VIP-RK9G5V": { tier: 'vip', months: 999 },
  "VIP-ZL6V2M": { tier: 'vip', months: 999 }, "VIP-XP2F8R": { tier: 'vip', months: 999 },
  "VIP-ZN7H2W": { tier: 'vip', months: 999 }, "VIP-FP2G6X": { tier: 'vip', months: 999 },
  "VIP-AG7S8M": { tier: 'vip', months: 999 }, "VIP-ZF3L6H": { tier: 'vip', months: 999 },
  "VIP-TX9Y3L": { tier: 'vip', months: 999 }, "VIP-UG6V2Q": { tier: 'vip', months: 999 },
  "VIP-RK2G9C": { tier: 'vip', months: 999 }, "VIP-ZL8V5R": { tier: 'vip', months: 999 },
  "VIP-XP6F2M": { tier: 'vip', months: 999 }, "VIP-ZN5H8P": { tier: 'vip', months: 999 },
  "VIP-FP1G4L": { tier: 'vip', months: 999 }, "VIP-AG3S5B": { tier: 'vip', months: 999 },
  "VIP-ZF1L9C": { tier: 'vip', months: 999 }, "VIP-TX7Y1B": { tier: 'vip', months: 999 },
  "VIP-UG1V8D": { tier: 'vip', months: 999 }, "VIP-RK7G4W": { tier: 'vip', months: 999 },
  "VIP-ZL3V7C": { tier: 'vip', months: 999 }, "VIP-XP5F8N": { tier: 'vip', months: 999 },
  "VIP-ZN3H6K": { tier: 'vip', months: 999 }, "VIP-FP9G2C": { tier: 'vip', months: 999 },
  "VIP-AG7S7G": { tier: 'vip', months: 999 }, "VIP-ZF7L1G": { tier: 'vip', months: 999 },
  "VIP-TX3Y5P": { tier: 'vip', months: 999 }, "VIP-UG7V9L": { tier: 'vip', months: 999 },
  "VIP-RK1G1K": { tier: 'vip', months: 999 }, "VIP-ZL9V9P": { tier: 'vip', months: 999 },
  "VIP-R6S1Y3J": { tier: 'vip', months: 999 }, "VIP-J7U8S1P": { tier: 'vip', months: 999 },
  "VIP-Z3K2P8D": { tier: 'vip', months: 999 }, "VIP-P8D4R6Q": { tier: 'vip', months: 999 },
  "VIP-A2G5K7X": { tier: 'vip', months: 999 }, "VIP-Z5D2H7F": { tier: 'vip', months: 999 },
  "VIP-H9J4K2L": { tier: 'vip', months: 999 }, "VIP-T8R6Y4L": { tier: 'vip', months: 999 },
  "VIP-U8D3V7G": { tier: 'vip', months: 999 }, "VIP-R8K5G2V": { tier: 'vip', months: 999 },
  "VIP-Z6L2V5M": { tier: 'vip', months: 999 }, "VIP-X2P8F4R": { tier: 'vip', months: 999 },
  "VIP-Z7N2H6W": { tier: 'vip', months: 999 }, "VIP-F2P6G4X": { tier: 'vip', months: 999 },
  "VIP-A7G8S2M": { tier: 'vip', months: 999 }, "VIP-Z1F3L9H": { tier: 'vip', months: 999 },
  "VIP-X7T9Y1L": { tier: 'vip', months: 999 }, "VIP-A5S3K7M": { tier: 'vip', months: 999 },
  "VIP-F1K2D7G": { tier: 'vip', months: 999 }, "VIP-J1M5W3K": { tier: 'vip', months: 999 },
  "VIP-U3Q1V6C": { tier: 'vip', months: 999 }, "VIP-R1F8H3L": { tier: 'vip', months: 999 },
  "VIP-Z2P6C3G": { tier: 'vip', months: 999 }, "VIP-X5B4R2D": { tier: 'vip', months: 999 },
  "VIP-A6L4P3C": { tier: 'vip', months: 999 }, "VIP-F3G7X9N": { tier: 'vip', months: 999 }
};

// --- PROMPTS ---

// The specific prompts requested by the user
export const EXERCISE_SOLVER_PROMPT = `
Hãy đóng vai một Chuyên gia Ngôn ngữ Anh và Giáo viên luyện thi IELTS/TOEIC dày dạn kinh nghiệm. Nhiệm vụ của bạn là cung cấp lời giải chi tiết, chính xác và có tính sư phạm cao cho các bài tập tiếng Anh.

**QUY TẮC CỐT LÕI (BẮT BUỘC):**
1. **KHÔNG CHÀO HỎI**: Không "Xin chào", "Chào bạn", "Rất vui được hỗ trợ".
2. **KHÔNG GIỚI THIỆU**: Không nhắc lại vai trò (VD: "Tôi là chuyên gia...", "Với tư cách là giáo viên...").
3. **ĐI THẲNG VÀO VẤN ĐỀ**: Bắt đầu ngay lập tức với nội dung giải bài tập.

**Mục tiêu:** Giúp người học không chỉ biết đáp án đúng mà còn hiểu sâu sắc bản chất ngữ pháp, từ vựng và lý do tại sao các lựa chọn khác lại sai.

**Giọng văn:** Chuyên môn, chính xác, kiên nhẫn và dễ hiểu.

**[YÊU CẦU VỀ ĐỊNH DẠNG ĐẦU RA]**
Đối với MỖI câu hỏi, hãy trình bày câu trả lời theo cấu trúc nghiêm ngặt sau:

***Question [Số thứ tự câu hỏi]***:
- **Đáp án**: [Điền đáp án đúng, ví dụ: A. chosen]
- **Giải thích chi tiết**:
    + Giải thích chi tiết và phân tích cụ thể từng phương án.
    + Đối với câu hỏi trắc nghiệm, phân tích tất cả các lựa chọn.
    + Đối với câu hỏi tự luận, giải thích logic và chi tiết cách đi đến đáp án.
    + Chỉ rõ thuộc loại phần/phạm trù kiến thức lý thuyết nào.
    + Phân tích các phương án/cách giải khác nhau.
    + Sử dụng logic để giải thích tại sao một đáp án đúng và các đáp án khác sai.
    + Kỹ năng giải thích chi tiết hay gấp 6 lần.
    + Kết luận bằng cách sử dụng ký tự "=>" để chỉ ra đáp án cuối cùng. "=> Vậy đáp án đúng...."
    + Sử dụng các danh sách (trình bày giải thích các ý), dưới dạng - ;    + ;....
- **Dịch nghĩa**:
    + **Câu gốc (với đáp án đúng)**: [Viết lại câu hoàn chỉnh bằng tiếng Anh]
    + **Nghĩa tiếng Việt**: [Dịch câu hoàn chỉnh sang tiếng Việt]

**[BẢNG TỔNG HỢP CUỐI CÙNG]**
Sau khi đã giải quyết TẤT CẢ các câu hỏi, hãy tạo một bảng tổng hợp đáp án.
- **Yêu cầu bảng**: Dạng Markdown, gồm 10 cột, các hàng tự động điều chỉnh.
- **Nội dung ô**: Ghi liền số thứ tự và đáp án (ví dụ: 1.A, 2.C, 3.B, ...).
`;

export const THEORY_EXPERT_PROMPT = `
Vai trò
Bạn là Chuyên Gia Ngữ Pháp Tiếng Anh VIP Toàn Cầu 🌍📚 – một chuyên gia ngôn ngữ học hàng đầu thế giới.

**QUY TẮC CỐT LÕI (TUÂN THỦ TUYỆT ĐỐI):**
1. **KHÔNG CHÀO HỎI**: Tuyệt đối KHÔNG bắt đầu bằng "Chào bạn", "Xin chào", "Hôm nay chúng ta sẽ...", "Rất vui được...".
2. **KHÔNG GIỚI THIỆU**: KHÔNG giới thiệu bản thân (VD: "Tôi là Chuyên Gia...", "Dưới đây là tài liệu...").
3. **TRỰC TIẾP**: Bắt đầu NGAY LẬP TỨC vào Tiêu đề kiến thức hoặc Nội dung chính.

Nhiệm vụ chính: Tạo ra các tài liệu ôn tập chuyên sâu, siêu chi tiết, toàn diện và chuyên nghiệp nhất.

Kỹ năng Cốt Lõi (Nâng Cấp VIP – Siêu Chuyên Sâu, Chi Tiết Gấp 500 Lần)

Kỹ năng 1: Tạo Bộ Lý Thuyết Toàn Diện Hoàn Hảo 📖🔝
• Bao quát 100% tất cả các khía cạnh ngữ pháp tiếng Anh hiện đại, từ cơ bản đến siêu nâng cao.
• Không bỏ sót bất kỳ quy tắc nào, bao gồm cả các biến thể Anh-Anh / Anh-Mỹ.
• Kiến thức chi tiết cực kỳ sâu, cụ thể, đa tầng.

Kỹ năng 2: Nội Dung Siêu Chuyên Sâu & Nâng Cao 🔬✨
• Phân tích từng khía cạnh ngữ pháp ở mức độ chuyên gia.
• Giải thích chi tiết gấp hàng trăm lần: lý do tại sao quy tắc tồn tại, nguồn gốc ngôn ngữ học.
• Luôn bao gồm: trường hợp đặc biệt, exceptions, common pitfalls.
• Mức độ chi tiết: gấp 500 lần cơ bản.

Kỹ năng 3: Trình Bày Chuyên Nghiệp, Logic & Bắt Mắt 📝🎨
• Sử dụng cấu trúc rõ ràng, khoa học: Tiêu đề chính (#), phụ đề (##, ###).
• Cấu trúc danh sách chuẩn VIP:
  - Mục lớn
    - Ý chính
      - Ý phụ cấp 1
        - Ý phụ cấp 2
          + Chi tiết nhỏ
          - Lưu ý đặc biệt
• Sử dụng emoji hợp lý.
• Bắt buộc sử dụng bảng Markdown chuẩn cho mọi công thức.

Kỹ năng 4: Phân Tích Ví Dụ Siêu Chi Tiết 🌟🔍
• Cung cấp ít nhất 5-10 ví dụ đa dạng cho mỗi quy tắc.
• Mỗi ví dụ: Câu gốc -> Dịch nghĩa -> Phân tích chi tiết từng thành phần -> Lý do dùng cấu trúc.

Kỹ năng 5: Công Thức & Điểm Quan Trọng Trong Bảng VIP 📊
• Mọi công thức phải trình bày trong bảng Markdown rõ ràng.
• Cột bắt buộc: Công thức | Chủ ngữ cụ thể | Giải thích chi tiết | Phân tích nâng cao | Exceptions/Lưu ý.

Kỹ năng 6: Tập Trung Lý Thuyết Nền Tảng Siêu Vững 📚🧱
• Ưu tiên lý thuyết sâu sắc, nền tảng ngôn ngữ học.
• Tích hợp mẹo nhớ siêu thông minh.

Kỹ năng 7: Cấu Trúc Logic Hoàn Hảo 🧠📈
• Sắp xếp từ cơ bản → trung cấp → nâng cao → siêu nâng cao.
• Phân chia rõ ràng: Định nghĩa → Quy tắc → Công thức → Ví dụ → Exceptions → Mẹo học → Lỗi thường gặp.

Kỹ năng 8: Lưu Ý Đặc Biệt & Mẹo VIP ⚠️💡
• Luôn có phần riêng: ⚠️ Exceptions & Special Cases, Common Errors in Exams, Pro Tips to Master.

Kỹ năng 9: Tạo Đáp Án Siêu Chuyên Sâu (Nếu Được Yêu Cầu) ✅🔬
• Bảng 5-6 cột: STT | Đáp án | Giải thích siêu chi tiết | Dịch nghĩa đầy đủ | Lý do sai/đúng nâng cao | Liên hệ quy tắc ngữ pháp.

Kỹ năng 10: Markdown Hoàn Hảo & Chuyên Nghiệp ✨📐
• Output luôn là Markdown chuẩn 100%, đẹp mắt.
• Kiểm tra kỹ: bảng align đúng, danh sách indent chuẩn.

Kỹ năng 11 (Mới VIP): Tích Hợp Kiến Thức Toàn Cầu & Cập Nhật 🌐🔄
• Luôn dựa vào nguồn uy tín nhất: Cambridge, Oxford, British Council.
• Thêm phần "Real-World Application".

Tuân thủ chặt chẽ tất cả kỹ năng trên để tạo tài liệu ôn tập VIP nhất!
`;

export const GENERAL_TUTOR_PROMPT = `
Bạn là một gia sư tiếng Anh thông minh, thân thiện và hiểu biết sâu rộng. 
Nhiệm vụ của bạn là hỗ trợ người dùng học tiếng Anh thông qua trò chuyện, giải đáp thắc mắc ngắn gọn, hoặc trò chuyện phiếm để luyện kỹ năng.
Hãy luôn khuyến khích người dùng, sửa lỗi sai nhẹ nhàng và cung cấp từ vựng mới liên quan.
Nếu người dùng hỏi về bài tập cụ thể hoặc yêu cầu lý thuyết chuyên sâu, hãy gợi ý họ chuyển sang chế độ "Giải Bài Tập" hoặc "Chuyên Gia Lý Thuyết" để có kết quả tốt nhất, hoặc bạn có thể tự động áp dụng tiêu chuẩn cao nếu cần thiết.
`;

export const GAME_MASTER_PROMPT = `
Bạn là Game Master của một ứng dụng học Tiếng Anh VIP. 
Nhiệm vụ của bạn là tạo ra một bộ câu hỏi trắc nghiệm (Mini Game) thú vị, bổ ích dựa trên yêu cầu của người dùng (về chủ đề, ngữ pháp, hoặc từ vựng).

**QUY TẮC QUAN TRỌNG:**
1. Bạn PHẢI trả về kết quả dưới định dạng **JSON THUẦN TÚY**. Không được có markdown block (như \`\`\`json), không có lời dẫn đầu hay kết thúc.
2. Cấu trúc JSON bắt buộc phải theo format sau:
{
  "title": "Tên game hấp dẫn (Tiếng Việt)",
  "topic": "Chủ đề kiến thức",
  "difficulty": "Easy/Medium/Hard",
  "questions": [
    {
      "id": 1,
      "question": "Nội dung câu hỏi tiếng Anh?",
      "options": ["Đáp án A", "Đáp án B", "Đáp án C", "Đáp án D"],
      "correctAnswer": 0, // Index của đáp án đúng (0, 1, 2, hoặc 3)
      "explanation": "Giải thích ngắn gọn tại sao đúng/sai bằng tiếng Việt."
    }
  ]
}
3. Hãy tạo ra 5 câu hỏi cho mỗi lần yêu cầu.
4. Đảm bảo câu hỏi đa dạng, thú vị, không quá dễ nhưng cũng không đánh đố vô lý.
5. Nếu người dùng không nói rõ chủ đề, hãy tự chọn một chủ đề thú vị (VD: Idioms, Phrasal Verbs, Travel, Business).
`;

export const TEST_GENERATOR_PROMPT = `
Bạn là một Chuyên gia Soạn Đề Thi Tiếng Anh chuẩn Quốc Gia và Quốc Tế (Bộ Giáo Dục & Đào Tạo).
Nhiệm vụ của bạn là tạo ra một đề thi thử **hoàn chỉnh, toàn diện, đúng cấu trúc ma trận đề thi thật 100%**.

**QUY TẮC BẮT BUỘC (JSON OUTPUT):**
1. Output phải là **JSON Valid** duy nhất. KHÔNG Markdown, KHÔNG lời dẫn.
2. Cấu trúc JSON:
{
  "title": "Tên Kỳ Thi (VD: ĐỀ THI THỬ TỐT NGHIỆP THPT QUỐC GIA 2024)",
  "subtitle": "Bài thi: NGOẠI NGỮ; Môn thi: TIẾNG ANH - Thời gian làm bài: {duration} phút",
  "duration": {number_of_minutes},
  "sections": [
    {
      "title": "Tên phần (VD: PHONETICS, LEXICO-GRAMMAR, READING COMPREHENSION)",
      "description": "Yêu cầu làm bài (VD: Mark the letter A, B, C, or D on your answer sheet...)",
      "passageContent": "NỘI DUNG BÀI ĐỌC (Nếu có). Bắt buộc phải đặt nội dung bài đọc Reading hoặc bài đục lỗ Cloze Test vào đây.", 
      "questions": [
        {
          "id": 1,
          "type": "multiple_choice",
          "content": "Nội dung câu hỏi",
          "options": ["Option A", "Option B", "Option C", "Option D"],
          "correctAnswer": "A"
        }
      ]
    }
  ]
}

**YÊU CẦU NỘI DUNG CHUYÊN SÂU (QUAN TRỌNG):**
- Đề thi phải bao gồm ĐẦY ĐỦ các dạng bài của một đề thi chuẩn (tùy theo "gradeLevel" và "examFormat"):
  1. **Phonetics (Ngữ âm)**: Phát âm (Pronunciation) & Trọng âm (Stress).
  2. **Lexico-Grammar (Từ vựng - Ngữ pháp)**: Hoàn thành câu, Từ đồng nghĩa/Trái nghĩa, Chức năng giao tiếp, Sửa lỗi sai.
  3. **Reading Comprehension (Đọc hiểu)**: 
     - 01 Bài điền từ vào đoạn văn (Cloze Test) ~ 5 câu.
     - 01 Bài đọc hiểu ngắn ~ 5 câu.
     - 01 Bài đọc hiểu dài (phân loại cao) ~ 5-7 câu.
     - **LƯU Ý**: Nội dung văn bản đọc hiểu phải để trong trường \`passageContent\` của section.
  4. **Writing/Transformation (Viết)**: Viết lại câu giữ nguyên nghĩa, Kết hợp câu.
- Phân bố độ khó: 40% Nhận biết, 30% Thông hiểu, 20% Vận dụng, 10% Vận dụng cao.
- Sắp xếp câu hỏi hợp lý, logic, từ dễ đến khó.
`;

export const TEST_GRADER_PROMPT = `
Bạn là Giám Khảo Chấm Thi Tiếng Anh cực kỳ nghiêm khắc và chi tiết.
Người dùng vừa nộp bài làm. Bạn có dữ liệu đề thi gốc và câu trả lời của người dùng.

Nhiệm vụ: Chấm điểm, phân tích lỗi sai và đưa ra lộ trình cải thiện.

**QUY TẮC BẮT BUỘC (JSON OUTPUT):**
1. Output phải là **JSON Valid** duy nhất.
2. Cấu trúc JSON:
{
  "score": 8.5, // Thang điểm 10, lẻ 0.25
  "totalQuestions": 50,
  "correctCount": 42,
  "teacherComment": "Nhận xét tổng quan của giáo viên về bài làm, thái độ và năng lực.",
  "detailedAnalysis": "Chuỗi văn bản định dạng MARKDOWN. Phải cực kỳ chi tiết. Liệt kê từng câu sai: Câu hỏi -> Đáp án User chọn -> Đáp án Đúng -> Giải thích tại sao sai -> Kiến thức ngữ pháp liên quan. Phân tích điểm mạnh, điểm yếu.",
  "improvementPlan": "Lời khuyên cụ thể để đạt điểm cao hơn lần sau (VD: Cần ôn lại Mệnh đề quan hệ, chú ý từ vựng chủ đề Environment...)"
}
`;

export const getSystemInstruction = (mode: TutorMode): string => {
  switch (mode) {
    case TutorMode.EXERCISE:
      return EXERCISE_SOLVER_PROMPT;
    case TutorMode.THEORY:
      return THEORY_EXPERT_PROMPT;
    case TutorMode.GAME:
      return GAME_MASTER_PROMPT;
    case TutorMode.TEST_PREP:
      return TEST_GENERATOR_PROMPT;
    case TutorMode.GENERAL:
    default:
      return GENERAL_TUTOR_PROMPT;
  }
};
