import { FC } from "react";
import Head from 'next/head'

export const PageContainer: FC<any> = ({ children }) => (
  <div className="flex min-h-screen flex-col items-center py-2">
    <Head>
      <title>Registration | InDome 2022 - Roof Rave Party</title>
      <link rel="icon" href="/favicon.ico" />
    </Head>

    <main className="flex w-full flex-1 flex-col items-center px-20 text-left  max-w-6xl">
      <h1 className="text-3xl md:text-6xl font-bold mt-2 mb-6 text-center">
        InDome 2022 - Roof Rave Party
      </h1>
      <img
        src="/header.png"
        height={200}
        className="w-full"
      />
      {children}
    </main>

    <footer className="flex h-24 w-full items-center justify-center border-t mt-4">
      InDome 2022
    </footer>
  </div>
)