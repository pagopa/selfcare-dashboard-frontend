import React from 'react';
import { useFormik } from 'formik';

export default function FormComponent() {
  // Pass the useFormik() hook initial form values and a submit function that will
  // be called when the form is submitted
//   const formik = useFormik({
//     initialValues: {
//       firstName: '',
//       lastName: '',
//       email: '',
//     },
//     onSubmit: (values) => {
//       alert(JSON.stringify(values, null, 2));
//     },
//   });

 // A custom validation function. This must return an object
 // which keys are symmetrical to our values/initialValues
 const formik = useFormik({
  initialValues: {
    firstName: '',
    lastName: '',
    email: '',
  },
  onSubmit: values => {
    alert(JSON.stringify(values, null, 2));
  },
});
  
  return (
    <React.Fragment>
       <form onSubmit={formik.handleSubmit}>
       <label htmlFor="firstName">First Name</label>
       <input
         id="firstName"
         name="firstName"
         type="text"
         onChange={formik.handleChange}
         value={formik.values.firstName}
       />
       {formik.errors.firstName ? <div>{formik.errors.firstName}</div> : null}
 
       <label htmlFor="lastName">Last Name</label>
       <input
         id="lastName"
         name="lastName"
         type="text"
         onChange={formik.handleChange}
         value={formik.values.lastName}
       />
       {formik.errors.lastName ? <div>{formik.errors.lastName}</div> : null}
 
       <label htmlFor="email">Email Address</label>
       <input
         id="email"
         name="email"
         type="email"
         onChange={formik.handleChange}
         value={formik.values.email}
       />
       {formik.errors.email ? <div>{formik.errors.email}</div> : null}
 
       <button type="submit">Submit</button>
     </form>
    </React.Fragment>
  );
}
