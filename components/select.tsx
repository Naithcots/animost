import {
  Select as RadixSelect,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SelectProps {
  name: string;
  value: string;
  setValue: (a: any) => void;
  items: { name: string; value: string }[];
  disabled: boolean;
}

const Select = ({ name, value, items, setValue, disabled }: SelectProps) => {
  return (
    <RadixSelect disabled={disabled} defaultValue={value} onValueChange={(val) => setValue(val)}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder={name} />
      </SelectTrigger>
      <SelectContent>
        {items.map((item) => (
          <SelectItem value={item.value} key={item.value}>
            {item.name}
          </SelectItem>
        ))}
      </SelectContent>
    </RadixSelect>
  );
};
export default Select;
