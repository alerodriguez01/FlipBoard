'use client';
import React, { ReactNode } from "react";
import { Button, Card, CardBody, CardHeader, Divider, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@nextui-org/react";
import { ThreeDotsVerticalIcon } from "./icons/ThreeDotsIVerticalIcon";

/**
 * FLIPBOARD CARD
 */
type FBProps = {
  title: string, 
  dropDownItems: Array<{key: string, label: string, onAction: Function}>,
  children?: ReactNode,
  color: number,
  onPress?: Function
  editable?: boolean
}

const FBCard = (props: FBProps) => {
  return (
    <Card isPressable className="shadow-xl w-[400px] h-[200px]">
      <CardHeader className="flex justify-between min-h-[120px]">
          <h2 className="text-justify self-start max-w-[220px]">{props.title}</h2>
          {props.children}
          {props.editable && 
          <Dropdown>
            <DropdownTrigger>
              <Button isIconOnly variant="light" radius="full" className="self-start">
                <ThreeDotsVerticalIcon/>
              </Button>
            </DropdownTrigger>
            <DropdownMenu items={props.dropDownItems} onAction={(key) => props.dropDownItems.find(di => di.key === key)?.onAction()}>
              {(item) => (
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
      </CardHeader>
      <CardBody className={`bg-slate-${props.color}`}/>
    </Card>
  );
};

export { FBCard };