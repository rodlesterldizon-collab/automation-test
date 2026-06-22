import { test, expect } from '@playwright/test';
import mockData from './mock-data/reqres.json';
import { 
  PaginatedUsersResponse, 
  SingleUserResponse, 
  CreateUserResponse, 
  UpdateUserResponse 
} from './helpers/reqres.types';

test.describe('ReqRes User Management API Tests', () => {

  test.describe('GET Operations', () => {
    test('[REQ-U01] Should list users with default pagination - @smoke', async ({ request }) => {
      // Given a request to the users endpoint
      // When I send a GET request
      const response = await request.get('users');
      console.log('URL:', response.url());
      console.log('Body:', await response.text());

      // Then the status code should be 200
      expect(response.status()).toBe(200);

      // And the response structure should be correct
      const responseBody = await response.json() as PaginatedUsersResponse;
      expect(responseBody.page).toBe(1);
      expect(responseBody.data).toBeInstanceOf(Array);
      expect(responseBody.data.length).toBeGreaterThan(0);
    });

    test('[REQ-U02] Should list users with specific page query parameter', async ({ request }) => {
      // Given a request for page 2
      // When I send a GET request
      const response = await request.get('users?page=2');

      // Then the status code should be 200
      expect(response.status()).toBe(200);

      // And the response should reflect page 2
      const responseBody = await response.json() as PaginatedUsersResponse;
      expect(responseBody.page).toBe(2);
    });

    test('[REQ-U03] Should return a single user by ID', async ({ request }) => {
      // Given a valid user ID
      const userId = 2;

      // When I send a GET request for that user
      const response = await request.get(`users/${userId}`);

      // Then the status code should be 200
      expect(response.status()).toBe(200);

      // And the response should contain user data
      const responseBody = await response.json() as SingleUserResponse;
      expect(responseBody.data.id).toBe(userId);
      expect(responseBody.data.email).toBeDefined();
    });

    test('[REQ-U04] Should return 404 for a non-existent user', async ({ request }) => {
      // Given an invalid user ID
      const userId = 23;

      // When I send a GET request
      const response = await request.get(`users/${userId}`);

      // Then the status code should be 404
      expect(response.status()).toBe(404);
      
      // And the body should be empty
      const body = await response.text();
      expect(body).toBe('{}');
    });

    test('[REQ-U05] Should handle delayed responses correctly', async ({ request }) => {
      // Given a delay parameter of 3 seconds
      // When I send a GET request
      const startTime = Date.now();
      const response = await request.get('users?delay=3');
      const endTime = Date.now();

      // Then the status code should be 200
      expect(response.status()).toBe(200);

      // And the response time should be at least 3000ms
      expect(endTime - startTime).toBeGreaterThanOrEqual(3000);
    });

    test('[REQ-U06] Should validate paginated response data structure strictly', async ({ request }) => {
      // Given a standard GET request
      // When I send the request
      const response = await request.get('users');
      const responseBody = await response.json() as PaginatedUsersResponse;

      // Then every user object should have required properties
      const users = responseBody.data;
      const count = users.length;
      for (let i = 0; i < count; i++) {
        expect(users[i].id).toBeDefined();
        expect(users[i].email).toContain('@reqres.in');
        expect(users[i].first_name).toBeDefined();
        expect(users[i].last_name).toBeDefined();
        expect(users[i].avatar).toContain('reqres.in');
      }
    });

    test('[REQ-U07] Should verify HTTP response headers for GET request', async ({ request }) => {
      // Given a standard GET request
      // When I send the request
      const response = await request.get('users');

      // Then the headers should contain application/json
      const headers = response.headers();
      expect(headers['content-type']).toContain('application/json');
    });

    test('[REQ-U08] Should return empty array when page exceeds total pages', async ({ request }) => {
      // Given a page number that does not exist
      const page = 100;

      // When I send a GET request
      const response = await request.get(`users?page=${page}`);

      // Then the status code should be 200
      expect(response.status()).toBe(200);

      // And the data array should be empty
      const responseBody = await response.json() as PaginatedUsersResponse;
      expect(responseBody.data.length).toBe(0);
    });
  });

  test.describe('POST Operations', () => {
    test('[REQ-U09] Should successfully create a user - @smoke', async ({ request }) => {
      // Given a valid user payload
      const payload = mockData.validCreateUser;

      // When I send a POST request
      const response = await request.post('users', {
        data: payload
      });

      // Then the status code should be 201
      expect(response.status()).toBe(201);

      // And the response should reflect the payload
      const responseBody = await response.json() as CreateUserResponse;
      expect(responseBody.name).toBe(payload.name);
      expect(responseBody.job).toBe(payload.job);
      expect(responseBody.id).toBeDefined();
      expect(responseBody.createdAt).toBeDefined();
    });

    test('[REQ-U10] Should create a user with missing job field', async ({ request }) => {
      // Given a payload without a job field
      const payload = { name: 'morpheus' };

      // When I send a POST request
      const response = await request.post('users', {
        data: payload
      });

      // Then the status code should be 201
      expect(response.status()).toBe(201);
      
      const responseBody = await response.json() as CreateUserResponse;
      expect(responseBody.name).toBe(payload.name);
      expect(responseBody.job).toBeUndefined();
    });

    test('[REQ-U11] Should handle creating a user with empty payload', async ({ request }) => {
      // Given an empty payload
      const payload = {};

      // When I send a POST request
      const response = await request.post('users', {
        data: payload
      });

      // Then the status code should be 201 (ReqRes accepts empty)
      expect(response.status()).toBe(201);
      
      const responseBody = await response.json() as CreateUserResponse;
      expect(responseBody.id).toBeDefined();
    });

    test('[REQ-U12] Should verify headers for POST request', async ({ request }) => {
      // Given a valid user payload
      const payload = mockData.validCreateUser;

      // When I send a POST request
      const response = await request.post('users', {
        data: payload
      });

      // Then the headers should contain application/json
      const headers = response.headers();
      expect(headers['content-type']).toContain('application/json');
    });

    test('[REQ-U13] Should correctly handle extra fields in POST payload', async ({ request }) => {
      // Given a payload with extra unexpected fields
      const payload = { ...mockData.validCreateUser, extra: 'something' };

      // When I send a POST request
      const response = await request.post('users', {
        data: payload
      });

      // Then it should return 201
      expect(response.status()).toBe(201);
      
      const responseBody = await response.json() as any;
      expect(responseBody.extra).toBe('something');
    });

    test('[REQ-U14] Should ensure string payload acts properly (invalid Content-Type handling check)', async ({ request }) => {
      // Given a string payload
      const payload = "plain text data";

      // When I send a POST request
      const response = await request.post('users', {
        data: payload,
        headers: {
          'Content-Type': 'text/plain'
        }
      });

      // Then it should still return 201
      expect(response.status()).toBe(201);
    });
  });

  test.describe('PUT, PATCH, DELETE Operations', () => {
    test('[REQ-U15] Should fully update a user with PUT', async ({ request }) => {
      // Given an existing user ID and a valid update payload
      const userId = 2;
      const payload = mockData.validUpdateUser;

      // When I send a PUT request
      const response = await request.put(`users/${userId}`, {
        data: payload
      });

      // Then the status code should be 200
      expect(response.status()).toBe(200);

      // And the response should contain the updated data
      const responseBody = await response.json() as UpdateUserResponse;
      expect(responseBody.name).toBe(payload.name);
      expect(responseBody.job).toBe(payload.job);
      expect(responseBody.updatedAt).toBeDefined();
    });

    test('[REQ-U16] Should partially update a user with PATCH', async ({ request }) => {
      // Given an existing user ID and a partial payload
      const userId = 2;
      const payload = { name: 'morpheus' };

      // When I send a PATCH request
      const response = await request.patch(`users/${userId}`, {
        data: payload
      });

      // Then the status code should be 200
      expect(response.status()).toBe(200);

      // And the response should contain the updated name
      const responseBody = await response.json() as UpdateUserResponse;
      expect(responseBody.name).toBe(payload.name);
      expect(responseBody.updatedAt).toBeDefined();
    });

    test('[REQ-U17] Should return 204 when deleting a user', async ({ request }) => {
      // Given an existing user ID
      const userId = 2;

      // When I send a DELETE request
      const response = await request.delete(`users/${userId}`);

      // Then the status code should be 204 No Content
      expect(response.status()).toBe(204);
      
      // And the body should be empty
      const body = await response.text();
      expect(body).toBe('');
    });

    test('[REQ-U18] Should verify PUT returns 200 even for non-existent users (ReqRes mock behavior)', async ({ request }) => {
      // Given an invalid user ID
      const userId = 999;
      const payload = mockData.validUpdateUser;

      // When I send a PUT request
      const response = await request.put(`users/${userId}`, {
        data: payload
      });

      // Then the status code should be 200
      expect(response.status()).toBe(200);
    });

    test('[REQ-U19] Should verify DELETE returns 204 even for non-existent users', async ({ request }) => {
      // Given an invalid user ID
      const userId = 999;

      // When I send a DELETE request
      const response = await request.delete(`users/${userId}`);

      // Then the status code should be 204
      expect(response.status()).toBe(204);
    });

    test('[REQ-U20] Should ensure updatedAt timestamp format is correct for PUT', async ({ request }) => {
      // Given a PUT request
      const userId = 2;
      const payload = mockData.validUpdateUser;

      // When I send the request
      const response = await request.put(`users/${userId}`, {
        data: payload
      });

      // Then the updatedAt field should match a standard ISO date format
      const responseBody = await response.json() as UpdateUserResponse;
      const dateString = responseBody.updatedAt;
      if (dateString === null) throw new Error('updatedAt was null.');
      
      const parsedDate = Date.parse(dateString);
      expect(isNaN(parsedDate)).toBe(false);
    });
  });

});
