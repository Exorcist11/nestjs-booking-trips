import { ApiProperty } from '@nestjs/swagger';

export class SearchSchedulesDto {
  @ApiProperty({
    example: 'Thanh Hóa',
    description: 'Điểm xuất phát',
    required: false,
  })
  startLocation?: string;

  @ApiProperty({ example: 'Hà Nội', description: 'Điểm đến', required: false })
  endLocation?: string;

  @ApiProperty({
    example: '36B-12345',
    description: 'Biển số xe',
    required: false,
  })
  carLicensePlate?: string;

  @ApiProperty({
    example: true,
    description: 'Bao gồm lịch trình đã xóa mềm',
    required: false,
  })
  includeDeleted?: boolean;

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
    example: 'departureTime',
    description: 'Trường sắp xếp',
    required: false,
  })
  sortBy?: string;

  @ApiProperty({
    example: 'asc',
    description: 'Thứ tự sắp xếp (asc/desc)',
    required: false,
  })
  sortOrder?: 'asc' | 'desc';
}
