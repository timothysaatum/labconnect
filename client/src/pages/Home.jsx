import { useQuery } from "@tanstack/react-query";
import Motion from "../components/motion";

export default function Home() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["deliveries"],
    queryFn: () => fetch("/api/deliveries").then((res) => res.json()),
  });

  return (
    <Motion>
      {isLoading && <div>Loading...</div>}
      {isError && <div>Error</div>}
      {data && <div>{JSON.stringify(data)}</div>}
      <div>
        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Placeat quo
        odit iusto eligendi inventore, culpa dolorum eum iste a. A accusantium
        repudiandae deserunt est, tempora dolores pariatur magni reiciendis
        corrupti, fugit reprehenderit placeat aspernatur sint voluptatem
        doloremque excepturi hic impedit numquam, similique nostrum ipsam vitae
        alias? Quod quam in porro deleniti tempora quisquam tempore cupiditate
        amet officiis! Ipsa quasi repellendus nobis sed quos a ratione labore
        modi blanditiis dolore adipisci voluptas officiis iure alias doloribus
        autem, maxime veritatis ex dignissimos molestiae vitae ducimus aut
        voluptates. Molestias eaque, obcaecati voluptatem laborum ipsa
        laboriosam repellat culpa cumque cupiditate reprehenderit eum, quaerat
        sequi molestiae nam adipisci exercitationem quam consequatur quidem
        deserunt placeat, similique aliquid mollitia rem quasi. Blanditiis, quam
        vitae. Natus neque ducimus optio sequi iusto eius nisi cumque minus
        velit consequatur laborum explicabo totam fugit eveniet in repudiandae
        fugiat aperiam id, repellat facilis excepturi asperiores, saepe veniam
        ea? Aliquam ullam excepturi autem facilis vero! Quae laudantium veniam,
        iure optio soluta laboriosam autem iusto libero omnis, veritatis numquam
        molestias quasi quibusdam excepturi dolorum dolor quam nesciunt nulla
        quia tenetur voluptatem! Atque quas harum vitae. Iusto veritatis nobis,
        maxime, similique eos repellat laboriosam labore, maiores blanditiis
        vitae repellendus ex sit est. Voluptatum, ipsum amet.
      </div>
    </Motion>
  );
}
