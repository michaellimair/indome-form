import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Button, Label, Spinner, Table, TextInput } from "flowbite-react";
import { NextPage } from "next";
import { FC, useState } from "react";
import { ExternalLink } from "../../components/ExternalLink";
import { OrderTable } from "../../components/OrderTable";
import { paymentMethods } from "../../constants";
import { IOrder } from "../../global";

const TokenInput: FC<{ onChange: (token: string) => void }> = ({
  onChange
}) => {
  const [token, setToken] = useState<string>();

  return (
    <form className="p-3 block" onSubmit={(e) => {
      e.preventDefault();
      if (token) {
        onChange(token)
      }
    }}>
      <Label htmlFor="token">Token</Label>
      <TextInput name="token" id="token" type="password" autoComplete="password" value={token} onChange={(e) => setToken(e.target.value)} />
      <Button type="submit" style={{ marginTop: 16 }} disabled={!token}>
        Set Authentication Token
      </Button>
    </form>
  )
}

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
