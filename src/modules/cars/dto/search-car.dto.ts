import { ApiProperty } from '@nestjs/swagger';

export class SearchCarsDto {
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
    example: 'licensePlate',
    description:
      'Trường để sắp xếp (licensePlate, seatingCapacity, status, yearOfManufacture)',
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
    example: '36B',
    description:
      'Từ khóa tìm kiếm (áp dụng cho licensePlate, mainDriver, ticketCollector, phoneNumber, model)',
    required: false,
  })
  search?: string;

  @ApiProperty({
    example: false,
    description: 'Lấy cả xe đã xóa mềm (true/false, mặc định: false)',
    required: false,
  })
  includeDeleted?: boolean;
}
