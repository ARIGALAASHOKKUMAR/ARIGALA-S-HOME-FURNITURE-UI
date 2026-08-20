import React, { useState } from 'react';
import { useFormik, FormikProvider } from 'formik';
import * as Yup from 'yup';

const AdminProductForm = ({ 
  adminProductForm, 
  saveAdminProduct, 
  submitting, 
  catalogCategories,
  setAdminProductForm,
  handleImageUpload
}) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const formik = useFormik({
    initialValues: {
      id: adminProductForm.id || null,
      name: adminProductForm.name || '',
      slug: adminProductForm.slug || '',
      description: adminProductForm.description || '',
      price: adminProductForm.price || '',
      stock: adminProductForm.stock || '',
      categoryId: adminProductForm.categoryId || '',
      imageUrl: adminProductForm.imageUrl || '',
      isActive: adminProductForm.isActive !== undefined ? adminProductForm.isActive : true
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      name: Yup.string().required('Product name is required'),
      slug: Yup.string().required('Slug is required'),
      description: Yup.string().required('Description is required'),
      price: Yup.number().min(0, 'Price must be 0 or greater').required('Price is required'),
      stock: Yup.number().min(0, 'Stock must be 0 or greater').required('Stock is required'),
      categoryId: Yup.string().required('Category is required')
    }),
    onSubmit: (values) => {
      saveAdminProduct(values);
    }
  });

  return (
    <FormikProvider value={formik}>
      <form className="store-form admin-product-form" onSubmit={formik.handleSubmit}>
        <div>
          <input 
            required 
            placeholder="Product name" 
            name="name"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.name && formik.errors.name && (
            <div className="form-error">{formik.errors.name}</div>
          )}
        </div>

        <div>
          <input 
            required 
            placeholder="Slug" 
            name="slug"
            value={formik.values.slug}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.slug && formik.errors.slug && (
            <div className="form-error">{formik.errors.slug}</div>
          )}
        </div>

        <div>
          <textarea 
            required 
            placeholder="Product description" 
            name="description"
            value={formik.values.description}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.description && formik.errors.description && (
            <div className="form-error">{formik.errors.description}</div>
          )}
        </div>

        <div>
          <input 
            required 
            min="0" 
            step="0.01" 
            type="number" 
            placeholder="Price" 
            name="price"
            value={formik.values.price}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.price && formik.errors.price && (
            <div className="form-error">{formik.errors.price}</div>
          )}
        </div>

        <div>
          <input 
            required 
            min="0" 
            step="1" 
            type="number" 
            placeholder="Available stock" 
            name="stock"
            value={formik.values.stock}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.stock && formik.errors.stock && (
            <div className="form-error">{formik.errors.stock}</div>
          )}
        </div>

        <div>
          <select 
            required 
            name="categoryId"
            value={formik.values.categoryId}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          >
            <option value="">Choose category</option>
            {catalogCategories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          {formik.touched.categoryId && formik.errors.categoryId && (
            <div className="form-error">{formik.errors.categoryId}</div>
          )}
        </div>

        <div className="admin-image-field">
          <input 
            className="admin-image-url"
            placeholder="Image URL" 
            name="imageUrl"
            value={formik.values.imageUrl}
            onChange={formik.handleChange}
          />
          <div className="admin-upload-card">
            <div className="admin-upload-icon" aria-hidden="true">+</div>
            <div className="admin-upload-copy">
              <strong>{selectedFile ? selectedFile.name : "Upload product photo"}</strong>
              <small>{selectedFile ? `${Math.round(selectedFile.size / 1024)} KB` : "JPG, PNG or WEBP up to 3 MB"}</small>
            </div>
            <label className="admin-upload-button">
              Choose image
              <input 
                type="file" 
                accept="image/*" 
                onChange={(event) => {
                  setSelectedFile(event.target.files?.[0] || null);
                  handleImageUpload(event);
                }}
              />
            </label>
          </div>
          {formik.values.imageUrl && (
            <div className="admin-image-preview">
              <img src={formik.values.imageUrl} alt="Product preview" />
              <div>
                <strong>Image preview</strong>
                <small>{selectedFile ? "Ready to save with this product" : "Current product image"}</small>
              </div>
            </div>
          )}
        </div>

        <label className="admin-active">
          <input 
            type="checkbox" 
            name="isActive"
            checked={formik.values.isActive}
            onChange={formik.handleChange}
          /> 
          Product is active
        </label>

        <div>
          <button className="primary-button" type="submit" disabled={submitting}>
            {adminProductForm.id ? "Update product" : "Add product"}
          </button>
          {adminProductForm.id && (
            <button 
              className="store-link-button" 
              type="button" 
              onClick={() => {
                formik.resetForm();
                setAdminProductForm({ 
                  id: null, name: "", slug: "", description: "", 
                  price: "", stock: "", categoryId: "", imageUrl: "", isActive: true 
                });
              }}
            >
              Cancel edit
            </button>
          )}
        </div>
      </form>
    </FormikProvider>
  );
};

export default AdminProductForm;