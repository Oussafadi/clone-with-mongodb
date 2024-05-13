import { getSession } from "@auth0/nextjs-auth0"
import clientPromise from "lib/mongodb";
import { ObjectId, ReturnDocument } from "mongodb";

export default async function handler (req,res) {
    try {
       const {user} = await getSession(req,res);
       const { chatId,role,content } = req.body;
       const client = await clientPromise ;
       const db = client.db("OpenAI_Clone");
       const chat = db.collection("chats").findOneAndUpdate({
        _id : ObjectId(chatId),
        userId : user.sub ,
       } , {
        $push : {
            messages : {
                role,
                content,
            }
        }
       },{ 
        ReturnDocument :"after"
     })
        res.status(200).json({
            chat: {
                ...chat.value,
                _id : chat.value._id.toString(),
            }
        });

    }catch(e) {
        res.status(500).json({
            message : "Error occured when adding message to existing chat",
        })
    }
}