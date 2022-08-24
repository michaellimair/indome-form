import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { Button, Table } from "flowbite-react";
import { FC, useState } from "react";
import { paymentMethods } from "../constants";
import { IOrder } from "../global";
import { ExternalLink } from "./ExternalLink";

export const OrderTable: FC<{ orders: IOrder[]; token: string; onConfirm: () => void }> = ({ orders, token, onConfirm }) => {
  const [mutatingList, setMutatingList] = useState<Set<string>>(new Set<string>());
  const confirmOrderMutation = useMutation(['admin', 'orders', 'confirm', token], async (orderId: string) => {
    await axios.post(`/api/admin/orders/${orderId}/confirm`, {}, {
      headers: {
        authorization: `Bearer ${token}`,
      },
    });
    onConfirm();
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
              {order.phone} {!!order.phone && (<ExternalLink target="_blank" rel="noopener noreferrer" href={`https://wa.me/${order.phone.replace('+', '')}`}>WhatsApp</ExternalLink>)}
            </Table.Cell>
            <Table.Cell>
              {!!order.email && <ExternalLink target="_blank" rel="noopener noreferrer" href={`mailto:${order.email}`}>{order.email}</ExternalLink>}
            </Table.Cell>
            <Table.Cell>
              HKD {(order.price / 100).toFixed(0)}
            </Table.Cell>
            <Table.Cell>
              {paymentMethods.find((method) => method.name === order.paymentMethod)?.label} {!!order.paymentProofUrl && (<ExternalLink target="_blank" rel="noopener noreferrer" href={order.paymentProofUrl}>Link</ExternalLink>)}
            </Table.Cell>
            <Table.Cell>
              {order.confirmed ? 'Yes' : 'No'}
            </Table.Cell>
            <Table.Cell>
              {<Button
                disabled={(confirmOrderMutation.isLoading && mutatingList.has(order._id)) || !order.filled}
                onClick={() => confirmOrderMutation.mutate(order._id)}
              >
                {order.confirmed ? 'Resend Email' : 'Confirm'}
              </Button>}
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
}