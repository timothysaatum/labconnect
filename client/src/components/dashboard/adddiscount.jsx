import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useEffect, useState } from "react";
import { FormBuilder } from "../formbuilder";
import { useForm } from "react-hook-form";
import { Form } from "../ui/form";

export function ApplyDisCount({ children, test }) {
  const [percent, setPercent] = useState(0);

  const form = useForm({
    defaultValues: {
      discount: "",
      discountPercent: percent,
    },
  });

  const discount = form.watch("discount");
  useEffect(() => {
    const calculateDiscountPercentage = () => {
      if (!discount) return;
      const result = (discount / test?.price) * 100;
      const onedecimalplace = parseFloat(result.toFixed(1));
      setPercent(`${onedecimalplace}%`); // Corrected line
    };
    calculateDiscountPercentage();
  }, [discount]);

  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none flex justify-between items-center">
              Apply Discount
              <span className="text-muted-foreground/50 text-xs uppercase tabular-nums">
                discount: {percent}
              </span>
            </h4>
            <p className="text-sm text-muted-foreground">
              Apply dicount for this test
            </p>
          </div>
          <Form {...form}>
            <form className="grid gap-2 space-y-3">
              <div className="grid grid-cols-3 items-center gap-4">
                <Label htmlFor="width">Original (GHS)</Label>
                <span id="original" className="text-xs">
                  {test?.price}
                </span>
              </div>
              <FormBuilder
                name={"discount"}
                label={"Discount amount "}
                className="grid grid-cols-3 items-center gap-4"
              >
                <Input
                  id="maxWidth"
                  className="col-span-2 h-8 "
                  type="number"
                />
              </FormBuilder>
              <Button disabled={!discount}>
                {discount ? `Apply ${percent} discount` : "Apply discount"}
              </Button>
            </form>
          </Form>
        </div>
      </PopoverContent>
    </Popover>
  );
}
