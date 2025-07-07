import { ApiProperty } from '@nestjs/swagger';

export class PromotionResponseDto {
  @ApiProperty({
    example: '65fa1c9e1234567890abcdef',
    description: 'ID của khuyến mãi',
  })
  id: string;

  @ApiProperty({
    example: 'SUMMER2025',
    description: 'Mã khuyến mãi',
  })
  code: string;

  @ApiProperty({
    example: 'Khuyến mãi mùa hè',
    description: 'Tên chương trình khuyến mãi',
  })
  name: string;

  @ApiProperty({
    example: 'Giảm 20% cho vé tuyến Thanh Hóa - Hà Nội',
    description: 'Mô tả khuyến mãi',
  })
  description: string;

  @ApiProperty({
    example: 'percentage',
    description: 'Loại khuyến mãi (percentage hoặc fixed)',
  })
  discountType: string;

  @ApiProperty({
    example: 20,
    description: 'Giá trị giảm giá (phần trăm hoặc số tiền cố định)',
  })
  discountValue: number;

  @ApiProperty({
    example: '2025-07-01T00:00:00+07:00',
    description: 'Ngày bắt đầu khuyến mãi (theo chuẩn ISO 8601)',
  })
  startDate: string;

  @ApiProperty({
    example: '2025-08-31T23:59:59+07:00',
    description: 'Ngày kết thúc khuyến mãi (theo chuẩn ISO 8601)',
  })
  endDate: string;

  @ApiProperty({
    example: 100000,
    description: 'Giá trị đơn hàng tối thiểu để áp dụng khuyến mãi',
  })
  minOrderValue: number;

  @ApiProperty({
    example: 50000,
    description: 'Mức giảm giá tối đa (nếu có)',
  })
  maxDiscount: number;

  @ApiProperty({
    example: 100,
    description: 'Giới hạn số lần sử dụng khuyến mãi',
  })
  usageLimit: number;

  @ApiProperty({
    example: 0,
    description: 'Số lần khuyến mãi đã được sử dụng',
  })
  usedCount: number;

  @ApiProperty({
    example: ['65fa1c9e1234567890abcdef'],
    description: 'Danh sách ID tuyến đường áp dụng khuyến mãi',
    type: [String],
  })
  applicableRoutes: string[];

  @ApiProperty({
    example: true,
    description: 'Trạng thái hoạt động của khuyến mãi',
  })
  isActive: boolean;

  @ApiProperty({
    example: '2025-07-07T10:00:00Z',
    description: 'Thời gian tạo khuyến mãi',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2025-07-07T10:00:00Z',
    description: 'Thời gian cập nhật khuyến mãi',
  })
  updatedAt: Date;
}
