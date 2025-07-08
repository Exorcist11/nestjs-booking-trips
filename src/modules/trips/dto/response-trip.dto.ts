import { ApiProperty } from '@nestjs/swagger';

export class TripResponseDto {
  id: string;

  template: string;

  date: string;

  bookedSeats: string[];

  availableSeats: string[];

  status: string;

  actualDepartureTime?: string;

  actualArrivalTime?: string;

  note?: string;

  createdAt: string;

  updatedAt: string;

  startLocation: string;

  endLocation: string;

  duration: number;

  price: number;

  departureTime: string; // Thêm trường này

  car: {
    licensePlate: string;
    seatingCapacity: number;
    seats: number;
    mainDriver: string;
  } | null;
}
