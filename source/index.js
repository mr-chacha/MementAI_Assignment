import React, { useState, useCallback, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import styled from "styled-components";
import { createRoot } from "react-dom/client";

const DragDropLayout = styled.div`
  display: flex;
  gap: 20px;
`;
const GRID = 8;

const getItemStyle = (
  isDragging,
  isSelected,
  isRestricted,
  draggableStyle,
  evennumber
) => ({
  userSelect: "none",
  padding: GRID * 2,
  margin: `0 0 ${GRID}px 0`,
  background: isRestricted
    ? "red"
    : isDragging && evennumber
    ? "red"
    : isDragging
    ? "lightgreen"
    : isSelected
    ? "lightcoral"
    : "grey",
  ...draggableStyle,
});

const getListStyle = (isDraggingOver) => ({
  background: isDraggingOver ? "lightblue" : "lightgrey",
  padding: GRID,
  width: 250,
});

const getItems = (count, droppableId) =>
  Array.from({ length: count }, (_, index) => ({
    id: `${droppableId}-${index}`,
    content: `item ${index}`,
  }));

const DragDropList = ({
  items,
  droppableId,
  title,
  selectedItems,
  onSelectItem,
  restrictedItems,
  evennumber,
}) => {
  return (
    <Droppable droppableId={droppableId} type="ITEM">
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          style={getListStyle(snapshot.isDraggingOver)}
        >
          <div>{title}</div>
          {items.map((item, index) => (
            <Draggable key={item?.id} draggableId={item?.id} index={index}>
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
                      evennumber
                    ),
                  }}
                  onClick={(e) => onSelectItem(e, item.id, droppableId)}
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
  // 선택된 아이템 상태관리
  const [selectedItems, setSelectedItems] = useState([]);
  // 마지막으로 선택된 아이템 상태관리
  const [lastSelectedItem, setLastSelectedItem] = useState(null);
  // 1번리스트 아이템 3번리스트 못가게 예외처리
  const [restrictedItems, setRestrictedItems] = useState([]);
  // 짝수일때 예외처리
  const [evennumber, setEvennumber] = useState(false);

  //아이템 선택시 호출되는 함수
  const onSelectItem = (e, itemId, droppableId) => {
    const isSelected = selectedItems.includes(itemId);

    // ctrl, cmd 키일때
    if (e.ctrlKey || e.metaKey) {
      if (isSelected) {
        // 이미선택되었으면 해제
        setSelectedItems(selectedItems.filter((id) => id !== itemId));
      } else {
        // 선택안된경우 그대로
        setSelectedItems([...selectedItems, itemId]);
      }
    }
    // shift 키일때
    else if (e.shiftKey && lastSelectedItem) {
      //리스트의 찾기
      const list = lists.find((list) => list.id === droppableId);
      const startIndex = list.items.findIndex(
        (item) => item.id === lastSelectedItem
      );

      const endIndex = list.items.findIndex((item) => item.id === itemId);
      const range = [startIndex, endIndex].sort((a, b) => a - b);
      const itemsInRange = list.items
        .slice(range[0], range[1] + 1)
        .map((item) => item.id);

      if (isSelected) {
        setSelectedItems(
          selectedItems.filter((id) => !itemsInRange.includes(id))
        );
      } else {
        setSelectedItems([...new Set([...selectedItems, ...itemsInRange])]);
      }
    } else {
      if (isSelected) {
        setSelectedItems(selectedItems.filter((id) => id !== itemId));
      } else {
        setSelectedItems([itemId]);
      }
    }

    setLastSelectedItem(itemId);
  };

  // 드래그 내려놓을때
  const onDragEnd = useCallback(
    (result) => {
      const { source, destination, draggableId } = result;

      if (!destination) {
        return;
      }

      // 리스트 번호가 1이고 3일때는 빈배열
      if (source.droppableId === "1" && destination.droppableId === "3") {
        setRestrictedItems([]);
        return;
      }

      // 선택된 항목이 드래그되었는지 확인
      const isDraggingSelectedItem = selectedItems.includes(draggableId);

      if (isDraggingSelectedItem) {
        // 선택된 항목이 드래그되는 경우, 모든 선택된 항목 이동
        const sourceListIndex = lists.findIndex(
          (list) => list.id === source.droppableId
        );
        const destinationListIndex = lists.findIndex(
          (list) => list.id === destination.droppableId
        );

        if (source.droppableId === destination.droppableId) {
          // 같은 리스트 내에서 드래그하는 경우
          const newItems = Array.from(lists[sourceListIndex].items);
          const [reorderedItem] = newItems.splice(source.index, 1);
          newItems.splice(destination.index, 0, reorderedItem);
          newItems.forEach((item, index) => {
            item.content = `item ${index}`;
          });

          const updatedLists = [...lists];
          updatedLists[sourceListIndex] = {
            ...lists[sourceListIndex],
            items: newItems,
          };

          setLists(updatedLists);
        } else {
          // 서로 다른 리스트 간에 드래그하는 경우
          const sourceItems = Array.from(lists[sourceListIndex].items);
          const destinationItems = Array.from(
            lists[destinationListIndex].items
          );
          const movingItems = sourceItems.filter((item) =>
            selectedItems.includes(item.id)
          );

          // 원본 리스트에서 이동하는 항목 제거
          const newSourceItems = sourceItems.filter(
            (item) => !selectedItems.includes(item.id)
          );

          destinationItems.splice(destination.index, 0, ...movingItems);

          newSourceItems.forEach((item, index) => {
            item.content = `item ${index}`;
          });
          destinationItems.forEach((item, index) => {
            item.content = `item ${index}`;
          });

          const updatedLists = [...lists];
          updatedLists[sourceListIndex] = {
            ...lists[sourceListIndex],
            items: newSourceItems,
          };
          updatedLists[destinationListIndex] = {
            ...lists[destinationListIndex],
            items: destinationItems,
          };

          setLists(updatedLists);
        }
      }
      setEvennumber(false);
      setSelectedItems([]);
      setRestrictedItems([]);
    },
    [lists, selectedItems]
  );

  // 드래그중일때 호출되는 함수
  const onDragUpdate = useCallback((update) => {
    if (!update?.destination) {
      return;
    }

    const draggList = update?.source.droppableId;
    const destinationList = update?.destination.droppableId;

    if (draggList === "1" && destinationList === "3") {
      // 1번 리스트에서 3번 리스트로 드래그할 때 제한된 항목 설정
      setRestrictedItems(selectedItems);
      setEvennumber(true);
    } else if (draggList === destinationList) {
      const draggNum = update.source.index;
      const destinationNum = update.destination.index;

      if (draggNum > destinationNum) {
        // 짝수 번호 간의 드래그 시 true
        if (draggNum % 2 === 0 && destinationNum % 2 === 0) {
          console.log("red");
          console.log("비교", draggNum, destinationNum);
          setEvennumber(true);
        } else {
          setEvennumber(false);
        }
      } else {
        setEvennumber(false);
      }
    } else {
      setEvennumber(false);
    }
  });

  // 아이템 선택후 리스트 밖을 클릭하면 선택해제
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!document.getElementById("list").contains(e.target)) {
        setSelectedItems([]);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
      }}
    >
      <DragDropContext onDragEnd={onDragEnd} onDragUpdate={onDragUpdate}>
        <DragDropLayout id="list">
          {lists.map((list) => (
            <DragDropList
              key={list.id}
              droppableId={list.id}
              items={list.items}
              title={list.title}
              selectedItems={selectedItems}
              onSelectItem={onSelectItem}
              restrictedItems={restrictedItems}
              evennumber={evennumber}
            />
          ))}
        </DragDropLayout>
      </DragDropContext>
    </div>
  );
};

const root = createRoot(document.getElementById("root"));
root.render(<App />);

export default App;
