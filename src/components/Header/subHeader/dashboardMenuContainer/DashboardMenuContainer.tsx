import { useEffect, useState } from 'react';
import { Grid } from '@mui/material';
import { Party } from '../../../../model/Party';
import { roleLabels } from '../../../../utils/constants';
import DashboardSubMenu from './components/DashboardSubMenu';
import LogoSubMenu from './components/LogoSubMenu';

export default function DashboardMenuContainer() {
  const selectedParty=  {
    role: 'Manager',
    description: 'Comune di Milano',
    urlLogo: 'image',
    institutionId: '1',
    digitalAddress: '',
    status: 'Active',
    platformRole: 'admin',
    attributes: [],
  };

  const ownerName = 'Simone Verdi';

  // MOCK PROVVISORIO
  const [parties, setParties] = useState<Array<Party>>([]);

  useEffect(() => {
    // TODO: chiamata BE
    const party: Array<Party> = [
      {
        role: 'Manager',
        description: 'Comune di Milano',
        urlLogo: 'image',
        institutionId: '1',
        digitalAddress: '',
        status: 'Active',
        platformRole: 'admin',
        attributes: [],
      },{
        role: 'Manager',
        description: 'Comune di Bari',
        urlLogo: 'image',
        institutionId: '2',
        digitalAddress: '',
        status: 'Active',
        platformRole: 'admin',
        attributes: [],
      },{
        role: 'Manager',
        description: 'Comune di Bari',
        urlLogo: 'image',
        institutionId: '3',
        digitalAddress: '',
        status: 'Active',
        platformRole: 'admin',
        attributes: [],
      },{
        role: 'Manager',
        description: 'Comune di Bari',
        urlLogo: 'image',
        institutionId: '4',
        digitalAddress: '',
        status: 'Active',
        platformRole: 'admin',
        attributes: [],
      },{
        role: 'Manager',
        description: 'Comune di Bari',
        urlLogo: 'image',
        institutionId: '5',
        digitalAddress: '',
        status: 'Active',
        platformRole: 'admin',
        attributes: [],
      }
    ];
    setParties(party);
  }, []);

  return (
    <Grid container item direction="row" xs={6} alignContent="center" justifyContent="end">
      <Grid item xs={5}>
        <LogoSubMenu 
        urlLogo={selectedParty.urlLogo} 
        title={selectedParty.description} 
        subTitle={roleLabels[selectedParty.role]} 
        />
      </Grid>
      <Grid item xs={1}>
        <DashboardSubMenu
          ownerName={ownerName}
          urlLogo={selectedParty.urlLogo}
          description={selectedParty.description}
          role={roleLabels[selectedParty.role]}
          parties={parties}
        />
      </Grid>
    </Grid>
  );
}
