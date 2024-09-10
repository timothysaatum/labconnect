import React, { useState } from "react";
import { FormControl, FormField, FormItem, FormLabel } from "./ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useSelector } from "react-redux";
import { selectActiveBranch } from "@/redux/branches/activeBranchSlice";

const PopoverSelect = ({
  form,
  label,
  items,
  loading,
  error,
  name,
  title,
  search,
  info,
  ...rest
}) => {
  const [open, setOpen] = useState(false);
  const activeBranch = useSelector(selectActiveBranch);

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem {...rest}>
          <FormLabel>{label}</FormLabel>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant="outline"
                  role="combobox"
                  className={cn(
                    "w-full justify-between max-w-full",
                    !field.value && "text-muted-foreground"
                  )}
                >
                  {field.value
                    ? title === "Laboratories"
                      ? items?.data?.find((option) => option.id === field.value)
                          ?.name
                      : title === "Branches"
                        ? items?.data?.find(
                            (option) => option.id === field.value
                          )?.name
                        : items?.data?.find(
                            (option) => option.id === field.value
                          )?.name
                    : label}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-popover-content-width-same-as-its-trigger max-h-pop">
              <Command loop>
                <CommandInput placeholder={search} />
                <CommandEmpty>
                  {loading
                    ? "Loading..."
                    : error
                      ? `Error loading ${title}`
                      : `No ${title} found`}
                </CommandEmpty>
                <CommandGroup>
                  <CommandList>
                    {items?.data
                      ?.filter((item) => item.id !== activeBranch)
                      .map((item) => (
                        <CommandItem
                          key={item.id}
                          onSelect={() => {
                            form.setValue(name, item.id);
                            form.clearErrors(name);
                            setOpen(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              item.id === field.value
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />

                          {item.name}
                        </CommandItem>
                      ))}
                  </CommandList>
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
        </FormItem>
      )}
    />
  );
};

export default PopoverSelect;
