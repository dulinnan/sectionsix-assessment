/** @format */

"use strict"

/**
 * validation functions for checking parameters and schemas
 *
 * the heavy lifting is mostly done by ZSchema and swagger-parameters
 */

const ZSchema = require("z-schema")
const schema = require("../../config/openapi.json")
const options = {assumeAdditional: true} // ban additional properties and array items from the schema (no unexpected things)
const schemaValidator = new ZSchema(options)
const parameterValidator = require("swagger-parameters")

/**
 * validate some object against the API schema
 *
 * @param actual        the object to be validated (usually a req.body)
 * @param schemaPath    if supplied, sub-schema to be used for validation (passed directly to ZSchema schemaPath)
 */
const validateSchema = (actual, schemaPath = "definitions") => {
    return schemaValidator.validate(actual, schema, {schemaPath: schemaPath})
}

const getLastErrors = () => schemaValidator.getLastErrors()

module.exports = {
    isValidSchema: validateSchema,
    getLastErrors: getLastErrors,
}
