import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Button, Label, Spinner, Table, TextInput } from "flowbite-react";
import { NextPage } from "next";
import { FC, useState } from "react";
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
  const { data: orders, isFetching, refetch } = useQuery(['admin', 'orders', token], () => {
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
      <TokenInput onChange={setToken} />
      <p className="p-3">If you are not able to open the image from the table below, please refresh the page and set the authentication token again.</p>
      <div className="p-3 mt-2">
        <Table>
          <Table.Head>
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
              Payment Proof
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
            {!isFetching ? orders?.map((order) => (
              <Table.Row key={order._id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                  {order.name}
                </Table.Cell>
                <Table.Cell>
                  {order.phone}
                </Table.Cell>
                <Table.Cell>
                  {order.email}
                </Table.Cell>
                <Table.Cell>
                  HKD {(order.price / 100).toFixed(2)}
                </Table.Cell>
                <Table.Cell>
                  {paymentMethods.find((method) => method.name === order.paymentMethod)?.label}
                </Table.Cell>
                <Table.Cell>
                  <a href={order.paymentProofUrl} target="_blank" className="font-medium text-blue-600 hover:underline dark:text-blue-500" rel="noopener noreferrer">Link</a>
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
            )) : (
              <Spinner
                className="p-4"
                color="info"
                aria-label="Loading Orders"
              />          
            )}
          </Table.Body>
        </Table>
      </div>
    </>
  );
}

export default AdminOrdersPage;
