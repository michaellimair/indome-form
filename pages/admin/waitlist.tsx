import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Spinner } from "flowbite-react";
import { NextPage } from "next";
import { useState } from "react";
import { TokenInput } from "../../components/TokenInput";
import { WaitlistTable } from "../../components/WaitlistTable";
import { IWaitlist } from "../../global";

const AdminWaitlistPage: NextPage = () => {
  const [token, setToken] = useState<string>();
  const { data: waitlist, isFetching, refetch, isError } = useQuery(['admin', 'waitlist', token], () => {
    return axios.get<IWaitlist[]>('/api/admin/waitlist', {
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
      }} />
      <h2 className="font-bold mt-2 ml-3">Waitlist</h2>
      <div className="p-3 text-center">
        {!isFetching && waitlist && (
          <WaitlistTable waitlist={waitlist} />
        )}
        {isFetching && (
          <Spinner />
        )}
        {!isFetching && isError && (
          <p className="text-center text-red-600 font-bold">Unable to fetch waitlist!</p>
        )}
      </div>
    </div>
  );
}

export default AdminWaitlistPage;
