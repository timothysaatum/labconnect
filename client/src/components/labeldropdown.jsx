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
const labels = ["Year(s)", "Month(s)", "Day(s)"];

  const isMobile = useMediaQuery("(min-width: 640px)");
  return (
    <div>
      <FormField
        name="age"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Patient's age</FormLabel>
            <FormControl>
              <div className="relative">
                <Input
                  type="numeric"
                  placeholder="Patient's age"
                  autoComplete="off"
                  maxLength={3}
                  {...field}
                  />
                <DropdownMenu open={open} onOpenChange={setOpen}>
                  <DropdownMenuTrigger
                    asChild
                    className="absolute right-0 top-0 h-full"
                  >
                    
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
