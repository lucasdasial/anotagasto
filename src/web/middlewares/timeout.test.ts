import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { timeout } from "./timeout.ts";

describe("timeout", () => {
	let req: object;
	let res: { on: ReturnType<typeof vi.fn> };
	let next: ReturnType<typeof vi.fn>;

	beforeEach(() => {
		vi.useFakeTimers();
		req = {};
		res = { on: vi.fn() };
		next = vi.fn();
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it("should call next() immediately", () => {
		timeout(req as never, res as never, next);
		expect(next).toHaveBeenCalledTimes(1);
		expect(next).toHaveBeenCalledWith();
	});

	it("should call next with AppError 408 after 3 seconds", () => {
		timeout(req as never, res as never, next);
		vi.advanceTimersByTime(3000);
		expect(next).toHaveBeenCalledTimes(2);
		expect(next).toHaveBeenLastCalledWith(
			expect.objectContaining({ statusCode: 408 }),
		);
	});

	it("should clear timer on res finish event", () => {
		timeout(req as never, res as never, next);

		const finishCall = res.on.mock.calls.find(
			(call) => call[0] === "finish",
		) as [string, () => void];
		expect(finishCall).toBeDefined();
		finishCall[1]();

		vi.advanceTimersByTime(3000);
		expect(next).toHaveBeenCalledTimes(1);
	});

	it("should clear timer on res close event", () => {
		timeout(req as never, res as never, next);

		const closeCall = res.on.mock.calls.find((call) => call[0] === "close") as [
			string,
			() => void,
		];
		expect(closeCall).toBeDefined();
		closeCall[1]();

		vi.advanceTimersByTime(3000);
		expect(next).toHaveBeenCalledTimes(1);
	});
});
