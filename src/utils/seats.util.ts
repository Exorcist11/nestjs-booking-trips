export function organizeSeats(seats: string[]) {
  const structuredSeats = {};

  seats.forEach((seat) => {
    const row = seat[0];
    const floor = `floor${seat[1]}`;

    if (!structuredSeats[floor]) {
      structuredSeats[floor] = {};
    }
    if (!structuredSeats[floor][row]) {
      structuredSeats[floor][row] = [];
    }
    structuredSeats[floor][row].push(seat);
  });

  return structuredSeats;
}
