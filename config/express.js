/** @format */

const express = require("express")
const app = express()
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept")
    res.header("Access-Control-Allow-Methods", "GET")
    next()
})

app.get("/", function(req, res) {
    res.status(200).send("Server up")
})

require("../app/routes/admin.server.routes")(app)

module.exports = app
