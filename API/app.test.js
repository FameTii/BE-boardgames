const request = require("supertest");
const seed = require("../db/seeds/seed");
const db = require("../db/connection");
const testData = require("../db/data/test-data/index");
const app = require("./app");
const {toBeSortedBy} = require('jest-sorted');
const { expect } = require("@jest/globals");

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
    
describe('Get GET /api/reviews/:review_id/comments', () => {
    it('responds with 200 and returns an array of comments for the given review_id', () => {
        const review_id = 3
        return request(app)
            .get(`/api/reviews/${review_id}/comments`)
            .expect(200)
            .then(({body}) => {
                expect(body.comments.length).toEqual(3)
                expect(body.comments).toEqual(
                    [{
                        comment_id: 6,
                        body: 'Not sure about dogs, but my cat likes to get involved with board games, the boxes are their particular favourite',
                        review_id: 3,
                        author: 'philippaclaire9',
                        votes: 10,
                        created_at: '2021-03-27T19:49:48.110Z'
                      },
                      {
                        comment_id: 3,
                        body: "I didn't know dogs could play games",
                        review_id: 3,
                        author: 'philippaclaire9',
                        votes: 10,
                        created_at: '2021-01-18T10:09:48.110Z'
                      },
                      {
                        comment_id: 2,
                        body: 'My dog loved this game too!',
                        review_id: 3,
                        author: 'mallionaire',
                        votes: 13,
                        created_at: '2021-01-18T10:09:05.410Z'
                      }]
                )
                expect(body.comments).toBeSortedBy('created_at', {descending: true});
            })
    })
    it("should respond with 200 empty array if review exists but no comments", () => {
        return request(app)
        .get(`/api/reviews/1/comments`)
        .expect(200)
        .then(({body}) => {
            expect(body.comments.length).toEqual(0)
            expect(body.comments).toEqual([])
        })    
    }) 
    it("should respond with 404 and comment not found", () => {
        return request(app)
        .get(`/api/reviews/50/comments`)
        .expect(404)
        .then((body) => {
            expect(body.text).toEqual(`no comments found`);
            });
    }) 
    it("should respond with 400 and bad request", () => {
        return request(app)
          .get(`/api/reviews/bake/comments`)
          .expect(400)
          .then(( body) => {
            expect(body.text).toEqual(`bad request`);
          });
      })
})


// SELECT comment_id, body, comments.review_id, author, comments.votes, comments.created_at FROM comments RIGHT JOIN reviews ON reviews.review_id = comments.review_id WHERE reviews.review_id = 1;