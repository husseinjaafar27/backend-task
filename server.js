const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
app = express();
const authRoute = require("./routes/authRoute");
const productRoute = require("./routes/productRoute");

app.use(express.json());

app.use("/api/auth", authRoute);
app.use("/api/product", productRoute);

mongoose
  .connect(process.env.DB_URL)
  .then(() => console.log("Database connecting successfully"))
  .catch((err) => console.log(err));

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is listening on port: ${PORT}`);
});
