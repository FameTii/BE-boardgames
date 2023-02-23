const request = require("supertest");
const seed = require("../db/seeds/seed");
const db = require("../db/connection");
const testData = require("../db/data/test-data/index");
const app = require("./app");

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

describe.only('POST /api/reviews/:review_id/comments', () => {
    it.skip('responds with 201: request body accepts an object with username and body property, returns posted comment', () => {
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
    it("should respond with 404 and review not found", () => {
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
    it('should respond with 400 if comment is missing', () => {
        const review_id = 1
        const newComment = {
            username: "dav3rid",
            body:''
        }
        return request(app)
        .post(`/api/reviews/${review_id}/comments`)
        .send(newComment)
        .expect(400)
        .then((body) => {
            expect(body.text).toEqual(`body is empty`)
        })
    })
    it('should respond with 400 if username is missing', () => {
        const review_id = 1
        const newComment = {
            username: '',
            body:'hehehaha'
        }
        return request(app)
        .post(`/api/reviews/${review_id}/comments`)
        .send(newComment)
        .expect(400)
        .then((body) => {
            expect(body.text).toEqual(`no username`)
        })
    })
    it('should respond with 404 if username does not exist', () => {
        const review_id = 1
        const newComment = {
            username: 'username22',
            body: 'hehehaha'
        }
        return request(app)
        .post(`/api/reviews/${review_id}/comments`)
        .send(newComment)
        .expect(404)
        .then((body) => {
            expect(body.text).toEqual(`username does not exist`)
        })
    })
})

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

describe('PATCH /api/reviews/:review_id', () => {
    it('responds with 200: updates the votes with positive value and returns the updated review', () => {
        const review_id = 3
        const newVotes = { inc_votes : 1 }
        return request(app)
        .patch(`/api/reviews/${review_id}`)
        .send(newVotes)
        .expect(200)
        .then(({body}) => {
            expect(body).toMatchObject({
                review_id: 3,
                title: 'Ultimate Werewolf',
                review_body: `We couldn't find the werewolf!`,
                category: 'social deduction',
                designer: 'Akihisa Okui',
                owner: 'bainesface',
                review_img_url: 'https://images.pexels.com/photos/5350049/pexels-photo-5350049.jpeg?w=700&h=700',
                created_at: '2021-01-18T10:01:41.251Z',
                votes: 6
            })
        })
    })
    it('responsed with 200: updates the votes with negative value and returns updated review', () => {
        const review_id = 3
        const newVotes = { inc_votes : -10 }
        return request(app)
        .patch(`/api/reviews/${review_id}`)
        .send(newVotes)
        .expect(200)
        .then(({body}) => {
            expect(body).toMatchObject({
                review_id: 3,
                title: 'Ultimate Werewolf',
                review_body: `We couldn't find the werewolf!`,
                category: 'social deduction',
                designer: 'Akihisa Okui',
                owner: 'bainesface',
                review_img_url: 'https://images.pexels.com/photos/5350049/pexels-photo-5350049.jpeg?w=700&h=700',
                created_at: '2021-01-18T10:01:41.251Z',
                votes: -5
            })
        })
    })
    it("should respond with 404 and review not found", () => {
        const review_id = 50;
        const newVotes = { inc_votes : 5 }
        return request(app)
        .patch(`/api/reviews/${review_id}`)
        .send(newVotes)
        .expect(404)
        .then(( body) => {
            expect(body.text).toEqual(`no review found`);
            });
    }) 
    it("should respond with 400 and bad request", () => {
        const review_id = 'egg'
        const newVotes = { inc_votes : 5 }
        return request(app)
        .patch(`/api/reviews/${review_id}`)
        .send(newVotes)
        .expect(400)
        .then(( body) => {
            expect(body.text).toEqual(`bad request`);
          });
    })
    it("should respond with 400 and bad request if inc_votes is not a integer", () => {
        const review_id = 3
        const newVotes = { inc_votes : 'egg' }
        return request(app)
        .patch(`/api/reviews/${review_id}`)
        .send(newVotes)
        .expect(400)
        .then((body) => {
            expect(body.text).toEqual(`bad request`)
        })
    })
})    

      
