const express = require("express");
const cors = require("cors");
const db = require("./database/index");
const cookieParser = require("cookie-parser");
require('dotenv').config();


const PORT = process.env.PORT || 4000;
const app = express();


app.use(express.json());
app.use(cookieParser());
app.use(cors({
  credentials: true
}));

//routes connection
const userRoutes = require("./routes/userRoutes")

// user routes 
app.use("/api/users", userRoutes)
app.use("/api/paiment", require("./routes/paimentRoutes"))
app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});