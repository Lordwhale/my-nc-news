const endpointsJson = require("../endpoints.json");
const request = require("supertest");
const db = require("../db/connection");
const app = require("../db/app");
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
