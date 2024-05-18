import { OpenAIEdgeStream } from "openai-edge-stream";

export const config = {
    runtime : 'edge' 
};

export default async function handle(req) {
    try {
   const  { message ,chatId : chatIdFromParam } = req.json() ;
     
     // validation
     if( !message || typeof message !== "String" || message.length > 200) {
      return new Response({
        message : "Message must be less than 200 characters"
      }, 
        {
        status : 422 ,

      })
     }

   let chatId = chatIdFromParam;
   const initialChatMessage = {
    role : "system",
    content : "openai chat robot"
   }
     let newChatId;

   if(chatId) {
     // add message to existing chat
      const response = await fetch( `${req.headers.get("origin")}/api/chat/addMessageToChat`, {
        method : 'POST',
        headers : {
          'content-type' : 'application/json',
           cookie : req.headers.get("cookie"),
        },
        body : JSON.stringify({
          chatId ,
          role : "user",
          content : message,
        })
       }) ;

       const json = await response.json();
       chatMessages = json.chat.messages || [];


   }else {
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
     chatId = newChatResponse._id;
     newChatId = newChatResponse._id;
     chatMessages = json.chat.messages || [];
}

    const messagesToInclude = [];
    chatMessages.reverse();
    let usedTokens = 0 ;
    for ( let chatMessage of chatMessages ) {
      const messageTokens = chatMessage.content.length / 4 ;
      usedTokens = usedTokens + messageTokens ;
      if ( usedTokens <= 2000 ) {
        messagesToInclude.push(chatMessage);
      }else {
        break;
      }
    }

     messagesToInclude.reverse();

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
                messages:[initialChatMessage, ...messagesToInclude],
             } ) 
  
        },
         {
            onBeforeStream : async ({emit}) => {
                if(newChatId) {
                emit(chatId,"newChatId");
                }
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
      return new Response({
        message : "An Error occured while sending the message"
      }, 
        {
        status : 500 ,

      })
        //console.log("An Error occured while sending the message" , e);
    }
}