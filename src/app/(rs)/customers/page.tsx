import CustomerSearch from "@/app/(rs)/customers/CustomerSearch";
import { getCustomerSearchResults } from "@/lib/queries/getCustomerSearchResults";
import { db } from "@/db";

export const metadata = {
  title: "Customer Search",
};

type Props = {
  searchParams: Promise<{ [key: string]: string | undefined }>;
};

async function Customers({ searchParams }: Props) {
  const { searchText } = await searchParams;

  if (!searchText) return <CustomerSearch />;

  const results = await getCustomerSearchResults(searchText);

  return (
    <>
      <CustomerSearch />
      <p>{JSON.stringify(results)}</p>
    </>
  );
}

export default Customers;
