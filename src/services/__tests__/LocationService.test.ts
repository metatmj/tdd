import LocationService from '../LocationService';
describe('LocationServices', () => {
  test('should return latitude and longitude from current location', async () => {
    const position = await LocationService.getCurrentPosition();
    expect(position).toEqual({
      latitude: 0,
      longitude: 0,
    });
  });
});
