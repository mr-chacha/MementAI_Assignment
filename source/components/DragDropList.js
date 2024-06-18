import React from "react";
import { Droppable } from "react-beautiful-dnd";
import DragDropItem from "./DragDropItem";
import {
  DragDropListTop,
  DragDropListTopBox,
  DragDropListTopTitle,
  IconBox,
  StyledList,
} from "../styles";
import { PlusIcon, ReloadIcon } from "../icons";

export default function DragDropList({
  items,
  droppableId,
  title,
  selectedItems,
  onSelectItem,
  restrictedItems,
  evennumber,
  selectedItemCount = 0,
  ghostingItems = [],
  onAddItem,
  onDeleteItem,
  onRefreshList,
  ListItemsContainer,
}) {
  return (
    <>
      <Droppable droppableId={droppableId} type="ITEM">
        {(provided, snapshot) => (
          <StyledList ref={provided.innerRef} {...provided.droppableProps}>
            <DragDropListTop>
              <DragDropListTopTitle>{title}</DragDropListTopTitle>
              <DragDropListTopBox>
                <IconBox onClick={onAddItem}>
                  <PlusIcon />
                </IconBox>
                <IconBox onClick={onRefreshList}>
                  <ReloadIcon />
                </IconBox>
              </DragDropListTopBox>
            </DragDropListTop>

            {items.map((item, index) => (
              <DragDropItem
                key={item.id}
                item={item}
                index={index}
                selectedItems={selectedItems}
                restrictedItems={restrictedItems}
                evennumber={evennumber}
                ghostingItems={ghostingItems}
                selectedItemCount={selectedItemCount}
                onSelectItem={onSelectItem}
                droppableId={droppableId}
                onDeleteItem={() => onDeleteItem(droppableId, item.id)}
              />
            ))}

            {provided.placeholder}
          </StyledList>
        )}
      </Droppable>
    </>
  );
}
