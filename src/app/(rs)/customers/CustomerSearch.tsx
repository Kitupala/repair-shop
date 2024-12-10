import Form from "next/form";
import { Input } from "@/components/ui/input";
import SearchButton from "@/components/SearchButton";

const CustomerSearch = () => {
  return (
    <Form action="/customers" className="flex items-center gap-2">
      <Input
        name="searchText"
        type="text"
        placeholder="Search customer"
        className="w-full"
      />
      <SearchButton />
    </Form>
  );
};

export default CustomerSearch;
