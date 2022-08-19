import { getSession } from "next-auth/react";
import Order from "../../../models/Order";
import db from "../../../utils/db";
const handler = async (req, res) => {
  const session = await getSession({ req });
  if (!session) {
    res.status(404).send({ message: "Signing is required" });
    return;
  }
  const { user } = session;
  await db.connect();
  const orders = await Order.find({ user: user._id });
  await db.disconnect();
  res.send(orders);
};

export default handler;
