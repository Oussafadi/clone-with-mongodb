'use client';
import Head from "next/head";
import { useUser } from '@auth0/nextjs-auth0/client';
import Link from "next/link";
import { getSession } from "@auth0/nextjs-auth0";

export default function Home() {
  const {user,error,isLoading} = useUser();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;


  return (
    <>
      <Head>
        <title>Clone with MongoDB</title>
      </Head>
      <div className="flex justify-center items-center  min-h-screen w-full text-white bg-gray-700 ">
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
