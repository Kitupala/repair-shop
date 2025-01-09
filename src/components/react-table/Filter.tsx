import { Column } from "@tanstack/react-table";
import { DebouncedInput } from "@/components/react-table/DebouncedInput";

type FilterProps<T> = {
  column: Column<T, unknown>;
  filteredRows: string[];
};

export default function Filter<T>({ column, filteredRows }: FilterProps<T>) {
  const columnFilterValue = column.getFilterValue();
  const uniqueFilteredValues = new Set(filteredRows);
  const sortedUniqueValues = Array.from(uniqueFilteredValues).sort();

  return (
    <>
      <datalist id={column.id + "list"}>
        {sortedUniqueValues.map((value, i) => (
          <option key={`${i}-${column.id}`} value={value} />
        ))}
      </datalist>
      <DebouncedInput
        type="text"
        value={(columnFilterValue ?? "") as string}
        onChange={(value) => column.setFilterValue(value)}
        placeholder={`Search... (${uniqueFilteredValues.size})`}
        list={column.id + "list"}
        className="my-1 w-full rounded border shadow"
      />
    </>
  );
}
