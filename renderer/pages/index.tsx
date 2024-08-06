import { useEffect } from "react";
import Link from "next/link";
import Layout from "../components/Layout";
import supabase from "../lib/supabase";
import Image from "next/image";

const IndexPage = () => {
  useEffect(() => {
    const handleMessage = (_event, args) => alert(args);

    // listen to the 'message' channel
    window.electron.receiveHello(handleMessage);

    return () => {
      window.electron.stopReceivingHello(handleMessage);
    };
  }, []);

  const onSayHiClick = () => {
    // window.electron.sayHello();
    window.ipcRenderer.send("print", {});
  };

  function handleCartonUpdate(payload) {
    const carton = payload.new;
    console.log("🎁", carton);
    window.ipcRenderer.send("print-carton", {
      serialNumber: carton.serial_number,
      product: carton.variants[0].name.split(",")[0],
      quantity: carton.varian,
    });
  }

  useEffect(function printOnCartonUpdate() {
    const channel = supabase.channel("cartons");
    channel
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "cartons" },
        handleCartonUpdate
      )
      .subscribe();

    return function unsubscribe() {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <Layout title="Hunt Wilson | Printer">
      <p className="text-red-700">test</p>
      <Image
        className="hidden ms-10"
        src="/images/logo.svg"
        alt=""
        width={100}
        height={100}
      />
      {/* <h1>Hello Next.js 👋</h1>
      <button onClick={onSayHiClick}>Say hi to electron</button>
      <p>
        <Link href="/about">About</Link>
      </p> */}
    </Layout>
  );
};

export default IndexPage;
