import React from 'react';
import { useFormik, FormikProvider } from 'formik';
import * as Yup from 'yup';

const AddressFormModal = ({ 
  addressForm, 
  createAddress, 
  submitting, 
  editingAddressId,
  setShowAddressForm 
}) => {
  const formik = useFormik({
    initialValues: {
      fullName: addressForm.fullName || '',
      phone: addressForm.phone || '',
      line1: addressForm.line1 || '',
      line2: addressForm.line2 || '',
      city: addressForm.city || '',
      state: addressForm.state || '',
      postalCode: addressForm.postalCode || '',
      country: addressForm.country || 'India',
      isDefault: addressForm.isDefault !== undefined ? addressForm.isDefault : true
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      fullName: Yup.string().required('Full name is required'),
      phone: Yup.string().required('Phone number is required'),
      line1: Yup.string().required('Address line is required'),
      city: Yup.string().required('City is required'),
      postalCode: Yup.string().required('Postal code is required'),
      country: Yup.string().required('Country is required')
    }),
    onSubmit: (values) => {
      createAddress(values);
    }
  });

  return (
    <FormikProvider value={formik}>
      <form className="store-form address-form" onSubmit={formik.handleSubmit}>
        <div>
          <input 
            required 
            placeholder="Full name" 
            name="fullName"
            value={formik.values.fullName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.fullName && formik.errors.fullName && (
            <div className="form-error">{formik.errors.fullName}</div>
          )}
        </div>

        <div>
          <input 
            required 
            placeholder="Phone" 
            name="phone"
            value={formik.values.phone}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.phone && formik.errors.phone && (
            <div className="form-error">{formik.errors.phone}</div>
          )}
        </div>

        <div>
          <input 
            required 
            placeholder="Address line" 
            name="line1"
            value={formik.values.line1}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.line1 && formik.errors.line1 && (
            <div className="form-error">{formik.errors.line1}</div>
          )}
        </div>

        <input 
          placeholder="Apartment / landmark" 
          name="line2"
          value={formik.values.line2}
          onChange={formik.handleChange}
        />

        <div>
          <input 
            required 
            placeholder="City" 
            name="city"
            value={formik.values.city}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.city && formik.errors.city && (
            <div className="form-error">{formik.errors.city}</div>
          )}
        </div>

        <input 
          placeholder="State" 
          name="state"
          value={formik.values.state}
          onChange={formik.handleChange}
        />

        <div>
          <input 
            required 
            placeholder="Postal code" 
            name="postalCode"
            value={formik.values.postalCode}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.postalCode && formik.errors.postalCode && (
            <div className="form-error">{formik.errors.postalCode}</div>
          )}
        </div>

        <div>
          <input 
            required 
            placeholder="Country" 
            name="country"
            value={formik.values.country}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.country && formik.errors.country && (
            <div className="form-error">{formik.errors.country}</div>
          )}
        </div>

        <button className="outline-button" type="submit" disabled={submitting}   style={{display:"flex",justifyContent:"center",alignItems:"center"}}>
          {editingAddressId ? "Update address" : "Save address"}
        </button>
      </form>
    </FormikProvider>
  );
};

export default AddressFormModal;