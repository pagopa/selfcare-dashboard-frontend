import { mockedProductRoles } from '../../services/__mocks__/productService';
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
          phasesAdditionAllowed: ['dashboard']
        },
        {
          productId: 'PRODID',
          partyRole: 'DELEGATE',
          selcRole: 'ADMIN',
          multiroleAllowed: false,
          productRole: 'referente-amministrativo',
          title: 'Amministratore',
          description: 'Descrizione referente-amministrativo',
          phasesAdditionAllowed: ['dashboard']
        },
        {
          productId: 'PRODID',
          partyRole: 'SUB_DELEGATE',
          selcRole: 'ADMIN',
          multiroleAllowed: false,
          productRole: 'incaricato-ente-creditore',
          title: 'Incaricato Ente Creditore',
          description: 'Descrizione incaricato-ente-creditore',
          phasesAdditionAllowed: ['dashboard']
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
          phasesAdditionAllowed: ['dashboard']
        },
        {
          productId: 'PRODID',
          partyRole: 'OPERATOR',
          selcRole: 'LIMITED',
          multiroleAllowed: true,
          productRole: 'referente-tecnico',
          title: 'Referente Tecnico',
          description: 'Descrizione referente-tecnico',
          phasesAdditionAllowed: ['dashboard']
        },
      ],
    },
    groupByPartyRole: {
      DELEGATE: [
        {
          description: 'Descrizione referente-amministrativo',
          multiroleAllowed: false,
          partyRole: 'DELEGATE',
          productId: 'PRODID',
          productRole: 'referente-amministrativo',
          selcRole: 'ADMIN',
          title: 'Amministratore',
          phasesAdditionAllowed: ['dashboard']
        },
      ],
      MANAGER: [
        {
          description: 'Descrizione referente-legale',
          multiroleAllowed: false,
          partyRole: 'MANAGER',
          productId: 'PRODID',
          productRole: 'referente-legale',
          selcRole: 'ADMIN',
          title: 'Referente Legale',
          phasesAdditionAllowed: ['dashboard']
        },
      ],
      OPERATOR: [
        {
          description: 'Descrizione referente-dei-pagamenti',
          multiroleAllowed: true,
          partyRole: 'OPERATOR',
          productId: 'PRODID',
          productRole: 'referente-dei-pagamenti',
          selcRole: 'LIMITED',
          title: 'Referente dei Pagamenti',
          phasesAdditionAllowed: ['dashboard']
        },
        {
          description: 'Descrizione referente-tecnico',
          multiroleAllowed: true,
          partyRole: 'OPERATOR',
          productId: 'PRODID',
          productRole: 'referente-tecnico',
          selcRole: 'LIMITED',
          title: 'Referente Tecnico',
          phasesAdditionAllowed: ['dashboard']
        },
      ],
      SUB_DELEGATE: [
        {
          description: 'Descrizione incaricato-ente-creditore',
          multiroleAllowed: false,
          partyRole: 'SUB_DELEGATE',
          productId: 'PRODID',
          productRole: 'incaricato-ente-creditore',
          selcRole: 'ADMIN',
          title: 'Incaricato Ente Creditore',
          phasesAdditionAllowed: ['dashboard-async']
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
        phasesAdditionAllowed: ['dashboard']
      },
      'referente-amministrativo': {
        productId: 'PRODID',
        partyRole: 'DELEGATE',
        selcRole: 'ADMIN',
        multiroleAllowed: false,
        productRole: 'referente-amministrativo',
        title: 'Amministratore',
        description: 'Descrizione referente-amministrativo',
        phasesAdditionAllowed: ['dashboard']
      },
      'incaricato-ente-creditore': {
        productId: 'PRODID',
        partyRole: 'SUB_DELEGATE',
        selcRole: 'ADMIN',
        multiroleAllowed: false,
        productRole: 'incaricato-ente-creditore',
        title: 'Incaricato Ente Creditore',
        description: 'Descrizione incaricato-ente-creditore',
        phasesAdditionAllowed: ['dashboard']
      },
      'referente-dei-pagamenti': {
        productId: 'PRODID',
        partyRole: 'OPERATOR',
        selcRole: 'LIMITED',
        multiroleAllowed: true,
        productRole: 'referente-dei-pagamenti',
        title: 'Referente dei Pagamenti',
        description: 'Descrizione referente-dei-pagamenti',
        phasesAdditionAllowed: ['dashboard']
      },
      'referente-tecnico': {
        productId: 'PRODID',
        partyRole: 'OPERATOR',
        selcRole: 'LIMITED',
        multiroleAllowed: true,
        productRole: 'referente-tecnico',
        title: 'Referente Tecnico',
        description: 'Descrizione referente-tecnico',
        phasesAdditionAllowed: ['dashboard']
      },
    },
  });
});
