import React, { useState, useCallback, useEffect } from "react";
import { DragDropContext } from "react-beautiful-dnd";

import { createRoot } from "react-dom/client";
import { getItems } from "./utils";
import { DragDropLayout, Layout, DragDropListLayout } from "./styles";
import DragDropList from "./components/DragDropList";

const App = () => {
  const initialLists = [
    { id: "1", title: "List 1", items: getItems(10, "1") },
    { id: "2", title: "List 2", items: getItems(10, "2") },
    { id: "3", title: "List 3", items: getItems(10, "3") },
    { id: "4", title: "List 4", items: getItems(10, "4") },
  ];

  const [lists, setLists] = useState(initialLists);
  const [selectedItems, setSelectedItems] = useState([]);
  const [lastSelectedItem, setLastSelectedItem] = useState(null);
  const [restrictedItems, setRestrictedItems] = useState([]);
  const [evennumber, setEvennumber] = useState(false);
  const [ghostingItems, setGhostingItems] = useState([]);

  const onSelectItem = (e, itemId, droppableId) => {
    const isSelected = selectedItems.includes(itemId);

    if (e.ctrlKey || e.metaKey) {
      if (isSelected) {
        setSelectedItems(selectedItems.filter((id) => id !== itemId));
      } else {
        setSelectedItems([...selectedItems, itemId]);
      }
    } else if (e.shiftKey && lastSelectedItem) {
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

  const onDragEnd = useCallback(
    (result) => {
      const { source, destination, draggableId } = result;

      const draggableListId = source?.droppableId;
      const destinationListId = destination?.droppableId;

      if (!destination) {
        return;
      }

      if (draggableListId === "1" && destinationListId === "3") {
        setRestrictedItems([]);
        return;
      }

      const sourceListIndex = lists.findIndex(
        (list) => list.id === draggableListId
      );
      const destinationListIndex = lists.findIndex(
        (list) => list.id === destinationListId
      );

      if (draggableListId !== destinationListId) {
        const sourceItems = Array.from(lists[sourceListIndex].items);
        const destinationItems = Array.from(lists[destinationListIndex].items);
        const movingItem = sourceItems[source.index];

        sourceItems.splice(source.index, 1);
        destinationItems.splice(destination.index, 0, movingItem);

        sourceItems.forEach((item, index) => {
          item.content = `item ${index}`;
        });
        destinationItems.forEach((item, index) => {
          item.content = `item ${index}`;
        });

        const updatedLists = [...lists];
        updatedLists[sourceListIndex] = {
          ...lists[sourceListIndex],
          items: sourceItems,
        };
        updatedLists[destinationListIndex] = {
          ...lists[destinationListIndex],
          items: destinationItems,
        };

        setLists(updatedLists);
      }

      const isDraggingSelectedItem = selectedItems.includes(draggableId);
      if (isDraggingSelectedItem) {
        if (draggableListId === destinationListId) {
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
          const sourceItems = Array.from(lists[sourceListIndex].items);
          const destinationItems = Array.from(
            lists[destinationListIndex].items
          );
          const movingItems = sourceItems.filter((item) =>
            selectedItems.includes(item.id)
          );

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
      setGhostingItems([]);
    },
    [lists, selectedItems]
  );

  const onDragUpdate = useCallback((update) => {
    if (!update?.destination) {
      return;
    }

    const draggList = update?.source.droppableId;
    const destinationList = update?.destination.droppableId;

    if (draggList === "1" && destinationList === "3") {
      setRestrictedItems(selectedItems);
      setEvennumber(true);
    } else if (draggList === destinationList) {
      const draggNum = update.source.index;
      const destinationNum = update.destination.index;

      if (draggNum > destinationNum) {
        if (draggNum % 2 === 0 && destinationNum % 2 === 0) {
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

    if (update.destination) {
      setGhostingItems(selectedItems);
    }
  });

  const addItem = (listId) => {
    setLists((prevLists) =>
      prevLists.map((list) => {
        if (list.id === listId) {
          const existingIds = list.items
            .map((item) => parseInt(item.id.split("-")[1]))
            .sort((a, b) => a - b);
          const existingContents = list.items
            .map((item) => parseInt(item.content.split(" ")[1]))
            .sort((a, b) => a - b);

          let newId = 0;
          for (let i = 0; i <= existingIds.length; i++) {
            if (i !== existingIds[i]) {
              newId = i;
              break;
            }
          }

          let newContent = 0;
          for (let i = 0; i <= existingContents.length; i++) {
            if (i !== existingContents[i]) {
              newContent = i;
              break;
            }
          }

          return {
            ...list,
            items: [
              ...list.items,
              {
                id: `${listId}-${newId}`,
                content: `item ${newContent}`,
              },
            ].sort(
              (a, b) =>
                parseInt(a.id.split("-")[1]) - parseInt(b.id.split("-")[1])
            ),
          };
        }
        return list;
      })
    );
  };

  const deleteItem = (listId, itemId) => {
    setLists((prevLists) =>
      prevLists.map((list) =>
        list.id === listId
          ? {
              ...list,
              items: list.items.filter((item) => item.id !== itemId),
            }
          : list
      )
    );
  };

  const refreshList = (listId) => {
    setLists((prevLists) =>
      prevLists.map((list) =>
        list.id === listId
          ? initialLists.find((initialList) => initialList.id === listId)
          : list
      )
    );
  };

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
    <Layout>
      <DragDropContext onDragEnd={onDragEnd} onDragUpdate={onDragUpdate}>
        <DragDropLayout id="list">
          {lists.map((list) => (
            <DragDropListLayout key={list.id}>
              <DragDropList
                droppableId={list.id}
                items={list.items}
                title={list.title}
                selectedItems={selectedItems}
                onSelectItem={onSelectItem}
                restrictedItems={restrictedItems}
                evennumber={evennumber}
                selectedItemCount={selectedItems.length}
                ghostingItems={ghostingItems}
                onAddItem={() => addItem(list.id)}
                onDeleteItem={deleteItem}
                onRefreshList={() => refreshList(list.id)}
              />
            </DragDropListLayout>
          ))}
        </DragDropLayout>
      </DragDropContext>
    </Layout>
  );
};

const root = createRoot(document.getElementById("root"));
root.render(<App />);

export default App;
