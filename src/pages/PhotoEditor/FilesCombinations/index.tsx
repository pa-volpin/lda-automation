import { useCallback, useEffect, useState } from "react";
import { Box, Button } from "@mui/material";
import {  v4 as uuidV4 } from 'uuid';
import AWS from 'aws-sdk';
import { processImages } from "../../../utils/processImage";
import { isValidSkuCode } from '../../../utils/validateSku';
import { base64ToBlob } from '../../../utils/base64ToBlob';
import { ICombination, IImageToCombine } from '../../../types';
import { LinearProgressWithLabel } from '../FilesFromFolder/LoadingBar';
import { CombinationItem } from "./CombinationItem";

interface IProps {
  setImagesToCombine: React.Dispatch<React.SetStateAction<IImageToCombine[]>>;
}

interface IInputHandleDrop {
  combinationId?: string;
  currentItem: IImageToCombine;
  type: 'imageMeasure' | 'image';
  itemDropped: IImageToCombine;
}

export const FilesCombinations = ({
  setImagesToCombine
}: IProps) => {
  const combinationSlotInitialState: ICombination = {
    id: '',
    sku: '',
    image: null,
    imageMeasure: null,
    resultImage: null,
    uploadInProgress: false,
    uploadProgress: 0,
    uploadStatus: '',
    error: '',
    bucketUrl: ''
  };

  const [combinationSlot, setCombinationSlot] = useState<ICombination>(combinationSlotInitialState);
  const [combinations, setCombinations] = useState<Array<ICombination>>([]);
  const [uploadProcessRunning, setUploadProcessRunning] = useState<boolean>(false);

  // FUNCTIONS TO MANIPULATE COMBINATIONS
  // --------------------------------------------------------------------
  const addCombination = ({ sku, image, imageMeasure, resultImage }: ICombination) => {
    const newId = uuidV4();

    setCombinations(previousCombinations => {
      return ([
        ...previousCombinations,
        { ...combinationSlotInitialState, id: newId, sku, image, imageMeasure, resultImage }
      ])
    });
  }

  const editCombination = ({ id, sku, image, imageMeasure, resultImage, error }: ICombination) => {
    setCombinations(previousCombinations => {
      const combinationIndex = previousCombinations.findIndex((combination) => combination.id === id);

      if (combinationIndex < 0) {
        return previousCombinations;
      }

      const editedCombination = { ...combinationSlotInitialState, id, sku, image, imageMeasure, resultImage, error };

      return [
        ...previousCombinations.slice(0, combinationIndex),
        editedCombination,
        ...previousCombinations.slice(combinationIndex + 1)
      ]
    });
  }

  const removeCombination = (id: ICombination['id']) => {
    setCombinations(previousCombinations => {
      const combinationIndex = previousCombinations.findIndex((combination) => combination.id === id);

      if (combinationIndex < 0) {
        return previousCombinations;
      }

      return [
        ...previousCombinations.slice(0, combinationIndex),
        ...previousCombinations.slice(combinationIndex + 1)
      ]
    });
  }
  // --------------------------------------------------------------------


  // FUNCTIONS TO MANIPULATE IMAGES LIST
  // --------------------------------------------------------------------
  const replaceImageOnList = (img: IImageToCombine) => {
    if (!img) {
      return;
    }

    setImagesToCombine(prevImagesToCombine => {
      return [...prevImagesToCombine, img]
    });
  }

  const removeImageFromList = (id: string) => {
    if (!id) {
      return;
    }

    setImagesToCombine(prevImagesToCombine => {
      const filteredImagesToCombine = prevImagesToCombine.filter((img) => img.id !== id);
      return filteredImagesToCombine;
    });
  }
  // --------------------------------------------------------------------


  // CALLBACK FUNCTIONS TO BE TRIGGERED WHEN AN IMAGE IS DROPPED
  // --------------------------------------------------------------------
  const handleDropOnCombinationSlot = async ({ currentItem, type, itemDropped }: IInputHandleDrop) => {  
    if (!type || !itemDropped) {
      return;
    }

    removeImageFromList(itemDropped.id);
    replaceImageOnList(currentItem);

    const combinationType = type === 'image' ? 'imageMeasure' : 'image';

    let resultImage: IImageToCombine | null;
    if (type === 'image') {
      resultImage = await processImages({ image: itemDropped, imageMeasure: combinationSlot[combinationType] });
    } else if (type === 'imageMeasure') {
      resultImage = await processImages({ imageMeasure: itemDropped, image: combinationSlot[combinationType] });
    }

    setCombinationSlot(prev => ({
      ...prev,
      [type]: itemDropped,
      resultImage: resultImage as IImageToCombine
    }));
  }

  const handleDropOnCombination = useCallback(async ({ combinationId, currentItem, type, itemDropped }: IInputHandleDrop) => {
    if (!type || !itemDropped || !combinationId) {
      return;
    }

    const combinationIndex = combinations.findIndex((combination) => combination.id === combinationId);

    if (combinationIndex < 0) {
      return;
    }

    removeImageFromList(itemDropped.id);
    replaceImageOnList(currentItem);

    const combination = combinations[combinationIndex];

    const combinationType = type === 'image' ? 'imageMeasure' : 'image';

    let resultImage: ICombination['resultImage'] = null;
    if (type === 'image') {
      resultImage = await processImages({ image: itemDropped, imageMeasure: combinationSlot[combinationType] });
    } else if (type === 'imageMeasure') {
      resultImage = await processImages({ imageMeasure: itemDropped, image: combinationSlot[combinationType] });
    }

    editCombination({
      ...combination,
      [type]: itemDropped,
      resultImage
    });
  }, [combinations]);
  // --------------------------------------------------------------------


  // ADDITIONAL FUNCTIONS TO MANIPULATE RELATIONS BETWEEN:
  // COMBINATIONS / COMBINATION SLOT / IMAGES
  // --------------------------------------------------------------------
  const handleChangeSkuOnCombinationSlot = ({ sku }: ICombination) => {
    setCombinationSlot(prev => ({ ...prev, sku }));
  }

  const handleChangeSkuOnCombination = ({ id, sku }: ICombination) => {
    if (!id || !sku) {
      return;
    }

    const combinationIndex = combinations.findIndex((combination) => combination.id === id);

    if (combinationIndex < 0) {
      return;
    }

    const combination = combinations[combinationIndex];

    editCombination({ ...combination, sku, error: '' });
  }

  const handleDeleteCombinationSlot = () => {
    if (combinationSlot.image) {
      replaceImageOnList(combinationSlot.image);
    }

    if (combinationSlot.imageMeasure) {
      replaceImageOnList(combinationSlot.imageMeasure);
    }

    setCombinationSlot(combinationSlotInitialState);
  }

  const handleDeleteCombination = (id: ICombination[ 'id']) => {
    if (!id) {
      return;
    }

    const combinationIndex = combinations.findIndex((combination) => combination.id === id);

    if (combinationIndex < 0) {
      return;
    }

    const combination = combinations[combinationIndex];

    if (combination.image) {
      replaceImageOnList(combination.image);
    }

    if (combination.imageMeasure) {
      replaceImageOnList(combination.imageMeasure);
    }

    removeCombination(id);
  }
  // --------------------------------------------------------------------


  // EVERY TIME THE COMBINATION SLOT IS FULL FILLED, IT ADDS A NEW COMBINATION
  // AND RESET THE COMBINATION SLOT
  // --------------------------------------------------------------------
  useEffect(() => {
    if (combinationSlot.resultImage) {
      addCombination(combinationSlot);

      setCombinationSlot(combinationSlotInitialState);
    }
  }, [combinationSlot.resultImage]);
  // --------------------------------------------------------------------

  const handleUploadImages = async () => {
    let hasError = false;
    for (let index = 0; index < combinations.length; index++) {
      const combination = combinations[index];

      if (!combination.sku || !isValidSkuCode(combination.sku)) {
        hasError= true;

        setCombinations((prevState) => ([
            ...prevState.slice(0, index),
            {
              ...combination,
              error: 'sku'
            },
            ...prevState.slice(index + 1)
          ]));
      }
    }

    if (hasError) {
      return;
    }

    setUploadProcessRunning(true);

    const s3 = new AWS.S3({
      // Configure your AWS credentials here
      accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
      region: process.env.REACT_APP_AWS_REGION,
    });

    for (let index = 0; index < combinations.length; index++) {
      const combination = combinations[index];

      if (!combination.resultImage) {
        return;
      }

      const imgBlob = await base64ToBlob(combination.resultImage.img as string);

      const bucketFolderName = process.env.REACT_APP_AWS_BUCKET_FOLDER_NAME;
  
      const params = {
        Bucket: process.env.REACT_APP_AWS_BUCKET_NAME as string,
        Key: `${bucketFolderName}/${combination.sku}/combination-${combination.resultImage.id}`,
        Body: imgBlob,
        ContentEncoding: 'base64',
        ContentType: 'image/jpeg'
      };

      try {
        const upload = s3.upload(params);

        upload.on('httpUploadProgress', (progress) => {
          setCombinations((prevState) => ([
            ...prevState.slice(0, index),
            {
              ...combination,
              uploadProgress: progress.loaded / progress.total,
              uploadInProgress: true
            },
            ...prevState.slice(index + 1)
          ]));
        });

        const uploadResult = await upload.promise();

        setCombinations((prevState) => ([
          ...prevState.slice(0, index),
          {
            ...combination,
            uploadStatus: 'success',
            uploadInProgress: false,
            bucketUrl: uploadResult.Location
          },
          ...prevState.slice(index + 1)
        ]));
      } catch (error) {
        setCombinations((prevState) => ([
          ...prevState.slice(0, index),
          {
            ...combination,
            uploadStatus: 'error',
            uploadInProgress: false
          },
          ...prevState.slice(index + 1)
        ]));
      }
    }
  };

  const handleResetCombinationsAfterUpload = () => {
    for (const combination of combinations) {
      if (combination.image && combination.uploadStatus !== 'success') {
        replaceImageOnList(combination.image);
      }

      if (combination.imageMeasure && combination.uploadStatus !== 'success') {
        replaceImageOnList(combination.imageMeasure);
      }
    }

    setCombinations([]);
    setUploadProcessRunning(false);
  }

  const loading = combinations.some(({ uploadInProgress }) => uploadInProgress);
  const loadingProgress = combinations.filter(({ uploadInProgress }) => !uploadInProgress).length / combinations.length;

  return (
    <Box sx={{width: '60%'}}>
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'space-between',
        justifyContent: 'flex-start',
        gap: 1,
        background: '#fff',
        height: '90vh',
        maxHeight: '90vh',
        overflowY: 'auto',
        borderRadius: 1,
        padding: 1
      }}>
        {!uploadProcessRunning &&
          <CombinationItem
            item={combinationSlot}
            handleDrop={handleDropOnCombinationSlot}
            handleChangeSku={handleChangeSkuOnCombinationSlot}
            handleDelete={handleDeleteCombinationSlot}
          />
        }
        {combinations.map((combinationItem, index) => (
          <CombinationItem
            key={index}
            item={combinationItem}
            handleDrop={handleDropOnCombination}
            handleChangeSku={handleChangeSkuOnCombination}
            handleDelete={handleDeleteCombination}
          />
        ))}
      </Box>
      {!loading &&
        <Button
          variant="contained"
          size="large"
          color="secondary"
          fullWidth
          sx={{marginTop: 1}}
          onClick={() => {
            if (combinations.length > 0 && !uploadProcessRunning) {
              return handleUploadImages()
            } else if (combinations.length > 0 && uploadProcessRunning) {
              return handleResetCombinationsAfterUpload()
            }
          }}
          disabled={combinations.some(({ uploadInProgress }) => uploadInProgress) || combinations.length <= 0}
        >
          {!uploadProcessRunning ? 'Subir Fotos' : 'Limpar'}
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
