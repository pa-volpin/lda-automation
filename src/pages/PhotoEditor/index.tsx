import{ useState } from "react";
import { FilesFromFolder } from "./FilesFromFolder";
import { Box } from "@mui/material";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

export interface IImageToCombine {
  id: string;
  img: string | ArrayBuffer | null;
  createdAt: Date;
}

export const PhotoEditor = () => {
  const [imagesToCombine, setImagesToCombine] = useState<Array<IImageToCombine>>([]);

  return (
    <DndProvider backend={HTML5Backend}>
       <Box sx={{
        width: window.innerWidth,
        height: window.innerHeight,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 1
      }}>
        <FilesFromFolder
          setImagesToCombine={setImagesToCombine}
          imagesToCombine={imagesToCombine}
        />
      </Box>
    </DndProvider>
  )
}