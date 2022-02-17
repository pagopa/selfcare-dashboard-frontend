import { ProductRole, productRoles2ProductRolesList } from '../ProductRole';

test('Test productRoles2ProductRolesList', () => {
  const productRoles: Array<ProductRole> = [
    {
      selcRole: 'ADMIN',
      productRole: 'incaricato-ente-creditore',
      title: 'Incaricato Ente Creditore',
      description: 'Descrizione ruolo Incaricato Ente Creditore',
    },
    {
      selcRole: 'LIMITED',
      productRole: 'referente-tecnico',
      title: 'Referente Tecnico',
      description: 'Descrizione ruolo Referente Tecnico',
    },
    {
      selcRole: 'LIMITED',
      productRole: 'operatore-sicurezza',
      title: 'Operatore sicurezza',
      description: 'Descrizione ruolo Operatore sicurezza',
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
          title: 'Incaricato Ente Creditore',
          description: 'Descrizione ruolo Incaricato Ente Creditore',
        },
      ],
      LIMITED: [
        {
          selcRole: 'LIMITED',
          productRole: 'referente-tecnico',
          title: 'Referente Tecnico',
          description: 'Descrizione ruolo Referente Tecnico',
        },
        {
          selcRole: 'LIMITED',
          productRole: 'operatore-sicurezza',
          title: 'Operatore sicurezza',
          description: 'Descrizione ruolo Operatore sicurezza',
        },
      ],
    },
    groupByProductRole: {
      'incaricato-ente-creditore': {
        selcRole: 'ADMIN',
        productRole: 'incaricato-ente-creditore',
        title: 'Incaricato Ente Creditore',
        description: 'Descrizione ruolo Incaricato Ente Creditore',
      },
      'referente-tecnico': {
        selcRole: 'LIMITED',
        productRole: 'referente-tecnico',
        title: 'Referente Tecnico',
        description: 'Descrizione ruolo Referente Tecnico',
      },
      'operatore-sicurezza': {
        selcRole: 'LIMITED',
        productRole: 'operatore-sicurezza',
        title: 'Operatore sicurezza',
        description: 'Descrizione ruolo Operatore sicurezza',
      },
    },
  });
});
