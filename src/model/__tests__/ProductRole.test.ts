import { ProductRole, productRoles2ProductRolesList } from '../ProductRole';

test('Test productRoles2ProductRolesList', () => {
  const productRoles: Array<ProductRole> = [
    {
      selcRole: 'ADMIN',
      productRole: 'incaricato-ente-creditore',
      displayableProductRole: 'Incaricato Ente Creditore',
    },
    {
      selcRole: 'LIMITED',
      productRole: 'referente-tecnico',
      displayableProductRole: 'Referente Tecnico',
    },
    {
      selcRole: 'LIMITED',
      productRole: 'operatore-sicurezza',
      displayableProductRole: 'Operatore sicurezza',
    },
  ];

  const rolesList = productRoles2ProductRolesList(productRoles);
  expect(rolesList).toStrictEqual({
    list: productRoles,
    groupBySelcRole: {
      ADMIN: [
        {
          selcRole: 'ADMIN',
          productRole: 'incaricato-ente-creditore',
          displayableProductRole: 'Incaricato Ente Creditore',
        },
      ],
      LIMITED: [
        {
          selcRole: 'LIMITED',
          productRole: 'referente-tecnico',
          displayableProductRole: 'Referente Tecnico',
        },
        {
          selcRole: 'LIMITED',
          productRole: 'operatore-sicurezza',
          displayableProductRole: 'Operatore sicurezza',
        },
      ],
    },
    groupByProductRole: {
      'incaricato-ente-creditore': {
        selcRole: 'ADMIN',
        productRole: 'incaricato-ente-creditore',
        displayableProductRole: 'Incaricato Ente Creditore',
      },
      'referente-tecnico': {
        selcRole: 'LIMITED',
        productRole: 'referente-tecnico',
        displayableProductRole: 'Referente Tecnico',
      },
      'operatore-sicurezza': {
        selcRole: 'LIMITED',
        productRole: 'operatore-sicurezza',
        displayableProductRole: 'Operatore sicurezza',
      },
    },
  });
});
