import React from 'react';

/**
 * LinkingConfiguration for React Navigation on web
 * This ensures proper URL handling on web platforms
 */
const linking = {
  prefixes: ['myshop://', 'https://myshop.app'],
  config: {
    screens: {
      Auth: 'auth',
      SignIn: 'auth/signin',
      SignUp: 'auth/signup',
      MainApp: 'app',
      Shop: 'app/shop',
      Catalog: 'app/catalog',
      CatalogDetail: 'app/catalog/:id',
      EditShop: 'app/shop/edit',
    },
  },
};

export default linking;

