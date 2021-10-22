import request from 'supertest';
import { Connection } from 'typeorm';
import { app } from '../../../../app';
import createConnection from '../../../../database';

let connection: Connection;

describe("Authenticate User", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("Should be able authenticate a user", async () => {
    const user = {
      name: "testuser",
      email: "testuser@email.com",
      password: "1234"
    }

    await request(app).post("/api/v1/users").send(user);

    const result = await request(app)
                    .post("/api/v1/sessions")
                    .send({email: user.email, password: user.password});

    expect(result.body).toHaveProperty("token");
    expect(result.body.user).toHaveProperty("id");

  });
})
