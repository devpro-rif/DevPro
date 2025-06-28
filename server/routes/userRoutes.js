const express = require("express");
const router = express.Router();
const { register,login,logout,updateUsername ,updatePassword } = require("../controllers/userController");
const auth = require("../middleware/authMiddleware")
//register route
router.post("/register", register);
// login route
router.post("/login", login);
//logout route
router.post("/logout", logout);
//auth route
router.get("/profile", auth, (req, res) => {
    res.json({ message: "Welcome", userId: req.user.id });
});

//update username
router.put("/update-username", auth, updateUsername);

//update password

router.put("/update-password", auth, updatePassword);



module.exports = router;