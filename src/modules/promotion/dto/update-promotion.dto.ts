import { ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose';

export class UpdatePromotionDto {
  @ApiProperty({
    example: 'SUMMER2025',
    description: 'Mã khuyến mãi',
    required: false,
  })
  code?: string;

  @ApiProperty({
    example: 'Khuyến mãi mùa hè',
    description: 'Tên chương trình khuyến mãi',
    required: false,
  })
  name?: string;

  @ApiProperty({
    example: 'Giảm 20% cho vé tuyến Thanh Hóa - Hà Nội',
    description: 'Mô tả khuyến mãi',
    required: false,
  })
  description?: string;

  @ApiProperty({
    example: 'percentage',
    description: 'Loại khuyến mãi (percentage hoặc fixed)',
    required: false,
  })
  discountType?: string;

  @ApiProperty({
    example: 20,
    description: 'Giá trị giảm giá (phần trăm hoặc số tiền cố định)',
    required: false,
  })
  discountValue?: number;

  @ApiProperty({
    example: '2025-07-01T00:00:00+07:00',
    description: 'Ngày bắt đầu khuyến mãi (theo chuẩn ISO 8601)',
    required: false,
  })
  startDate?: string;

  @ApiProperty({
    example: '2025-08-31T23:59:59+07:00',
    description: 'Ngày kết thúc khuyến mãi (theo chuẩn ISO 8601)',
    required: false,
  })
  endDate?: string;

  @ApiProperty({
    example: 100000,
    description: 'Giá trị đơn hàng tối thiểu để áp dụng khuyến mãi',
    required: false,
  })
  minOrderValue?: number;

  @ApiProperty({
    example: 50000,
    description: 'Mức giảm giá tối đa (nếu có)',
    required: false,
  })
  maxDiscount?: number;

  @ApiProperty({
    example: 100,
    description: 'Giới hạn số lần sử dụng khuyến mãi',
    required: false,
  })
  usageLimit?: number;

  @ApiProperty({
    example: 0,
    description: 'Số lần khuyến mãi đã được sử dụng',
    required: false,
  })
  usedCount?: number;

  @ApiProperty({
    example: ['65fa1c9e1234567890abcdef'],
    description: 'Danh sách ID tuyến đường áp dụng khuyến mãi',
    type: [String],
    required: false,
  })
  applicableRoutes?: Types.ObjectId[];

  @ApiProperty({
    example: true,
    description: 'Trạng thái hoạt động của khuyến mãi',
    required: false,
  })
  isActive?: boolean;
}
