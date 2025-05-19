export default {
  customAlert: {
    message:
      '<1>Novità!</1><br />Disponibile dal 31/03/2025 la funzionalità dei <2>Gruppi</2> per IO. Permette di gestire i servizi limitando l’accesso a gruppi specifici di utenti. <3>Come funziona?</3>',
  },
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
      'L’Area Riservata è dedicata agli enti che utilizzano i prodotti <1 /> PagoPA.  Se lavori per un ente, chiedi a un Amministratore <3 /> di aggiungerti nella sezione Utenti.',
    backHome: 'Chiudi',
    addAdmin:
      'Gli attuali Amministratori non sono più disponibili e hai l’esigenza<1 /> di gestire i prodotti? <3>Aggiungi un nuovo Amministratore</3>',
    moreInformationOnRoles: 'Più informazioni sui ruoli',
  },
  activeProductCard: {
    disableInfo: 'Non hai un ruolo per gestire questo prodotto',
  },
  overview: {
    title: 'Panoramica',
    subTitle:
      'Gestisci i prodotti PagoPA attivi e, se hai i permessi, puoi aderire a nuovi prodotti.',
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
        documents: {
          title: 'Documenti',
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
        message: `Sei stato abilitato ad operare negli ambienti riportati di seguito per il prodotto <1>{{productTitle}}</1>.`,
        messageProduct:
          'L’ambiente di test ti permette di conoscere <1>{{productTitle}}</1> e fare prove in tutta sicurezza. L’ambiente di Produzione è il prodotto in esercizio effettivo.',
        devEnviromentMessage:
          'Ti permette di conoscere il prodotto e fare prove in tutta sicurezza',
        uatEnviromentMessage: 'Ti permette di esplorare il prodotto',
        prodEnviromentMessage: 'Prodotto in uso',
        envDevButton: 'Ambiente di Collaudo',
        envLocalButton: 'Ambiente Locale',
        envUatButton: 'Ambiente di Attestazione',
        envProdButton: 'Ambiente di Produzione',
        enterButton: 'Entra',
        backButton: 'Annulla',
      },
      adminLimit: {
        title: 'Non è possibile accedere ',
        message:
          'Il tuo ente ha <1>superato il limite</1> di {{adminLimit}} Amministratori, che è il numero massimo consentito per accedere alla <3>Piattaforma pagoPA.</3><5 /> Per accedere, modifica l’elenco degli Amministratori per questo prodotto.',
        modifyButton: 'Modifica',
        backButton: 'Indietro',
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
    discoverMore: '<0>Scopri di più</0>',
    adhesionPopup: {
      title: 'Adesione in corso',
      description:
        'Per questo prodotto c’è già una richiesta di adesione in corso. Vuoi procedere lo stesso?',
      confirmButton: 'Procedi con una nuova adesione',
      closeButton: 'Esci',
    },
    partyLogo: {
      upload: "Carica il logo dell'ente",
      modify: 'Cambia immagine',
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
      info: 'Inserisci solo il logo del tuo ente. Sarai responsabile dell’inserimento di immagini diverse da quella indicata.',
      infoEditLabel: 'Dimensione esatta 300 x 300px - Formato .jpg o .png',
    },
    changeDetails: 'Gestisci i dati dell’ente',
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
        "<0>Alcuni dati non sono modificabili da questa sezione. Per farlo, vai al sito dell'Indice della Pubblica Amministrazione (IPA)</0>",
      goToIPA: 'Vai al sito',
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
        PRV: 'Privato',
        GPU: 'Gestore di pubblica utilità e/o di interesse generale',
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
      subTitle:
        'Qui trovi l’elenco degli enti a cui hai affidato la gestione di uno o più prodotti. Puoi anche aggiungere una nuova delega.',
      whatIsDelegation: 'Cos’è una delega?',
      addDelegationsBtn: 'Aggiungi delega',
      delegationsNavigationBar: {
        redirectDescription: 'Panoramica',
        titlePageDescription: 'Deleghe',
      },
      productsSection: {
        title: 'Prodotti',
        labelDelegates: 'Delegato',
        noDelegatesLabel: 'Ancora nessuna delega',
        noDelegatesLabelWithLink: 'Ancora nessuna delega,<1> creane una adesso</1>',
      },
    },
    ptPage: {
      title: 'Enti gestiti',
      subTitle:
        'Qui trovi l’elenco degli enti che ti hanno delegato la gestione di uno o più prodotti. ',
      tableEmptyLabel: 'Non sei stato ancora delegato da nessun ente.',
      headerPtTableLabels: {
        party: 'Ente',
        taxCode: 'Codice fiscale',
        product: 'Prodotto',
        createdAt: 'Delegato il',
      },
      bodyPtTable: {
        showMoreButtonLabel: 'Vedi tutti',
      },
      filterTechPartner: {
        searchBy: 'Cerca per',
        insert: 'Inserisci',
        name: 'Nome',
        taxCode: 'Codice fiscale',
        textfieldLabel: 'Cerca per nome',
        productSelectLabel: 'Prodotto',
        buttonLabel: 'Filtra',
        allProductsLabel: 'Tutti  i prodotti',
        resetFilter: 'Rimuovi filtri',
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
    subTitle: 'Scegli il prodotto e indica chi potrà gestirlo per conto del tuo ente.',
    navigationBar: {
      overview: 'Panoramica',
      delegations: 'Deleghe',
      addDelegation: 'Aggiungi delega',
      exit: 'Esci',
    },
    addOneDelegation: 'Aggiungi una delega',
    formSubTitle: 'Indica per quale prodotto vuoi delegare la gestione',
    findOutMore: 'Dubbi? Vai al manuale',
    chooseProduct: 'Scegli il prodotto',
    selectTechPartner: {
      title: 'Scegli chi gestirà il prodotto',
      subTitle: 'Cerca utilizzando la ragione sociale o il Codice Fiscale dell’ente',
      radioName: 'Ragione sociale',
      radioFiscalCode: 'Codice Fiscale ente',
      labelName: 'Inserisci la ragione sociale',
      labelFiscalCode: 'Inserisci il Codice Fiscale',
      groupByName: 'Ragione sociale',
      groupByFiscalCode: 'Codice Fiscale',
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
    confirmModal: {
      title: 'Confermi la delega?',
      description: `Delegando la gestione del prodotto <1>{{productName}}</1> per l’ente <2>{{institutionName}}</2> a <3>{{partnerName}}</3>.<4/> Se confermi, {{partnerName}} potrà gestire il prodotto per conto del tuo ente.`,
      confirmButton: 'Conferma',
      backButton: 'Indietro',
    },
  },
  documents: {
    title: 'Documenti',
    subTitle:
      'Qui puoi visualizzare i tuoi prodotti attivi e scaricare il relativo contratto di adesione. Per farlo, clicca su ‘Vedi di più’.',
    viewMore: 'Vedi di più',
    backButton: 'Esci',
  },
  documentsDetails: {
    firstCard: {
      title: 'DETTAGLI ADESIONE',
      state: 'Stato',
      active: 'Attivo',
    },
    secondCard: {
      title: 'DOCUMENTI',
      noDocumentFound:
        'Non ci è possibile recuperare questo documento, ma la tua adesione al prodotto resta valida.',
    },
  },
  subHeader: {
    partySelectionSearch: {
      title: 'Enti gestiti',
      label: 'Enti gestiti',
    },
    backButton: 'Esci',
  },
  SessionModalInteropProduct: {
    closeButton: 'Annulla',
    confirmButton: 'Riprova',
    testLabel: 'Collaudo',
    uatLabel: 'Attestazione',
  },
};
