import { describe, expect, it } from "vitest";
import { z } from "zod";
import { AppError } from "./AppError.ts";
import { ValidationError } from "./ValidationError.ts";

describe("ValidationError", () => {
	it("should have statusCode 422", () => {
		const result = z.object({ name: z.string() }).safeParse({ name: 123 });
		const err = new ValidationError(
			(result as { error: Parameters<typeof ValidationError>[0] }).error,
		);
		expect(err.statusCode).toBe(422);
	});

	it("should have message Validation failed", () => {
		const result = z.string().safeParse(123);
		const err = new ValidationError(
			(result as { error: Parameters<typeof ValidationError>[0] }).error,
		);
		expect(err.message).toBe("Validation failed");
	});

	it("should map zod issues to field/message pairs", () => {
		const schema = z.object({ email: z.email() });
		const result = schema.safeParse({ email: "invalid" });
		const err = new ValidationError(
			(result as { error: Parameters<typeof ValidationError>[0] }).error,
		);
		expect(err.issues).toHaveLength(1);
		expect(err.issues[0].field).toBe("email");
		expect(typeof err.issues[0].message).toBe("string");
	});

	it("should collect multiple issues", () => {
		const schema = z.object({ name: z.string().min(2), email: z.email() });
		const result = schema.safeParse({ name: "T", email: "bad" });
		const err = new ValidationError(
			(result as { error: Parameters<typeof ValidationError>[0] }).error,
		);
		expect(err.issues.length).toBeGreaterThan(1);
	});

	it("should be instance of AppError", () => {
		const result = z.string().safeParse(123);
		const err = new ValidationError(
			(result as { error: Parameters<typeof ValidationError>[0] }).error,
		);
		expect(err).toBeInstanceOf(AppError);
	});
});
