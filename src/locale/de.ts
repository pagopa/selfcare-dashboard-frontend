export default {
  session: {
    expired: {
      title: 'Sitzung abgelaufen',
      message: 'Du wirst zur Anmeldeseite weitergeleitet...',
    },
  },
  partySelection: {
    title: 'Wähle deine Körperschaft',
    subTitle:
      'Se operi per più enti, potrai modificare la tua scelta dopo aver <1 /> effettuato l’accesso.',
    partyStatus: {
      pending: 'Zu vervollständigen',
      toBeValidated: 'Warten',
    },
    continueButton: 'Anmelden',
    backButton: 'Zurück',
    label: 'Körperschaft suchen',
    notFoundResults: 'Kein Ergebnis',
  },
  noActiveParty: {
    pending: {
      title: 'Es liegen keine <1 /> Beitrittsanträge für diese Körperschaft vor',
      description:
        "Der Beitritt wird möglicherweise noch bearbeitet. <1 /> Überprüfe, ob alle erforderlichen Schritte abgeschlossen sind.",
    },
    toBeValidated: {
      title: 'Die Registrierungsanfrage ist <1 />noch nicht validiert',
      description:
        'La richiesta di registrazione per l’ente {{partyName}} deve <3 />essere ancora confermata. Per accedere, attendi la conferma <5 />che arriverà all’indirizzo PEC dell’ente.',
    },
    close: 'Beenden',
  },
  noParty: {
    title: 'Zugriff unzulässig',
    description:
      'L’Area Riservata è dedicata agli enti che utilizzano i prodotti <1 /> PagoPA.  Se lavori per un ente, chiedi a un Amministratore <3 /> di aggiungerti nella sezione Utenti.',
    backHome: 'Beenden',
    addAdmin:'Gli attuali Amministratori non sono più disponibili e hai l’esigenza<1 /> di gestire i prodotti? <3>Aggiungi un nuovo Amministratore</3>',
    moreInformationOnRoles:'Più informazioni sui ruoli',
  },
  activeProductCard: {
    disableInfo: 'Um dieses Produkt zu verwalten, frage einen seiner Administratoren',
  },
  overview: {
    title: 'Übersicht',
    subTitle:
      'Gestisci i prodotti PagoPA attivi e, se hai i permessi, puoi aderire a nuovi prodotti.',
    sideMenu: {
      institutionManagement: {
        title: 'Körperschaftsverwaltung',
        overview: {
          title: 'Übersicht',
        },
        delegations: {
          title: 'Vollmachten',
        },
        referents: {
          title: 'Benutzer',
        },
        groups: {
          title: 'Gruppen',
        },
        invoices: {
          title: 'Rechnungsstellung',
        },
      },
      product: {
        overview: 'Übersicht',
        users: 'Benutzer',
      },
    },
    activeProductsSection: {
      title: 'Aktive Produkte',
    },
    activeProducts: {
      activationOf: 'Aktiv seit ',
      active: 'Aktiv',
      premiumProduct: 'Premium',
      manageButton: 'Verwalten',
      activeProductsEnvModal: {
        title: 'In welche Umgebung möchtest du?',
        message: `Sei stato abilitato ad operare negli ambienti riportati di seguito per il prodotto <1>{{productTitle}}</1>.`,
        messageProduct:
          'L’ambiente di test ti permette di conoscere <1>{{productTitle}}</1> e fare prove in tutta sicurezza. L’ambiente di Produzione è il prodotto in esercizio effettivo.',
        devEnviromentMessage:
          'Ti permette di conoscere il prodotto e fare prove in tutta sicurezza',
        uatEnviromentMessage: 'Hiermit kannst du das Produkt erkunden',
        prodEnviromentMessage: 'Verwendetes Produkt',
        envDevButton: 'Testumgebung',
        envLocalButton: 'Lokale Umgebung',
        envUatButton: 'Bescheinigungsumgebung',
        envProdButton: 'Produktionsumgebung',
        enterButton: 'Einwählen',
        backButton: 'Abbrechen',
      },
    },
    lastServiceActive: 'Letzter aktivierter Dienst: ',
    notActiveProductsSection: {
      title: 'Verfügbare Produkte',
    },
    notActiveProducts: {
      joinButton: 'Beitreten',
    },
    depictOf: 'Darstellung von',
    discoverMore: '<0> MEHR HIERZU → </0>',
    adhesionPopup: {
      title: 'Beitritt wird bearbeitet',
      description:
        'Per questo prodotto c’è già una richiesta di adesione in corso. Vuoi procedere lo stesso?',
      confirmButton: 'Mit neuem Beitritt fortfahren',
      closeButton: 'Beenden',
    },
    partyLogo: {
      upload: "Logo der Körperschaft laden",
      modify: 'Anderes Bild wählen',
      uploadError: {
        title: 'Laden fehlgeschlagen',
        description:
          'Il caricamento del logo non è andato a buon fine. Verifica che il formato e la dimensione siano corretti e caricalo di nuovo',
      },
      modifyError: {
        title: 'Laden fehlgeschlagen',
        description: 'Leider ist etwas schiefgelaufen. Bitte später erneut versuchen',
      },
      size: 'Genaue Größe 300 x <1/> 300px - Format .png',
      info: 'Füg nur das Logo deiner Körperschaft ein. Du bist für das Einfügen anderer Bilder als der angegebenen verantwortlich.',
      infoEditLabel: 'Genaue Größe 300 x  300px - Format .jpg oder .png',
    },
    changeDetails: 'Daten der Körperschaft verwalten',
    partyDetail: {
      institutionType: 'Typ',
      category: 'Kategorie',
      originId: 'Code',
      companyName: 'Firmenbezeichnung',
      denomination: 'Bezeichnung',
      structure: 'Struktur',
      uniqueCode: 'Eindeutiger Code',
      geographicTaxonomies: {
        label: 'Geografisches Gebiet',
        modalSections: {
          national: 'National',
          local: 'Lokal',
          inputLabel: 'Gemeinde, Provinz oder Region',
          addMoreArea: 'Gebiet hinzufügen',
          error: {
            notMatchedArea: 'Wähle einen Ort aus der Liste',
          },
        },
        firstTimeInsertGeographicTaxonomiesModal: {
          title: 'Geografisches Gebiet angeben',
          description:
            'Seleziona il territorio in cui opera il tuo ente. Se locale, puoi scegliere una o più aree di competenza. La scelta verrà applicata a tutti i prodotti PagoPA a cui l’ente aderirà.',
          add: 'Hinzufügen',
        },
        addNewGeographicTaxonomiesModal: {
          title: 'Geografisches Gebiet ändern',
          description:
            'Seleziona il territorio in cui opera il tuo ente. Se locale, puoi scegliere una o più aree di competenza. La modifica verrà applicata a tutti i prodotti PagoPA a cui l’ente ha già aderito.',
          modify: 'Ändern',
          back: 'Beenden',
        },
      },
      fiscalCode: 'Steuernummer',
      pec: 'Primäre PEC-Adresse',
      registeredOffice: 'Geschäftssitz',
      sdiCode: 'SDI-Code',
      aooParentCode: 'Referenz-AOO',
      contactToModify:
        "<0>Einige Daten können in diesem Abschnitt nicht geändert werden. Gehe hierzu auf die Website des Index der öffentlichen Verwaltung (IPA)</0>",
      goToIPA: 'Besuche die Website',
      institutionTypeValue: {
        GSP: 'Betreiber öffentlicher Dienstleistungen',
        PA: 'Öffentliche Verwaltung',
        PT: 'Technologischer Partner',
        SCP: 'Öffentlich kontrollierte Gesellschaft',
        PSP: 'Zahlungsverkehrsdienstleister',
        SA: 'Privater Betreiber einer E-Beschaffungsplattform',
        AS: 'Versicherungsgesellschaft',
        PG: 'Unternehmen',
        REC: 'Zusteller',
        CON: 'Konsolidierer',
      },
      delegationBanner: {
        title: 'Betraut einen Partner oder Vermittler mit dem Produktmanagement',
        subTitle:
          'Se ti avvali di figure come Partner o Intermediari tecnologici, puoi delegare la gestione di alcuni prodotti.',
        goToButton: 'Gehe zu',
      },
      vatNumberGroupValues: {
        yes: 'Ja',
        no: 'Nein',
      },
      supportEmail: 'E-Mail-Adresse für Bürger sichtbar',
      vatNumberGroup: 'USt.-IdNr. Gruppe',
      isTaxCodeEquals2Piva: 'Steuernummer / USt.IdNr.',
      vatNumber: 'USt.-IdNr.',
    },
    delegationsPage: {
      title: 'Vollmachten',
      subTitle: 'Füge Bevollmächtigte für das Produktmanagement hinzu oder zeige sie an. ',
      whatIsDelegation: 'Was ist eine Vollmacht?',
      addDelegationsBtn: 'Vollmacht hinzufügen',
      delegationsNavigationBar: {
        redirectDescription: 'Übersicht',
        titlePageDescription: 'Vollmachten',
      },
      productsSection: {
        title: 'Produkte',
        labelDelegates: 'Bevollmächtigter',
        noDelegatesLabel: 'Kein Bevollmächtigter für dieses Produkt <1>Vollmacht hinzufügen</1>',
      },
    },
    ptPage: {
      title: 'Verwaltete Körperschaften',
      subTitle:
        'Qui trovi l’elenco degli enti che ti hanno delegato la gestione di uno o più prodotti. ',
      tableEmptyLabel: 'Du wurdest noch von keiner Körperschaft bevollmächtigt.',
      headerPtTableLabels: {
        party: 'Körperschaft',
        taxCode: 'Steuernummer',
        product: 'Produkt',
        createdAt: 'Bevollmächtigt am',
      },
      bodyPtTable: {
        showMoreButtonLabel: 'Alle ansehen',
      },
      filterTechPartner: {
        searchBy: 'Suchen nach',
        insert: 'Einfügen',
        name: 'Name',
        taxCode: 'Steuernummer',
        textfieldLabel: 'Suchen nach Namen',
        productSelectLabel: 'Produkt',
        buttonLabel: 'Filtern',
        allProductsLabel: 'Alle Produkte',
        resetFilter: 'Filter entfernen',
        emptyFilterResult:
          'I filtri che hai applicato non hanno dato nessun risultato. <1>Rimuovi filtri</1>',
      },
    },
    genericError: {
      title: 'Leider ist etwas schiefgelaufen.',
      description: `A causa di un errore del sistema non è possibile completare la procedura.
      <1/>
      Ti chiediamo di riprovare più tardi.`,
      backAction: 'Schließen',
    },
  },
  addDelegationPage: {
    title: 'Vollmacht hinzufügen',
    subTitle: 'Wähle das Produkt und gib an, wer es im Namen deiner Körperschaft verwalten kann.',
    navigationBar: {
      overview: 'Übersicht',
      delegations: 'Vollmachten',
      addDelegation: 'Vollmacht hinzufügen',
    },
    addOneDelegation: 'Eine Vollmacht hinzufügen',
    formSubTitle: 'Gib an, für welches Produkt du die Verwaltung bevollmächtigen möchtest',
    findOutMore: 'Zweifel? Zur Anleitung',
    chooseProduct: 'Wähle das Produkt',
    selectTechPartner: {
      title: 'Wähle, wer das Produkt verwalten soll',
      subTitle: 'Suche über die Firmenbezeichnung oder die Steuernummer der Körperschaft',
      radioName: 'Firmenbezeichnung',
      radioFiscalCode: 'Steuernummer der Körperschaft',
      labelName: 'Firmenbezeichnung eingeben',
      labelFiscalCode: 'Steuernummer eingeben',
      groupByName: 'Firmenbezeichnung',
      groupByFiscalCode: 'Steuernummer',
      notFoundTechPartnerOptions: 'Kein Ergebnis',
      actions: {
        back: 'Zurück',
        continue: 'Weiter',
        exit: 'Beenden',
        confirm: 'Bestätigen',
      },
    },
    delegationSuccessfulCreated: 'Vollmacht korrekt hinzugefügt',
    delegationNotCreated: 'Die Vollmacht konnte nicht hinzugefügt werden. Erneut versuchen.',
    alreadyDelegated: 'Der gewählte Partner ist bereits mit der Körperschaft verbunden',
  },
  subHeader: {
    partySelectionSearch: {
      title: 'Verwaltete Körperschaften',
      label: 'Verwaltete Körperschaften',
    },
    backButton: 'Beenden',
  },
  SessionModalInteropProduct: {
    closeButton: 'Abbrechen',
    confirmButton: 'Erneut versuchen',
    testLabel: 'Test',
    uatLabel: 'Bescheinigung',
  },
};
