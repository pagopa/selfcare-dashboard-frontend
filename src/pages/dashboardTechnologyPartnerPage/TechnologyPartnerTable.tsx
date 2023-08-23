import { Box } from '@mui/system';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function TechnologyPartnerTable() {
  const [tableResuls, setTAbleResults] = useState([]);
  const { t } = useTranslation();

  useEffect(() => {
    setTAbleResults([]);
  }, []);
  return tableResuls && tableResuls.length > 0 ? (
    <div>TABELLA</div>
  ) : (
    // empty state
    <Box
      width={'100%'}
      p={2}
      sx={{ backgroundColor: 'white' }}
      display="flex"
      justifyContent={'center'}
    >
      {t('overview.ptPage.tableEmptyLabel')}
    </Box>
  );
}
