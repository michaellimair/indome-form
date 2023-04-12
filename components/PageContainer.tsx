import { FC } from "react";
import Head from 'next/head'

export const PageContainer: FC<any> = ({ children }) => (
  <div className="flex min-h-screen flex-col items-center w-full dark:bg-black dark:text-white">
    <Head>
      <title>Registration | InDome 2023 - Euphoria</title>
      <link rel="icon" href="/favicon.ico" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" />
    </Head>

    <main className="flex w-full flex-1 flex-col items-center text-left max-w-8xl">
      <img
        src="/euphoria-banner.png"
        height={200}
        className="w-full max-w-7xl"
        alt="InDome 2023 - Euphoria"
      />
      <div className="w-full px-8 max-w-7xl">
        {children}
      </div>
    </main>

    <footer className="flex h-24 w-full items-center justify-center border-t mt-4">
      InDome 2023
    </footer>
  </div>
)