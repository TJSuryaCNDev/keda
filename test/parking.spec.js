const chai = require('chai')
const expect = chai.expect
const sinon = require('sinon')
const sinonChai = require('sinon-chai')
chai.use(sinonChai)
const rewire = require('rewire')
const request = require('supertest')

const parkingController = require("../controllers/parking")
const route = require("../routes/index")

const sandbox = sinon.createSandbox()

let app = rewire('../app')

describe('Test', () => {
  describe('Test Controller', () => {
    describe('check on getAll', () => {
      it('Test should be okay', async () => {
        const actualResult = await parkingController.getAll({
          query: {}
        }, {})
        expect(actualResult).to.be.an('object')
        expect(actualResult).to.have.property("success").to.equal(true)
      })
    })
    describe("check on postParking", () => {
      it("Test should successfully create a new item", async () => {
        const actualResult = await parkingController.postParking({
          body: {
            type: "mobil",
            startDate: "2023-01-09T08:22:18.287Z",
            endDate: "2023-01-09T08:22:18.287Z"
          }
        }, {})
        expect(actualResult).to.be.an("string")
        expect(actualResult).to.equal("Success")
      })
    })
  })
  
  describe('Test Route', () => {
    it('check on GET /', (done) => {
      request(app).get(`/`)
        .expect(200)
        .send({
          query: {}
        }, {})
        .end((err, response) => {
          done(err)
        })
    })
    it("check on POST /add", (done) => {
      request(app).post('/add')
        .send({
          type: "mobil",
          startDate: "2023-01-09T08:22:18.287Z",
          endDate: "2023-01-09T08:22:18.287Z"
        })
        .expect(302)
        .end((err, response) => {
          done(err)
        })
    })
    it('check on GET /api', (done) => {
      request(app).get(`/api`)
        .expect(200)
        .send({
          query: {}
        }, {})
        .end((err, response) => {
          expect(response.body).to.be.an('object')
          expect(response.body).to.have.property("success").to.equal(true)
          done(err)
        })
    })
    it("check on POST /api/add", (done) => {
      request(app).post('/api/add')
        .send({
          type: "mobil",
          startDate: "2023-01-09T08:22:18.287Z",
          endDate: "2023-01-09T08:22:18.287Z"
        })
        .expect(200)
        .end((err, response) => {
          expect(response.body).to.be.an('object')
          expect(response.body).to.have.property("success").to.equal(true)
          done(err)
        })
    })
  })
})
