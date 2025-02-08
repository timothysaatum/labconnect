import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useEffect, useMemo, useState } from "react";
import { FormBuilder } from "../formbuilder";
import { useForm } from "react-hook-form";
import { Form } from "../ui/form";
import { useAddDiscount } from "@/lib/formactions";
import { zodResolver } from "@hookform/resolvers/zod";
import { AddDiscountSchema } from "@/lib/schema";
import { Loader2 } from "lucide-react";

export function ApplyDisCount({ test }) {
  const [percent, setPercent] = useState(0);
  const [open, setOpen] = useState(false);

  const form = useForm({
    resolver: zodResolver(AddDiscountSchema),
    defaultValues: {
      discount_price: "",
      price: test?.price,
    },
  });

  const discount = form.watch("discount_price");

  useEffect(() => {
    console.log(form.formState.errors);
  }, [form.formState.errors]);
  //intializing discount is there is one

  const prevDiscount = useMemo(() => {
    if (test?.discount_price) {
      form.setValue("discount_price", test?.discount_price);
    }
    return test?.discount_price;
  }, []);

  useEffect(() => {
    const calculateDiscountPercentage = () => {
      if (!discount) return;
      const result = (discount / test?.price) * 100;
      const onedecimalplace = parseFloat(result.toFixed(1));
      setPercent(`${onedecimalplace}%`); // Corrected line
    };
    calculateDiscountPercentage();
  }, [discount]);

  // update discount
  const onaddDiscount = useAddDiscount(form, test, setOpen);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <span className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent">
          Apply discount
        </span>
      </PopoverTrigger>
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
            <form
              className="grid gap-2 space-y-3"
              noValidate
              onSubmit={form.handleSubmit(onaddDiscount)}
            >
              <div className="grid grid-cols-3 items-center gap-4">
                <Label htmlFor="width">Original (GH{`\u20B5`})</Label>
                <span id="original" className="text-xs">
                  {test?.price}
                </span>
              </div>
              <FormBuilder
                name={"discount_price"}
                label={"Discount amount "}
                className="grid grid-cols-3 items-center gap-4"
                message
                messageClassName={"col-span-3"}
                description={"Enter 0 to remove discount"}
                descriptionClassName={"col-span-3 text-xs"}
              >
                <Input
                  id="maxWidth"
                  className="col-span-2 h-8 "
                  type="number"
                />
              </FormBuilder>
              <Button
                disabled={
                  form.formState.isSubmitting ||
                  !discount ||
                  prevDiscount === form.watch("discount_price") ||
                  parseFloat(discount) > parseFloat(test?.price)
                }
              >
                {form.formState.isSubmitting ? (
                  <span className="flex items-center">
                    Applying discount{" "}
                    <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                  </span>
                ) : discount &&
                  parseFloat(discount) < parseFloat(test?.price) ? (
                  `Apply ${percent} discount`
                ) : (
                  "Apply discount"
                )}
              </Button>
            </form>
          </Form>
        </div>
      </PopoverContent>
    </Popover>
  );
}
