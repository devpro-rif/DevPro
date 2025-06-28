const express = require("express");
const cors = require("cors");
const db = require("./database/index");
const cookieParser = require("cookie-parser");



const PORT = 4000;
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

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});