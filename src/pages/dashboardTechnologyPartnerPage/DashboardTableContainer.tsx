import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { Box, Divider } from '@mui/material';
import { ButtonNaked } from '@pagopa/mui-italia';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DelegationResource } from '../../api/generated/b4f-dashboard/DelegationResource';
import DashboardTablePT from './DashboardTablePT';

type Props = {
  filteredArray: Array<DelegationResource>;
};
export default function DashboardTableContainer({ filteredArray }: Props) {
  const { t } = useTranslation();
  const [expandMore, setExpandMore] = useState<boolean>(false);
  const [areMoreThen5Elemnts, setAreMoreThen5Elemnts] = useState<boolean>();
  useEffect(() => {
    if (filteredArray.length > 5) {
      setAreMoreThen5Elemnts(true);
    }
  }, [filteredArray]);
  return (
    <Box
      sx={{
        height:
          expandMore && areMoreThen5Elemnts ? '100%' : !areMoreThen5Elemnts ? '100%' : '360px',
      }}
    >
      <DashboardTablePT filteredArray={filteredArray} />
      {!expandMore && areMoreThen5Elemnts && (
        <>
          <Divider color="divider" />
          <Box sx={{ backgroundColor: 'white' }} p="4px" display="flex" justifyContent="center">
            <ButtonNaked
              onClick={() => setExpandMore(true)}
              endIcon={<KeyboardArrowDownIcon />}
              weight="default"
              size="large"
              color="primary"
            >
              {t('overview.ptPage.bodyPtTable.showMoreButtonLabel')}
            </ButtonNaked>
          </Box>
        </>
      )}
    </Box>
  );
}
