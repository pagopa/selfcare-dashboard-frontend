export default {
  contractUpdateWizard: {
    openDevelopment: 'Vertragsaktualisierung ausprobieren',
    exit: 'Verlassen',
    back: 'Zurück',
    continue: 'Weiter',
    steps: {
      institutionData: 'Daten der Einrichtung',
      addLR: 'Gib den Rechtsvertreter an',
      addUsers: 'Gib die Administratoren an',
    },
    institutionData: {
      description:
        'Überprüfen und bestätigen Sie die Daten der Einrichtung und stellen Sie sicher, dass sie korrekt sind.',
      alert:
        'Die Daten Ihrer Einrichtung sind nicht korrekt oder nicht aktuell? Melden Sie dies dem Support, um die Änderung zu veranlassen.',
      contactSupport: 'Support kontaktieren',
      fields: {
        businessName: 'Firmenname',
        registeredOffice: 'Adresse und Hausnummer des Rechtssitzes',
        zipCode: 'PLZ',
        city: 'Stadt',
        county: 'Provinz',
        digitalAddress: 'PEC-Adresse',
        fiscalCode: 'Steuernummer',
        vatNumber: 'MwSt.-Nummer',
        recipientCode: 'SDI-Code',
        supportEmail: 'Für Bürger sichtbare E-Mail-Adresse',
        geographicTaxonomies: 'Geografisches Gebiet',
      },
    },
    addLR: {
      description:
        'Gib die Daten des Rechtsvertreters oder Bevollmächtigten deiner Körperschaft ein. Er ist für die Unterzeichnung des Vertrags für {{productName}} verantwortlich und erhält die Rolle des Administrators für dieses Produkt im reservierten Bereich.',
      rolesInfo: 'Weitere Informationen zu den Rollen',
      fields: {
        name: 'Vorname',
        surname: 'Nachname',
        taxCode: 'Steuernummer',
        email: 'Geschäftliche E-Mail',
      },
      emailHint:
        'Bitte geben Sie die institutionelle E-Mail-Adresse der Organisation ein. PEC-E-Mail-Adressen sind nicht zulässig.',
      errors: {
        required: 'Pflichtfeld',
        nameMismatch: 'Name falsch oder stimmt nicht mit der Steuernummer überein',
        surnameMismatch: 'Nachname falsch oder stimmt nicht mit der Steuernummer überein',
        invalidTaxCode: 'Die eingegebene Steuernummer ist ungültig',
        invalidEmail: 'Die E-Mail-Adresse ist ungültig',
        pecEmail:
          'PEC-E-Mail-Adresse nicht akzeptiert. Bitte geben Sie die institutionelle E-Mail-Adresse der Organisation ein.',
      },
    },
    addUsers: {
      description:
        'Überprüfe die Daten der aktuellen Administratoren oder füge weitere Administratoren zur Liste hinzu. Sie sind für die Verwaltung von {{productName}} verantwortlich und werden im Beitrittsvertrag als Beauftragte des gesetzlichen Vertreters aufgeführt.',
      legalRepresentativeTitle: 'Gesetzlicher Vertreter und Administrator',
      adminTitle: 'Administrator {{index}}',
      remove: 'Entfernen',
      removeAriaLabel: '{{title}} entfernen',
      add: 'Administrator hinzufügen',
      errors: {
        duplicateTaxCode: 'Die eingegebene Steuernummer ist bereits vorhanden',
      },
      removeModal: {
        title: 'Möchtest du diesen Administrator entfernen?',
        message:
          'Alle zugehörigen eingegebenen Daten werden gelöscht und erscheinen nicht im Vertrag.',
        back: 'Zurück',
        remove: 'Entfernen',
        close: 'Schließen',
      },
    },
    exitModal: {
      title: 'Möchtest du wirklich verlassen?',
      message: 'Wenn du verlässt, wird die Anfrage abgebrochen und du musst von vorne beginnen.',
      exit: 'Zurück zu Dokumente',
      stay: 'Weiter',
      close: 'Schließen',
    },
  },
  customAlert: {
    message:
      '<1>Neuigkeit!</1><br />Ab dem 31.03.2025 ermöglicht die <2>Gruppen</2>-Funktion für IO die Verwaltung von Diensten, indem der Zugriff auf bestimmte Benutzergruppen beschränkt wird. <3>Wie funktioniert das?</3>',
  },
  exitModal: {
    title: 'Möchtest du den reservierten Bereich wirklich verlassen?',
    titleBackstage: 'Möchtest du den reservierten Bereich Backstage wirklich verlassen?',
    confirm: 'Verlassen',
    cancel: 'Abbrechen',
  },
  session: {
    expired: {
      title: 'Sitzung abgelaufen',
      message: 'Du wirst zur Anmeldeseite weitergeleitet...',
    },
  },
  partySelection: {
    title: 'Wähle deine Körperschaft',
    subTitle:
      'Wenn du für mehrere Körperschaften operierst, kannst du deine Wahl nach dem <1 /> Anmelden ändern.',
    partyStatus: {
      pending: 'Zu vervollständigen',
      toBeValidated: 'Warten',
    },
    continueButton: 'Anmelden',
    backButton: 'Zurück',
    label: 'Körperschaft suchen',
    notFoundResults: 'Kein Ergebnis',
  },
  searchBackstagePage: {
    supportRole: 'Support',
  },
  noActiveParty: {
    pending: {
      title: 'Es liegen keine <1 /> Beitrittsanträge für diese Körperschaft vor',
      description:
        'Der Beitritt wird möglicherweise noch bearbeitet. <1 /> Überprüfe, ob alle erforderlichen Schritte abgeschlossen sind.',
    },
    toBeValidated: {
      title: 'Die Registrierungsanfrage ist <1 />noch nicht validiert',
      description:
        'Die Registrierungsanfrage für die Körperschaft {{partyName}} muss <3 />noch bestätigt werden. Zum Anmelden warte bitte auf die Bestätigung, <5 />die an der PEC-Adresse der Körperschaft eingehen wird.',
    },
    close: 'Schließen',
  },
  noParty: {
    title: 'Zugriff unzulässig',
    description:
      'Der reservierte Bereich ist für die Körperschaften bestimmt, die <1 />PagoPA-Produkte verwenden.  Wenn du für eine Körperschaft arbeitest, bitte einen Administrator, dich <3 /> im Bereich Benutzer hinzuzufügen.',
    backHome: 'Schließen',
    addAdmin:
      'Gli attuali Amministratori non sono più disponibili e hai l’esigenza<1 /> di gestire i prodotti? <3>Aggiungi un nuovo Amministratore</3>',
    moreInformationOnRoles: 'Più informazioni sui ruoli',
  },
  activeProductCard: {
    disableInfo: 'Um dieses Produkt zu verwalten, frage einen seiner Administratoren',
  },
  overview: {
    title: 'Übersicht',
    subTitle:
      'Du verwaltest die aktiven PagoPA-Produkte und kannst, sofern im Besitz der Berechtigungen, neuen Produkten beitreten.',
    sideMenu: {
      titleExpand: 'Seitenmenü erweitern',
      titleCollapse: 'Seitenmenü reduzieren',
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
          'Die Testumgebung bietet dir die Möglichkeit, <1>{{productTitle}}</1> kennenzulernen und Tests in aller Sicherheit auszuführen. Die Produktionsumgebung ist das Produkt beim effektiven Betrieb.',
        devEnviromentMessage:
          'Sie bietet dir die Möglichkeit, das Produkt kennenzulernen und Tests in aller Sicherheit auszuführen.',
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
        'Für dieses Produkt steht bereits ein Beitrittsantrag in Bearbeitung. Möchtest du dennoch fortfahren?',
      confirmButton: 'Mit neuem Beitritt fortfahren',
      closeButton: 'Beenden',
    },
    partyLogo: {
      upload: 'Logo der Körperschaft laden',
      modify: 'Anderes Bild wählen',
      uploadError: {
        title: 'Laden fehlgeschlagen',
        description:
          'Das Laden des Logos ist fehlgeschlagen. Prüfe, ob Format und Größe korrekt sind, und lade es erneut',
      },
      modifyError: {
        title: 'Laden fehlgeschlagen',
        description: 'Leider ist etwas schiefgelaufen. Bitte später erneut versuchen',
      },
      size: 'Genaue Größe 300 x <1/> 300px - Format .png',
      info: 'Füg nur das Logo deiner Körperschaft ein. Du bist für das Einfügen anderer Bilder als der angegebenen verantwortlich.',
      infoEditLabel: 'Genaue Größe 300 x  300px - Format .jpg oder .png',
    },
    goToPecInstituion: {
      badgeLabel: 'Wichtiger Hinweis',
      title: 'Aktualisieren Sie Ihre E-Mail-Adresse',
      message:
        'Sie haben eine PEC-Adresse als E-Mail für die Institution {{nome}} angegeben. Diese Adresse empfängt keine Bestätigungscodes (OTP), die für die Anmeldung erforderlich sind. Sie müssen sie durch eine reguläre E-Mail-Adresse ersetzen, um weiterhin problemlos zugreifen zu können.',
      changeButton: 'Institution wechseln',
    },
    pecOtp: {
      title: 'E-Mail-Adresse aktualisieren',
      message:
        'Sie haben eine PEC-Adresse angegeben. Diese Adressen können keine Bestätigungscodes (OTP) empfangen, die für die Anmeldung erforderlich sind. Bitte verwenden Sie eine Standard-E-Mail-Adresse, um einen reibungslosen Zugriff zu gewährleisten.',
      modifyButton: 'E-Mail ändern',
      badgeLabel: 'Wichtiger Hinweis',
    },
    changeDetails: 'Daten der Körperschaft verwalten',
    viewDetails: 'Siehe die Daten der Einrichtung',
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
        ariaLabelEdit_zero: 'Geografisches Gebiet bearbeiten',
        ariaLabelEdit_one: 'Geografisches Gebiet bearbeiten, {{count}} weiteres vorhanden',
        ariaLabelEdit_other: 'Geografisches Gebiet bearbeiten, {{count}} weitere vorhanden',
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
            'Wähle das Gebiet, in dem deine Körperschaft tätig ist. Sofern lokal, kannst du ein oder mehrere Zuständigkeitsgebiete wählen. Die Auswahl wird auf alle Produkte von PagoPA angewendet, denen die Körperschaft beitreten wird.',
          add: 'Hinzufügen',
        },
        addNewGeographicTaxonomiesModal: {
          title: 'Geografisches Gebiet ändern',
          description:
            'Wähle das Gebiet, in dem deine Körperschaft tätig ist. Sofern lokal, kannst du ein oder mehrere Zuständigkeitsgebiete wählen. Die Änderung wird auf alle Produkte von PagoPA angewendet, denen die Körperschaft bereits beigetreten ist.',
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
        '<0>Einige Daten können in diesem Abschnitt nicht geändert werden. Gehe hierzu auf die Website des Index der öffentlichen Verwaltung (IPA)</0>',
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
          'Wenn du Berufsbilder wie Partner oder technologische Vermittler einsetzt, kannst du die Verwaltung bestimmter Produkte bevollmächtigen.',
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
        'Hier findest du die Liste der Körperschaften, die die Verwaltung eines oder mehrerer Produkte bevollmächtigt haben. ',
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
          'Die von dir angewendeten Filter ergaben keine Ergebnisse. <1>Filter entfernen</1>',
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
