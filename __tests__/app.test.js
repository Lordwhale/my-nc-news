const endpointsJson = require("../endpoints.json");
const request = require("supertest");
const db = require("../db/connection");
const app = require("../app");
const data = require("../db/data/test-data");
const seed = require("../db/seeds/seed");

beforeEach(() => {
  return seed(data);
});

afterAll(() => {
  return db.end();
});

describe("GET /api", () => {
  test("200: Responds with an object detailing the documentation for each endpoint", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body: { endpoints } }) => {
        expect(endpoints).toEqual(endpointsJson);
      });
  });
});

describe("GET /api/topics", () => {
  test("200: responds with an array of all the topics", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        const { topics } = body;
        expect(topics).toHaveLength(3);
        topics.forEach((topic) => {
          expect(topic).toMatchObject({
            slug: expect.any(String),
            description: expect.any(String),
          });
        });
      });
  });
});

describe("GET /api/articles/:article_id", () => {
  test("200: responds with an article object", () => {
    const expectedArticle = {
      article_id: 8,
      title: "Does Mitch predate civilisation?",
      topic: "mitch",
      author: "icellusedkars",
      body: "Archaeologists have uncovered a gigantic statue from the dawn of humanity, and it has an uncanny resemblance to Mitch. Surely I am not the only person who can see this?!",
      created_at: expect.any(String),
      article_img_url:
        "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
      votes: 0,
    };
    return request(app)
      .get("/api/articles/8")
      .expect(200)
      .then(({ body: { article } }) => {
        expect(article).toEqual(expectedArticle);
      });
  });

  test("404: responds with an error message if article id does not exist", () => {
    return request(app)
      .get("/api/articles/555")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("item not found");
      });
  });

  test("400: responds with an error message if article id not valid", () => {
    return request(app)
      .get("/api/articles/not-an-id")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
});

describe("GET /api/articles", () => {
  test("200: responds with an array of all the articles", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toBeSortedBy("created_at", { descending: true });
        expect(articles).toHaveLength(13);
        articles.forEach((article) => {
          expect(article).toMatchObject({
            article_id: expect.any(Number),
            title: expect.any(String),
            topic: expect.any(String),
            author: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
            comment_count: expect.any(String),
          });
        });
      });
  });
});

describe("GET /api/articles/:article_id/comments", () => {
  test("200: responds with an array of comments", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        expect(comments).toBeSortedBy("created_at", { descending: true });
        expect(comments).toHaveLength(11);
        comments.forEach((comment) => {
          expect(comment).toMatchObject({
            article_id: expect.any(Number),
            body: expect.any(String),
            votes: expect.any(Number),
            author: expect.any(String),
            article_id: expect.any(Number),
            created_at: expect.any(String),
          });
        });
      });
  });

  test("404: responds with an error message if article id does not exist", () => {
    return request(app)
      .get("/api/articles/555/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("item not found");
      });
  });

  test("400: responds with an error message if article id not valid", () => {
    return request(app)
      .get("/api/articles/not-an-id/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
});

describe("POST /api/articles/:article_id/comments", () => {
  test("201: responds with a newly created comment object", () => {
    const newComment = {
      username: "icellusedkars",
      body: "I dont know Mitch.",
    };
    return request(app)
      .post("/api/articles/6/comments")
      .send(newComment)
      .expect(201)
      .then(({ body: { comment } }) => {
        expect(comment).toEqual({
          comment_id: expect.any(Number),
          author: "icellusedkars",
          body: "I dont know Mitch.",
          votes: expect.any(Number),
          created_at: expect.any(String),
          article_id: 6,
        });
      });
  });

  test("400: responds with an error message if username is missing", () => {
    return request(app)
      .post("/api/articles/5/comments")
      .send({
        body: "Am I missing something?",
      })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("missing username");
      });
  });

  test("400: responds with an error message if body is missing", () => {
    return request(app)
      .post("/api/articles/2/comments")
      .send({
        username: "Mr Forgetful",
      })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("missing content");
      });
  });

  test("400: responds with an error message if empty object passed", () => {
    return request(app)
      .post("/api/articles/3/comments")
      .send({})
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("missing input");
      });
  });

  test("404: responds with an error message when given an out of range id", () => {
    return request(app)
      .get("/api/articles/9000/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("item not found");
      });
  });

  test("404: responds with an error message when the user does not exist", () => {
    return request(app)
      .post("/api/articles/1/comments")
      .send({
        username: "nkotb",
        body: "When will I be famous?",
      })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Unknown user");
      });
  });
});

describe("PATCH /api/articles/:article_id", () => {
  test("200: responds with an increased vote count from the return object", () => {
    return request(app)
      .patch("/api/articles/3")
      .send({ inc_votes: 10 })
      .expect(200)
      .then(({ body: { article } }) => {
        expect(article.votes).toBe(10);
      });
  });

  test("200: responds with a decreased vote count from the object received", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: -10 })
      .expect(200)
      .then(({ body: { article } }) => {
        expect(article).toMatchObject({
          article_id: 1,
          article_img_url: "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: expect.any(String),
          title: "Living in the shadow of a great man",
          topic: "mitch",
          votes: 90,
        });
      });
  });

  test("404: responds with an error message when given out of range id", () => {
    return request(app)
      .patch("/api/articles/1234")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("item not found");
      });
  });

  test("400: Responds with an error message when given an invalid id", () => {
    return request(app)
      .patch("/api/articles/sputnik-in-space")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad Request");
      });
  });
});

describe("DELETE /api/comments/:comment_id", () => {
  test("204: removes the selected comment", () => {
    return request(app)
      .delete("/api/comments/1")
      .expect(204)
      .then(({ body }) => {
        expect(body).toEqual({});
      });
  });

  test("404: responds with an error message when given an out of range id", () => {
    return request(app)
      .delete("/api/comments/1234")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("comment does not exist");
      });
  });

  test("400: responds with an error message when given an invalid id", () => {
    return request(app)
      .delete("/api/comments/laijka-in-space")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad Request");
      });
  });
});

describe("GET /api/users", () => {
  test("200: responds with an array of all users", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body: { allUsers } }) => {
        expect(allUsers).toHaveLength(4);
        allUsers.forEach((user) => {
          expect(user).toMatchObject({
          username: expect.any(String),
          name: expect.any(String),
          avatar_url: expect.any(String),
          });
        });
      });
  });
});
