import bcrypt from "bcryptjs";
import request from "supertest";
import { beforeEach, describe, expect, it, vi } from "vitest";

const { mockFindByEmail, mockCreate, mockFindById } = vi.hoisted(() => ({
	mockFindByEmail: vi.fn(),
	mockCreate: vi.fn(),
	mockFindById: vi.fn(),
}));

vi.mock("../db/index.ts", () => ({ db: {} }));

vi.mock("../modules/users/users.repository.ts", () => ({
	UsersRepository: vi.fn(function () {
		this.findByEmail = mockFindByEmail;
		this.findById = mockFindById;
		this.create = mockCreate;
	}),
}));

import { createServer, startServer } from "./server.ts";

const app = createServer();

const baseUser = {
	id: "user-123",
	name: "Test User",
	email: "test@test.com",
	password: "hashed",
	createdAt: new Date(),
	updatedAt: new Date(),
};

describe("POST /api/auth/register", () => {
	beforeEach(() => {
		vi.resetAllMocks();
	});

	it("should return 201 and user without password on success", async () => {
		mockFindByEmail.mockResolvedValue(null);
		mockCreate.mockResolvedValue(baseUser);

		const res = await request(app).post("/api/auth/register").send({
			name: "Test User",
			email: "test@test.com",
			password: "password123",
		});

		expect(res.status).toBe(201);
		expect(res.body).toHaveProperty("id");
		expect(res.body).not.toHaveProperty("password");
	});

	it("should return 422 on invalid body", async () => {
		const res = await request(app)
			.post("/api/auth/register")
			.send({ name: "T", email: "not-an-email", password: "short" });

		expect(res.status).toBe(422);
		expect(res.body).toHaveProperty("issues");
		expect(res.body.issues).toBeInstanceOf(Array);
	});

	it("should return 409 when email is already in use", async () => {
		mockFindByEmail.mockResolvedValue(baseUser);

		const res = await request(app).post("/api/auth/register").send({
			name: "Test User",
			email: "test@test.com",
			password: "password123",
		});

		expect(res.status).toBe(409);
		expect(res.body).toHaveProperty("error");
	});
});

describe("POST /api/auth/login", () => {
	beforeEach(() => {
		vi.resetAllMocks();
	});

	it("should return 200 with token on success", async () => {
		const hashed = await bcrypt.hash("password123", 10);
		mockFindByEmail.mockResolvedValue({ ...baseUser, password: hashed });

		const res = await request(app)
			.post("/api/auth/login")
			.send({ email: "test@test.com", password: "password123" });

		expect(res.status).toBe(200);
		expect(res.body).toHaveProperty("token");
		expect(typeof res.body.token).toBe("string");
	});

	it("should return 422 on invalid body", async () => {
		const res = await request(app)
			.post("/api/auth/login")
			.send({ email: "bad" });

		expect(res.status).toBe(422);
		expect(res.body).toHaveProperty("issues");
	});

	it("should return 401 when user does not exist", async () => {
		mockFindByEmail.mockResolvedValue(null);

		const res = await request(app)
			.post("/api/auth/login")
			.send({ email: "test@test.com", password: "password123" });

		expect(res.status).toBe(401);
	});

	it("should return 401 when password is wrong", async () => {
		const hashed = await bcrypt.hash("correct-password", 10);
		mockFindByEmail.mockResolvedValue({ ...baseUser, password: hashed });

		const res = await request(app)
			.post("/api/auth/login")
			.send({ email: "test@test.com", password: "wrong-password" });

		expect(res.status).toBe(401);
	});
});

describe("createServer", () => {
	it("should return an express app", () => {
		const app = createServer();
		expect(typeof app).toBe("function");
	});
});

describe("startServer", () => {
	it("should start listening and log the port", async () => {
		const server = startServer();
		await new Promise<void>((resolve) => setImmediate(resolve));
		server.close();
	});
});

describe("Authenticated routes", () => {
	it("should return 401 when Authorization header is missing", async () => {
		const res = await request(app).get("/api/some-protected-route");
		expect(res.status).toBe(401);
	});

	it("should return 401 when token is invalid", async () => {
		const res = await request(app)
			.get("/api/some-protected-route")
			.set("Authorization", "Bearer invalid-token");

		expect(res.status).toBe(401);
	});
});
