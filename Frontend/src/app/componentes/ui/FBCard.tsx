'use client';
import React, { ReactNode } from "react";
import { Button, Card, CardBody, CardHeader, Divider, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, ScrollShadow } from "@nextui-org/react";
import { ThreeDotsVerticalIcon } from "./icons/ThreeDotsIVerticalIcon";

/**
 * FLIPBOARD CARD
 */
type FBProps = {
  title: string,
  dropDownItems: Array<{ key: string, label: string, onAction: Function }>,
  children?: ReactNode,
  color: number,
  onPress: Function
  editable?: boolean,
  description?: string
}

const colors = [
  "bg-slate-200 dark:bg-slate-600",
  "bg-slate-300 dark:bg-slate-700",
];

const FBCard = (props: FBProps) => {
  return (
    // <article onClick={() => props.onPress()} className="rounded-[14px] hover:cursor-pointer dark:shadow-gray-800 hover:shadow-xl transition duration-300">
    //   <Card className="shadow-md w-[400px] h-[200px]  dark:bg-gray-800 dark:border dark:border-gray-900">
    <Card isPressable onPress={() => props.onPress()} className="shadow-md w-[400px] h-[200px]  dark:bg-gray-800 dark:border-gray-900 hover:shadow-xl dark:shadow-gray-700 transition duration-300">
      <CardHeader className={"flex text-lg gap-2 items-center justify-between " + colors.at(props.color)}>
        <h2 className="px-3 text-left">{props.title}</h2>
        <aside className="flex">
          {props.children}
          {props.editable &&
            <Dropdown className="dark:bg-gray-800">
              <DropdownTrigger>
                <Button isIconOnly variant="light" radius="full">
                  <ThreeDotsVerticalIcon />
                </Button>
              </DropdownTrigger>
              <DropdownMenu items={props.dropDownItems} onAction={(key) => props.dropDownItems.find(di => di.key === key)?.onAction()}>
                {(item: any) => (
                  <DropdownItem
                    key={item.key}
                    color={item.key === "delete" ? "danger" : "default"}
                    className={item.key === "delete" ? "text-danger" : ""}>
                    {item.label}
                  </DropdownItem>
                )}
              </DropdownMenu>
            </Dropdown>
          }
        </aside>
      </CardHeader>
      <CardBody className="py-4">
        <ScrollShadow hideScrollBar className="w-full h-full">
          {/* Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. */}
          {props.description !== "" ? props.description : <span className="w-full h-full flex items-center justify-center italic text-sm text-gray-300 dark:text-gray-600">FlipBoard</span>}
        </ScrollShadow>
      </CardBody>
    </Card>
    // </article>
  );
};

export { FBCard };