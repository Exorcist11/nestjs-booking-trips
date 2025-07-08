export interface PlainCar {
  _id: string;
  licensePlate: string;
  seatingCapacity: number;
  seats: number;
  mainDriver: string;
  isDeleted?: boolean;
  deletedAt?: Date;
}
