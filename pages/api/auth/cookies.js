import { getToken } from "next-auth/jwt"

const secret = process.env.JWT_SECRET

export default async function handler(req, res) {
  // if using `NEXTAUTH_SECRET` env variable, we detect it, and you won't actually need to `secret`
//   const token = await getToken({ req })
  const token = await getToken({ req, secret} )
  res.send(token,"JSON Web Token")
  res.end()
}