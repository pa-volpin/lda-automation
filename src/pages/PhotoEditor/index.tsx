import{ useState } from "react";
import { FilesFromFolder } from "./FilesFromFolder";
import { Box } from "@mui/material";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { IImageToCombine } from "../../types";
import { FilesCombinations } from "./FilesCombinations";

export const PhotoEditor = () => {
  const [imagesToCombine, setImagesToCombine] = useState<Array<IImageToCombine>>([]);

  return (
    <DndProvider backend={HTML5Backend}>
       <Box sx={{
        padding: 1,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 1
      }}>
        <FilesFromFolder
          setImagesToCombine={setImagesToCombine}
          imagesToCombine={imagesToCombine}
        />
        <FilesCombinations
          setImagesToCombine={setImagesToCombine}
        />
      </Box>
    </DndProvider>
  )
}