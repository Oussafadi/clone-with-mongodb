import Link from "next/link"
import { useEffect, useState } from "react"

export const SideBar = ({}) => {
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
     
    }, []);

 return (
    <div className=" flex flex-col  bg-gray-800  text-emerald-500 font-bold ">
     <div className="flex-1 ">
       {
        chats.map(chat => (
         <div key={chat._id} className="text-white font-bold">
          {chat.title}
         </div>
        ))
       }
     </div>
    <Link href="/api/auth/logout"> Logout </Link>
    </div>
    )
}