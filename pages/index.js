'use client';
import Head from "next/head";
import { useUser } from '@auth0/nextjs-auth0/client';
import Link from "next/link";
import { getSession } from "@auth0/nextjs-auth0";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRobot } from "@fortawesome/free-solid-svg-icons";

export default function Home() {
  const {user,error,isLoading} = useUser();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;


  return (
    <>
      <Head>
        <title>Clone with MongoDB</title>
      </Head>
      <div className="flex  justify-center items-center  min-h-screen w-full text-white bg-gray-700 ">
        <div>
          <div>
          <FontAwesomeIcon icon={faRobot} className="text-emerald-200 text-6xl " />
          </div>
          <h1 className="text-4xl font-bold"> Welcome to OpenAI Clone</h1>
          <p className="text-lg"> Log in to start talking</p>
          <div className="mt-4 flex justify-center gap-3">
            { !!user && 
                  <Link href="/api/auth/logout">
                  Logout
                  </Link>
            }
            { !user && 
              <>
                  <Link href="/api/auth/login" className=" btn ">
                  Login</Link>
                  <Link href="/api/auth/sign" className=" btn " >
                  Sign Up</Link>
                </>
            }
          </div>
        </div>
      </div>
    </>
  );
}

export const getServerSideProps = async (ctx) => {
  const session = getSession(ctx.req , ctx.res);
  if(!!session) {
    return {
      redirect: {
        destination: "/chat"
      }
    };
  }

  return {
    props: {}
  };
};
