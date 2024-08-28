import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Check, CheckCheck, MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { useUpdateNotificationMutation } from "@/api/mutations";

export default function NotiicationsPopover({
  children,
  notifs,
  notifsError,
  notifsLoading,
}) {
  const { mutate } = useUpdateNotificationMutation();
  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent
        className="w-96 max-h-96 overflow-auto pt-0"
        side="bottom"
      >
        <div className="grid">
          <div className="space-y-2">
            <div className="sticky top-0 left-0 z-30 bg-background/95  py-4 flex items-center">
              <h4 className="font-semibold capitalize text-base tracking-wide leading-none flex-1">
                Notifications
              </h4>

              <p className="font-medium text-sm hover:underline cursor-default">
                Mark all as read
              </p>
            </div>
            <div className="max-h-[28rem] text-sm  ">
              <ul className="divide-y-[1px] flex flex-col gap-2">
                {notifs?.data?.map((notif) => (
                  <li
                    key={notif?.id}
                    className={`flex gap-2 pykw-2 items-end  ${notif?.is_read ? "" : "bg-accent/50 rounded-sm"} `}
                  >
                    <Avatar>
                      <AvatarFallback>LC</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 gap-2">
                      <p className="flex items-end">
                        <span className="flex-1"> {notif?.message}</span>
                        <div className="flex flex-col items-start justify-between gap-3">
                          <DropdownMenu>
                            <DropdownMenuTrigger>
                              <Button
                                size="icon"
                                variant="outline"
                                className="h-6 w-6 flex-1"
                              >
                                <MoreVertical className="h-3.5 w-3.5" />
                                <span className="sr-only">More</span>
                              </Button>{" "}
                            </DropdownMenuTrigger>
                            <DropdownMenuContent collisionPadding={20}>
                              <DropdownMenuItem
                                onClick={() => mutate(notif?.id)}
                              >
                                Mark Read
                              </DropdownMenuItem>
                              <DropdownMenuItem>Hide</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                          <div>
                            {notif?.is_read ? (
                              <CheckCheck className="w-3 inline text-muted-foreground " />
                            ) : (
                              <Check className="w-3 ml-auto inline text-muted-foreground" />
                            )}
                          </div>
                        </div>
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
