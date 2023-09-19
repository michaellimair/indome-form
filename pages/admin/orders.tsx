import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Spinner } from "flowbite-react";
import { NextPage } from "next";
import { useState } from "react";
import { OrderTable } from "../../components/OrderTable";
import { TokenInput } from "../../components/TokenInput";
import { IOrder } from "../../global";
import { formatCurrency } from "../../utils/currency";
import Head from 'next/head';
import { eventName } from "../../constants";

const AdminOrdersPage: NextPage = () => {
  const [token, setToken] = useState<string>();
  const { data: orders, isFetching, refetch, isError } = useQuery(['admin', 'orders', token], () => {
    return axios.get<IOrder[]>('/api/admin/orders', {
      headers: {
        authorization: `Bearer ${token}`,
      }
    }).then((r) => r.data)
  }, {
    enabled: !!token,
    retry: false,
  });

  const { data: pendingOrders, isFetching: isFetchingPendingOrders, isError: isPendingOrdersError, refetch: refetchPending } = useQuery(['admin', 'orders', 'pending', token], () => {
    return axios.get<IOrder[]>('/api/admin/orders', {
      params: {
        pending: true,
      },
      headers: {
        authorization: `Bearer ${token}`,
      }
    }).then((r) => r.data)
  }, {
    enabled: !!token,
    retry: false,
  });

  return (
    <div className="py-3 max-w-7xl mx-auto">
      <Head>
        <title>InDome Admin Page</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" />
      </Head>
      <h1 className="px-3 text-3xl font-bold text-center">{eventName}</h1>
      <TokenInput onChange={(t) => {
        setToken(t);
        refetch();
        refetchPending();
      }} />
      <p className="p-3">If you are not able to open the image from the table below, please click the "Set Authentication Token" button above again.</p>
      <h2 className="font-bold mt-2 ml-3">Completed Orders</h2>
      <div className="p-3 text-center">
        {!isFetching && orders && (
          <OrderTable orders={orders} onConfirm={() => refetch()} token={token!} />
        )}
        {isFetching && (
          <Spinner />
        )}
        {!isFetching && isError && (
          <p className="text-center text-red-600 font-bold">Unable to fetch list of orders!</p>
        )}
        {!isFetching && orders && (
          <p className="mt-2 font-bold text-right text-xl">Total Revenue: {formatCurrency(orders.reduce<number>((acc, order) => acc + order.price / 100, 0))}</p>
        )}
      </div>
      <h2 className="font-bold mt-2 ml-3">Pending Orders</h2>
      <p className="px-3">Pending orders are orders which are not expired (the user is still filling in the form). A price tier (first release, second release, etc.) is assigned to an order when it is created.</p>
      <div className="p-3 text-center">
        {!isFetchingPendingOrders && !!pendingOrders?.length && (
          <OrderTable orders={pendingOrders} onConfirm={() => refetch()} token={token!} />
        )}
        {!isFetchingPendingOrders && pendingOrders && !pendingOrders.length && (
          <p className="text-center font-bold">There are no pending orders</p>
        )}
        {isFetchingPendingOrders && (
          <Spinner />
        )}
        {!isFetchingPendingOrders && isPendingOrdersError && (
          <p className="text-center text-red-600 font-bold">Unable to fetch list of pending orders!</p>
        )}
      </div>
    </div>
  );
}

export default AdminOrdersPage;
