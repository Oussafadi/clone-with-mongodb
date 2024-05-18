import { getSession } from "@auth0/nextjs-auth0"
import clientPromise from "lib/mongodb";
import { ObjectId, ReturnDocument } from "mongodb";

export default async function handler (req,res) {
    try {
       const {user} = await getSession(req,res);
       const { chatId,role,content } = req.body;
       const client = await clientPromise ;
       const db = client.db("OpenAI_Clone");

       // Validate chat id
       if(chatId){
       let objectId ;
         try {
          objectId = new ObjectId(chatId)
         }catch(e) {
          res.status(422).json({
            message : "The chat id is not valid",
          })
          return ;
         }
        }

        // validate the message content 
        if( !content || typeof content !== "String" || (role ==="user" && content.length > 200 ) || (role ==="assistant" && content.length > 100000 ) ) {
            res.status(422).json({
               message : " Content required and must be less than 200 characters",
          })
          return ;
          } 

          // validate role 

          if ( role !== "user" && role !== "assistant") {
            res.status(422).json({
                message : " The message sender should be either an user or assistant ",
           })
           return ;
          }

      

       const chat = db.collection("chats").findOneAndUpdate({
        _id : objectId,
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