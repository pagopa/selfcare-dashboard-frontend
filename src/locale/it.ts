export default {
  session: {
    expired: {
      title: 'Sessione scaduta',
      message: 'Stai per essere rediretto alla pagina di login...',
    },
  },
  partySelection: {
    title: 'Seleziona il tuo ente',
    subTitle:
      'Se operi per più enti, potrai modificare la tua scelta dopo aver <1 /> effettuato l’accesso.',
    partyStatus: 'Da completare',
    continueButton: 'Entra',
    backButton: 'Indietro',
    label: 'Cerca ente',
  },
  NoActiveParty: {
    bodyTitle: 'Non risultano richieste di <1 /> adesione per questo Ente',
    bodyDescription:
      "L'adesione potrebbe essere ancora in corso. <1 /> Verifica di aver completato tutti i passaggi richiesti.",
    backButton: 'Torna alla Home',
  },
  noParty: {
    title: 'Il tuo profilo non è associato a nessun ente',
    description:
      'Per accedere all’Area Riservata, chiedi a un Amministratore di aggiungerti nella sezione Utenti.',
    backHome: 'Torna alla home',
  },
  activeProductCard: {
    disableInfo: 'Per gestire questo prodotto, chiedi a uno dei suoi <1>Amministratori</1>',
  },
  overview: {
    title: 'Panoramica',
    subTitle:
      'Gestisci i prodotti PagoPA attivi per questo ente. Se hai i permessi, puoi anche aderire a nuovi prodotti.',
    sideMenu: {
      institutionManagement: {
        title: 'Gestione Ente',
        overview: {
          title: 'Panoramica',
        },
        referents: {
          title: 'Utenti',
        },
        groups: {
          title: 'Gruppi',
        },
      },
      product: {
        overview: 'Panoramica',
        users: 'Utenti',
      },
    },
    activeProductsSection: {
      title: 'Prodotti attivi',
    },
    activeProducts: {
      activationOf: 'Attivo dal ',
      active: 'Attivo',
      manageButton: 'Gestisci',
      activeProductsEnvModal: {
        title: 'In quale ambiente vuoi entrare?',
        message:
          'L’ambiente di test ti permette di conoscere <1>{{productTitle}}</1> e fare prove in tutta sicurezza. L’ambiente di produzione è il prodotto vero e proprio.',
        envProdButton: 'Produzione',
        envTestButton: 'Test',
      },
    },
    lastServiceActive: 'Ultimo servizio attivato: ',
    notActiveProductsSection: {
      title: 'Prodotti disponibili',
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
      modify: 'Modifica',
      uploadError: {
        title: 'Caricamento non riuscito',
        description:
          'Il caricamento del logo non è andato a buon fine. Verifica che il formato e la dimensione siano corretti e caricalo di nuovo',
      },
      modifyError: {
        title: 'Caricamento non riuscito',
        description: 'Spiacenti, qualcosa è andato storto. Riprova più tardi',
      },
      size: 'Dimensione massima 300 x <1/> 300px - Formato .png',
      info: 'Inserisci solo il logo del tuo ente. <1/> Sarai responsabile dell’inserimento di immagini diverse da quella indicata. ',
    },
    partyDetail: {
      institutionType: 'Tipologia',
      category: 'Categoria',
      originId: 'Codice',
      companyName: 'Ragione sociale',
      fiscalCode: 'Codice Fiscale',
      pec: 'Indirizzo PEC primario',
      registeredOffice: 'Sede Legale',
      recipientCode: 'Codice destinatario',
      contactToModify:
        "<0>Vuoi modificare questi dati? <1>Vai al sito</1> dell'Indice della Pubblica Amministrazione (IPA)</0>",
      institutionTypeValue: {
        GSP: 'Gestore di servizi pubblici',
        PA: 'Pubblica Amministrazione',
        PT: 'Società a controllo pubblico',
        SCP: 'Partner tecnologico',
        PSP: 'Prestatori Servizi di Pagamento',
      },
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
