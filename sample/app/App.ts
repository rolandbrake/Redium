import { Center, Column, Root } from "redium";
import { Actions } from "../components/Actions";
import { Header } from "../components/Header";
import { ProgressCard } from "../components/ProgressCard";
import { TaskList } from "../components/TaskList";
import { pageStyle, panelStyle } from "../styles";

export function App() {
  return Root(
    Center(
      Column({
        gap: 24,
        style: panelStyle,
        children: [Header(), ProgressCard(), TaskList(), Actions()],
      }),
    ),
    { style: pageStyle },
  );
}
