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
import { Badge } from "../ui/badge";

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
                  {!form.watch("to_laboratory") && title === "tests"
                    ? "please choose the lab to receive the sample first"
                    : loading
                    ? "Loading..."
                    : error
                    ? `Error loading ${title}`
                    : `No ${title} found`}
                </CommandEmpty>
                <CommandGroup>
                  {items && (
                    <span className="text-[12px] text-center text-muted-foreground block">
                      hover over tests for details
                    </span>
                  )}

                  <CommandList className="pt-2">
                    {items?.data
                      ?.filter((item) => item?.test_status === "active")
                      .map((item) => (
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
                            className="flex gap-5"
                          >
                            <div className="flex-grow flex">
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
                            </div>
                            {item?.discount_price && (
                              <Badge
                                // variant="secondary"
                                className="whitespace-nowrap tabular-nums min-w-16"
                              >
                                {parseFloat(
                                  (
                                    (item?.discount_price / item?.price) *
                                    100
                                  ).toFixed(1)
                                )}
                                % off
                              </Badge>
                            )}
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
