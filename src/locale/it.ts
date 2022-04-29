export default {
  session: {
    expired: {
      title: 'Sessione scaduta',
      message: 'Stai per essere rediretto alla pagina di login...',
    },
  },
  partySelection: {
    title: 'Seleziona il tuo Ente',
    subTitle: "Se operi per più Enti, puoi modificare la tua scelta all'interno del portale.",
    searchBar: 'Cerca',
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
        overview: 'Panoramica',
        referents: 'Referenti',
      },
    },
    activeProductsSection: {
      title: 'Prodotti attivi',
      subTitle: 'I prodotti PagoPA a cui il tuo Ente ha aderito.',
    },
    activeProducts: {
      activationOf: 'Attivo dal ',
      active: 'Attivo',
      manageButton: 'Gestisci',
    },
    lastServiceActive: 'Ultimo servizio attivato: ',
    notActiveProductsSection: {
      title: 'Scopri i nuovi prodotti',
      subTitle: 'Attiva qui altri prodotti PagoPA, a tua disposizione in pochi passi.',
    },
    notActiveProducts: {
      joinButton: 'Aderisci',
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
      upload: "Carica il logo dell'ente",
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
      size: 'Dimensione massima 300 x 300px - Formato .jpg o . png',
    },
    partyDetail: {
      ipaCode: 'Codice IPA',
      companyName: 'Ragione sociale',
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
  },
};
