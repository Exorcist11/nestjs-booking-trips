import { ApiProperty } from '@nestjs/swagger';

export class SearchTripDto {
  @ApiProperty({
    example: 'Thanh Hóa',
    description: 'Điểm xuất phát',
    required: false,
  })
  startLocation?: string;

  @ApiProperty({
    example: 'Hà Nội',
    description: 'Điểm đến',
    required: false,
  })
  endLocation?: string;

  @ApiProperty({
    example: '2025-07-07T00:00:00+07:00',
    description: 'Ngày diễn ra chuyến đi (theo chuẩn ISO 8601)',
    required: false,
  })
  date?: string;

  @ApiProperty({
    example: 1,
    description: 'Số trang (mặc định: 1)',
    required: false,
  })
  page?: number;

  @ApiProperty({
    example: 10,
    description: 'Số bản ghi mỗi trang (mặc định: 10)',
    required: false,
  })
  limit?: number;
}
