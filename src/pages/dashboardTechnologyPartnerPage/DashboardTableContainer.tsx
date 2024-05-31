import { Box } from '@mui/material';
import { DelegationWithInfo } from '../../api/generated/b4f-dashboard/DelegationWithInfo';
import TechPartnersTable from './TechPartnersTable';

type Props = {
  delegationsWithoutDuplicates: Array<DelegationWithInfo>;
};
export default function DashboardTableContainer({ delegationsWithoutDuplicates }: Props) {
  return (
    <Box
      sx={{
        height: '100%',
      }}
    >
      <TechPartnersTable delegationsWithoutDuplicates={delegationsWithoutDuplicates} />
    </Box>
  );
}
