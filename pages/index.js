'use client';
import Head from "next/head";
import { useUser } from '@auth0/nextjs-auth0/client';
import Link from "next/link";

export default function Home() {
  const {user,error,isLoading} = useUser();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;


  return (
    <div>
      <Head>
        <title>Next JS ChatGPT Starter</title>
      </Head>
      <h1>Welcome to the Next JS &amp; ChatGPT Starter</h1>
      { user && 
            <Link href="/api/auth/logout">
            Logout
            </Link>
      }
      { !user && 
            <Link href="/api/auth/login">
            Login</Link>
      }
    </div>
  );
}
