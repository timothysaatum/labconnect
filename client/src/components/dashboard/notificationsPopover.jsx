import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export default function NotiicationsPopover({ children }) {
  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent className="w-80 opacity-90 max-h-96 overflow-auto mr-4" side="bottom" >
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-bold uppercase text-sm leading-none">Notifications</h4>
                      <div className="max-h-96">
                          Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptas perferendis maxime quidem quasi error odit delectus obcaecati velit adipisci, modi alias soluta minus id molestias debitis consectetur accusantium sed consequatur. Lorem ipsum, dolor sit amet consectetur adipisicing elit. Omnis voluptas vitae nam quia tempora. Hic id quisquam fugit, nam temporibus magnam cumque repellat iusto dicta aliquam porro at ex a assumenda? Officiis consequatur quo laboriosam tempore distinctio doloribus necessitatibus sint omnis, non, eaque cupiditate impedit quae! Quis aut iure ullam est laborum error vitae corrupti impedit sit, dolor perferendis qui consectetur illo reprehenderit repellat ad. Laborum earum, fuga odio hic libero quidem provident minus quisquam accusamus molestias reprehenderit minima deserunt! Recusandae cum labore inventore dicta quae soluta similique exercitationem, distinctio quo mollitia aliquam illo incidunt fuga a voluptatum? Quos veritatis, tempore libero repellat ex doloremque illum. Voluptas nemo eveniet eum qui, mollitia enim consequuntur placeat quia quasi maiores voluptatum itaque culpa officia ad? Architecto totam atque optio vero necessitatibus, corrupti repellendus tempore earum nihil delectus, eaque eum inventore? Officiis repellat, provident fugiat tempore, nesciunt veniam ipsam debitis voluptatum corporis praesentium inventore quo architecto. Omnis optio nam voluptatum nostrum! Vel beatae perferendis nobis explicabo modi reiciendis reprehenderit fuga eligendi dolorem voluptas. Magni reiciendis sapiente illum, quaerat rerum animi expedita aliquam qui dolor, quidem dolorem adipisci dignissimos voluptatibus rem eveniet debitis repellat veniam. Labore cumque veniam quis id quo eaque consequuntur tempore?
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
