const jwt =require("jsonwebtoken");
const User = require("../Models/user");
// const cookieparser=require("cookie-parser")


// const auth =async (req,res,next)=>{
//   const token =req.cookies["acces-token"];
//   console.log(token) 
//   if(!token){
//     return res.status(401).send("token is requird")
//   }
//   token=token?.split("")[1]
//   let secretKey=process.env.ACCESS_TOKEN_SECRET
//   let decode =jwt.verify(token,secretKey) 
  
//   if(!decode){
//     return res.status(403).send("token is requird")
//   }
//   const user=await User.findById({decode:id})
//   req.user=user
//   next()
// }

const auth = async (req, res, next) => {
  const token = req?.cookies["acsses-token"];
  // console.log(token +"this is eist token");
  
  if (!token) {
    return res.status(401).send("Token is required");
  }


  let secretKey = process.env.ACCESS_TOKEN_SECRET;
  let decode = jwt.verify(token, secretKey); 
  console.log(decode)
     
  const user = await User.findOne({_id:decode._id})
  // console.log(user.username)
  // console.log(user)
  if(!user){
      throw new Error("token required")
  }
  req.user = user
  req.token = token
  next()  
    
//    catch(e){
//   res.status(401).send({error:'Please authenticate'})
// }
  
};
// const auth = async (req, res, next) => {
//   const token = req?.cookies["acsses-token"];
//   console.log(token +"this is eist token");
  
//   if (!token) {
//     return res.status(401).send("Token is required");
//   }

//   const tokenn = token?.split(" ")[1];  // Fix: Split the token string into an array and access the second element
//   let secretKey = process.env.ACCESS_TOKEN_SECRET;

//   try {
//     let decode = jwt.verify(tokenn, secretKey); 
    
//     if (!decode) {
//       return res.status(403).send("Invalid token");
//     }

//     const user = await User.findById(decode.id);
     
//     if (!user) {
//       return res.status(404).send("User not found");
//     }

//     req.user = user;
//     req.token = tokenn
//     next();
//   } catch (error) {
//     return res.status(500).send("Internal Server Error");
//   }
// };

module.exports = auth;









