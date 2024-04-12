import * as React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { ChevronDown } from "lucide-react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { useMediaQuery } from "@/hooks/use-media-query";

export default function LabelDropdown({
  labels,
  setLabel,
  label,
  menusize,
  name,
  formlabel,
  placeholder,
}) {
  const [open, setOpen] = React.useState(false);

  const isMobile = useMediaQuery("(min-width: 640px)");
  return (
    <div>
      <FormField
        name={name}
        render={({ field }) => (
          <FormItem>
            <FormLabel>{formlabel}</FormLabel>
            <FormControl className="">
              <div className="relative">
                <Input
                  type="numeric"
                  placeholder={placeholder}
                  autoComplete="off"
                  maxLength={3}
                  {...field}
                  />
                <DropdownMenu open={open} onOpenChange={setOpen}>
                  <DropdownMenuTrigger
                    asChild
                    className="absolute right-0 top-0 h-full"
                  >
                    <Label variant="ghost">
                      <Badge
                        variant="outline"
                        className="min-w-10 h-full text-xs rounded-e-sm"
                      >
                        {isMobile ? label : label.charAt(0)}
                        <ChevronDown
                          size="1.4em"
                          className={`${
                            open
                              ? "rotate-180 transition-transform ml-2"
                              : "ml-2"
                          }`}
                        />
                      </Badge>
                    </Label>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className={`${isMobile ? `w-[${menusize}] ` : "w-[20px]"}`}
                  >
                    {labels.map((label) => (
                      <DropdownMenuItem
                        key={label}
                        onClick={() => setLabel(label)}
                      >
                        {isMobile ? label : label.charAt(0)}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
