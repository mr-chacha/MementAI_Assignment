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

const DragDropList = ({ initialItems, droppableId, title }) => {
  // 아이템의 목록 상태
  const [items, setItems] = useState(initialItems);
  // 선택된 아이템의 id
  const [selectedItems, setSelectedItems] = useState([]);
  // 마지막으로 선택된 아이템의 인덱스
  const [lastSelectedIndex, setLastSelectedIndex] = useState(null);
  // 짝수인지 아닌지
  const [evennumber, setEvennumber] = useState(false);

  // 드래그시작할때 호출
  const onBeforeDragStart = (start) => {
    //드래그를 시작할때 item의 정보
    const selectedItem = items[start.source.index];
    if (!selectedItems.includes(selectedItem.id)) {
      setSelectedItems([selectedItem.id]);
    }
  };

  // 드래그를 놓을때 호출
  const onDragEnd = useCallback(
    (result) => {
      if (!result.destination) {
        return;
      }

      if (evennumber) {
        setEvennumber(false);
        return;
      }

      const destinationIndex = result.destination.index;

      const selectedIndices = selectedItems
        .map((id) => items.findIndex((item) => item.id === id))
        .sort((a, b) => a - b);

      const movingItems = selectedIndices.map((index) => items[index]);

      const newItems = items.filter(
        (_, index) => !selectedIndices.includes(index)
      );

      newItems.splice(destinationIndex, 0, ...movingItems);
      setItems(newItems);
    },
    [items, selectedItems, evennumber, setEvennumber]
  );

  // 드래그 중일때 호출
  const onDragUpdate = useCallback(
    (update) => {
      if (!update.destination) {
        setEvennumber(false);
        return;
      }
      const dragItemId = update.draggableId;
      const destinationIndex = update.destination.index;

      // 지나간 아이템의 콘텐츠 값 찾기
      const passedItemId =
        update.source.droppableId === update.destination.droppableId
          ? items[destinationIndex].id
          : items.find((item) => item.id === dragItemId).id;

      const passedItem = items.find((item) => item.id === passedItemId).content;

      const dragNum = Number(dragItemId.replace("item-", ""));
      const nextNum = Number(passedItem.replace("item", ""));

      // 드래그 중인 아이템의 배열 번호
      const dragItemIndex = update.source.index;

      // 지나간 아이템의 배열 번호
      const copyItems2 = [...items];
      const [removed] = copyItems2.splice(dragItemIndex, 1);
      copyItems2.splice(destinationIndex, 0, removed);

      //드래그한 아이템의 인덱스 번호가 지나친 인덱스의 번호보다 클때만 동작
      if (dragItemIndex > destinationIndex) {
        //드래그한 아이템과 지나쳐간 아이템의 콘텐츠 번호가 짝수일때만 true
        if (dragNum % 2 === 0 && nextNum % 2 === 0) {
          setEvennumber(true);
        } else {
          setEvennumber(false);
        }
      }
    },
    [items]
  );

  // 아이템 선택 함수
  const selectionHandler = useCallback(
    (itemId) => {
      const index = selectedItems.indexOf(itemId);
      if (index === -1) {
        //선택안되어있을때는 선택하고
        setSelectedItems([itemId]);
      } else {
        // 그게 아니면 해제함
        setSelectedItems([]);
      }
      // 마지막에 선택된 아이템의 인덱스
      setLastSelectedIndex(items.findIndex((item) => item.id === itemId));
    },
    [selectedItems, items]
  );

  // ctrl이나 cmd로 아이템 다중 선택
  const selectionGroupHandler = useCallback(
    (itemId) => {
      const index = selectedItems.indexOf(itemId);
      if (index === -1) {
        //선택안되어있을때는 선택하고
        setSelectedItems([...selectedItems, itemId]);
      } else {
        // 그게 아니면 해제함
        setSelectedItems(selectedItems.filter((id) => id !== itemId));
      }
      // 마지막에 선택된 아이템의 인덱스
      setLastSelectedIndex(items.findIndex((item) => item.id === itemId));
    },
    [selectedItems, items]
  );

  // shift키를 사용해서 범위내 선택
  const selectionMultiHandler = useCallback(
    (newItemId) => {
      const newItemIndex = items.findIndex((item) => item.id === newItemId);
      const start = Math.min(lastSelectedIndex, newItemIndex);
      const end = Math.max(lastSelectedIndex, newItemIndex);

      // 시작 인덱스와 끝 인덱스 사이의 모든 아이템 선택
      const newSelectedItems = items
        .slice(start, end + 1)
        .map((item) => item.id);

      setSelectedItems(newSelectedItems);
      // setItems(newSelectedItems);
    },
    [items, lastSelectedIndex]
  );

  return (
    <DragDropContext
      onDragEnd={onDragEnd}
      onBeforeDragStart={onBeforeDragStart}
      onDragUpdate={onDragUpdate}
    >
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
                      background: selectedItems.includes(item.id)
                        ? evennumber
                          ? "red"
                          : "lightgreen"
                        : "grey",
                    }}
                    onClick={(event) => {
                      //ctrl이나 cmd 클릭일경우 selectionGroupHandler()
                      if (event.ctrlKey || event.metaKey) {
                        selectionGroupHandler(item.id);
                      } else if (event.shiftKey) {
                        // shift키를 눌렀으면 selectionMultiHandler()
                        selectionMultiHandler(item.id);
                      } else {
                        selectionHandler(item.id);
                      }
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
