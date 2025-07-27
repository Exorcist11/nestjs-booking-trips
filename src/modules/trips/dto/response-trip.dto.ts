import { ApiProperty } from '@nestjs/swagger';

class CarDto {
  @ApiProperty({ example: '29A-12345' })
  licensePlate: string;

  @ApiProperty({ example: 40 })
  seatingCapacity: number;

  @ApiProperty({ example: ['A1', 'A2'] })
  seats: string[];

  @ApiProperty({ example: 'Nguyen Van Tai' })
  mainDriver: string;

  @ApiProperty({ example: '091992351' })
  phoneNumber: string;
}

export class TripResponseDto {
  @ApiProperty({ example: '65fa1c9e1234567890abcdef' })
  id: string;

  @ApiProperty({ example: '686c9f20c340817736dfafcb' })
  template: string;

  @ApiProperty({ example: '2025-07-13T00:00:00.000Z' })
  date: string;

  @ApiProperty({ example: ['A1', 'A2'] })
  bookedSeats: string[];

  @ApiProperty({ example: ['A3', 'A4'] })
  availableSeats: string[];

  @ApiProperty({ example: 'scheduled' })
  status: string;

  @ApiProperty({ example: null, nullable: true })
  actualDepartureTime?: string;

  @ApiProperty({ example: null, nullable: true })
  actualArrivalTime?: string;

  @ApiProperty({ example: 'Chuyến đi ảo cho ngày 2025-07-13' })
  note: string;

  @ApiProperty({ example: '2025-07-08T07:38:15.337Z' })
  createdAt: string;

  @ApiProperty({ example: '2025-07-08T07:38:15.337Z' })
  updatedAt: string;

  @ApiProperty({ example: 'Thanh Hóa' })
  startLocation: string;

  @ApiProperty({ example: 'Hà Nội' })
  endLocation: string;

  @ApiProperty({ example: 180 })
  duration: number;

  @ApiProperty({ example: 250000 })
  price: number;

  @ApiProperty({ example: '08:00' })
  departureTime: string;

  @ApiProperty({ type: CarDto })
  car: CarDto;
}
