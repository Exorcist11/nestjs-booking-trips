import { ApiProperty } from '@nestjs/swagger';

export class SearchRouteDto {
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

  @ApiProperty({
    example: 'departure',
    description:
      'Trường để sắp xếp (departure, destination, distance, estimatedDuration, direction, isActive)',
    required: false,
  })
  sortBy?: string;

  @ApiProperty({
    example: 'asc',
    description: 'Thứ tự sắp xếp (asc hoặc desc)',
    required: false,
  })
  sortOrder?: string;

  @ApiProperty({
    example: 'Hà Nội',
    description: 'Điểm xuất phát',
    required: false,
  })
  departure?: string;

  @ApiProperty({
    example: 'Thanh Hóa',
    description: 'Điểm đến',
    required: false,
  })
  destination?: string;
}
