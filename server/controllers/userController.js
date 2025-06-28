const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../database/index");
const User = db.User;

// jwt sectrt
const JWT_SECRET = "secretKey";

//register
const register = async (req, res) => {
  const { username, email, password, profileImage } = req.body;

  if (!username || !email || !password || !profileImage) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    const existingUser = await User.findOne({ where: { email } });

    if (existingUser) {
      return res.status(409).json({ message: "Email already in use." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      profileImage,
    });

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        profileImage: newUser.profileImage,
      },
    });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ message: "Server error." });
  }
};

//login

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required." });
  }

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: "Invalid password." });
    }

    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "7d" });

    // Set token in HTTP-only cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // true in production with HTTPS
      sameSite: "lax", // or "none" if using cross-site cookies
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(200).json({
      message: "Login successful",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        profileImage: user.profileImage,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error." });
  }
};

//logout

const logout = (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Logged out successfully." });
};

// update username
const updateUsername = async (req, res) => {
  const userId = req.user.id; // from authMiddleware
  const { newUsername } = req.body;

  if (!newUsername || newUsername.trim() === "") {
    return res.status(400).json({ message: "New username is required." });
  }

  try {
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    user.username = newUsername;
    await user.save();

    res.status(200).json({
      message: "Username updated successfully",
      username: user.username,
    });
  } catch (error) {
    console.error("Error updating username:", error);
    res.status(500).json({ message: "Server error." });
  }
};

//update password 

const updatePassword = async (req, res) => {
  const userId = req.user.id;
  const { currentPassword, newPassword } = req.body;

  // Validation
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: "Both current and new passwords are required." });
  }

  try {
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Check if current password is correct
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Current password is incorrect." });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    await user.save();

    res.status(200).json({ message: "Password updated successfully." });
  } catch (error) {
    console.error("Error updating password:", error);
    res.status(500).json({ message: "Server error." });
  }
};

// user contribution 

const getUserContributions = async (req, res) => {
  const userId = req.user.id;

  try {
    const contributions = await db.Contribution.findAll({
      where: { UserId: userId },
      include: {
        model: db.Campaign,
        attributes: ['name'],
      },
      attributes: ['id', 'amount', 'createdAt'],
      order: [['createdAt', 'DESC']],
    });

    if (!contributions || contributions.length === 0) {
      return res.status(200).json({
        totalAmount: 0,
        contributions: [],
      });
    }

    const totalAmount = contributions.reduce((sum, c) => sum + c.amount, 0);

    const formattedContributions = contributions.map((c) => ({
      id: c.id,
      amount: c.amount,
      campaignName: c.Campaign.name,
      date: c.createdAt,
    }));

    res.status(200).json({
      totalAmount,
      contributions: formattedContributions,
    });
  } catch (error) {
    console.error("Error fetching contributions:", error);
    res.status(500).json({ message: "Server error." });
  }
};


module.exports = {
  register,
  login,
  logout,
  updateUsername,
  updatePassword,
  getUserContributions
};

