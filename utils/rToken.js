import  Jwt  from "jsonwebtoken";

// Token for reset password
export const createResetToken = (payload) =>{
    return Jwt.sign(payload, process.env.RESET_TOKEN,{
        expiresIn: "6h",
    })
}
// Token for reset password
// export const createUserToken = (userId) => {
//     const token = Jwt.sign({_id: userId.toString()}, process.env.CRYPTO_SECRET);
//     return token;
//   };