import User from "../../../models/User";
import db from "../../../utils/db";
import bcryptjs from "bcryptjs";

const handler = async (req, res) => {
  if (req.method !== "POST") {
    return;
  }
  console.log(req.body);
  //   get values from req.body
  const { name, email, password } = req.body;
  //   Validation check
  if (
    !name ||
    !email ||
    !email.includes("@") ||
    !password ||
    password.trim().length < 5
  ) {
    res.status(422).json({
      message: "Validation Error",
    });
    return;
  }

  await db.connect();
  const userExist = await User.findOne({ email: email });
  if (userExist) {
    res.status(422).json({
      message: "User Already Exist",
    });
    db.disconnect();
    return;
  }

  const newUser = new User({
    name,
    email,
    password: bcryptjs.hash(password),
    isAdmin: false,
  });
  const user = await newUser.save();
  db.disconnect();
  res.status(204).send({
    message: "Created User!",
    _id: user._id,
    name: user.name,
    email: user.email,
    isAdmin: user.isAdmin,
  });
};

export default handler;
