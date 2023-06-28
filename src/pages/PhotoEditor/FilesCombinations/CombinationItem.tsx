import { Box, CircularProgress, IconButton, TextField, Tooltip, Typography } from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import { Pause as PauseIcon } from "@mui/icons-material";
import { useDrop } from "react-dnd";
import { Delete as DeleteIcon, CheckOutlined as CheckIcon, ContentCopy as ContentCopyIcon } from '@mui/icons-material';
import { ICombination } from "../../../types";

const styles = {
  boxTitle: {
    fontWeight: 'bold',
    textAlign: 'center'
  },
  boxImage: {
    width: 130,
    height: 130,
    objectFit: 'cover'
  },
  box: (isOver: boolean) => ({
    border: '1px solid black',
    minHeight: 130,
    minWidth: 130,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 0,
    background: isOver ? '#0347AC' : '#ccc',
    fontWeight: 'bold'
  }),
  
}

interface IInput {
  item: ICombination;
  handleDrop: CallableFunction;
  handleChangeSku: CallableFunction;
  handleDelete: CallableFunction;
}

export const CombinationItem = ({ item, handleDrop, handleChangeSku, handleDelete }: IInput) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'image-item',
    canDrop: () => true,
    drop: (itemDropped, _) => handleDrop({ combinationId: item.id, type: 'image', itemDropped, currentItem: item['image'] }),
    collect: monitor => ({
      isOver: !!monitor.isOver(),
      canDrop: !!monitor.canDrop()
    }),
  }), [item])

  const [{ isOverMeasureImage }, dropMeasureImage] = useDrop(() => ({
    accept: 'image-item',
    drop: (itemDropped, _) => handleDrop({ combinationId: item.id, type: 'imageMeasure', itemDropped, currentItem: item['imageMeasure'] }),
    collect: monitor => ({
      isOverMeasureImage: !!monitor.isOver(),
      canDropMeasureImage: !!monitor.canDrop()
    }),
  }), [item])

  let border = 'none';
  if (item.uploadStatus === 'success') {
    border = '2px solid green';
  } else if (item.uploadStatus === 'error') {
    border = '2px solid red';
  }

  return (
    <Box sx={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      background: '#D0D1D3',
      borderRadius: 5,
      padding: 1,
      border
    }}>
      <TextField
        sx={{backgroundColor: "#949496", borderRadius: 1}}
        variant="outlined"
        placeholder="Digite o SKU"
        label="Código SKU"
        required={true}
        onChange={(event) => handleChangeSku({ id: item.id, sku: event.currentTarget.value })}
        error={item.error === 'sku'}
        helperText={item.error === 'sku' && 'SKU inválido'}
        disabled={item.uploadStatus === 'success'}
        value={item.sku}
      />
      <Box sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: '#949496',
          borderRadius: 1,
          padding: 1
        }}
      >
        <Box
          ref={item.uploadStatus !== 'success' ? drop : null}
          sx={styles.box(isOver)}
        >
          {item.image
            ? <img width="130" height="130" style={{objectFit: 'cover'}}  src={item.image?.img as string} alt="Imagem Bolinhas" loading="lazy" />
            : 'Imagem Bolinhas'
          }
        </Box>
        <AddIcon sx={{width: 50, height: 50}} />
        <Box
          ref={item.uploadStatus !== 'success' ? dropMeasureImage : null}
          sx={styles.box(isOverMeasureImage)}
        >
          {item.imageMeasure
            ?<img width="130" height="130" style={{objectFit: 'cover'}} src={item.imageMeasure?.img as string} alt="Imagem Régua" loading="lazy" />
            : 'Imagem Régua'
          }
        </Box>
        <PauseIcon sx={{width: 50, height: 50, rotate: '90deg'}} />
        <Box
          sx={styles.box(false)}
        >
          {item.resultImage
            ? <img width="130" height="130" style={{objectFit: 'cover'}} src={item.resultImage?.img as string} alt="Imagem Final" loading="lazy" />
            : 'Imagem Final'
          }
        </Box>
      </Box>
      <Box sx={{
        background: '#949496',
        borderRadius: 1,
        padding: 1
      }}>
        <Box
          sx={styles.box(false)}
        >
          {item.image
            ? <img style={{width: 130, height: 130, objectFit: 'cover'}}  src={item.image?.img as string} alt="Imagem Caixinha" loading="lazy" />
            : 'Imagem Caixinha'
          }
        </Box>
      </Box>
      {(!item.uploadInProgress && item.uploadStatus !== 'success') &&
        <IconButton
          aria-label="delete"
          size="large"
          onClick={() => handleDelete(item.id)}
          disabled={item.uploadStatus === 'success' || (!item.id && !item.image && !item.imageMeasure && !item.sku)}
        >
          <DeleteIcon
            fontSize="inherit"
            sx={!(item.uploadStatus === 'success' || (!item.id && !item.image && !item.imageMeasure && !item.sku)) ? { color: 'red'} : {}}
          />
        </IconButton>
      }
      {(!item.uploadInProgress && item.uploadStatus === 'success') &&
        <Tooltip title="Foto carregada com sucesso!">
          <CheckIcon fontSize="inherit" sx={{color: 'green'}} />
        </Tooltip>
      }
      {(!item.uploadInProgress && item.uploadStatus === 'success' && item?.bucketUrl !== '') &&
        <Tooltip title="Copiar link das imagens">
          <IconButton onClick={() => navigator.clipboard.writeText(item.bucketUrl)}>
            <ContentCopyIcon fontSize="inherit" />
          </IconButton>
        </Tooltip>
      }
      {item.uploadInProgress &&
        <Box sx={{ position: 'relative', display: 'inline-flex' }}>
          <CircularProgress />
          <Box
            sx={{
              top: 0,
              left: 0,
              bottom: 0,
              right: 0,
              position: 'absolute',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography
              variant="caption"
              component="div"
              color="text.secondary"
            >{`${Math.round(item.uploadProgress)}%`}</Typography>
          </Box>
        </Box>
      }
    </Box>
  );
}