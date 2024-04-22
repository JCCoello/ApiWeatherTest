import { test, expect } from '@playwright/test';

const apiKey = '676e5d3d4b87f89d77f2092785299f77';

// This describes a test suite for OpenWeatherMap API tests
test.describe('OpenWeatherMap API tests', () => {

  // This test checks weather data retrieval by city name
  test('retrieves weather data for a known city by name', async ({ page }) => {
    const cityName = 'Santiago';
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}`;

    const response = await page.evaluate(async (apiUrl) => {
      const res = await fetch(apiUrl);
      return {
        status: res.status,
        body: await res.json(),
      };
    }, apiUrl);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('weather');
    expect(response.body).toHaveProperty('main.temp');
    expect(response.body).toHaveProperty('main.humidity');
    expect(response.body.name.toLowerCase()).toBe(cityName.toLowerCase());
  });

  // This test checks weather data retrieval by city ID
  test('retrieves weather data for a city by ID', async ({ page }) => {
    const cityId = '3871336'; // Example city ID for Santiago, Chile
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?id=${cityId}&appid=${apiKey}`;

    const response = await page.evaluate(async (apiUrl) => {
      const res = await fetch(apiUrl);
      return {
        status: res.status,
        body: await res.json(),
      };
    }, apiUrl);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('weather');
    expect(response.body).toHaveProperty('main.temp');
    expect(response.body).toHaveProperty('main.humidity');
    expect(response.body.id.toString()).toBe(cityId);
  });

  test('retrieves a 5-day weather forecast for a specified city by name', async ({ page }) => {
    const cityName = 'Santiago';
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}`;

    const response = await page.evaluate(async (apiUrl) => {
      const res = await fetch(apiUrl);
      return {
        status: res.status,
        body: await res.json(),
      };
    }, apiUrl);

    expect(response.status).toBe(200);

    expect(response.body).toHaveProperty('list');

    expect(Array.isArray(response.body.list)).toBeTruthy();
    expect(response.body.list.length).toBeGreaterThan(0);

    expect(response.body.city.name.toLowerCase()).toBe(cityName.toLowerCase());
  });

});
