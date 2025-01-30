const request = require('supertest');
const app = require('./server');

describe('GET /cves/list', () => {
  it('should fetch a list of CVEs', async () => {
    const res = await request(app)
      .get('/cves/list')
      .query({ page: 1, resultsPerPage: 10 });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('vulnerabilities');
    expect(res.body).toHaveProperty('totalResults');
  });

  it('should handle errors', async () => {
    const res = await request(app)
      .get('/cves/list')
      .query({ page: 1000, resultsPerPage: 10 });

    expect(res.statusCode).toEqual(500);
    expect(res.body).toHaveProperty('message');
  });
});