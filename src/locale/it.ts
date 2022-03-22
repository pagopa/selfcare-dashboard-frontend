export default {
  overview: {
    activeProductCard: {
      activationOf: 'Attivo dal ',
      active: 'Attivo',
      buttonLabel: 'Gestisci',
    },
    lastServiceActive: 'Ultimo servizio attivato: ',
    activeProductSection: {
      title: 'Prodotti attivi',
      subTitle: 'I prodotti PagoPA a cui il tuo Ente ha aderito.',
    },
    notActiveProductCard: {
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
    notActiveProductSection: {
      title: 'Scopri i nuovi prodotti',
      subTitle: 'Attiva qui altri prodotti PagoPA, a tua disposizione in pochi passi.',
      // TODO Fix buttons
    },
    partyLogo: {
      // TODO Check && fix
      upload: 'Carica il logo del tuo Ente',
      modify: 'Modifica Logo',
      labelLink: 'Modifica Logo',
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
    /*
    baseProductCard: {
      title: '{{title}}',
      subTitle: '{{subTitle}}',
      buttonLabel: '{{buttonLabel}}',
    },
    */
    partyDetail: {
      title: '{{title}}',
      ipaCode: 'Codice IPA',
      companyName: 'Ragione sociale',
      description: '{{description}}',
      fiscalCode: 'Codice fiscale',
      pec: 'PEC',
      contactToModify:
        "<0>Per modificare questi dati, <1>contatta</1> l'Indice della Pubblica Amministrazione (IPA)</0>",
    },
    welcome: {
      title: 'La panoramica del tuo Ente',
      subTitle: 'Visualizza e gestisci i prodotti PagoPA a cui il tuo Ente ha aderito.',
    },
  },
  subHeader: {
    partySelectionSearch: {
      title: 'I tuoi enti',
      label: 'I tuoi enti',
    },
    backButton: 'Esci',
    logoSubMenu: {
      titleLogo: '{{title}}',
      subTitle: '{{subTitle}}',
      selected: {
        titleLogo: '{{title}}',
        subTitleLogo: '{{subTitle}}',
      },
    },
    dashboardSubMenu: {
      selected: {
        titleDash: '{{title}}',
        description: '{{description}}',
        role: '{{role}}',
      },
    },
  },
};
