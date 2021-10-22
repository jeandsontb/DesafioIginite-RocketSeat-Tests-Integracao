import request from "supertest";
import { Connection } from "typeorm";
import { app } from "../../../../app";
import createConnection from "../../../../database";

let connection: Connection;

describe("Get Balance - Test Integration", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  const user = {
    name: "userbalance",
    email: "userbalance@email.com",
    password: "123456"
  };

  it("shoud be able to show user balance - Test Integration", async () => {
    await request(app).post("/api/v1/users").send(user);

    const resultToken = await request(app)
                        .post("/api/v1/sessions")
                        .send({ email: user.email, password: user.password });
    await request(app)
      .post("/api/v1/statements/deposit")
      .send({
        amount: 100,
        description: "Test deposit",
      })
      .set({
        Authorization: `Bearer ${resultToken.body.token}`,
      });

    const result = await request(app)
      .get("/api/v1/statements/balance")
      .set({
        Authorization: `Bearer ${resultToken.body.token}`,
      });


    expect(result.body).toHaveProperty("balance");
    expect(result.body.balance).toEqual(100);
  });

})
