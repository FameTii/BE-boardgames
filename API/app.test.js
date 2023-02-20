const request = require("supertest");
const { seed } = require("../db/seeds/seed");
const db = require("../db/connection");
const testData = require("../db/data/test-data/index");
const app = require("./app");
const { describe } = require("yargs");
const { it } = require("node:test");
const { expect } = require("@jest/globals");
const { type } = require("os");

beforeEach(() => seed(testData));

afterAll(() => {
  db.end();
});

describe('GET /api/categories', () => {
    it('respond with 200 and return an array of category objects and includes properties of slug and description', () => {
        return request(app)
            .get('/api/categories')
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

describe('GET /api/reviews', () => {
    it('respond with 200 and return an array of review objects', () => {
        return request(app)
            .get('/api/reviews')
            .expect(200)
            .then(({body}) => {
                expect(typeof body).toBe('object')
                const {categories} = body
                expect(body.categories).toBeInstanceOf(Array);
                categories.forEach((category) => {
                    expect(category).toMatchObject({
                        owner: expect.any(String),
                        title: expect.any(String),
                        review_id: expect.any(String),
                        category: expect.any(String),
                        review_img_id: expect.any(String),
                        created_at: expect.any(String),
                        votes: expect.any(String),
                        designer: expect.any(String),
                        commnet_count: expect.any(String),
                    })
                })
            })
    })
})