import { getSession } from "next-auth/react";

const handler = (req, res) => {
  const session = getSession({ req });
  if(!session){
    return res.status(401).send('Signin required')
  }

  res.send(process.env.PAYPAL_CLIENT_ID || 'sb')
};


export default handler
