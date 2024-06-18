export const getItemStyle = (
  isDragging,
  isSelected,
  isRestricted,
  draggableStyle,
  evennumber,
  isGhosting
) => ({
  boxShadow: isDragging ? `2px 2px 1px rgba(0,0,0,.2)` : "none",
  opacity: isGhosting ? "0.4" : isDragging ? "0.8" : "1",
  userSelect: "none",
  padding: 8 * 2,
  margin: "0 0 8px 0",
  backgroundColor: isRestricted
    ? "red"
    : isDragging && evennumber
    ? "red"
    : isDragging
    ? "rgba(30,144,255,.8)"
    : isSelected
    ? "rgba(30,144,255,.8)"
    : isDragging & isSelected
    ? "blue"
    : "#fff",
  color: "rgba(0,0,0,.8)",
  ...draggableStyle,
});

export const getItems = (count, droppableId) =>
  Array.from({ length: count }, (_, index) => ({
    id: `${droppableId}-${index}`,
    content: `item ${index}`,
  }));
