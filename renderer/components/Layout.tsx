import React, { ReactNode } from "react";
import Link from "next/link";
import Head from "next/head";

type Props = {
  children: ReactNode;
  title?: string;
};

const Layout = ({ children, title = "Hunt Wilson | Printer" }: Props) => (
  <div>
    <Head>
      <title>{title}</title>
      <meta charSet="utf-8" />
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
    </Head>
    <header>
      {/* <nav>
        <Link href="/">Home</Link> | <Link href="/about">About</Link> |{" "}
        <Link href="/initial-props">With Initial Props</Link>
      </nav> */}
    </header>
    {children}
    <footer>
      <hr />
      <span>
        This application monitors real-time updates to cartons data and prints
        summaries of any additions or updates.
      </span>
    </footer>
  </div>
);

export default Layout;
