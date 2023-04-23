const app = require("./index")
const port = process.env.PORT
const errorMiddleware = require("./middlewares/error.middleware")
const mongoose = require('mongoose');

console.log(`Node environment: ${process.env.NODE_ENV}`)
app.listen(port, () => {
    console.log(`Example app listening at port http://localhost:${port}`)
})

mongoose.connect(process.env.BDD_MONGO)

// Error Handler Middleware
app.use(errorMiddleware)
