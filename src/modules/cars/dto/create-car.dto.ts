import { ApiProperty } from '@nestjs/swagger';

export class CreateCarDto {
    @ApiProperty({ example: '51A-12345', description: 'License Plate' })
    licensePlate: string;
    
    @ApiProperty({ example: 'Nguyễn Văn A', description: 'Main Driver' })
    mainDriver: string;
    
    @ApiProperty({ example: 'Trần Thị B', description: ' Ticket Collector' })
    ticketCollector: string;
    
    @ApiProperty({ example: '0123456789', description: 'PhoneNumber' })
    phoneNumber: string;
    
    @ApiProperty({ example: 40, description: 'Seating Capacity' })
    seatingCapacity: number;
}
