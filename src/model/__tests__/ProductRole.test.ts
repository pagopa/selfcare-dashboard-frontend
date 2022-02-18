import { mockedProductRoles } from '../../services/__mocks__/usersService';
import { ProductRole, productRoles2ProductRolesList } from '../ProductRole';

test('Test productRoles2ProductRolesList', () => {
  const rolesList = productRoles2ProductRolesList(mockedProductRoles);
  expect(rolesList).toStrictEqual({
    list: mockedProductRoles,
    groupBySelcRole: {
      ADMIN: [
        {
          productId: 'PRODID',
          partyRole: 'MANAGER',
          selcRole: 'ADMIN',
          multiroleAllowed: false,
          productRole: 'referente-legale',
          title: 'Referente Legale',
          description: 'Descrizione referente-legale',
        },
        {
          productId: 'PRODID',
          partyRole: 'DELEGATE',
          selcRole: 'ADMIN',
          multiroleAllowed: false,
          productRole: 'referente-amministrativo',
          title: 'Referente Amministrativo',
          description: 'Descrizione referente-amministrativo',
        },
        {
          productId: 'PRODID',
          partyRole: 'SUB_DELEGATE',
          selcRole: 'ADMIN',
          multiroleAllowed: false,
          productRole: 'incaricato-ente-creditore',
          title: 'Incaricato Ente Creditore',
          description: 'Descrizione incaricato-ente-creditore',
        },
      ],
      LIMITED: [
        {
          productId: 'PRODID',
          partyRole: 'OPERATOR',
          selcRole: 'LIMITED',
          multiroleAllowed: true,
          productRole: 'referente-dei-pagamenti',
          title: 'Referente dei Pagamenti',
          description: 'Descrizione referente-dei-pagamenti',
        },
        {
          productId: 'PRODID',
          partyRole: 'OPERATOR',
          selcRole: 'LIMITED',
          multiroleAllowed: true,
          productRole: 'referente-tecnico',
          title: 'Referente Tecnico',
          description: 'Descrizione referente-tecnico',
        },
      ],
    },
    groupByProductRole: {
      'referente-legale': {
        productId: 'PRODID',
        partyRole: 'MANAGER',
        selcRole: 'ADMIN',
        multiroleAllowed: false,
        productRole: 'referente-legale',
        title: 'Referente Legale',
        description: 'Descrizione referente-legale',
      },
      'referente-amministrativo': {
        productId: 'PRODID',
        partyRole: 'DELEGATE',
        selcRole: 'ADMIN',
        multiroleAllowed: false,
        productRole: 'referente-amministrativo',
        title: 'Referente Amministrativo',
        description: 'Descrizione referente-amministrativo',
      },
      'incaricato-ente-creditore': {
        productId: 'PRODID',
        partyRole: 'SUB_DELEGATE',
        selcRole: 'ADMIN',
        multiroleAllowed: false,
        productRole: 'incaricato-ente-creditore',
        title: 'Incaricato Ente Creditore',
        description: 'Descrizione incaricato-ente-creditore',
      },
      'referente-dei-pagamenti': {
        productId: 'PRODID',
        partyRole: 'OPERATOR',
        selcRole: 'LIMITED',
        multiroleAllowed: true,
        productRole: 'referente-dei-pagamenti',
        title: 'Referente dei Pagamenti',
        description: 'Descrizione referente-dei-pagamenti',
      },
      'referente-tecnico': {
        productId: 'PRODID',
        partyRole: 'OPERATOR',
        selcRole: 'LIMITED',
        multiroleAllowed: true,
        productRole: 'referente-tecnico',
        title: 'Referente Tecnico',
        description: 'Descrizione referente-tecnico',
      },
    },
  });
});
