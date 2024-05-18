import { getSession } from "@auth0/nextjs-auth0";
import clientPromise from "lib/mongodb";

export default async function handler(req,res) {
   try {
    const { user } = await getSession(req,res);
    const { message } = req.body;
    // validation
    if( !message || typeof message !== "String" || message.length > 200) {
         res.status(422).json({
            message : " Message required and must be less than 200 characters",
       })
       return ;
       } 

    const newUserMessage = {
        role: "user",
        content : message,
    };
    const client = await clientPromise;
    const db = client.db("OpenAI_Clone");
    const chat = await db.collection("chats").insertOne({
        userId: user.sub ,
        messages: [
            newUserMessage,
        ],
        title: message,
    });
     res.status(200).json({
        _id : chat.insertedId.toString(),
        messages : [ newUserMessage ],
        title : message ,
     });

   }catch(e) {
    res.status(500).json({
         message : " Error occured when creating a new chat",
    })
    console.log("Error Occured in Create a New Chat", e);
   }

}