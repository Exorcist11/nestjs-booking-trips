import { ApiProperty } from '@nestjs/swagger';

export class CarResponseDto {
  @ApiProperty({
    example: '65fa1c9e1234567890abcdef',
    description: 'ID của xe khách',
  })
  id: string;

  @ApiProperty({
    example: '36B-12345',
    description: 'Biển số xe',
  })
  licensePlate: string;

  @ApiProperty({
    example: 'Nguyễn Văn A',
    description: 'Tên tài xế chính',
  })
  mainDriver: string;

  @ApiProperty({
    example: 'Trần Thị B',
    description: 'Tên phụ xe',
  })
  ticketCollector: string;

  @ApiProperty({
    example: '0123456789',
    description: 'Số điện thoại liên hệ',
  })
  phoneNumber: string;

  @ApiProperty({
    example: 30,
    description: 'Sức chứa của xe (số ghế)',
  })
  seatingCapacity: number;

  @ApiProperty({
    example: ['A1', 'A2', 'B1', 'B2'],
    description: 'Danh sách ghế trên xe',
    type: [String],
  })
  seats: string[];

  @ApiProperty({
    example: 'active',
    description: 'Trạng thái của xe (active, maintenance, inactive)',
  })
  status: string;

  @ApiProperty({
    example: 'Hyundai Universe',
    description: 'Mẫu xe',
    required: false,
  })
  model?: string;

  @ApiProperty({
    example: 2020,
    description: 'Năm sản xuất',
    required: false,
  })
  yearOfManufacture?: number;

  @ApiProperty({
    example: '2-2',
    description: 'Bố trí ghế (VD: 2-2 hoặc 1-2)',
    required: false,
  })
  seatLayout?: string;

  @ApiProperty({
    example: false,
    description: 'Trạng thái xóa của xe',
  })
  isDeleted: boolean;

  @ApiProperty({
    example: '2025-07-07T10:00:00Z',
    description: 'Thời gian xóa (nếu có)',
    required: false,
  })
  deletedAt?: Date;

  @ApiProperty({
    example: '2025-07-07T10:00:00Z',
    description: 'Thời gian tạo xe',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2025-07-07T10:00:00Z',
    description: 'Thời gian cập nhật xe',
  })
  updatedAt: Date;
}
