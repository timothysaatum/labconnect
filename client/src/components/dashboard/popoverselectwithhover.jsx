import React from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
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
import HoverCardDetails from "../hovercarddetails";

const PopoverSelectwithhover = ({
  form,
  label,
  items,
  loading,
  error,
  name,
  title,
  search,
  info,
}) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="">
          <FormLabel>{label}</FormLabel>
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant="outline"
                  role="combobox"
                  className={cn(
                    "w-full justify-between",
                    !field.value && "text-muted-foreground"
                  )}
                >
                  {field.value
                    ? items?.data?.find((option) => option.id === field.value)
                        ?.name
                    : label}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-popover-content-width-same-as-its-trigger max-h-popover-content-width-same-as-its-trigger">
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
                    {items?.data?.map((item) => (
                      <HoverCardDetails
                        key={item.id}
                        option={item.id}
                        items={items?.data}
                        title={title}
                      >
                        <CommandItem
                          onSelect={() => {
                            form.setValue(name, item.id);
                            form.clearErrors(name);
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
                          {title === "Laboratories"
                            ? item.laboratory + " " + "|" + " " + item.name
                            : title === "Branches"
                            ? item.name
                            : item.name}
                        </CommandItem>
                      </HoverCardDetails>
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

export default PopoverSelectwithhover;
