export const seatMapConfigs = {
  limousine34: {
    id: 'limousine34',
    name: 'Limousine 34 Phòng',
    basePrice: 350000,
    floors: [
      {
        floorIndex: 1,
        floorName: 'Tầng 1 (Dưới)',
        matrix: [
          // Row 1
          [
            { id: 'A01', type: 'seat', status: 'available' },
            null,
            { id: 'A02', type: 'seat', status: 'available' },
            null,
            { id: 'A03', type: 'seat', status: 'booked' },
          ],
          // Row 2
          [
            { id: 'A04', type: 'seat', status: 'available' },
            null,
            { id: 'A05', type: 'seat', status: 'booked' },
            null,
            { id: 'A06', type: 'seat', status: 'available' },
          ],
          // Row 3
          [
            { id: 'A07', type: 'seat', status: 'available' },
            null,
            { id: 'A08', type: 'seat', status: 'available' },
            null,
            { id: 'A09', type: 'seat', status: 'available' },
          ],
          // Row 4
          [
            { id: 'A10', type: 'seat', status: 'available' },
            null,
            { id: 'A11', type: 'seat', status: 'available' },
            null,
            { id: 'A12', type: 'seat', status: 'available' },
          ],
          // Row 5
          [
            { id: 'A13', type: 'seat', status: 'booked' },
            null,
            { id: 'A14', type: 'seat', status: 'available' },
            null,
            { id: 'A15', type: 'seat', status: 'available' },
          ],
          // Row 6 (Back row, full)
          [
            { id: 'A16', type: 'seat', status: 'available' },
            { id: 'A17', type: 'seat', status: 'available' },
            { id: 'A18', type: 'seat', status: 'available' },
            { id: 'A19', type: 'seat', status: 'available' },
            { id: 'A20', type: 'seat', status: 'available' },
          ],
        ],
      },
      {
        floorIndex: 2,
        floorName: 'Tầng 2 (Trên)',
        matrix: [
          // Row 1
          [
            { id: 'B01', type: 'seat', status: 'available' },
            null,
            { id: 'B02', type: 'seat', status: 'available' },
            null,
            { id: 'B03', type: 'seat', status: 'available' },
          ],
          // Row 2
          [
            { id: 'B04', type: 'seat', status: 'booked' },
            null,
            { id: 'B05', type: 'seat', status: 'available' },
            null,
            { id: 'B06', type: 'seat', status: 'available' },
          ],
          // Row 3
          [
            { id: 'B07', type: 'seat', status: 'available' },
            null,
            { id: 'B08', type: 'seat', status: 'available' },
            null,
            { id: 'B09', type: 'seat', status: 'booked' },
          ],
          // Row 4
          [
            { id: 'B10', type: 'seat', status: 'available' },
            null,
            { id: 'B11', type: 'seat', status: 'available' },
            null,
            { id: 'B12', type: 'seat', status: 'available' },
          ],
          // Row 5
          [
            { id: 'B13', type: 'seat', status: 'available' },
            null,
            { id: 'B14', type: 'seat', status: 'available' },
            null,
            { id: 'B15', type: 'seat', status: 'available' },
          ],
          // Row 6 (Back row usually slightly different, maybe 4 rooms)
          [
            { id: 'B16', type: 'seat', status: 'available' },
            null,
            { id: 'B17', type: 'seat', status: 'available' },
            null,
            { id: 'B18', type: 'seat', status: 'available' },
          ],
        ],
      },
    ],
  },
  bed40: {
    id: 'bed40',
    name: 'Giường Nằm 40',
    basePrice: 250000,
    floors: [
      {
        floorIndex: 1,
        floorName: 'Tầng 1 (Dưới)',
        matrix: [
          // Row 1
          [
            { id: 'A01', type: 'seat', status: 'booked' },
            null,
            { id: 'A02', type: 'seat', status: 'available' },
            null,
            { id: 'A03', type: 'seat', status: 'available' },
          ],
          // Row 2
          [
            { id: 'A04', type: 'seat', status: 'available' },
            null,
            { id: 'A05', type: 'seat', status: 'available' },
            null,
            { id: 'A06', type: 'seat', status: 'available' },
          ],
          // Row 3
          [
            { id: 'A07', type: 'seat', status: 'available' },
            null,
            { id: 'A08', type: 'seat', status: 'available' },
            null,
            { id: 'A09', type: 'seat', status: 'available' },
          ],
          // Row 4
          [
            { id: 'A10', type: 'seat', status: 'available' },
            null,
            { id: 'A11', type: 'seat', status: 'booked' },
            null,
            { id: 'A12', type: 'seat', status: 'available' },
          ],
          // Row 5
          [
            { id: 'A13', type: 'seat', status: 'available' },
            null,
            { id: 'A14', type: 'seat', status: 'available' },
            null,
            { id: 'A15', type: 'seat', status: 'available' },
          ],
          // Row 6
          [
            { id: 'A16', type: 'seat', status: 'available' },
            null,
            { id: 'A17', type: 'seat', status: 'available' },
            null,
            { id: 'A18', type: 'seat', status: 'available' },
          ],
          // Row 7 (back row)
          [
            { id: 'A19', type: 'seat', status: 'available' },
            { id: 'A20', type: 'seat', status: 'available' },
            { id: 'A21', type: 'seat', status: 'available' },
            { id: 'A22', type: 'seat', status: 'available' },
            { id: 'A23', type: 'seat', status: 'available' },
          ],
        ],
      },
      {
        floorIndex: 2,
        floorName: 'Tầng 2 (Trên)',
        matrix: [
          // Row 1
          [
            { id: 'B01', type: 'seat', status: 'available' },
            null,
            { id: 'B02', type: 'seat', status: 'available' },
            null,
            { id: 'B03', type: 'seat', status: 'available' },
          ],
          // Row 2
          [
            { id: 'B04', type: 'seat', status: 'available' },
            null,
            { id: 'B05', type: 'seat', status: 'available' },
            null,
            { id: 'B06', type: 'seat', status: 'available' },
          ],
          // Row 3
          [
            { id: 'B07', type: 'seat', status: 'available' },
            null,
            { id: 'B08', type: 'seat', status: 'available' },
            null,
            { id: 'B09', type: 'seat', status: 'available' },
          ],
          // Row 4
          [
            { id: 'B10', type: 'seat', status: 'available' },
            null,
            { id: 'B11', type: 'seat', status: 'available' },
            null,
            { id: 'B12', type: 'seat', status: 'booked' },
          ],
          // Row 5
          [
            { id: 'B13', type: 'seat', status: 'available' },
            null,
            { id: 'B14', type: 'seat', status: 'available' },
            null,
            { id: 'B15', type: 'seat', status: 'available' },
          ],
          // Row 6
          [
            { id: 'B16', type: 'seat', status: 'available' },
            null,
            { id: 'B17', type: 'seat', status: 'available' },
            null,
            { id: 'B18', type: 'seat', status: 'available' },
          ],
          // Row 7 (back row)
          [
            { id: 'B19', type: 'seat', status: 'available' },
            { id: 'B20', type: 'seat', status: 'available' },
            { id: 'B21', type: 'seat', status: 'available' },
            { id: 'B22', type: 'seat', status: 'available' },
            { id: 'B23', type: 'seat', status: 'available' },
          ],
        ],
      },
    ],
  },
};
