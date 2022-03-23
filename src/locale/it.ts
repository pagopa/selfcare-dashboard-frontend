export default {
  partySelection: {
    title: 'Seleziona il tuo Ente',
    subTitle: "Se operi per più Enti, puoi modificare la tua scelta all'interno del portale.",
    searchBar: 'Cerca',
    partyName: '{{partyName}}',
    role: '{{role}}',
    partyStatus: 'Da completare',
    enterButton: 'Entra',
  },
  overview: {
    title: 'La panoramica del tuo Ente',
    subTitle: 'Visualizza e gestisci i prodotti PagoPA a cui il tuo Ente ha aderito.',
    sideMenu: {
      institutionManagement: {
        title: 'Gestione Ente',
        overview: {
          title: 'Panoramica',
        },
        referents: {
          title: 'Referenti',
        },
        groups: {
          title: 'Gruppi',
        },
      },
      product: {
        title: '{{title}}',
        overview: 'Panoramica',
        referents: 'Referenti',
      },
    },
    activeProductSection: {
      title: 'Prodotti attivi',
      subTitle: 'I prodotti PagoPA a cui il tuo Ente ha aderito.',
    },
    activeProductCard: {
      tag: '{{tag}}',
      productName: '{{productName}}',
      activationOf: 'Attivo dal ',
      active: 'Attivo',
      manageButton: 'Gestisci',
    },
    lastServiceActive: 'Ultimo servizio attivato: ',
    notActiveProductSection: {
      title: 'Scopri i nuovi prodotti',
      subTitle: 'Attiva qui altri prodotti PagoPA, a tua disposizione in pochi passi.',
    },
    notActiveProductCard: {
      productName: '{{productName}}',
      productDescription: '{{productDescription}}',
      buttonLabel: 'Aderisci',
    },
    discoverMore: '<0> SCOPRI DI PIÙ → </0>',
    adhesionPopup: {
      title: 'Adesione in corso',
      description:
        'Per questo prodotto c’è già una richiesta di adesione in corso. Vuoi procedere lo stesso?',
      confirmButton: 'Procedi con una nuova adesione',
      closeButton: 'Esci',
    },
    partyLogo: {
      upload: 'Carica il logo del tuo Ente',
      modify: 'Modifica Logo',
      uploadError: {
        title: 'Caricamento non riuscito',
        description:
          'Il caricamento del logo non è andato a buon fine. Verifica che il formato e la dimensione siano corretti e caricalo di nuovo',
      },
      modifyError: {
        title: 'Caricamento non riuscito',
        description: 'Spiacenti, qualcosa è andato storto. Riprova più tardi',
      },
    },
    partyDescription: {
      type: 'formato .png',
      size: 'dimensione 300x300px',
    },
    partyDetail: {
      category: '{{category}}',
      title: '{{title}}',
      ipaCode: 'Codice IPA',
      companyName: 'Ragione sociale',
      description: '{{description}}',
      fiscalCode: 'Codice fiscale',
      pec: 'PEC',
      contactToModify:
        "<0>Per modificare questi dati, <1>contatta</1> l'Indice della Pubblica Amministrazione (IPA)</0>",
    },
  },
  subHeader: {
    partySelectionSearch: {
      title: 'I tuoi enti',
      label: 'I tuoi enti',
    },
    backButton: 'Esci',
    logoSubMenu: {
      partyName: '{{partyName}}',
      role: '{{role}}',
      selected: {
        partyName: '{{partyName}}',
        role: '{{role}}',
      },
    },
    dashboardSubMenu: {
      selected: {
        partyName: '{{partyName}}',
        description: '{{description}}',
        role: '{{role}}',
      },
    },
  },
};
