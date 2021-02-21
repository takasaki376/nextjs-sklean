import Head from "next/head";
import { ReactNode } from "react";

interface Props {
  children: ReactNode;
  title: string;
}

const Layout = ({ children, title = "Default title" }: Props) => {
  return (
    <div className="flex justify-center items-center flex-col min-h-screen text-white font-mono bg-gray-100 ">
      <Head>
        <title>{title}</title>
      </Head>
      <main className="flex flex-1 justify-center items-center w-screen flex-col">
        {children}
      </main>
    </div>
  );
};

export default Layout;
