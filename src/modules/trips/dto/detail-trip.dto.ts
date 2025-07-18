import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsDateString, IsArray, IsOptional, IsEnum, IsObject } from 'class-validator';

class SeatDto {
  @ApiProperty({ description: 'Mã ghế', example: 'A1' })
  @IsString()
  id: string;

  @ApiProperty({ description: 'Trạng thái ghế (true: đã đặt, false: còn trống)', example: true })
  isBooked: boolean;
}

class CarInfoDto {
  @ApiProperty({ description: 'Biển số xe', example: '29B-12345' })
  @IsString()
  licensePlate: string;

  @ApiProperty({ description: 'Tên tài xế chính', example: 'Nguyễn Văn A' })
  @IsString()
  mainDriver: string;

  @ApiProperty({ description: 'Tên nhân viên soát vé', example: 'Trần Thị B' })
  @IsString()
  ticketCollector: string;

  @ApiProperty({ description: 'Số điện thoại liên lạc', example: '+84912345678' })
  @IsString()
  phoneNumber: string;

  @ApiProperty({ description: 'Model xe', example: 'Hyundai Universe' })
  @IsString()
  model: string;

  @ApiProperty({ description: 'Năm sản xuất xe', example: 2020, nullable: true })
  @IsOptional()
  @IsNumber()
  yearOfManufacture?: number;
}

export class TripDetailsDto {
  @ApiProperty({ description: 'Mã chuyến xe', example: '12345' })
  @IsString()
  tripId: string;

  @ApiProperty({ description: 'Địa điểm xuất phát', example: 'Hà Nội' })
  @IsString()
  startLocation: string;

  @ApiProperty({ description: 'Địa điểm đến', example: 'TP Hồ Chí Minh' })
  @IsString()
  endLocation: string;

  @ApiProperty({ description: 'Giờ xuất phát', example: '08:00' })
  @IsString()
  departureTime: string;

  @ApiProperty({ description: 'Ngày diễn ra chuyến xe', example: '2025-07-14T00:00:00+07:00' })
  @IsDateString()
  date: string;

  @ApiProperty({ description: 'Thời gian dự kiến (giây)', example: 3600 })
  @IsNumber()
  duration: number;

  @ApiProperty({ description: 'Giá vé (VND)', example: 500000 })
  @IsNumber()
  price: number;

  @ApiProperty({ description: 'Trạng thái chuyến xe', example: 'scheduled', enum: ['scheduled', 'boarding', 'departed', 'arrived', 'cancelled'] })
  @IsEnum(['scheduled', 'boarding', 'departed', 'arrived', 'cancelled'])
  status: string;

  @ApiProperty({ description: 'Ghi chú', example: 'Dự kiến xuất phát đúng giờ', nullable: true })
  @IsOptional()
  @IsString()
  note?: string;

  @ApiProperty({ description: 'Số ghế còn trống', example: 37 })
  @IsNumber()
  availableSeats: number;

  @ApiProperty({ description: 'Danh sách mã ghế đã đặt', example: ['A1', 'A2', 'B3'] })
  @IsArray()
  @IsString({ each: true })
  bookedSeats: string[];

  @ApiProperty({ description: 'Danh sách ghế', type: [SeatDto] })
  @IsArray()
  seats: SeatDto[];

  @ApiProperty({ description: 'Bố trí ghế', example: '2-2' })
  @IsString()
  seatLayout: string;

  @ApiProperty({ description: 'Thông tin xe', type: CarInfoDto })
  @IsObject()
  carInfo: CarInfoDto;

  @ApiProperty({ description: 'Thời gian xuất phát thực tế', example: null, nullable: true })
  @IsOptional()
  @IsDateString()
  actualDepartureTime?: string;

  @ApiProperty({ description: 'Thời gian đến thực tế', example: null, nullable: true })
  @IsOptional()
  @IsDateString()
  actualArrivalTime?: string;
}