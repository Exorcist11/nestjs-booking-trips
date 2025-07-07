import { ApiProperty } from '@nestjs/swagger';

export class UpdateRouteDto {
  @ApiProperty({
    example: 'Thanh Hóa',
    description: 'Điểm xuất phát của tuyến đường',
    required: false,
  })
  departure?: string;

  @ApiProperty({
    example: 'Hà Nội',
    description: 'Điểm đến của tuyến đường',
    required: false,
  })
  destination?: string;

  @ApiProperty({
    example: ['Bến xe Thanh Hóa', 'Ngã tư Đại La'],
    description: 'Danh sách các điểm đón khách',
    type: [String],
    required: false,
  })
  pickupPoints?: string[];

  @ApiProperty({
    example: ['Bến xe Giáp Bát', 'Bến xe Nước Ngầm'],
    description: 'Danh sách các điểm trả khách',
    type: [String],
    required: false,
  })
  dropOffPoints?: string[];

  @ApiProperty({
    example: 150,
    description: 'Khoảng cách tuyến đường (km)',
    required: false,
  })
  distance?: number;

  @ApiProperty({
    example: 240,
    description: 'Thời gian di chuyển ước tính (phút)',
    required: false,
  })
  estimatedDuration?: number;

  @ApiProperty({
    example: 'forward',
    description: 'Hướng tuyến đường (forward hoặc return)',
    required: false,
  })
  direction?: string;

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
    required: false,
  })
  isActive?: boolean;
}
