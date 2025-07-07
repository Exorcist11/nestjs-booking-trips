import { ApiProperty } from '@nestjs/swagger';

export class RouteResponseDto {
  @ApiProperty({
    example: '65fa1c9e1234567890abcdef',
    description: 'ID của tuyến đường',
  })
  id: string;

  @ApiProperty({
    example: 'Thanh Hóa',
    description: 'Điểm xuất phát của tuyến đường',
  })
  departure: string;

  @ApiProperty({
    example: 'Hà Nội',
    description: 'Điểm đến của tuyến đường',
  })
  destination: string;

  @ApiProperty({
    example: ['Bến xe Thanh Hóa', 'Ngã tư Đại La'],
    description: 'Danh sách các điểm đón khách',
    type: [String],
  })
  pickupPoints: string[];

  @ApiProperty({
    example: ['Bến xe Giáp Bát', 'Bến xe Nước Ngầm'],
    description: 'Danh sách các điểm trả khách',
    type: [String],
  })
  dropOffPoints: string[];

  @ApiProperty({
    example: 150,
    description: 'Khoảng cách tuyến đường (km)',
  })
  distance: number;

  @ApiProperty({
    example: 240,
    description: 'Thời gian di chuyển ước tính (phút)',
  })
  estimatedDuration: number;

  @ApiProperty({
    example: 'forward',
    description: 'Hướng tuyến đường (forward hoặc return)',
  })
  direction: string;

  @ApiProperty({
    example: '+07:00',
    description: 'Múi giờ của tuyến đường',
    required: false,
  })
  timezone?: string;

  @ApiProperty({
    example: 'Tuyến cao tốc Thanh Hóa - Hà Nội',
    description: 'Mô tả chi tiết về tuyến đường',
    required: false,
  })
  description?: string;

  @ApiProperty({
    example: true,
    description: 'Trạng thái hoạt động của tuyến đường',
  })
  isActive: boolean;

  @ApiProperty({
    example: '2025-07-07T10:00:00Z',
    description: 'Thời gian tạo tuyến đường',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2025-07-07T10:00:00Z',
    description: 'Thời gian cập nhật tuyến đường',
  })
  updatedAt: Date;
}
