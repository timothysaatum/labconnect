import { gridItems } from "@/data";
import { BentoGrid, BentoGridItem } from "./ui/bentogrid";

const Grid = () => {
  return (
    <section id="about">
      <BentoGrid>
        {gridItems.map(
          ({
            className,
            description,
            id,
            img,
            imgClassName,
            spareImg,
            title,
            titleClassName,
          }) => (
            <BentoGridItem
              id={id}
              key={id}
              title={title}
              description={description}
              className={className}
              img={img}
              imgClassName={imgClassName}
              spareImg={spareImg}
              titleClassName={titleClassName}
              
            />
          )
        )}
      </BentoGrid>
    </section>
  );
};

export default Grid;
