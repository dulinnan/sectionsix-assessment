/**
 * establish a bunyan logger
 *
 * @format
 */

const bunyan = require("bunyan")

let logger,
    createLogger = options => {
        options = {name: "sectionsix-application", ...options} // name default
        if (logger) {
            return logger
        }
        logger = bunyan.createLogger(options)
        return logger
    }

module.exports = createLogger
