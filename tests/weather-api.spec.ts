import { test as baseTest, expect, APIRequestContext, request } from '@playwright/test';

// Create a fixture for the API context
const test = baseTest.extend<{ apiContext: APIRequestContext }>({
  apiContext: async ({ }, use) => {
    // Create a new API context using the request object
    const context = await request.newContext();
    await use(context);
    await context.dispose();
  },
});

// Use the fixture in the tests
test.describe('OpenWeatherMap API tests', () => {
  const apiKey = '676e5d3d4b87f89d77f2092785299f77'; // Replace with your actual API key

  test('retrieves weather data for a known city by name', async ({ apiContext }) => {
    const cityName = 'London';
    const response = await apiContext.get(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}`);
    expect(response.status()).toBe(200);
    const responseBody = await response.json();
    expect(responseBody).toHaveProperty('weather');
    expect(responseBody).toHaveProperty('main.temp');
    expect(responseBody.name.toLowerCase()).toBe(cityName.toLowerCase());
  });

  test('retrieves weather data for a city by ID', async ({ apiContext }) => {
    const cityId = '2172797'; // Cairns, Australia
    const response = await apiContext.get(`https://api.openweathermap.org/data/2.5/weather?id=${cityId}&appid=${apiKey}`);
    expect(response.status()).toBe(200);
    const responseBody = await response.json();
    expect(responseBody).toHaveProperty('weather');
    expect(responseBody).toHaveProperty('main.temp');
    expect(responseBody.id.toString()).toBe(cityId);
  });

  test('retrieves a 5-day weather forecast for a specified city by name', async ({ apiContext }) => {
    const cityName = 'Paris';
    const response = await apiContext.get(`https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}`);
    expect(response.status()).toBe(200);
    const responseBody = await response.json();
    expect(responseBody).toHaveProperty('list');
    expect(Array.isArray(responseBody.list)).toBeTruthy();
    expect(responseBody.list.length).toBeGreaterThan(0);
    expect(responseBody.city.name.toLowerCase()).toBe(cityName.toLowerCase());
  });
});