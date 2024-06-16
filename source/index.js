import React, { useState, useCallback } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import styled from "styled-components";
import { createRoot } from "react-dom/client";

const DragDropLayout = styled.div`
  display: flex;
  gap: 20px;
`;
const GRID = 8;

const getItemStyle = (isDragging, draggableStyle) => ({
  userSelect: "none",
  padding: GRID * 2,
  margin: `0 0 ${GRID}px 0`,
  background: isDragging ? "lightgreen" : "grey",
  ...draggableStyle,
});

const getListStyle = (isDraggingOver) => ({
  background: isDraggingOver ? "lightblue" : "lightgrey",
  padding: GRID,
  width: 250,
});

const getItems = (count) =>
  Array.from({ length: count }, (v, k) => k).map((k) => ({
    id: `item-${k}`,
    content: `item ${k}`,
  }));

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};
const DragDropList = ({ initialItems, droppableId, title }) => {
  console.log("initialItems", title);
  const [items, setItems] = useState(initialItems);

  const onDragEnd = useCallback(
    (result) => {
      if (!result.destination) {
        return;
      }

      const newItems = reorder(
        items,
        result.source.index,
        result.destination.index
      );

      setItems(newItems);
    },
    [items]
  );

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId={droppableId}>
        {(provided, snapshot) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            style={getListStyle(snapshot.isDraggingOver)}
          >
            <div>{title}</div>
            {items.map((item, index) => (
              <Draggable key={item.id} draggableId={item.id} index={index}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    style={getItemStyle(
                      snapshot.isDragging,
                      provided.draggableProps.style
                    )}
                  >
                    {item.content}
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

const App = () => {
  return (
    <DragDropLayout>
      <DragDropList
        initialItems={getItems(10)}
        droppableId="1"
        title="List 1"
      />
      <DragDropList
        initialItems={getItems(10)}
        droppableId="2"
        title="List 2"
      />
      <DragDropList
        initialItems={getItems(10)}
        droppableId="3"
        title="List 3"
      />
      <DragDropList
        initialItems={getItems(10)}
        droppableId="4"
        title="List 4"
      />
    </DragDropLayout>
  );
};
const root = createRoot(document.getElementById("root"));
root.render(<App />);
