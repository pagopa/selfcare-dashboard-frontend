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
    partyStatus: {
      pending: 'Da completare',
      toBeValidated: 'In attesa',
    },
    continueButton: 'Accedi',
    backButton: 'Indietro',
    label: 'Cerca ente',
    notFoundResults: 'Nessun risultato',
  },
  noActiveParty: {
    pending: {
      title: 'Non risultano richieste di <1 /> adesione per questo ente',
      description:
        "L'adesione potrebbe essere ancora in corso. <1 /> Verifica che tutti i passaggi richiesti siano stati completati.",
    },
    toBeValidated: {
      title: 'La richiesta di registrazione è <1 />in attesa di validazione',
      description:
        'La richiesta di registrazione per l’ente {{partyName}} deve <3 />essere ancora confermata. Per accedere, attendi la conferma <5 />che arriverà all’indirizzo PEC dell’ente.',
    },
    close: 'Chiudi',
  },
  noParty: {
    title: 'Accesso non consentito',
    description:
      'L’Area Riservata è dedicata agli enti che utilizzano i prodotti <1 /> di PagoPA.  Se lavori per un ente, chiedi a un <3 /> Amministratore di aggiungerti nella sezione Utenti.',
    backHome: 'Chiudi',
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
        delegations: {
          title: 'Deleghe',
        },
        referents: {
          title: 'Utenti',
        },
        groups: {
          title: 'Gruppi',
        },
        invoices: {
          title: 'Fatturazione',
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
      premiumProduct: 'Premium',
      manageButton: 'Gestisci',
      activeProductsEnvModal: {
        title: 'In quale ambiente vuoi entrare?',
        message: `Sei stato abilitato ad operare in entrambi gli ambienti. Ti ricordiamo che l’ambiente di collaudo ti permette di conoscere <1>{{productTitle}}</1> e fare prove in tutta sicurezza. L’ambiente di produzione è il prodotto in esercizio.`,
        messageProduct:
          'L’ambiente di test ti permette di conoscere <1>{{productTitle}}</1> e fare prove in tutta sicurezza. L’ambiente di Produzione è il prodotto in esercizio effettivo.',
        envProdButton: 'Produzione',
        backButton: 'Annulla',
      },
    },
    lastServiceActive: 'Ultimo servizio attivato: ',
    notActiveProductsSection: {
      title: 'Prodotti disponibili',
    },
    notActiveProducts: {
      joinButton: 'Aderisci',
    },
    depictOf: 'Rappresentazione di',
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
      size: 'Dimensione esatta 300 x <1/> 300px - Formato .png',
      info: 'Inserisci solo il logo del tuo ente. <1/> Sarai responsabile dell’inserimento di immagini diverse da quella indicata. ',
      infoEditLabel: 'Dimensione esatta 300 x 300px - Formato .jpg o .png',
    },
    partyDetail: {
      institutionType: 'Tipologia',
      category: 'Categoria',
      originId: 'Codice',
      companyName: 'Ragione sociale',
      denomination: 'Denominazione',
      structure: 'Struttura',
      uniqueCode: 'Codice Univoco',
      geographicTaxonomies: {
        label: 'Area geografica',
        modalSections: {
          national: 'Nazionale',
          local: 'Locale',
          inputLabel: 'Comune, Provincia o Regione',
          addMoreArea: 'Aggiungi area',
          error: {
            notMatchedArea: 'Scegli una località presente nell’elenco',
          },
        },
        firstTimeInsertGeographicTaxonomiesModal: {
          title: 'Indica l’area geografica',
          description:
            'Seleziona il territorio in cui opera il tuo ente. Se locale, puoi scegliere una o più aree di competenza. La scelta verrà applicata a tutti i prodotti PagoPA a cui l’ente aderirà.',
          add: 'Aggiungi',
        },
        addNewGeographicTaxonomiesModal: {
          title: 'Modifica l’area geografica',
          description:
            'Seleziona il territorio in cui opera il tuo ente. Se locale, puoi scegliere una o più aree di competenza. La modifica verrà applicata a tutti i prodotti PagoPA a cui l’ente ha già aderito.',
          modify: 'Modifica',
          back: 'Esci',
        },
      },
      fiscalCode: 'Codice Fiscale',
      pec: 'Indirizzo PEC primario',
      registeredOffice: 'Sede Legale',
      sdiCode: 'Codice SDI',
      aooParentCode: 'AOO di riferimento',
      contactToModify:
        "<0>Alcuni dati non sono modificabili da questa sezione. Per farlo, <1>vai al sito</1> dell'Indice della Pubblica Amministrazione (IPA)</0>",
      institutionTypeValue: {
        GSP: 'Gestore di servizi pubblici',
        PA: 'Pubblica Amministrazione',
        PT: 'Partner tecnologico',
        SCP: 'Società a controllo pubblico',
        PSP: 'Prestatori Servizi di Pagamento',
        SA: 'Gestore privato di piattaforma e-procurement',
        AS: 'Società di assicurazione',
        PG: 'Azienda',
        REC: 'Recapitista',
        CON: 'Consolidatore',
      },
      delegationBanner: {
        title: 'Delega la gestione dei prodotti a un Partner o a un Intermediario',
        subTitle:
          'Se ti avvali di figure come Partner o Intermediari tecnologici, puoi delegare la gestione di alcuni prodotti.',
        goToButton: 'Vai',
      },
      vatNumberGroupValues: {
        yes: 'Sì',
        no: 'No',
      },
      supportEmail: 'Indirizzo email visibile ai cittadini',
      vatNumberGroup: 'Partita IVA di gruppo',
      isTaxCodeEquals2Piva: 'Codice Fiscale / P.IVA',
      vatNumber: 'Partita IVA',
    },
    delegationsPage: {
      title: 'Deleghe',
      subTitle: 'Aggiungi o visualizza i delegati per la gestione dei prodotti. ',
      addDelegationsBtn: 'Aggiungi delega',
      delegationsNavigationBar: {
        redirectDescription: 'Panoramica',
        titlePageDescription: 'Deleghe',
      },
      productsSection: {
        title: 'Prodotti',
        labelDelegates: 'Delegato',
        noDelegatesLabel: 'Nessun delegato per questo prodotto. <1>Aggiungi delega</1>',
      },
    },
    ptPage: {
      title: 'I tuoi enti',
      subTitle:
        'Qui trovi l’elenco degli enti che ti hanno delegato la gestione di uno o più prodotti. ',
      tableEmptyLabel: 'Non hai ancora nessuna delega dagli enti',
      headerPtTableLabels: {
        party: 'Ente',
        product: 'Prodotto',
      },
      bodyPtTable: {
        showMoreButtonLabel: 'Vedi tutti',
      },
      filterTechPartner: {
        textfieldLabel: 'Cerca per nome',
        productSelectLabel: 'Prodotto',
        buttonLabel: 'Filtra',
        allProductsLabel: 'Tutti  i prodotti',
        resetFilter: 'Annulla filtri',
        emptyFilterResult:
          'I filtri che hai applicato non hanno dato nessun risultato. <1>Rimuovi filtri</1>',
      },
    },
    genericError: {
      title: 'Spiacenti, qualcosa è andato storto.',
      description: `A causa di un errore del sistema non è possibile completare la procedura.
      <1/>
      Ti chiediamo di riprovare più tardi.`,
      backAction: 'Chiudi',
    },
  },
  addDelegationPage: {
    title: 'Aggiungi delega',
    subTitle:
      "Qui trovi l'elenco dei Partner e degli Intermediari Tecnologici presenti in Area Riservata.",
    navigationBar: {
      overview: 'Panoramica',
      delegations: 'Deleghe',
      addDelegation: 'Aggiungi delega',
    },
    addOneDelegation: 'Aggiungi una delega',
    formSubTitle: 'Scegli il prodotto per il quale vuoi aggiungere una delega',
    findOutMore: 'Dubbi? Vai al manuale',
    chooseProduct: 'Scegli il prodotto',
    selectTechPartner: {
      title: 'Seleziona un Partner Tecnologico o Intermediario',
      subTitle: 'Digita il nome oppure scegli dalla lista',
      label: 'Seleziona o scegli dalla lista',
      groupByName: 'Nome',
      notFoundTechPartnerOptions: 'Nessun risultato',
      actions: {
        back: 'Indietro',
        continue: 'Continua',
        exit: 'Esci',
        confirm: 'Conferma',
      },
    },
    delegationSuccessfulCreated: 'Delega aggiunta correttamente.',
    delegationNotCreated: 'Non è stato possibile aggiungere la delega. Riprova.',
    alreadyDelegated: 'Il Partner selezionato risulta già associato all’ente.',
  },
  subHeader: {
    partySelectionSearch: {
      title: 'I tuoi enti',
      label: 'I tuoi enti',
    },
    backButton: 'Esci',
  },
  SessionModalInteropProduct: {
    closeButton: 'Annulla',
    confirmButton: 'Riprova',
    testLabel: 'Collaudo',
  },
};
