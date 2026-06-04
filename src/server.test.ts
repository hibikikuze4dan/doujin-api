import request from "supertest";
import app from "./app";

describe("App", () => {
  it("starts and responds to request", async () => {
    const res = await request(app).get("/");
    expect(res.statusCode).toBe(200);
  });

  it("returns 404 for unknown routes", async () => {
    const res = await request(app).get("/does-not-exist");
    expect(res.statusCode).toBe(404);
  });
});
