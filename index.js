require("dotenv").config()
require("express-async-errors")

const accessLogMiddleware = require("./middlewares/logger.middleware")
const routes = require("./routes/api")

const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");

const express = require("express")
const app = express()
const cors = require("cors")

const swaggerOptions = require("./swaggerConfig.js");
const swaggerDocs = swaggerJsdoc(swaggerOptions);

app.use(cors())

app.use(express.json())


// Req and Res logger.
app.use(accessLogMiddleware)

app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use("/", routes)

module.exports = app

