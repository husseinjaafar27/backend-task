const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { validateEmail, validateLength } = require("../helpers/validation");

const signToken = (id, time) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: time,
  });
};

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (!validateEmail(email)) {
      return res.status(400).json({ message: "Invalid email address" });
    }
    const checkEmail = await User.findOne({ email });
    if (checkEmail) {
      return res.status(401).json({
        message:
          "This email address already exists,try with a different email address.",
      });
    }
    if (!validateLength(name, 3, 30)) {
      return res.status(400).json({
        message: "Name must between 3 and 30 characters.",
      });
    }
    if (!validateLength(password, 6, 40)) {
      return res.status(400).json({
        message: "Password must be atleast 6 characters.",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });
    const token = signToken(user._id, "1d");
    return res
      .status(200)
      .json({ message: "User created successfully", token, user });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email || !req.body.password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        message:
          "The email address you entered is not connected to an account.",
      });
    }
    const checkPass = await bcrypt.compare(req.body.password, user.password);
    if (!checkPass) {
      return res.status(400).json({ message: "Invalid credentials." });
    }
    const token = signToken(user._id, "1d");
    const { password, ...others } = user._doc;
    return res
      .status(200)
      .json({ message: "You logged in successfully.", token, user: others });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
