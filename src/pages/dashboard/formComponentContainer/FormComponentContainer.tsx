import React from 'react';
import FormComponent from './FormComponent';
import UserTitleComponent from './UserTitleComponent';

export default function FormComponentContainer() {
   // const [products, setProducts]=useState:()
    return (
        <React.Fragment>
            <UserTitleComponent title='Aggiungi un Referente' subTitle='Inserisci i dati della persona che vuoi autorizzare a gestire' />
            <FormComponent />
        </React.Fragment>
    );
}
