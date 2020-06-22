/** @format */

const request = require("supertest")
const expect = require("chai").expect
const server = "http://localhost:8080"

describe("Endpoint route test suites", () => {
    after(done => {
        // runs once after the last test in this suite
        done()
    })

    // BDD styled test root endpoint
    describe("Endpoint › GET '/'", () => {
        it("should return Server up", done => {
            request(server)
                .get("/")
                .end((err, res) => {
                    if (err) done(err)
                    expect(res.status).to.equal(200)
                    expect(res.text).to.equal("Server up")
                    done()
                })
        })
    })

    // BDD styled test /convert endpoint
    describe("Endpoint › GET '/convert'", () => {
        it("should return OK", done => {
            request(app)
                .get("/convert?id=274")
                .end((err, res) => {
                    if (err) done(err)
                    expect(res.status).to.equal(200)
                    expect(res.body).to.be.a("object")
                    expect(res.body).to.have.property("time")
                    expect(res.body).to.have.property("distance")
                    done()
                })
        })
    })
})
