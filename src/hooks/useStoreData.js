import { useState, useEffect } from 'react';
import { apiRequest } from '../api';
import { normalizeProduct } from '../utils/formatting';
import { categories } from '../constants/data';

export const useStoreData = () => {
  const [catalogProducts, setCatalogProducts] = useState([]);
  const [catalogCategories, setCatalogCategories] = useState(categories);
  const [error, setError] = useState("");

  useEffect(() => {
    apiRequest("/categories")
      .then((data) => {
        if (data?.length) {
          setCatalogCategories(
            data.map((category) => ({
              id: category.id,
              name: category.name,
              slug: category.slug,
              image: category.image_url || categories.find((item) => item.name.toLowerCase() === category.name.toLowerCase())?.image || categories[0].image,
            }))
          );
        }
      })
      .catch(() => {});

    apiRequest("/products?limit=100")
      .then((data) => {
        if (data?.items?.length) {
          setCatalogProducts(data.items.map(normalizeProduct));
        }
      })
      .catch(() => setError("Unable to load products. Check that the API server is running on port 5001."));
  }, []);

  return { catalogProducts, setCatalogProducts, catalogCategories, error, setError };
};