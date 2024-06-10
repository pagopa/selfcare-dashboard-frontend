import { Grid } from '@mui/material';

type Props = {
  loading: boolean;
  urlLogo?: string;
  isLoaded: boolean;
  setIsLoaded: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function PartyLogo({ urlLogo, isLoaded, setIsLoaded }: Props) {
  const handleImageLoad = () => {
    setIsLoaded(true);
  };

  const handleImageError = () => {
    setIsLoaded(false);
  };

  return (
    <Grid
      width="102px"
      height="102px"
      mr={2}
      display="flex"
      justifyContent="center"
      alignItems="center"
      border="1px solid #E3E7EB"
      borderRadius="8px"
      style={{ display: isLoaded ? 'flex' : 'none' }}
    >
      <img
        src={urlLogo}
        id="partyLogo"
        alt="logo"
        onLoad={handleImageLoad}
        onError={handleImageError}
        height={'51px'}
        width={'51px'}
        style={{
          maxWidth: '100%',
          maxHeight: '100%',
          objectFit: 'contain',
          justifyContent: 'center',
          alignContent: 'center',
        }}
      />
    </Grid>
  );
}
