import { db } from "@/db/db";
import { ContactProps, TypedRequestBody, UserCreateprops, UserLoginprops } from "@/types/types";
import { generateSlug } from "@/utils/generateSlug";
import { error } from "console";
import { Request, Response } from "express";
import bcrypt from "bcrypt"
import { generateAccessToken, generateRefreshToken, TokenPayload } from "@/utils/tokens";

export async function createUser(req: TypedRequestBody<UserCreateprops>, res: Response) {
  const data =req.body
  const {email,password,
    name, 
    role,
    phone,
    image,} = data;

  try {

    const existingEmail =await db.user.findUnique({
      where:{
        email,
      },
    });
    if (existingEmail){
      return res.status(409). json({
        data:null,
        error:"email already exist",
      })
    }

    //hash the password
const hashedPassword = await bcrypt.hash(password,10);
data.password=hashedPassword

    const newUser = await db.user.create({
      data
    });
    console.log(
      `user Sent successfully: ${newUser} (${newUser.id})`
    );
    return res.status(201).json({
      data: newUser,
      error: null,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      data: null,
      error: "Something went wrong",
    });
  }
}

export async function loginUser(req: TypedRequestBody<UserLoginprops>, res: Response) {
  const data =req.body
  const {email,password,} = data;

  try {

    const existingUser =await db.user.findUnique({
      where:{
        email,
      },
    });
    if (!existingUser){
      return res.status(409). json({
        data:null,
        error:"Invalid Credentials",
      })
    }

   const isPasswordValid = await bcrypt.compare(password,existingUser.password);
   if (!isPasswordValid){
    return res.status(401).json({
      error:"invalid credentials",
      data:null,
    });
   }

   const tokenPayload:TokenPayload={
    userId:existingUser.id,
    email:existingUser.email,
    role:existingUser.role,
   };

   const accessToken=generateAccessToken(tokenPayload);
   const refreshToken= generateRefreshToken(tokenPayload);

   await db.refreshToken.create({
    data:{
      token:refreshToken,
      userId:existingUser.id,
      expiresAt:new Date(Date.now()+30*24*60*60*1000),
    },
   });



   const {password: _, ...userWithoutPassword}=existingUser;
    return res.status(200).json({
      data:{
        user:userWithoutPassword,
        accessToken,
        refreshToken,
      },
      error:null,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      data: null,
      error: "Something went wrong",
    });
  }
}
