console.log("EXPRRESS PROJECT")
const express = require("express");
const connectDb = require("./config/dbConnection.js");
const errorHandler = require("./middleware/errorHandler.js");
const dotenv = require("dotenv").config();

connectDb();
const app = express();

const port = process.env.PORT || 5000;

app.use(express.json());
app.use("/api/contacts", require("./routes/contactRoutes.js"));
app.use("/api/users", require("./routes/userRoutes.js"));
app.use(errorHandler);

app.listen(port, () => {
    console.log(`Server runnin on port ${port}`)
});