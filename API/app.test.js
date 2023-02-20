const request = require("supertest");
const { seed } = require("../db/seeds/seed");
const db = require("../db/connection");
const testData = require("../db/data/test-data/index");
const app = require("./app");

beforeEach(() => seed(testData));

afterAll(() => {
  db.end();
});

describe('GET /api/categories', () => {
    it('respond with 200 and return an array of category objects and includes properties of slug and description', () => {
        return request(app)
            .get("/api/categories")
            .expect(200)
            .then(({body}) => {
                expect(typeof body).toBe('object')
                const {categories} = body
                expect(body.categories).toBeInstanceOf(Array);
                categories.forEach((category) => {
                    expect(category).toMatchObject({
                        slug: expect.any(String),
                        description: expect.any(String)
                    })
                })
            })
    })
})