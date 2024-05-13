import { OpenAIEdgeStream } from "openai-edge-stream";

export const config = {
    runtime : 'edge' 
};

export default async function handle(req) {
    try {
   const  { message } = req.json() ;
   const initialChatMessage = {
    role : "system",
    content : "openai chat robot"
   }

   const response = await fetch(`${req.headers.get("origin")}/api/chat/newChat`, {
    method : 'POST',
    headers : {
      'content-type' : 'application/json',
       cookie : req.headers.get("cookie"),
    },
    body : JSON.stringify({
      message ,
    })
   }
   );
    const newChatResponse = await response.json();
    const chatId = newChatResponse._id;

    const stream = await OpenAIEdgeStream(
        'https://api.openai.com/v1/chat/completions',
        {
            headers: {
                'content-type': 'application/json',
                Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
            }
        ,
          method: 'POST',
            body: JSON.stringify({
                model: 'gpt-3.5-turbo',
                stream: true,
                messages:[initialChatMessage, { role: 'user', content: message }],
             } ) 
  
        },
         {
            onBeforeStream : async ({emit}) => {
                emit(chatId,"newChatId");
            }
         } ,
         {
            onAfterStream : async ({fullContent}) => {
            const updateChatResponse = await fetch(`${req.headers.get("origin")}/api/chat/addMessageToChat`, {
                method : "POST",
                headers : {
                    'content-type': 'application/json',
                     cookie : req.headers.get("cookie"),
                },
                body : JSON.stringify( {
                    chatId,
                    role : "assistant" , 
                    content : fullContent ,
                })
                
            })
            }
        }
    )
     return new Response(stream);
     
    } catch(e) {
        console.log("An Error occured while sending the message" , e);
    }
}