import { ApiProperty } from '@nestjs/swagger';

export class CreateRouteDto {
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
