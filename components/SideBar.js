import { faMessage, faPlus, faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link"
import { useEffect, useState } from "react"

export const SideBar = ({chatId}) => {
     const [chats,setChats] = useState([]);

    useEffect(() => {
      const getChats = async () => {
        try {
        const call = await fetch('/api/chat/getChatList',
        {
            method: "GET",
        });
        const {chats} = await call.json();
      //  console.log("User chats" , chats);
       setChats(chats);
        }catch(e) {
            console.log("error occured fetching chats",e);
        }}
      getChats();
     
    }, [chatId]);

 return (
    <div className=" flex flex-col overflow-hidden bg-gray-700  text-emerald-500 font-bold ">
     <Link href="/chat" className="side-bar-item bg-emerald-500 hover:bg-emerald-600" > 
      <FontAwesomeIcon icon={faPlus}/> New Chat 
     </Link>
     <div className="flex-1 overflow-auto bg-gray-800 ">
       {
        chats.map(chat => (
         <Link href={`/chat/${chat._id}`} key={chat._id}
          className={`side-bar-item ${chatId === chat._id ? "bg-gray-700 hover:bg-gray-700" : ""} `}>
         <FontAwesomeIcon icon={faMessage}/>  {chat.title}
         </Link>
        ))
       }
     </div>
    <Link href="/api/auth/logout" className="side-bar-item">
    <FontAwesomeIcon icon={faRightFromBracket}/> Logout 
    </Link>
    </div>
    )
}