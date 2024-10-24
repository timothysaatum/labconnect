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
import { cn } from "@/lib/utils";

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
              <SelectTrigger
                className={cn(
                  "text-muted-foreground",
                  field?.value && "text-black dark:text-white"
                )}
              >
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {items?.length > 0 ? (
                items?.map((item, index) => (
                  <SelectItem value={item.value} key={index}>
                    {item.label}
                  </SelectItem>
                ))
              ) : (
                <p className="whitespace-wrap  px-4 flex justify-center items-center text-muted-foreground text-sm">
                  {empty || "no items to choose from"}
                </p>
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
