const express = require("express");
const router = express.Router();
const { register,login,logout,updateUsername ,updatePassword , getUserContributions } = require("../controllers/userController");
const auth = require("../middleware/authMiddleware")
//register route
router.post("/register", register);

// login route
router.post("/login", login);

//logout route
router.post("/logout", logout);

//update username
router.put("/update-username", auth, updateUsername);

//update password
router.put("/update-password", auth, updatePassword);

// user contribution

router.get("/contributions", auth , getUserContributions)
module.exports = router;