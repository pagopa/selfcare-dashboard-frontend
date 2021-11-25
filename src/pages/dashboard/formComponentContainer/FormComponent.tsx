
import React from 'react';
import { Grid, TextField } from '@mui/material';
import { useFormik } from 'formik';

// type Props={
//   fields: Array<any>;
// };


export default function FormComponent() {
  
  const formik = useFormik({
    initialValues: {
      name: '',
      surname:'',
      fiscalCode:'',
      email:''
    },
    onSubmit: (values) => {
      alert(JSON.stringify(values, null, 2));
    },
  });

  const baseTextFieldProps={
    required:true,
    variant:"standard" as const,
    onChange:formik.handleChange,
    sx:{ width: '100%' },
    InputProps:{
      style: {
        fontSize: '16px',
        fontStyle: 'italic',
        fontWeight: 400,
        lineHeight: '24px',
        color: '#5C6F82',
        textAlign: 'start' as const,
        paddingLeft: '16px',
      },
    }
  };
  return (
    <React.Fragment>
      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={4} mb={5}>
            <TextField
              {...baseTextFieldProps}
              id='name'
              type='text'
              value={formik.values.name}
              label='Nome'
              placeholder='Inserisci il nome del referente'
            />
          </Grid>
          <Grid item xs={4} mb={5}>
            <TextField
              {...baseTextFieldProps}
              id='surname'
              type='text'
              value={formik.values.surname}
              label='Cognome'
              placeholder='Inserisci il cognome del referente'
            />
          </Grid>
          <Grid item xs={8} mb={5}>
            <TextField
              {...baseTextFieldProps}
              id='fiscalCode'
              type='text'
              value={formik.values.fiscalCode}
              label='Codice Fiscale'
              placeholder='Inserisci il Codice Fiscale del referente'
            //  pattern= '^[A-Za-z]{6}[0-9lmnpqrstuvLMNPQRSTUV]{2}[abcdehlmprstABCDEHLMPRST]{1}[0-9lmnpqrstuvLMNPQRSTUV]{2}[A-Za-z]{1}[0-9lmnpqrstuvLMNPQRSTUV]{3}[A-Za-z]{1}$'
            />
          </Grid>
          <Grid item xs={8} mb={5}>
            <TextField
              {...baseTextFieldProps}
              id='email'
              type='email'
              value={formik.values.fiscalCode}
              label='Email'
              placeholder='Inserisci l’indirizzo email istituzionale del referente'
            //  pattern='^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$'
            />
          </Grid>
        </Grid>
        <button type="submit">Submit</button>
      </form>
    </React.Fragment>
  );
}
