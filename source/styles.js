import styled from "styled-components";

export const Layout = styled.div`
  display: flex;
  justify-content: center;
  margin: 100px 0px;
`;

export const DragDropLayout = styled.div`
  display: grid;
  gap: 20px;
  grid-template-columns: repeat(4, 1fr);

  @media (max-width: 1156px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (max-width: 768px) {
    grid-template-columns: repeat(1, 1fr);
  }
`;

export const DragDropListLayout = styled.div`
  height: 100%;
`;

export const SelectionCount = styled.div`
  right: -8px;
  top: -8px;
  color: red;
  background: white;
  border-radius: 50%;
  height: 30px;
  width: 30px;
  line-height: 30px;
  position: absolute;
  text-align: center;
  font-size: 0.8rem;
`;

export const StyledList = styled.div`
  background: lightblue;
  width: 250px;
  padding: 8px;
  border-radius: 20px;
`;

export const ListItemsContainer = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
`;

export const DragDropListTop = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 10px;
`;
export const DragDropListTopTitle = styled.div`
  font-size: 16px;
  font-weight: bold;
`;

export const DragDropListTopBox = styled.div`
  display: flex;
  gap: 7px;
`;

export const IconBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #fff;
  padding: 2px;
  cursor: pointer;
  border-radius: 10px;
`;

export const ContentsBox = styled.div`
  display: flex;
  justify-content: space-between;
`;
