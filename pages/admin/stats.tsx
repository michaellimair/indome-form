import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Spinner } from "flowbite-react";
import { NextPage } from "next";
import { useState } from "react";
import { TokenInput } from "../../components/TokenInput";
import { IStatistics } from "../../global";

const AdminStatsPage: NextPage = () => {
  const [token, setToken] = useState<string>();
  const { data: statistics, isFetching, refetch, isError } = useQuery(['admin', 'stats', token], () => {
    return axios.get<IStatistics>('/api/admin/stats', {
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
      <h2 className="font-bold mt-2 ml-3">Event Statistics</h2>
      {isFetching && (
        <Spinner />
      )}
      {!isFetching && isError && (
        <p className="text-center text-red-600 font-bold">Unable to fetch statistics!</p>
      )}
      {!isFetching && statistics && (
        <div className="px-3">
          <p className="mt-2">Total Attendees: {statistics.totalAttendees}</p>
          <p className="mt-2">Checked In Attendees: {statistics.checkedInAttendees}</p>
        </div>
      )}
    </div>
  );
}

export default AdminStatsPage;
