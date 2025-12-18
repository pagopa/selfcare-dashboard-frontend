export default {
  session: {
    expired: {
      title: 'Seja je potekla',
      message: 'Preusmerjeni boste na stran za prijavo ...',
    },
  },
  partySelection: {
    title: 'Izberite svojo organizacijo',
    subTitle:
      'Se operi per più enti, potrai modificare la tua scelta dopo aver <1 /> effettuato l’accesso.',
    partyStatus: {
      pending: 'Izpolniti',
      toBeValidated: 'V postopku',
    },
    continueButton: 'Prijavite se',
    backButton: 'Nazaj',
    label: 'Poiščite organizacijo',
    notFoundResults: 'Brez rezultatov',
  },
  searchBackstagePage:{
    supportRole: 'Podpora'
  },
  noActiveParty: {
    pending: {
      title: 'Za to organizacijo ni prošenj za <1 /> članstvo',
      description:
        'Članstvo morda še traja. <1 /> Preverite, ali so bili opravljeni vsi zahtevani koraki.',
    },
    toBeValidated: {
      title: 'Zahteva za registracijo <1 />v postopku na potrditev',
      description:
        'La richiesta di registrazione per l’ente {{partyName}} deve <3 />essere ancora confermata. Per accedere, attendi la conferma <5 />che arriverà all’indirizzo PEC dell’ente.',
    },
    close: 'Zapri',
  },
  noParty: {
    title: 'Dostop ni dovoljen',
    description:
      'L’Area Riservata è dedicata agli enti che utilizzano i prodotti <1 /> PagoPA.  Se lavori per un ente, chiedi a un Amministratore <3 /> di aggiungerti nella sezione Utenti.',
    backHome: 'Zapri',
    addAdmin:
      'Gli attuali Amministratori non sono più disponibili e hai l’esigenza<1 /> di gestire i prodotti? <3>Aggiungi un nuovo Amministratore</3>',
    moreInformationOnRoles: 'Più informazioni sui ruoli',
  },
  activeProductCard: {
    disableInfo: 'Za upravljanje tega produkta se obrnite na enega od njegovih skrbnikov',
  },
  overview: {
    title: 'Pregled',
    subTitle:
      'Gestisci i prodotti PagoPA attivi e, se hai i permessi, puoi aderire a nuovi prodotti.',
    sideMenu: {
      institutionManagement: {
        title: 'Upravljanje organizacije',
        overview: {
          title: 'Pregled',
        },
        delegations: {
          title: 'Pooblastila',
        },
        referents: {
          title: 'Uporabniki',
        },
        groups: {
          title: 'Skupine',
        },
        invoices: {
          title: 'Obračunavanje',
        },
        contracts: {
          title: 'Pogodbe',
        }
      },
      product: {
        overview: 'Pregled',
        users: 'Uporabniki',
      },
    },
    activeProductsSection: {
      title: 'Aktivni produkti',
    },
    activeProducts: {
      activationOf: 'Aktiven od ',
      active: 'Aktiven',
      premiumProduct: 'Premium',
      manageButton: 'Upravljaj',
      activeProductsEnvModal: {
        title: 'V katero okolje želite vstopiti?',
        message: `Sei stato abilitato ad operare negli ambienti riportati di seguito per il prodotto <1>{{productTitle}}</1>.`,
        messageProduct:
          'L’ambiente di test ti permette di conoscere <1>{{productTitle}}</1> e fare prove in tutta sicurezza. L’ambiente di Produzione è il prodotto in esercizio effettivo.',
        devEnviromentMessage:
          'Ti permette di conoscere il prodotto e fare prove in tutta sicurezza',
        uatEnviromentMessage: 'Omogoča vam raziskovanje produkta',
        prodEnviromentMessage: 'Produkt v uporabi',
        envDevButton: 'Testno okolje',
        envLocalButton: 'Lokalno okolje',
        envUatButton: 'Okolje za potrjevanje',
        envProdButton: 'Proizvodno okolje',
        enterButton: 'Vnesi',
        backButton: 'Prekliči',
      },
    },
    lastServiceActive: 'Zadnja aktivirana storitev: ',
    notActiveProductsSection: {
      title: 'Produkt na voljo',
    },
    notActiveProducts: {
      joinButton: 'Pridružite se',
    },
    depictOf: 'Zastopanje',
    discoverMore: '<0> IZVEDITE VEČ → </0>',
    adhesionPopup: {
      title: 'Članstvo v teku',
      description:
        'Per questo prodotto c’è già una richiesta di adesione in corso. Vuoi procedere lo stesso?',
      confirmButton: 'Nadaljujte z novim članstvom',
      closeButton: 'Izhod',
    },
    partyLogo: {
      upload: 'Naložite logotip svoje organizacije',
      modify: 'Spremenite sliko',
      uploadError: {
        title: 'Nalaganje ni uspelo',
        description:
          'Il caricamento del logo non è andato a buon fine. Verifica che il formato e la dimensione siano corretti e caricalo di nuovo',
      },
      modifyError: {
        title: 'Nalaganje ni uspelo',
        description: 'Žal, nekaj je šlo narobe. Poskusite znova pozneje',
      },
      size: 'Natančna velikost 300 x <1/> 300px – Format .png',
      info: 'Vnesite samo logotip svoje organizacije. Prevzemate odgovornost za vstavljanje slik, ki so drugačne od navedenih.',
      infoEditLabel: 'Natančna velikost 300 x 300px – Format .jpg ali .png',
    },
    changeDetails: 'Upravljajte podatke organizacije',
    partyDetail: {
      institutionType: 'Tipologija',
      category: 'Kategorija',
      originId: 'Koda',
      companyName: 'Naziv podjetja',
      denomination: 'Naziv',
      structure: 'Struktura',
      uniqueCode: 'Edinstvena koda',
      geographicTaxonomies: {
        label: 'Geografsko območje',
        modalSections: {
          national: 'Nacionalno',
          local: 'Lokalno',
          inputLabel: 'Občina, pokrajina ali regija',
          addMoreArea: 'Dodajte območje',
          error: {
            notMatchedArea: 'Izberite lokacijo s seznama',
          },
        },
        firstTimeInsertGeographicTaxonomiesModal: {
          title: 'Označuje geografsko območje',
          description:
            'Seleziona il territorio in cui opera il tuo ente. Se locale, puoi scegliere una o più aree di competenza. La scelta verrà applicata a tutti i prodotti PagoPA a cui l’ente aderirà.',
          add: 'Dodaj',
        },
        addNewGeographicTaxonomiesModal: {
          title: 'Spremenite geografsko območje',
          description:
            'Seleziona il territorio in cui opera il tuo ente. Se locale, puoi scegliere una o più aree di competenza. La modifica verrà applicata a tutti i prodotti PagoPA a cui l’ente ha già aderito.',
          modify: 'Spremeni',
          back: 'Izhod',
        },
      },
      fiscalCode: 'Davčna številka',
      pec: 'Primarni naslov PEC',
      registeredOffice: 'Registrirani sedež',
      sdiCode: 'Koda SDI',
      aooParentCode: 'Referenca AOO',
      contactToModify:
        '<0>Nekaterih podatkov v tem razdelku ni mogoče spreminjati. To storite tako, da obiščete spletno mesto Indeksa javne uprave (IPA)</0>',
      goToIPA: 'Pojdite na spletno mesto',
      institutionTypeValue: {
        GSP: 'Vodja javne službe',
        PA: 'Javna uprava',
        PT: 'Tehnološki partner',
        SCP: 'Družba pod javnim nadzorom',
        PSP: 'Ponudniki plačilnih storitev',
        SA: 'Zasebni upravitelj platforme za e-javna naročila',
        AS: 'Zavarovalnica',
        PG: 'Agencija',
        REC: 'Dostavljavec',
        CON: 'Združevalec',
      },
      delegationBanner: {
        title: 'Prenesite upravljanje produktov na partnerja ali posrednika',
        subTitle:
          'Se ti avvali di figure come Partner o Intermediari tecnologici, puoi delegare la gestione di alcuni prodotti.',
        goToButton: 'Pojdi',
      },
      vatNumberGroupValues: {
        yes: 'Da',
        no: 'Ne',
      },
      supportEmail: 'E-poštni naslov, viden državljanom',
      vatNumberGroup: 'Številka za DDV skupine',
      isTaxCodeEquals2Piva: 'Davčna številka / Številka za DDV',
      vatNumber: 'Številka za DDV',
    },
    delegationsPage: {
      title: 'Pooblastila',
      subTitle: 'Dodajte ali si oglejte pooblaščence za upravljanje produktov. ',
      whatIsDelegation: 'Kaj je pooblastilo?',
      addDelegationsBtn: 'Dodajte pooblastilo',
      delegationsNavigationBar: {
        redirectDescription: 'Pregled',
        titlePageDescription: 'Pooblastila',
      },
      productsSection: {
        title: 'Produkti',
        labelDelegates: 'Pooblaščenec',
        noDelegatesLabel: 'Za ta izdelek ni pooblaščenca. <1>Dodajte pooblastilo</1>',
      },
    },
    ptPage: {
      title: 'Upravljane organizacije',
      subTitle:
        'Qui trovi l’elenco degli enti che ti hanno delegato la gestione di uno o più prodotti. ',
      tableEmptyLabel: 'Noben organ vas še ni pooblastil.',
      headerPtTableLabels: {
        party: 'Organizacija',
        taxCode: 'Davčna številka',
        product: 'Produkt',
        createdAt: 'Pooblaščeno dne',
      },
      bodyPtTable: {
        showMoreButtonLabel: 'Prikaži vse',
      },
      filterTechPartner: {
        searchBy: 'Išči po',
        insert: 'Vstavi',
        name: 'Ime',
        taxCode: 'Davčna številka',
        textfieldLabel: 'Išči po imenu',
        productSelectLabel: 'Produkt',
        buttonLabel: 'Filtriraj',
        allProductsLabel: 'Vsi produkti',
        resetFilter: 'Odstranite filtre',
        emptyFilterResult:
          'I filtri che hai applicato non hanno dato nessun risultato. <1>Rimuovi filtri</1>',
      },
    },
    genericError: {
      title: 'Žal, nekaj je šlo narobe.',
      description: `A causa di un errore del sistema non è possibile completare la procedura.
      <1/>
      Ti chiediamo di riprovare più tardi.`,
      backAction: 'Zapri',
    },
  },
  addDelegationPage: {
    title: 'Dodajte pooblastilo',
    subTitle: 'Izberite produkt in navedite, kdo ga lahko upravlja v imenu vaše organizacije.',
    navigationBar: {
      overview: 'Pregled',
      delegations: 'Pooblastila',
      addDelegation: 'Dodajte pooblastilo',
    },
    addOneDelegation: 'Dodajte pooblastilo',
    formSubTitle: 'Označite, za kateri produkt želite prenesti upravljanje',
    findOutMore: 'Ste v dvomih? Pojdite na priročnik',
    chooseProduct: 'Izberite produkt',
    selectTechPartner: {
      title: 'Izberite, kdo bo upravljal produkt',
      subTitle: 'Iščite po nazivu podjetja ali davčni številki organizacije',
      radioName: 'Naziv podjetja',
      radioFiscalCode: 'Davčna številka organizacije',
      labelName: 'Vnesite ime svojega podjetja',
      labelFiscalCode: 'Vnesite svojo davčno številko',
      groupByName: 'Naziv podjetja',
      groupByFiscalCode: 'Davčna številka',
      notFoundTechPartnerOptions: 'Brez rezultatov',
      actions: {
        back: 'Nazaj',
        continue: 'Nadaljuj',
        exit: 'Izhod',
        confirm: 'Potrdi',
      },
    },
    delegationSuccessfulCreated: 'Pooblastilo jo bila uspešno dodano.',
    delegationNotCreated: 'Pooblastila ni bilo mogoče dodati. Poskusite znova.',
    alreadyDelegated: 'Izbrani partner je že povezan z organizacijo.',
  },
  subHeader: {
    partySelectionSearch: {
      title: 'Upravljane organizacije',
      label: 'Upravljane organizacije',
    },
    backButton: 'Izhod',
  },
  SessionModalInteropProduct: {
    closeButton: 'Prekliči',
    confirmButton: 'Poskusite znova',
    testLabel: 'Testiranje',
    uatLabel: 'Potrdilo',
  },
};
