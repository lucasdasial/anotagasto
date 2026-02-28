import type { NextFunction } from "express";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../../config/jwt.ts", () => ({
	verifyToken: vi.fn(),
}));

import { verifyToken } from "../../config/jwt.ts";
import { authenticate } from "./authenticate.ts";

describe("authenticate", () => {
	let req: { headers: Record<string, string>; body: Record<string, unknown> };
	let res: object;
	let next: NextFunction;

	beforeEach(() => {
		req = { headers: {}, body: {} };
		res = {};
		next = vi.fn() as unknown as NextFunction;
		vi.clearAllMocks();
	});

	it("should call next with 401 if Authorization header is missing", () => {
		authenticate(req as never, res as never, next);
		expect(next).toHaveBeenCalledWith(
			expect.objectContaining({ statusCode: 401 }),
		);
	});

	it("should call next with 401 if token is empty", () => {
		req.headers.authorization = "Bearer ";
		authenticate(req as never, res as never, next);
		expect(next).toHaveBeenCalledWith(
			expect.objectContaining({ statusCode: 401 }),
		);
	});

	it("should set req.body.userId and call next() on valid token", () => {
		req.headers.authorization = "Bearer valid-token";
		vi.mocked(verifyToken).mockReturnValue({ sub: "user-123" } as never);

		authenticate(req as never, res as never, next);

		expect(req.body.userId).toBe("user-123");
		expect(next).toHaveBeenCalledWith();
	});

	it("should call next with 401 if token verification throws", () => {
		req.headers.authorization = "Bearer bad-token";
		vi.mocked(verifyToken).mockImplementation(() => {
			throw new Error("invalid");
		});

		authenticate(req as never, res as never, next);

		expect(next).toHaveBeenCalledWith(
			expect.objectContaining({ statusCode: 401 }),
		);
	});
});
