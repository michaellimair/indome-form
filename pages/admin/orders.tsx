import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Button, Label, Spinner, Table, TextInput } from "flowbite-react";
import { NextPage } from "next";
import { FC, useState } from "react";
import { ExternalLink } from "../../components/ExternalLink";
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
  const [mutatingList, setMutatingList] = useState<Set<string>>(new Set<string>());
  const confirmOrderMutation = useMutation(['admin', 'orders', 'confirm', token], async (orderId: string) => {
    await axios.post(`/api/admin/orders/${orderId}/confirm`, {}, {
      headers: {
        authorization: `Bearer ${token}`,
      },
    });
    await refetch();
  }, {
    onMutate: (orderId) => {
      setMutatingList((l) => {
        l.add(orderId);
        return l;
      });
    },
    onSettled: (_, __, orderId) => {
      setMutatingList((l) => {
        l.delete(orderId);
        return l;
      });
    }
  });

  return (
    <>
      <TokenInput onChange={(t) => {
        setToken(t);
        refetch();
      }} />
      <p className="p-3">If you are not able to open the image from the table below, please click the "Set Authentication Token" button above again.</p>
      <div className="p-3 mt-2 text-center">
        {!isFetching && orders && (
          <Table>
            <Table.Head>
              <Table.HeadCell>
                No
              </Table.HeadCell>
              <Table.HeadCell>
                Name
              </Table.HeadCell>
              <Table.HeadCell>
                Phone
              </Table.HeadCell>
              <Table.HeadCell>
                Email
              </Table.HeadCell>
              <Table.HeadCell>
                Price
              </Table.HeadCell>
              <Table.HeadCell>
                Payment Method
              </Table.HeadCell>
              <Table.HeadCell>
                Confirmed
              </Table.HeadCell>
              <Table.HeadCell>
                {/* @ts-ignore */}
                <span className="sr-only">
                  Confirm
                </span>
              </Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {orders?.map((order, index) => (
                <Table.Row key={order._id} className={`dark:border-gray-700 ${order.confirmed ? 'bg-green-200' : 'bg-amber-100'}`}>
                  <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                    {index + 1}
                  </Table.Cell>
                  <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                    {order.name}
                  </Table.Cell>
                  <Table.Cell>
                    {order.phone} (<ExternalLink target="_blank" rel="noopener noreferrer" href={`https://wa.me/${order.phone.replace('+', '')}`}>WhatsApp</ExternalLink>)
                  </Table.Cell>
                  <Table.Cell>
                    <ExternalLink target="_blank" rel="noopener noreferrer" href={`mailto:${order.email}`}>{order.email}</ExternalLink>
                  </Table.Cell>
                  <Table.Cell>
                    HKD {(order.price / 100).toFixed(0)}
                  </Table.Cell>
                  <Table.Cell>
                    {paymentMethods.find((method) => method.name === order.paymentMethod)?.label} (<ExternalLink target="_blank" rel="noopener noreferrer" href={order.paymentProofUrl}>Link</ExternalLink>)
                  </Table.Cell>
                  <Table.Cell>
                    {order.confirmed ? 'Yes' : 'No'}
                  </Table.Cell>
                  <Table.Cell>
                    <Button
                      disabled={confirmOrderMutation.isLoading && mutatingList.has(order._id)}
                      onClick={() => confirmOrderMutation.mutate(order._id)}
                    >
                      Confirm
                    </Button>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        )}
        {isFetching && (
          <Spinner />
        )}
        {!isFetching && isError && (
          <p className="text-center text-red-600 font-bold">Unable to fetch list of orders!</p>
        )}
      </div>
    </>
  );
}

export default AdminOrdersPage;
