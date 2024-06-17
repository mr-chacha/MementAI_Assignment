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

const DragDropList = ({ items, droppableId, title }) => {
  return (
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
                  style={{
                    ...getItemStyle(
                      snapshot.isDragging,
                      provided.draggableProps.style
                    ),
                    background: "grey",
                  }}
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
  );
};

const App = () => {
  const initialLists = [
    { id: "1", title: "List 1", items: getItems(10, "1") },
    { id: "2", title: "List 2", items: getItems(10, "2") },
    { id: "3", title: "List 3", items: getItems(10, "3") },
    { id: "4", title: "List 4", items: getItems(10, "4") },
  ];
  // 리스트 상태관리
  const [lists, setLists] = useState(initialLists);

  return (
    <DragDropContext>
      <DragDropLayout id="list">
        {lists.map((list) => (
          <DragDropList
            key={list.id}
            droppableId={list.id}
            items={list.items}
            title={list.title}
          />
        ))}
      </DragDropLayout>
    </DragDropContext>
  );
};
const root = createRoot(document.getElementById("root"));
root.render(<App />);
