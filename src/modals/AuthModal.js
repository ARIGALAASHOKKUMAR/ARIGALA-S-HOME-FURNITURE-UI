import React from 'react';
import { useFormik, FormikProvider } from 'formik';
import * as Yup from 'yup';

const AuthModal = ({ authMode, setAuthMode, handleAuth, submitting }) => {
  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: ''
    },
    validationSchema: Yup.object({
      name: authMode === 'register' ? Yup.string().required('Full name is required') : Yup.string(),
      email: Yup.string().email('Invalid email').required('Email is required'),
      password: Yup.string()
        .min(6, 'Password must be at least 6 characters')
        .required('Password is required')
    }),
    onSubmit: (values) => {
      handleAuth(values);
    }
  });

  return (
    <FormikProvider value={formik}>
      <span className="section-label">YOUR WOODHAVEN ACCOUNT</span>
      <h2>{authMode === "login" ? "Welcome back" : "Create your account"}</h2>
      
      <form className="store-form" onSubmit={formik.handleSubmit}>
        {authMode === "register" && (
          <div>
            <input
              required
              placeholder="Full name"
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.name && formik.errors.name && (
              <div className="form-error">{formik.errors.name}</div>
            )}
          </div>
        )}
        
        <div>
          <input
            required
            type="email"
            placeholder="Email address"
            name="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.email && formik.errors.email && (
            <div className="form-error">{formik.errors.email}</div>
          )}
        </div>
        
        <div>
          <input
            required
            minLength="6"
            type="password"
            placeholder="Password"
            name="password"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.password && formik.errors.password && (
            <div className="form-error">{formik.errors.password}</div>
          )}
        </div>
        
        <button className="primary-button" type="submit" disabled={submitting}>
          {submitting ? "Please wait..." : authMode === "login" ? "Sign In" : "Create Account"}
        </button>
      </form>
      
      <button 
        className="store-link-button" 
        onClick={() => { 
          setAuthMode(authMode === "login" ? "register" : "login"); 
          formik.resetForm();
        }}
      >
        {authMode === "login" ? "New here? Create an account" : "Already have an account? Sign in"}
      </button>
    </FormikProvider>
  );
};

export default AuthModal;