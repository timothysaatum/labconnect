import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import HoverCardDetails from "../hovercarddetails";

export default function SelectComponent({
  items,
  placeholder,
  name,
  control,
  label,
}) {
  return (
    <FormField
      name={name}
      control={control}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <Select
            onValueChange={field.onChange}
            defaultValue={field.value}
            value={field.value}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {items.map((item) => (
                <HoverCardDetails option={item.value} items={item}>
                  <SelectItem value={item.value} key={item.value}>
                    {item.label}
                  </SelectItem>
                </HoverCardDetails>
              ))}
            </SelectContent>
          </Select>
        </FormItem>
      )}
    />
  );
}
