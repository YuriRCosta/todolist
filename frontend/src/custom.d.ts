declare module "@asseinfo/react-kanban" {
  import * as React from "react";

  export interface Card {
    id: string | number;
    title: React.ReactNode;
    description?: React.ReactNode;
  }

  export interface Column {
    id: string | number;
    title: React.ReactNode;
    cards: Card[];
  }

  export interface Board {
    columns: Column[];
  }

  export interface KanbanBoardProps {
    initialBoard: Board;
    allowAddCard?: {
      on: "top" | "bottom";
    };
  }

  export default class KanbanBoard extends React.Component<KanbanBoardProps> {}
}
