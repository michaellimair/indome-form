import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { Button, Table } from "flowbite-react";
import { FC, useState } from "react";
import { paymentMethods } from "../constants";
import { IOrder } from "../global";
import { exportOrdersToExcel } from "../utils/excel";
import { ExternalLink } from "./ExternalLink";

export const OrderTable: FC<{ orders: IOrder[]; token: string; onConfirm: () => void }> = ({ orders, token, onConfirm }) => {
  const [mutatingList, setMutatingList] = useState<Set<string>>(new Set<string>());
  const [progress, setProgress] = useState<number>();
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

  const deleteTicketMutation = useMutation(['admin', 'orders', 'delete', token], async (orderId: string) => {
    await axios.delete(`/api/admin/orders/${orderId}`, {
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

  const resendTicketMutation = useMutation(['admin', 'orders', 'resend-ticket', token], async (orderId: string) => {
    await axios.post(`/api/admin/orders/${orderId}/resend-ticket`, {}, {
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

  const sendAllTicketsMutation = useMutation(['admin', 'orders', 'send-all-tickets', token], async () => {
    for (let i = 0; i < orders.length; i++) {
      const order = orders[i];
      setProgress(i + 1);
      await axios.post(`/api/admin/orders/${order._id}/resend-ticket`, {}, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
    }
    onConfirm();
  }, {
    onMutate: () => {
      setMutatingList(new Set<string>((orders as IOrder[]).map((order) => order._id)));
    },
    onSettled: () => {
      setMutatingList(new Set<string>());
      setProgress(undefined);
    }
  });

  const downloadMutation = useMutation(['admin', 'orders', 'download'], () => exportOrdersToExcel(orders))

  return (
    <>
      <div className="mb-4 flex flex-row">
        <Button color="success" disabled={downloadMutation.isLoading} onClick={() => downloadMutation.mutate()}>
          Export to Excel
        </Button>
        <Button style={{ marginLeft: 16 }} disabled={sendAllTicketsMutation.isLoading} onClick={() => sendAllTicketsMutation.mutate()}>
          Send All Tickets
        </Button>
      </div>
      {sendAllTicketsMutation.isLoading && (
        <div>
          <p>Sending ticket email {progress}/{orders.length}</p>
        </div>
      )}
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
          {/* <Table.HeadCell>
            Confirmed
          </Table.HeadCell> */}
          <Table.HeadCell>
            {/* @ts-ignore */}
            <span className="sr-only">
              Confirm or Resend Confirmation
            </span>
          </Table.HeadCell>
          <Table.HeadCell>
            {/* @ts-ignore */}
            <span className="sr-only">
              Resend Ticket
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
                {paymentMethods.find((method) => method.name === order.paymentMethod)?.label} {!!order.paymentProofFileName && (<ExternalLink target="_blank" rel="noopener noreferrer" href={`/api/admin/orders/${order._id}/image?token=${order.imageToken}`}>Link</ExternalLink>)}
              </Table.Cell>
              {/* <Table.Cell>
                {order.confirmed ? 'Yes' : 'No'}
              </Table.Cell> */}
              <Table.Cell>
                <Button
                  disabled={(deleteTicketMutation.isLoading && mutatingList.has(order._id)) || !order.filled}
                  onClick={() => {
                    if (window.confirm(`Are you sure you want to delete the ticket of ${order.name}?`)) {
                      deleteTicketMutation.mutate(order._id)
                    }
                  }}
                  color="failure"
                >
                  Delete Ticket
                </Button>
              </Table.Cell>
              <Table.Cell>
                <Button
                  disabled={(confirmOrderMutation.isLoading && mutatingList.has(order._id)) || !order.filled}
                  onClick={() => confirmOrderMutation.mutate(order._id)}
                >
                  {order.confirmed ? 'Resend Confirmation' : 'Confirm'}
                </Button>
              </Table.Cell>
              <Table.Cell>
                <Button
                  color="success"
                  disabled={(resendTicketMutation.isLoading && mutatingList.has(order._id)) || !order.filled}
                  onClick={() => resendTicketMutation.mutate(order._id)}
                >
                  Resend Ticket
                </Button>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </>
  );
}