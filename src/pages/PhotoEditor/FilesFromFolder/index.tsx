import React, { useEffect, useRef, useState } from "react";
import { Box, Button, ImageList } from "@mui/material";
import { LinearProgressWithLabel } from "./LoadingBar";
import { ImageItem } from "./ImageItem";
import {  v4 as uuidV4 } from 'uuid';
import { IImageToCombine } from "../../../types";
interface IProps {
  imagesToCombine: Array<IImageToCombine>;
  setImagesToCombine: React.Dispatch<React.SetStateAction<IImageToCombine[]>>;
}

type FileEvent = React.ChangeEvent<HTMLInputElement> & {
  target: EventTarget & { files: FileList };
};


export const FilesFromFolder = ({ imagesToCombine, setImagesToCombine }: IProps) => {
  const [loading, setLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const inputFilesElement = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (Math.round(loadingProgress) === 100) {
      setLoading(false);
      setLoadingProgress(0);
    }
  }, [loadingProgress])

  const handleSelectedFile = async (event: FileEvent) => {
    setLoading(true);
  
    const files = Array.from(event.target.files);
    const statusStep = 100 / files.length;
    
    for (let i = 0; i < files.length; i++) {
      const reader = new FileReader();
      const file = files[i];

      reader.addEventListener('load', (e) => {
        const readerTarget = e.target;

        const newId = uuidV4();

        const newImage = {
          ...file,
          id: newId,
          img: readerTarget ? readerTarget.result : null,
          createdAt: new Date()
        }


        setImagesToCombine((prev) => [...prev, newImage]);
        setLoadingProgress(prev => prev + statusStep);
      });

      reader.readAsDataURL(file);
    }
  };

  return (
    <Box sx={{width: '40%'}}>
      <Box sx={{
        height: '90vh',
        maxHeight: '90vh',
        overflowY: 'auto',
        background: '#fff',
        borderRadius: 1,
        padding: 1
      }}>
        {imagesToCombine.length > 0 &&
          <ImageList cols={5} rowHeight={164} sx={{margin: 0}}>
            {imagesToCombine.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime()).map((item, index) => (
              <ImageItem key={index} item={item}  />
            ))}
          </ImageList>
        }
      </Box>
      <input 
        ref={inputFilesElement}
        type='file'
        onChange={handleSelectedFile}
        hidden
        multiple
      />
      {!loading &&
        <Button
          variant="contained"
          size="large"
          color="secondary"
          fullWidth
          sx={{marginTop: 1}}
          onClick={() => {
            inputFilesElement.current?.click()
          }}
        >
          Selecionar Fotos
        </Button>
      }
      {loading &&
        <LinearProgressWithLabel
          sx={{
            backgroundColor: '#ccc',
            height: 40,
            borderRadius: 1,
            marginTop: 1
          }}
          value={loadingProgress}
        />
      }
    </Box>
  );
}