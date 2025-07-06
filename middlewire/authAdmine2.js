// used to make sure for login
const express =require("express")
const authshopadmine = async (req, res, next) => {
  const tokenAdmine = req.cookies["tokenAdmine"];
  console.log('Token from cookie:', tokenAdmine);

  if (!tokenAdmine) {
      return res.status(401).send("Token is required");
  }

  if (tokenAdmine === "2713e1c68b19a10d2ebf8e58a1795b3cdd5e53954caf5b1f81cb865cc6fe757e2cbe2d8af880e838") {
      console.log("You are good");
      return next(); // Proceed to the next middleware or route handler
  } else {
      return res.status(400).json('For Admin only');
  }
    
  };
 module.exports = authshopadmine;