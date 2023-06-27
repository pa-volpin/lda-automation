import { ImageListItem } from "@mui/material";
import { useDrag } from "react-dnd";
import { IImageToCombine } from "../../../types";
interface IProps {
  item: IImageToCombine;
}

export const ImageItem = ({ item }: IProps) => {
  const [{isDragging}, drag] = useDrag(() => ({
    type: 'image-item',
    item: item,
    collect: monitor => ({
      isDragging: !!monitor.isDragging(),
    }),
  }), [item])

  return (
    <ImageListItem
      ref={drag}
      sx={{
        opacity: isDragging ? 0.5 : 1,
        fontSize: 25,
        fontWeight: 'bold',
        cursor: 'move',
      }}
    >
      <img
        src={item.img as string}
        loading="lazy"
      />
    </ImageListItem>
  );
}