import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function SelectComponent({
  items,
  placeholder,
  name,
  control,
  label,
  message = null,
  description = null,
  empty,
  ...rest
}) {
  return (
    <FormField
      name={name}
      control={control}
      render={({ field }) => (
        <FormItem {...rest}>
          <FormLabel>{label}</FormLabel>
          <Select
            onValueChange={field.onChange}
            defaultValue={field.value}
            value={field.value}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder={placeholder} className="" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {items?.length > 0 ? (
                items?.map((item) => (
                  <SelectItem value={item.value} key={item.value}>
                    {item.label}
                  </SelectItem>
                ))
              ) : (
                <SelectItem className="whitespace-wrap">{empty || "no items to choose from"}</SelectItem>
              )}
            </SelectContent>
          </Select>
          {message && <FormMessage />}
          {description && <FormDescription>{description}</FormDescription>}
        </FormItem>
      )}
    />
  );
}
