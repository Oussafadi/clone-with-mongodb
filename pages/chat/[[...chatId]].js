import Head from "next/head";
import { useState } from "react";

export default function Chat() {
   const [ message , setMessage] = useState("");

   const handleSubmit = (e) => {
        e.preventDefault() ;

   }

  return (
    <>
      <Head>
        <title>Clone with MongoDB</title>
      </Head>
     
     <div className="grid h-screen grid-col-[260px_1fr]">
          <div>

          </div>
          <div className=" flex flex-col bg-gray-600">
            <div className="flex-1">

            </div>
            <footer className="bg-gray-700 p-10 rounded-md ">
             <form onSubmit={handleSubmit} >
              <fieldset className="flex gap-2" disabled>
                <textarea placeholder="Message me ..." 
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
