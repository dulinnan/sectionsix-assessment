/** @format */

const app = require("./config/express")

try {
    const port = process.env.PORT || 8080
    app.listen(port, () => console.log(`Sectionsix app listening at http://localhost:${port}`))
} catch (error) {
    console.error(error.stack)
}

module.exports = app
