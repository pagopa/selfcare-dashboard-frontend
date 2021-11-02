import React, { useEffect, useState } from 'react';
import { Party } from '../../model/Party';
import NoActiveParty from './NoActiveParty';
import NoParty from './NoParty';
import PartySelection from './partySelection/PartySelection';


export default function PartySelectionContainer() {
   
    const [parties, setParties] = useState<Array<Party>>([]);
    console.log("PARTIES", parties);
    useEffect(() => {
        // TODO: chiamata BE
        const party: Array<Party> = [   
      {
        role: 'Manager',
        description: 'Comune di Bari',
        image: 'image',
        status: 'Pending',
        institutionId: '1',
      },
      {
        role: 'Manager',
        description: 'Comune di Milano',
        image: 'image',
        status: 'Pending',
        institutionId: '2',
      },
      {
        role: 'Manager',
        description: 'Comune di Roma',
        image: 'image',
        status: 'Active',
        institutionId: '3',
      },
      {
        role: 'Manager',
        description: 'Comune di Napoli',
        image: 'image',
        status: 'Active',
        institutionId: '4',
      },
          ];
        setParties(party);
        
      }, []);

      // se esiste almeno un party attivo visualizzo PartySelection
        // altrimenti se esiste almeno un elemento visualizzo NoActiveParty --<PartyItemContainer />
        // NoParty
    return (
      <React.Fragment>
        
        {parties.filter(party => party.status === "Active").length >= 1 ?
        <PartySelection parties={parties}/>
        : <NoActiveParty /> }
        
        {parties.length === 0 && <NoParty />}
                                                                       
        </React.Fragment>
        );
}
