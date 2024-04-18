import FormWrapper from "../FormWrapper";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import MultipleSelector from "../ui/multi-select";



const OPTIONS = [
  { label: "nextjs", value: "Nextjs" },
  { label: "React", value: "react" },
  { label: "Remix", value: "remix" },
  { label: "Vite", value: "vite" },
  { label: "Nuxt", value: "nuxt" },
  { label: "Vue", value: "vue" },
  { label: "Svelte", value: "svelte" },
  { label: "Angular", value: "angular" },
  { label: "Ember", value: "ember", disable: true },
  { label: "Gatsby", value: "gatsby", disable: true },
  { label: "Astro", value: "astro" },
];
const SampleDetails = ({form}) => {
  return (
    <FormWrapper>
      <FormField
        name="sample_type"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Sample type</FormLabel>
            <FormControl>
              <Input type="text" placeholder="sample type" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        name="sample_container"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Sample Container</FormLabel>
            <FormControl>
              <Input type="text" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="tests"
        render={({ field }) => (
          <FormItem>
            <FormLabel>What test would you like to request</FormLabel>
            <FormControl>
              <MultipleSelector
                value={field.value}
                onChange={field.onChange}
                defaultOptions={OPTIONS}
                placeholder="Select frameworks you like..."
                emptyIndicator={
                  <p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">
                    no results found.
                  </p>
                }
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </FormWrapper>
  );
};

export default SampleDetails;
