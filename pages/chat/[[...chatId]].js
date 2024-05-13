import { SideBar } from "components";
import { Message } from "components/Message";
import Head from "next/head";
import { streamReader } from "openai-edge-stream";
import { useState } from "react";
import { v4 as uuid} from "uuid" ;

export default function Chat() {
   const [message , setMessage] = useState("");
   const [incomingMessage, setIncomingMessage] = useState("");
   const [chatMessages , setChatMessages] = useState([]);
   const [generatingResponse, setGeneratingResponse] = useState(false);

   const handleSubmit = async (e) => {
        e.preventDefault() ;
        setGeneratingResponse(true);
        setChatMessages( prev => {
          const chatMessages = [...prev, {
            _id : uuid(),
            role : 'user',
            content : message ,
          }];
          return chatMessages;
        })
       

      /*  This Api uses Edge function 
        const response = await fetch('/api/chat/sendMessage', {
            method : 'POST',
            headers : {
              'content-type' : 'application/json'
            },
             body : JSON.stringify({
              message : message
             })
        });
          const data = response.body;
        if (!data) {
          return;
        }
        const reader = data.getReader();
        await streamReader(reader , (message) => {
          setIncomingMessage( s => `${s}${message.content}`);
        })
       
        */

         /* This one without Edge function */
         const response = await fetch('/api/chat/newChat', {
          method : 'POST',
          headers : {
            'content-type' : 'application/json',
          },
          body : JSON.stringify({
            message : message ,
          })
         }
         );
        
         const data = await response.json();
       //  console.log('New Chat :', data);


        setMessage("");
        setGeneratingResponse(false);
       
   }

  return (
    <>
      <Head>
        <title>Clone with MongoDB</title>
      </Head>
     
     <div className="grid h-screen grid-cols-[260px_1fr] ">
          
           <SideBar  />
         
          <div className=" flex flex-col bg-gray-600 overflow-hidden">
            <div className="flex-1 text-white overflow-scroll ">
              {
                chatMessages.map(message => (
                   <Message key={message._id} role={message.role} content={message.content} />
                ))
              }
              { !!incomingMessage && (
              <Message role="assistant" content={incomingMessage} />
              )}
            </div>
            <footer className="bg-gray-700 p-10 rounded-md ">
             <form onSubmit={handleSubmit} >
              <fieldset className="flex gap-2" disabled={generatingResponse}>
                <textarea placeholder={generatingResponse ? "" : "Message me ..."}
                  value={message}
                  onChange={(e) => { setMessage(e.target.value)}}
                  className=" w-full resize-none rounded-md bg-gray-600 p-2 text-white focus:border-emerald-500 focus:bg-gray-500 focus:outline focus:outline-emerald-500 " />
                <button className=" btn ">
                  Send
                </button>
              </fieldset>
             </form>
            </footer>
          </div>
     </div>
    </>
  );
}
