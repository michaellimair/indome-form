import { FC } from "react";
import Head from 'next/head'

export const PageContainer: FC<any> = ({ children }) => (
  <div className="flex min-h-screen flex-col items-center w-full">
    <Head>
      <title>Registration | InDome 2022 - Roof Rave Party</title>
      <link rel="icon" href="/favicon.ico" />
    </Head>

    <main className="flex w-full flex-1 flex-col items-center text-left max-w-8xl">
      <img
        src="/roofrave-banner.png"
        height={200}
        className="w-full max-w-7xl"
        alt="InDome Roof Rave 2022"
      />
      <div className="w-full px-8 max-w-7xl">
        {children}
      </div>
    </main>

    <footer className="flex h-24 w-full items-center justify-center border-t mt-4">
      InDome 2022
    </footer>
  </div>
)