import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { Box, Divider } from '@mui/material';
import { ButtonNaked } from '@pagopa/mui-italia';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DelegationResource } from '../../api/generated/b4f-dashboard/DelegationResource';
import { DelegationWithInfo } from '../../api/generated/b4f-dashboard/DelegationWithInfo';
import DashboardTablePT from './DashboardTablePT';

type Props = {
  tableList: Array<DelegationResource>;
  setTableData: React.Dispatch<React.SetStateAction<Array<DelegationWithInfo>>>;
  retrieveDelegationsList: () => Promise<void>;
};
export default function DashboardTableContainer({ tableList, setTableData, retrieveDelegationsList }: Props) {
  const { t } = useTranslation();
  const [expandMore, setExpandMore] = useState<boolean>(false);
  const [areMoreThen5Elements, setAreMoreThen5Elements] = useState<boolean>(false);

  useEffect(() => {
    if (tableList.length > 5) {
      setAreMoreThen5Elements(true);
    } else {
      setAreMoreThen5Elements(false);
    }
  }, [tableList]);

  return (
    <Box
      sx={{
        height:
          expandMore && areMoreThen5Elements ? '100%' : !areMoreThen5Elements ? '100%' : '360px',
      }}
    >
      <DashboardTablePT
        tableList={tableList}
        setTableData={setTableData}
        retrieveDelegationsList={retrieveDelegationsList}
      />
      {!expandMore && areMoreThen5Elements && (
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
