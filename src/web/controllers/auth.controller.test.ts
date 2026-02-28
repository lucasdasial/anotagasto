import { beforeEach, describe, expect, it, vi } from "vitest";
import type { UsersService } from "../../modules/users/users.service.ts";
import { ValidationError } from "../errors/ValidationError.ts";
import { AuthController } from "./auth.controller.ts";

const mockService = {
	register: vi.fn(),
	login: vi.fn(),
} as unknown as UsersService;

describe("AuthController", () => {
	let controller: AuthController;
	let req: { body: Record<string, unknown> };
	let res: { status: ReturnType<typeof vi.fn>; json: ReturnType<typeof vi.fn> };
	// biome-ignore lint/suspicious/noExplicitAny: test mock
	let next: any;

	beforeEach(() => {
		vi.clearAllMocks();
		controller = new AuthController(mockService);
		req = { body: {} };
		res = { status: vi.fn().mockReturnThis(), json: vi.fn() };
		next = vi.fn();
	});

	describe("register", () => {
		it("should call next with ValidationError when name is too short", async () => {
			req.body = { name: "T", email: "test@test.com", password: "password123" };
			await controller.register(req as never, res as never, next);
			expect(next).toHaveBeenCalledWith(expect.any(ValidationError));
		});

		it("should call next with ValidationError when email is invalid", async () => {
			req.body = {
				name: "Test",
				email: "not-an-email",
				password: "password123",
			};
			await controller.register(req as never, res as never, next);
			expect(next).toHaveBeenCalledWith(expect.any(ValidationError));
		});

		it("should call next with ValidationError when password is too short", async () => {
			req.body = { name: "Test", email: "test@test.com", password: "short" };
			await controller.register(req as never, res as never, next);
			expect(next).toHaveBeenCalledWith(expect.any(ValidationError));
		});

		it("should call service.register and return 201 on valid input", async () => {
			req.body = {
				name: "Test User",
				email: "test@test.com",
				password: "password123",
			};
			const user = { id: "1", name: "Test User", email: "test@test.com" };
			vi.mocked(mockService.register).mockResolvedValue(user as never);

			await controller.register(req as never, res as never, next);

			expect(mockService.register).toHaveBeenCalledWith(req.body);
			expect(res.status).toHaveBeenCalledWith(201);
			expect(res.json).toHaveBeenCalledWith(user);
		});

		it("should forward service errors to next", async () => {
			req.body = {
				name: "Test User",
				email: "test@test.com",
				password: "password123",
			};
			const err = new Error("Service error");
			vi.mocked(mockService.register).mockRejectedValue(err);

			await controller.register(req as never, res as never, next);

			expect(next).toHaveBeenCalledWith(err);
		});
	});

	describe("login", () => {
		it("should call next with ValidationError when email is invalid", async () => {
			req.body = { email: "bad", password: "password123" };
			await controller.login(req as never, res as never, next);
			expect(next).toHaveBeenCalledWith(expect.any(ValidationError));
		});

		it("should call next with ValidationError when password is empty", async () => {
			req.body = { email: "test@test.com", password: "" };
			await controller.login(req as never, res as never, next);
			expect(next).toHaveBeenCalledWith(expect.any(ValidationError));
		});

		it("should call service.login and return 200 on valid input", async () => {
			req.body = { email: "test@test.com", password: "password123" };
			vi.mocked(mockService.login).mockResolvedValue({ token: "jwt-token" });

			await controller.login(req as never, res as never, next);

			expect(mockService.login).toHaveBeenCalledWith(req.body);
			expect(res.status).toHaveBeenCalledWith(200);
			expect(res.json).toHaveBeenCalledWith({ token: "jwt-token" });
		});

		it("should forward service errors to next", async () => {
			req.body = { email: "test@test.com", password: "password123" };
			const err = new Error("Service error");
			vi.mocked(mockService.login).mockRejectedValue(err);

			await controller.login(req as never, res as never, next);

			expect(next).toHaveBeenCalledWith(err);
		});
	});
});
