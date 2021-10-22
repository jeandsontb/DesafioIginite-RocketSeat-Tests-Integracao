import request from "supertest";
import { Connection } from "typeorm";
import { app } from "../../../../app";
import createConnection from "../../../../database";


let connection: Connection;

describe("Create User", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("Shoud a be able create user controller", async () => {
    const result = await request(app).post("/api/v1/users").send({
      name: "usertest",
      email: "usertest@email.com",
      password: "123456"
    });

    expect(result.status).toBe(201);
  });
})
