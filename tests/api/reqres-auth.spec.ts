import { test, expect } from "@playwright/test";
import mockData from "./mock-data/reqres.json";
import {
  RegisterSuccessResponse,
  LoginSuccessResponse,
  ErrorResponse,
} from "./helpers/reqres.types";

test.describe("ReqRes Authentication API Tests", () => {
  test.describe("Registration Endpoints", () => {
    test("[REQ-A01] Should successfully register a valid user - @smoke", async ({
      request,
    }) => {
      // Given a valid registration payload
      const payload = mockData.validRegister;

      // When I send a POST request to /register
      const response = await request.post("register", {
        data: payload,
      });

      // Then the status code should be 200
      if (response.status() === 429) test.skip(true, "Rate limit exceeded");
      expect(response.status()).toBe(200);

      // And the response should contain an id and a token
      const responseBody = (await response.json()) as RegisterSuccessResponse;
      expect(responseBody.id).toBeDefined();
      expect(responseBody.token).toBeDefined();
      expect(typeof responseBody.token).toBe("string");
    });

    test("[REQ-A02] Should fail registration when password is missing", async ({
      request,
    }) => {
      // Given a registration payload without a password
      const payload = mockData.invalidRegister;

      // When I send a POST request to /register
      const response = await request.post("register", {
        data: payload,
      });

      // Then the status code should be 400
      if (response.status() === 429) test.skip(true, "Rate limit exceeded");
      expect(response.status()).toBe(400);

      // And the response should contain a missing password error
      const responseBody = (await response.json()) as ErrorResponse;
      expect(responseBody.error).toBe("Missing password");
    });

    test("[REQ-A03] Should fail registration when email is missing", async ({
      request,
    }) => {
      // Given a registration payload without an email
      const payload = { password: "somepassword" };

      // When I send a POST request to /register
      const response = await request.post("register", {
        data: payload,
      });

      // Then the status code should be 400
      if (response.status() === 429) test.skip(true, "Rate limit exceeded");
      expect(response.status()).toBe(400);

      // And the response should contain a missing email error
      const responseBody = (await response.json()) as ErrorResponse;
      expect(responseBody.error).toBe("Missing email or username");
    });

    test("[REQ-A04] Should fail registration with an empty payload", async ({
      request,
    }) => {
      // Given an empty payload
      const payload = {};

      // When I send a POST request to /register
      const response = await request.post("register", {
        data: payload,
      });

      // Then the status code should be 400
      if (response.status() === 429) test.skip(true, "Rate limit exceeded");
      expect(response.status()).toBe(400);

      // And the response should contain a missing email error
      const responseBody = (await response.json()) as ErrorResponse;
      expect(responseBody.error).toBe("Missing email or username");
    });

    test("[REQ-A05] Should fail registration with an unregistered email", async ({
      request,
    }) => {
      // Given an email not found in the ReqRes system
      const payload = { email: "unknown@reqres.in", password: "password123" };

      // When I send a POST request to /register
      const response = await request.post("register", {
        data: payload,
      });

      // Then the status code should be 400
      if (response.status() === 429) test.skip(true, "Rate limit exceeded");
      expect(response.status()).toBe(400);

      // And the response should contain a user not found error
      const responseBody = (await response.json()) as ErrorResponse;
      // ReqRes returns "Note: Only defined users succeed registration" for some emails
      expect(responseBody.error).toBeDefined();
    });
  });

  test.describe("Login Endpoints", () => {
    test("[REQ-A06] Should successfully login a valid user - @smoke", async ({
      request,
    }) => {
      // Given a valid login payload
      const payload = mockData.validLogin;

      // When I send a POST request to /login
      const response = await request.post("login", {
        data: payload,
      });

      // Then the status code should be 200
      if (response.status() === 429) test.skip(true, "Rate limit exceeded");
      expect(response.status()).toBe(200);

      // And the response should contain a token
      const responseBody = (await response.json()) as LoginSuccessResponse;
      expect(responseBody.token).toBeDefined();
      expect(typeof responseBody.token).toBe("string");
    });

    test("[REQ-A07] Should fail login when password is missing", async ({
      request,
    }) => {
      // Given a login payload without a password
      const payload = mockData.invalidLogin;

      // When I send a POST request to /login
      const response = await request.post("login", {
        data: payload,
      });

      // Then the status code should be 400
      if (response.status() === 429) test.skip(true, "Rate limit exceeded");
      expect(response.status()).toBe(400);

      // And the response should contain a missing password error
      const responseBody = (await response.json()) as ErrorResponse;
      expect(responseBody.error).toBe("Missing password");
    });

    test("[REQ-A08] Should fail login when email is missing", async ({
      request,
    }) => {
      // Given a login payload without an email
      const payload = { password: "cityslicka" };

      // When I send a POST request to /login
      const response = await request.post("login", {
        data: payload,
      });

      // Then the status code should be 400
      if (response.status() === 429) test.skip(true, "Rate limit exceeded");
      expect(response.status()).toBe(400);

      // And the response should contain a missing email error
      const responseBody = (await response.json()) as ErrorResponse;
      expect(responseBody.error).toBe("Missing email or username");
    });

    test("[REQ-A09] Should fail login with an empty payload", async ({
      request,
    }) => {
      // Given an empty payload
      const payload = {};

      // When I send a POST request to /login
      const response = await request.post("login", {
        data: payload,
      });

      // Then the status code should be 400
      if (response.status() === 429) test.skip(true, "Rate limit exceeded");
      expect(response.status()).toBe(400);

      // And the response should contain a missing email error
      const responseBody = (await response.json()) as ErrorResponse;
      expect(responseBody.error).toBe("Missing email or username");
    });

    test("[REQ-A10] Should fail login with an unregistered email", async ({
      request,
    }) => {
      // Given an email not found in the ReqRes system
      const payload = { email: "unknown@reqres.in", password: "password123" };

      // When I send a POST request to /login
      const response = await request.post("login", {
        data: payload,
      });

      // Then the status code should be 400
      if (response.status() === 429) test.skip(true, "Rate limit exceeded");
      expect(response.status()).toBe(400);

      // And the response should contain an error about the user
      const responseBody = (await response.json()) as ErrorResponse;
      expect(responseBody.error).toBe("user not found");
    });
  });
});
