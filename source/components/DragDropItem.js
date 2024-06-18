import React from "react";
import { Draggable } from "react-beautiful-dnd";
import { getItemStyle } from "../utils";
import { ContentsBox, SelectionCount } from "../styles";
import { DeleteIcon } from "../icons";

const DragDropItem = ({
  item,
  index,
  selectedItems,
  restrictedItems,
  evennumber,
  ghostingItems,
  selectedItemCount,
  onSelectItem,
  droppableId,
  onDeleteItem,
}) => {
  return (
    <Draggable key={item.id} draggableId={item.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={{
            ...getItemStyle(
              snapshot.isDragging,
              selectedItems.includes(item.id),
              restrictedItems.includes(item.id),
              provided.draggableProps.style,
              evennumber,
              ghostingItems.includes(item.id)
            ),
          }}
          onClick={(e) => onSelectItem(e, item.id, droppableId)}
        >
          {snapshot.isDragging && selectedItemCount > 1 && (
            <SelectionCount>{selectedItemCount}</SelectionCount>
          )}
          <ContentsBox>
            {item.content}{" "}
            <div
              onClick={(e) => {
                onDeleteItem();
              }}
            >
              <DeleteIcon />
            </div>
          </ContentsBox>
        </div>
      )}
    </Draggable>
  );
};

export default DragDropItem;
const test = () => {};
