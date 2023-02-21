const request = require("supertest");
const seed = require("../db/seeds/seed");
const db = require("../db/connection");
const testData = require("../db/data/test-data/index");
const app = require("./app");
const {toBeSortedBy} = require('jest-sorted');

beforeEach(() => seed(testData));

afterAll(() => {
  db.end();
});

describe('GET /api/categories', () => {
    it('responds with 200 and return an array of category objects and includes properties of slug and description', () => {
        return request(app)
            .get("/api/categories")
            .expect(200)
            .then(({body}) => {
                expect(typeof body).toBe('object')
                expect(body.categories).toHaveLength(4)
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
    it("should respond with 404 and message if route does not exist", () => {
        return request(app)
          .get("/api/cate")
          .expect(404)
          .then((body) => {
            expect(body.text).toEqual(`route does not exist`);
          })
      });
})

describe('GET /api/reviews', () => {
    it('responds with 200 and return an array of review objects', () => {
        return request(app)
            .get('/api/reviews')
            .expect(200)
            .then(({body}) => {
                expect(typeof body).toBe('object')
                const {reviews} = body
                expect(body.reviews).toBeInstanceOf(Array);
                reviews.forEach((review) => {
                    expect(review).toMatchObject({
                        review_id: expect.any(Number),
                        title: expect.any(String),
                        category: expect.any(String),
                        designer: expect.any(String),
                        owner: expect.any(String),
                        review_img_url: expect.any(String),
                        created_at: expect.any(String),
                        votes: expect.any(Number),
                        comment_count: expect.any(Number)
                    })
                    expect(reviews).toHaveLength(13)
                })
                expect(reviews).toBeSortedBy('created_at', {descending: true});
            })
    })
})

describe('GET /api/reviews/:review_id', () => {
    it('responds with 200 and returns an object according to review_id', () => {
        const review_id = 3
        return request(app)
            .get(`/api/reviews/${review_id}`)
            .expect(200)
            .then(({body}) => {
                expect(typeof body).toBe('object')
                expect(body.review).toEqual({
                    review_id: 3,
                    title: 'Ultimate Werewolf',
                    review_body: `We couldn't find the werewolf!`,
                    category: 'social deduction',
                    designer: 'Akihisa Okui',
                    owner: 'bainesface',
                    review_img_url: 'https://images.pexels.com/photos/5350049/pexels-photo-5350049.jpeg?w=700&h=700',
                    created_at: '2021-01-18T10:01:41.251Z',
                    votes: 5
                })
            })
        })
    it("should respond with 404 and review not found", () => {
        const review_id = 50;
        return request(app)
        .get(`/api/reviews/${review_id}`)
        .expect(404)
        .then(( body) => {
            expect(body.text).toEqual(`no review found`);
            });
    }) 
    it("should respond with 400 and bad request", () => {
        return request(app)
          .get(`/api/reviews/egg`)
          .expect(400)
          .then(( body) => {
            expect(body.text).toEqual(`bad request`);
          });
      });
});

describe('POST /api/reviews/:review_id/comments', () => {
    it('responds with 201: request body accepts an object with username and body property, returns posted comment', () => {
        const review_id = 1
        const newComment = {
            username: "dav3rid",
            body: "hahahehe"
        }
        return request(app) 
            .post(`/api/reviews/${review_id}/comments`)
            .send(newComment)
            .expect(201)
            .then(({body}) => {
                expect(body).toMatchObject({
                    comment_id: 7,
                    body: 'hahahehe',
                    review_id: 1,
                    author: "dav3rid",
                    votes: 0, 
                    created_at: expect.any(String)
                })
            })
    })
    it("should responsd with 404 and review not found", () => {
        const review_id = 50;
        const newComment = {
            username: "dav3rid",
            body:'hehehohoegg'
        }
        return request(app)
        .post(`/api/reviews/${review_id}/comments`)
        .send(newComment)
        .expect(404)
        .then(( body) => {
            expect(body.text).toEqual(`cannot find review_id`);
            });
    }) 
    it("should response with 400 and bad request", () => {
        const review_id = 1
        const newComment = {
            username: "dav3rid",
            body:'hehehohoegg'
        }
        return request(app)
          .post(`/api/reviews/egg/comments`)
          .send(newComment)
          .expect(400)
          .then(( body) => {
            expect(body.text).toEqual(`bad request`);
          });
      });
    it('should respond with 403 if not enough information provided', () => {
        const review_id = 1
        const newComment = {
            username: "dav3rid",
            body:''
        }
        return request(app)
        .post(`/api/reviews/${review_id}/comments`)
        .send(newComment)
        .expect(403)
        .then((body) => {
            expect(body.text).toEqual(`body is empty`)
        })
    })
})

// username does not exist
// nothing to post, comment body is empty 