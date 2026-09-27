import {
  Column,
  Text,
  Button,
  createState,
  mountElement,
  Root,
  Center,
  Align,
  Border,
  Colors,
  ratio,
} from "redium";

export function Counter() {
  const count = createState(0);

  return Center(
    Column({
      gap: 20,
      children: [
        Text(count, {
          style: {
            width: ratio(1),
            //Todo: add alignment to Redium elements 
            align: Align.center,
          },
        }),
        Button("+", {
          onClick: () => count.value++,
          style: {
            //Todo : add placeholder for none value
            border: Border(0, Colors.black),
            background: Colors.aqua,
            radius: 50,
          },
        }),
      ],
    }),
  );
}

mountElement(Root(Counter()));
