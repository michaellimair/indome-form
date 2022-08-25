import { Table } from "flowbite-react";
import { FC } from "react";
import { IWaitlist } from "../global";
import { ExternalLink } from "./ExternalLink";

export const WaitlistTable: FC<{ waitlist: IWaitlist[] }> = ({ waitlist }) => {
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
      </Table.Head>
      <Table.Body className="divide-y">
        {waitlist?.map((item, index) => (
          <Table.Row key={item._id} className={`dark:border-gray-700 ${item.confirmed ? 'bg-green-200' : 'bg-amber-100'}`}>
            <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
              {index + 1}
            </Table.Cell>
            <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
              {item.name}
            </Table.Cell>
            <Table.Cell>
              {item.phone} {!!item.phone && (<ExternalLink target="_blank" rel="noopener noreferrer" href={`https://wa.me/${item.phone.replace('+', '')}`}>WhatsApp</ExternalLink>)}
            </Table.Cell>
            <Table.Cell>
              {!!item.email && <ExternalLink target="_blank" rel="noopener noreferrer" href={`mailto:${item.email}`}>{item.email}</ExternalLink>}
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
}