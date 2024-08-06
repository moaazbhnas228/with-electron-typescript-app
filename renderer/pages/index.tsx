import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import supabase from "../lib/supabase";
import { RealtimePostgresUpdatePayload } from "@supabase/supabase-js";
import { Tables } from "../interfaces/Database";
import _ from "lodash";

const IndexPage = () => {
  const [carton, setCarton] = useState<Tables<"cartons"> | null>(null);
  console.log("📦", carton);

  function handleCartonUpdate(
    payload: RealtimePostgresUpdatePayload<{
      [key: string]: any;
    }>
  ) {
    const carton = payload.new as Tables<"cartons">;
    setCarton(carton);
    window.ipcRenderer.send("print-carton", {
      serialNumber: carton.serial_number,
      product: carton.variants[0].name.split(",")[0],
      quantity: _.sumBy(carton.variants as any, "quantity"),
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
      {carton ? (
        <div>
          <h1>
            <b>Carton</b>: <code>{carton.serial_number}</code>
          </h1>
          <p>
            <b>Product</b>: {carton.variants[0].name.split(",")[0]}
          </p>
          <p>
            <b>Quantity</b>: {_.sumBy(carton.variants as any, "quantity")}
          </p>
        </div>
      ) : (
        <></>
      )}
    </Layout>
  );
};

export default IndexPage;
