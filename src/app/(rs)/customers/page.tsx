import CustomerSearch from "@/app/(rs)/customers/CustomerSearch";
import { getCustomerSearchResults } from "@/lib/queries/getCustomerSearchResults";
import * as Sentry from "@sentry/nextjs";
import CustomerTable from "@/app/(rs)/customers/CustomerTable";

export const metadata = {
  title: "Customer Search",
};

type Props = {
  searchParams: Promise<{ [key: string]: string | undefined }>;
};

async function Customers({ searchParams }: Props) {
  const { searchText } = await searchParams;

  if (!searchText) return <CustomerSearch />;

  const span = Sentry.startInactiveSpan({
    name: "getCustomerSearchResults-v2",
  });
  const results = await getCustomerSearchResults(searchText);
  span.end();

  return (
    <>
      <CustomerSearch />
      {results.length ? (
        <CustomerTable data={results} />
      ) : (
        <p className="mt-4">No customers found</p>
      )}
    </>
  );
}

export default Customers;
