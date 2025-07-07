import { ApiProperty } from '@nestjs/swagger';

export class CreateRouteDto {
  @ApiProperty({
    example: 'Thanh Hóa',
    description: 'Điểm xuất phát của tuyến đường',
  })
  startLocation: string;

  @ApiProperty({
    example: 'Hà Nội',
    description: 'Điểm đến của tuyến đường',
  })
  endLocation: string;

  @ApiProperty({
    example: 240,
    description: 'Thời gian di chuyển ước tính (phút)',
  })
  duration: number;

  @ApiProperty({
    example: 150000,
    description: 'Giá tuyến đường (VNĐ)',
  })
  price: number;

  @ApiProperty({
    example: false,
    description: 'Đánh dấu đã xóa tuyến đường hay chưa',
    required: false,
  })
  isDeleted?: boolean;
}
