import MultipleSelector from "@/components/ui/multi-select";

export default function Home() {
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
  return (
    <main>
      <div className="landing">
        <MultipleSelector defaultOptions={OPTIONS} />
      </div>
    </main>
  );
}
