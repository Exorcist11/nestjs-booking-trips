import { ApiProperty } from '@nestjs/swagger';
import {
  IsMongoId,
  IsDateString,
  IsString,
  IsOptional,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsBoolean,
  IsEnum,
} from 'class-validator';
import { Types } from 'mongoose';

export class CreateBookingDto {
  @ApiProperty({
    example: '65fa1c9e1234567890abcdef',
    description: 'ID của lịch trình (Schedule)',
  })
  @IsMongoId()
  @IsNotEmpty()
  scheduleId: Types.ObjectId;

  @ApiProperty({
    example: '2025-07-08T00:00:00+07:00',
    description: 'Ngày của chuyến đi',
  })
  @IsDateString()
  @IsNotEmpty()
  date: string;

  @ApiProperty({
    example: '65fa1c9e1234567890abcdef',
    description: 'ID của người dùng (nếu đã đăng ký)',
    required: false,
  })
  @IsMongoId()
  @IsOptional()
  user?: Types.ObjectId;

  @ApiProperty({
    example: '65fa1c9e1234567890abcdef',
    description: 'ID của khuyến mãi (nếu có)',
    required: false,
  })
  @IsMongoId()
  @IsOptional()
  promotion?: Types.ObjectId;

  @ApiProperty({
    example: 'Nguyễn Văn A',
    description: 'Tên khách hàng',
  })
  @IsString()
  @IsNotEmpty()
  customerName: string;

  @ApiProperty({
    example: '0123456789',
    description: 'Số điện thoại của khách hàng',
  })
  @IsString()
  @IsNotEmpty()
  phoneNumber: string;

  @ApiProperty({
    example: 'nguyenvana@example.com',
    description: 'Email của khách hàng',
    required: false,
  })
  @IsString()
  @IsOptional()
  email?: string;

  @ApiProperty({
    example: ['A1', 'A2'],
    description: 'Danh sách ghế được đặt',
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty()
  seats: string[];

  @ApiProperty({
    example: 'Bến xe Thanh Hóa',
    description: 'Điểm đón khách',
  })
  @IsString()
  @IsNotEmpty()
  pickupPoint: string;

  @ApiProperty({
    example: 'Bến xe Giáp Bát',
    description: 'Điểm trả khách',
  })
  @IsString()
  @IsNotEmpty()
  dropOffPoint: string;

  @ApiProperty({
    example: 300000,
    description: 'Tổng giá vé (VNĐ)',
  })
  @IsNumber()
  @IsNotEmpty()
  totalPrice: number;

  @ApiProperty({
    example: false,
    description: 'Khách hàng có phải là khách vãng lai không',
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  isGuest?: boolean;

  @ApiProperty({
    example: 'pending',
    description: 'Trạng thái đặt vé (pending, confirmed, cancelled, completed)',
    required: false,
  })
  @IsEnum(['pending', 'confirmed', 'cancelled', 'completed'])
  @IsOptional()
  status?: string;

  @ApiProperty({
    example: false,
    description: 'Trạng thái thanh toán',
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  isPaid?: boolean;

  @ApiProperty({
    example: 'cash',
    description: 'Phương thức thanh toán (cash, transfer, card, e-wallet)',
    required: false,
  })
  @IsEnum(['cash', 'transfer', 'card', 'e-wallet'])
  @IsOptional()
  paymentMethod?: string;

  @ApiProperty({
    example: 'Yêu cầu ghế gần cửa sổ',
    description: 'Ghi chú của khách hàng',
    required: false,
  })
  @IsString()
  @IsOptional()
  note?: string;
}
