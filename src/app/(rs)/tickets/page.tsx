import TicketSearch from "@/app/(rs)/tickets/TicketSearch";
import { getOpenTickets } from "@/lib/queries/getOpenTickets";
import { getTicketSearchResults } from "@/lib/queries/getTicketSearchResults";

export const metadata = {
  title: "Ticket Search",
};

type Props = {
  searchParams: Promise<{ [key: string]: string | undefined }>;
};

async function Tickets({ searchParams }: Props) {
  const { searchText } = await searchParams;

  if (!searchText) {
    const results = await getOpenTickets();

    return (
      <>
        <TicketSearch />
        <p>{JSON.stringify(results)}</p>
      </>
    );
  }

  const results = await getTicketSearchResults(searchText);

  return (
    <>
      <TicketSearch />
      <p>{JSON.stringify(results)}</p>
    </>
  );
}

export default Tickets;
