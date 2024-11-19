export default {
  session: {
    expired: {
      title: 'Session expired',
      message: 'You are being redirected to the login page...',
    },
  },
  partySelection: {
    title: 'Select your institution',
    subTitle:
      'Se operi per più enti, potrai modificare la tua scelta dopo aver <1 /> effettuato l’accesso.',
    partyStatus: {
      pending: 'To be completed',
      toBeValidated: 'Wait',
    },
    continueButton: 'Login',
    backButton: 'Go back',
    label: 'Search for the institution',
    notFoundResults: 'No result',
  },
  noActiveParty: {
    pending: {
      title: 'There are no registration requests <1 /> for this institution',
      description:
        "Registration may still be in progress. <1 /> Check that all required steps have been completed.",
    },
    toBeValidated: {
      title: 'The registration request is <1 />is being validated',
      description:
        'La richiesta di registrazione per l’ente {{partyName}} deve <3 />essere ancora confermata. Per accedere, attendi la conferma <5 />che arriverà all’indirizzo PEC dell’ente.',
    },
    close: 'Close',
  },
  noParty: {
    title: 'Access not permitted',
    description:
      'L’Area Riservata è dedicata agli enti che utilizzano i prodotti <1 /> PagoPA.  Se lavori per un ente, chiedi a un Amministratore <3 /> di aggiungerti nella sezione Utenti.',
    backHome: 'Close',
    addAdmin:'Gli attuali Amministratori non sono più disponibili e hai l’esigenza<1 /> di gestire i prodotti? <3>Aggiungi un nuovo Amministratore</3>',
    moreInformationOnRoles:'Più informazioni sui ruoli',
  },
  activeProductCard: {
    disableInfo: 'To manage this product, contact one of your administrators',
  },
  overview: {
    title: 'Overview',
    subTitle:
      'Gestisci i prodotti PagoPA attivi e, se hai i permessi, puoi aderire a nuovi prodotti.',
    sideMenu: {
      institutionManagement: {
        title: 'Institution management',
        overview: {
          title: 'Overview',
        },
        delegations: {
          title: 'Delegations',
        },
        referents: {
          title: 'Users',
        },
        groups: {
          title: 'Groups',
        },
        invoices: {
          title: 'Invoicing',
        },
      },
      product: {
        overview: 'Overview',
        users: 'Users',
      },
    },
    activeProductsSection: {
      title: 'Active products',
    },
    activeProducts: {
      activationOf: 'Active since ',
      active: 'Active',
      premiumProduct: 'Premium',
      manageButton: 'Manage',
      activeProductsEnvModal: {
        title: 'Which environment do you want to enter?',
        message: `Sei stato abilitato ad operare negli ambienti riportati di seguito per il prodotto <1>{{productTitle}}</1>.`,
        messageProduct:
          'L’ambiente di test ti permette di conoscere <1>{{productTitle}}</1> e fare prove in tutta sicurezza. L’ambiente di Produzione è il prodotto in esercizio effettivo.',
        devEnviromentMessage:
          'Ti permette di conoscere il prodotto e fare prove in tutta sicurezza',
        uatEnviromentMessage: 'It allows you to explore the product',
        prodEnviromentMessage: 'Product in use',
        envDevButton: 'Test environment',
        envLocalButton: 'Local environment',
        envUatButton: 'Certification environment',
        envProdButton: 'Production environment',
        enterButton: 'Enter',
        backButton: 'Cancel',
      },
    },
    lastServiceActive: 'Last service activated: ',
    notActiveProductsSection: {
      title: 'Available products',
    },
    notActiveProducts: {
      joinButton: 'Register',
    },
    depictOf: 'Representation of',
    discoverMore: '<0> DISCOVER MORE → </0>',
    adhesionPopup: {
      title: 'Registration in progress',
      description:
        'Per questo prodotto c’è già una richiesta di adesione in corso. Vuoi procedere lo stesso?',
      confirmButton: 'Proceed with a new registration',
      closeButton: 'Exit',
    },
    partyLogo: {
      upload: "Upload your institution’s logo",
      modify: 'Change image',
      uploadError: {
        title: 'Uploading unsuccessful',
        description:
          'Il caricamento del logo non è andato a buon fine. Verifica che il formato e la dimensione siano corretti e caricalo di nuovo',
      },
      modifyError: {
        title: 'Uploading unsuccessful',
        description: 'Sorry, something went wrong. Try again later',
      },
      size: 'Exact dimensions 300 x <1/> 300px - Format .png',
      info: 'Enter only the logo of your institution. You will be responsible for entering images different than the one indicated.',
      infoEditLabel: 'Exact dimensions 300 x 300px - Format .jpg or .png',
    },
    changeDetails: 'Manage the institution data',
    partyDetail: {
      institutionType: 'Type',
      category: 'Category',
      originId: 'Code',
      companyName: 'Company name',
      denomination: 'Name',
      structure: 'Structure',
      uniqueCode: 'Univocal code',
      geographicTaxonomies: {
        label: 'Geographical area',
        modalSections: {
          national: 'National',
          local: 'Local',
          inputLabel: 'City, Province or Region',
          addMoreArea: 'Add area',
          error: {
            notMatchedArea: 'Select a city from the list',
          },
        },
        firstTimeInsertGeographicTaxonomiesModal: {
          title: 'Indicate the geographical area',
          description:
            'Seleziona il territorio in cui opera il tuo ente. Se locale, puoi scegliere una o più aree di competenza. La scelta verrà applicata a tutti i prodotti PagoPA a cui l’ente aderirà.',
          add: 'Add',
        },
        addNewGeographicTaxonomiesModal: {
          title: 'Change the geographical area',
          description:
            'Seleziona il territorio in cui opera il tuo ente. Se locale, puoi scegliere una o più aree di competenza. La modifica verrà applicata a tutti i prodotti PagoPA a cui l’ente ha già aderito.',
          modify: 'Modify',
          back: 'Exit',
        },
      },
      fiscalCode: 'Fiscal code',
      pec: 'Primary PEC address',
      registeredOffice: 'Registered office',
      sdiCode: 'SDI code',
      aooParentCode: 'AOO (Homogeneous Organizational Area) of reference',
      contactToModify:
        "<0>Some data cannot be changed in this section. To do so, go to the website of the Public Administration Index (IPA)</0>",
      goToIPA: 'Visit the website',
      institutionTypeValue: {
        GSP: 'Public Service Provider',
        PA: 'Public Administration',
        PT: 'Technological partner',
        SCP: 'State-owned companies',
        PSP: 'Payment Service Providers',
        SA: 'Private e-procurement platform operator',
        AS: 'Insurance company',
        PG: 'Company',
        REC: 'Delivering party',
        CON: 'Consolidator',
      },
      delegationBanner: {
        title: 'Delegate the management of products to a Partner or an Intermediary',
        subTitle:
          'Se ti avvali di figure come Partner o Intermediari tecnologici, puoi delegare la gestione di alcuni prodotti.',
        goToButton: 'Go',
      },
      vatNumberGroupValues: {
        yes: 'Yes',
        no: 'No',
      },
      supportEmail: 'Email address visible to citizens',
      vatNumberGroup: 'Group VAT no.',
      isTaxCodeEquals2Piva: 'Fiscal code/VAT no.',
      vatNumber: 'VAT no.',
    },
    delegationsPage: {
      title: 'Delegations',
      subTitle: 'Add or display the delegations for product management. ',
      whatIsDelegation: 'What is a delegation?',
      addDelegationsBtn: 'Add delegation',
      delegationsNavigationBar: {
        redirectDescription: 'Overview',
        titlePageDescription: 'Delegations',
      },
      productsSection: {
        title: 'Products',
        labelDelegates: 'Representative',
        noDelegatesLabel: 'No representative for this product. <1>Add delegation</1>',
      },
    },
    ptPage: {
      title: 'Managed institutions',
      subTitle:
        'Qui trovi l’elenco degli enti che ti hanno delegato la gestione di uno o più prodotti. ',
      tableEmptyLabel: 'You do not represent any institution.',
      headerPtTableLabels: {
        party: 'Institution',
        taxCode: 'Fiscal code',
        product: 'Product',
        createdAt: 'Delegated on',
      },
      bodyPtTable: {
        showMoreButtonLabel: 'See all',
      },
      filterTechPartner: {
        searchBy: 'Search by',
        insert: 'Enter',
        name: 'Name',
        taxCode: 'Fiscal code',
        textfieldLabel: 'Search by name',
        productSelectLabel: 'Product',
        buttonLabel: 'Filter',
        allProductsLabel: 'All products',
        resetFilter: 'Reset filters',
        emptyFilterResult:
          'I filtri che hai applicato non hanno dato nessun risultato. <1>Rimuovi filtri</1>',
      },
    },
    genericError: {
      title: 'Sorry, something went wrong.',
      description: `A causa di un errore del sistema non è possibile completare la procedura.
      <1/>
      Ti chiediamo di riprovare più tardi.`,
      backAction: 'Close',
    },
  },
  addDelegationPage: {
    title: 'Add delegation',
    subTitle: 'Select the product and indicate who can manage it on behalf of the institution.',
    navigationBar: {
      overview: 'Overview',
      delegations: 'Delegations',
      addDelegation: 'Add delegation',
    },
    addOneDelegation: 'Add a delegation',
    formSubTitle: 'Indicate for which product you want to delegate management',
    findOutMore: 'Questions? Consult the manual',
    chooseProduct: 'Select the product',
    selectTechPartner: {
      title: 'Select who will manage the product',
      subTitle: 'Search using the company name or fiscal code of the institution',
      radioName: 'Company name',
      radioFiscalCode: 'Company Fiscal Code',
      labelName: 'Enter the company name',
      labelFiscalCode: 'Enter the fiscal code',
      groupByName: 'Company name',
      groupByFiscalCode: 'Fiscal code',
      notFoundTechPartnerOptions: 'No result',
      actions: {
        back: 'Go back',
        continue: 'Continue',
        exit: 'Exit',
        confirm: 'Confirm',
      },
    },
    delegationSuccessfulCreated: 'Delegation added correctly.',
    delegationNotCreated: 'It was not possible to add the delegation. Try again.',
    alreadyDelegated: 'The selected partner is already associated with the institution.',
  },
  subHeader: {
    partySelectionSearch: {
      title: 'Managed institutions',
      label: 'Managed institutions',
    },
    backButton: 'Exit',
  },
  SessionModalInteropProduct: {
    closeButton: 'Cancel',
    confirmButton: 'Try again',
    testLabel: 'Test',
    uatLabel: 'Certification',
  },
};
