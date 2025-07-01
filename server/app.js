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
  origin: "http://localhost:5173",
  credentials: true
}));

const PostRouter = require("./routes/postRoutes");
app.use("/posts",PostRouter);

// Campaign routes
const CampaignRouter = require("./routes/campaignRoutes");
app.use("/campaigns", CampaignRouter);

// Contribution routes
const ContributionRouter = require("./routes/contributionRoutes");
app.use("/contributions", ContributionRouter);

//routes connection
const userRoutes = require("./routes/userRoutes")

// user routes 
app.use("/api/users", userRoutes)
app.use("/api/paiment", require("./routes/paimentRoutes"))
app.use("/api/communities", require("./routes/communityRoutes"))

// Community invitation routes
app.use("/api/community-invitations", require("./routes/communityInvitationRoutes"))

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});