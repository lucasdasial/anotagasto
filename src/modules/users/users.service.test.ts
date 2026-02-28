import bcrypt from "bcryptjs";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { AppError } from "../../web/errors/AppError.ts";
import { UsersService } from "./users.service.ts";

vi.mock("bcryptjs", () => ({
	default: {
		hash: vi.fn().mockResolvedValue("hashed_password"),
		compare: vi.fn(),
	},
}));

const mockRepository = {
	findByEmail: vi.fn(),
	findById: vi.fn(),
	create: vi.fn(),
};

const baseUser = {
	id: "user-123",
	name: "Test User",
	email: "test@test.com",
	password: "hashed_password",
	createdAt: new Date(),
	updatedAt: new Date(),
};

describe("UsersService", () => {
	let service: UsersService;

	beforeEach(() => {
		vi.clearAllMocks();
		service = new UsersService(mockRepository as never);
	});

	describe("register", () => {
		it("should throw 409 if email already in use", async () => {
			mockRepository.findByEmail.mockResolvedValue(baseUser);

			await expect(
				service.register({
					name: "Test",
					email: "test@test.com",
					password: "password123",
				}),
			).rejects.toMatchObject({ statusCode: 409 });
		});

		it("should call bcrypt.hash before saving", async () => {
			mockRepository.findByEmail.mockResolvedValue(null);
			mockRepository.create.mockResolvedValue(baseUser);

			await service.register({
				name: "Test",
				email: "test@test.com",
				password: "password123",
			});

			expect(vi.mocked(bcrypt.hash)).toHaveBeenCalledWith("password123", 10);
			expect(mockRepository.create.mock.calls[0][0].password).toBe(
				"hashed_password",
			);
		});

		it("should return user without password", async () => {
			mockRepository.findByEmail.mockResolvedValue(null);
			mockRepository.create.mockResolvedValue(baseUser);

			const result = await service.register({
				name: "Test",
				email: "test@test.com",
				password: "password123",
			});

			expect(result).not.toHaveProperty("password");
			expect(result).toHaveProperty("id", "user-123");
			expect(result).toHaveProperty("email", "test@test.com");
		});

		it("should throw AppError on duplicate email", async () => {
			mockRepository.findByEmail.mockResolvedValue(baseUser);

			await expect(
				service.register({
					name: "Test",
					email: "test@test.com",
					password: "password123",
				}),
			).rejects.toBeInstanceOf(AppError);
		});
	});

	describe("login", () => {
		it("should throw 401 if user not found", async () => {
			mockRepository.findByEmail.mockResolvedValue(null);

			await expect(
				service.login({ email: "test@test.com", password: "password123" }),
			).rejects.toMatchObject({ statusCode: 401 });
		});

		it("should throw 401 if password does not match", async () => {
			mockRepository.findByEmail.mockResolvedValue(baseUser);
			vi.mocked(bcrypt.compare).mockResolvedValue(false as never);

			await expect(
				service.login({ email: "test@test.com", password: "wrong" }),
			).rejects.toMatchObject({ statusCode: 401 });
		});

		it("should return a token on success", async () => {
			mockRepository.findByEmail.mockResolvedValue(baseUser);
			vi.mocked(bcrypt.compare).mockResolvedValue(true as never);

			const result = await service.login({
				email: "test@test.com",
				password: "password123",
			});

			expect(result).toHaveProperty("token");
			expect(typeof result.token).toBe("string");
		});
	});
});
