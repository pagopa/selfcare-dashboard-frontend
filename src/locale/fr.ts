export default {
  contractUpdateWizard: {
    openDevelopment: 'Essayer la mise à jour du contrat',
    exit: 'Quitter',
    back: 'Retour',
    continue: 'Continuer',
    steps: {
      institutionData: 'Données de l’organisme',
      addLR: 'Indiquez le Représentant Légal',
      addUsers: 'Indiquez les Administrateurs',
    },
    institutionData: {
      description:
        'Vérifiez et confirmez les données de l’organisme en vous assurant qu’elles sont correctes.',
      alert:
        'Les données de votre organisme sont incorrectes ou obsolètes ? Signalez-le à l’assistance pour procéder à la modification.',
      contactSupport: 'Contacter l’assistance',
      fields: {
        businessName: 'Raison sociale',
        registeredOffice: 'Adresse et numéro du siège social',
        zipCode: 'Code postal',
        city: 'Ville',
        county: 'Province',
        digitalAddress: 'Adresse PEC',
        fiscalCode: 'Code fiscal',
        vatNumber: 'Numéro de TVA',
        recipientCode: 'Code SDI',
        supportEmail: 'Adresse e-mail visible par les citoyens',
        geographicTaxonomies: 'Zone géographique',
      },
    },
    addLR: {
      description:
        "Saisissez les données du Représentant Légal ou du mandataire de votre organisme. Il sera responsable de la signature du contrat pour {{productName}} et aura le rôle d'Administrateur pour ce produit dans l'Espace Réservé.",
      rolesInfo: "Plus d'informations sur les rôles",
      fields: {
        name: 'Prénom',
        surname: 'Nom de famille',
        taxCode: 'Code Fiscal',
        email: 'Email institutionnel',
      },
      emailHint:
        "Veuillez saisir l'adresse e-mail institutionnelle utilisée pour l'entité. Les adresses PEC ne sont pas autorisées.",
      errors: {
        required: 'Champ obligatoire',
        nameMismatch: 'Nom incorrect ou différent par rapport au Code Fiscal',
        surnameMismatch: 'Nom de famille incorrect ou différent par rapport au Code Fiscal',
        invalidTaxCode: 'Le Code Fiscal saisi est invalide',
        invalidEmail: 'L’adresse mail est invalide',
        pecEmail:
          "Adresse PEC non acceptée. Veuillez saisir l'adresse e-mail institutionnelle utilisée pour l'entité.",
      },
    },
    addUsers: {
      description:
        'Vérifiez les données des Administrateurs actuels ou ajoutez d’autres Administrateurs à la liste. Ils seront responsables de la gestion de <1>{{productName}}</1> et figureront dans le contrat d’adhésion en tant que délégués du Représentant légal.',
      legalRepresentativeTitle: 'Représentant légal et Administrateur',
      adminTitle: 'Administrateur {{index}}',
      remove: 'Supprimer',
      removeAriaLabel: 'Supprimer {{title}}',
      add: 'Ajouter un administrateur',
      errors: {
        duplicateTaxCode: 'Le Code fiscal saisi est déjà présent',
      },
      removeModal: {
        title: 'Voulez-vous supprimer cet administrateur ?',
        message:
          'Toutes les données saisies correspondantes seront supprimées et n’apparaîtront pas dans le contrat.',
        back: 'Retour',
        remove: 'Supprimer',
        close: 'Fermer',
      },
      removedSnackbar: 'Vous avez supprimé un administrateur',
    },
    exitModal: {
      title: 'Voulez-vous vraiment quitter ?',
      message:
        'Si vous quittez, la demande sera annulée et vous devrez recommencer depuis le début.',
      exit: 'Quitter',
      back: 'Retour',
      close: 'Fermer',
    },
    submitModal: {
      title: 'Confirmez-vous la demande d’envoi ?',
      message:
        'Vous envoyez le document avec la demande d’adhésion au produit <1>{{productName}}</1> pour l’entité <2>{{partyName}}</2>.',
      description:
        'L’accord d’adhésion sera envoyé à la PEC institutionnelle de l’entité et devra être signé par le Représentant Légal. Assurez-vous d’être autorisé en tant qu’employé à effectuer cette demande.',
      back: 'Retour',
      confirm: 'Continuer',
      close: 'Fermer',
    },
  },
  customAlert: {
    message:
      '<1>Nouveauté !</1><br />Disponible à partir du 31/03/2025, la fonctionnalité des <2>Groupes</2> pour IO permet de gérer les services en limitant l’accès à des groupes spécifiques d’utilisateurs. <3>Comment ça marche ?</3>',
  },
  exitModal: {
    title: 'Confirmez-vous vouloir quitter l’Espace réservé ?',
    titleBackstage: 'Confirmez-vous vouloir quitter l’Espace réservé Backstage ?',
    confirm: 'Quitter',
    cancel: 'Annuler',
  },
  session: {
    expired: {
      title: 'Session expirée',
      message: 'Vous allez être redirigé vers la page de connexion...',
    },
  },
  partySelection: {
    title: 'Sélectionnez votre organisme',
    subTitle:
      'Se operi per più enti, potrai modificare la tua scelta dopo aver <1 /> effettuato l’accesso.',
    partyStatus: {
      pending: 'À compléter',
      toBeValidated: 'En attente',
    },
    continueButton: 'Se connecter',
    backButton: 'Retour',
    label: 'Chercher un organisme',
    notFoundResults: 'Aucun résultat',
  },
  searchBackstagePage: {
    supportRole: 'Support',
  },
  noActiveParty: {
    pending: {
      title: 'Aucune demande d’<1 />adhésion pour cet organisme',
      description:
        'L’adhésion pourrait encore être en cours. <1 /> Vérifier que tous les passages requis ont été complétés.',
    },
    toBeValidated: {
      title: 'La demande d’enregistrement est <1 />en attente de validation',
      description:
        'La richiesta di registrazione per l’ente {{partyName}} deve <3 />essere ancora confermata. Per accedere, attendi la conferma <5 />che arriverà all’indirizzo PEC dell’ente.',
    },
    close: 'Fermer',
  },
  noParty: {
    title: 'Accès non autorisé',
    description:
      'L’Area Riservata è dedicata agli enti che utilizzano i prodotti <1 /> PagoPA.  Se lavori per un ente, chiedi a un Amministratore <3 /> di aggiungerti nella sezione Utenti.',
    backHome: 'Fermer',
    addAdmin:
      'Gli attuali Amministratori non sono più disponibili e hai l’esigenza<1 /> di gestire i prodotti? <3>Aggiungi un nuovo Amministratore</3>',
    moreInformationOnRoles: 'Più informazioni sui ruoli',
  },
  activeProductCard: {
    disableInfo: 'Pour gérer ce produit, demandez à l’un de ses Administrateurs',
  },
  overview: {
    title: 'Aperçu',
    subTitle:
      'Gestisci i prodotti PagoPA attivi e, se hai i permessi, puoi aderire a nuovi prodotti.',
    sideMenu: {
      titleExpand: 'Développer le menu latéral',
      titleCollapse: 'Réduire le menu latéral',
      institutionManagement: {
        title: 'Gestion Organisme',
        overview: {
          title: 'Aperçu',
        },
        delegations: {
          title: 'Procurations',
        },
        referents: {
          title: 'Utilisateurs',
        },
        groups: {
          title: 'Groupes',
        },
        invoices: {
          title: 'Facturation',
        },
      },
      product: {
        overview: 'Aperçu',
        users: 'Utilisateurs',
      },
    },
    activeProductsSection: {
      title: 'Produits activés',
    },
    activeProducts: {
      activationOf: 'Activé à partir du ',
      active: 'Activé',
      premiumProduct: 'Premium',
      manageButton: 'Gérer',
      activeProductsEnvModal: {
        title: 'Dans quel environnement souhaitez-vous entrer ?',
        message: `Sei stato abilitato ad operare negli ambienti riportati di seguito per il prodotto <1>{{productTitle}}</1>.`,
        messageProduct:
          'L’ambiente di test ti permette di conoscere <1>{{productTitle}}</1> e fare prove in tutta sicurezza. L’ambiente di Produzione è il prodotto in esercizio effettivo.',
        devEnviromentMessage:
          'Ti permette di conoscere il prodotto e fare prove in tutta sicurezza',
        uatEnviromentMessage: 'Vous permet d’explorer le produit',
        prodEnviromentMessage: 'Produit en cours d’utilisation',
        envDevButton: 'Environnement de test',
        envLocalButton: 'Environnement local',
        envUatButton: 'Environnement d’attestation',
        envProdButton: 'Environnement de production',
        enterButton: 'Entrer',
        backButton: 'Annuler',
      },
    },
    lastServiceActive: 'Dernier service activé : ',
    notActiveProductsSection: {
      title: 'Produits disponibles',
    },
    notActiveProducts: {
      joinButton: 'Adhérer',
    },
    depictOf: 'Représentation de',
    discoverMore: '<0> EN SAVOIR PLUS → </0>',
    adhesionPopup: {
      title: 'Adhésion en cours',
      description:
        'Per questo prodotto c’è già una richiesta di adesione in corso. Vuoi procedere lo stesso?',
      confirmButton: 'Procéder à une nouvelle adhésion',
      closeButton: 'Sortir',
    },
    partyLogo: {
      upload: 'Télécharger le logo de l’organisme',
      modify: 'Modifier l’image',
      uploadError: {
        title: 'Échec du téléchargement',
        description:
          'Il caricamento del logo non è andato a buon fine. Verifica che il formato e la dimensione siano corretti e caricalo di nuovo',
      },
      modifyError: {
        title: 'Échec du téléchargement',
        description: 'Désolé, un problème est survenu. Réessayer plus tard',
      },
      size: 'Dimension exacte 300 x <1/> 300px - Format .png',
      info: 'N’entrez que le logo de votre organisme. Vous serez responsable de l’insertion d’images autres que celle indiquée.',
      infoEditLabel: 'Dimension exacte 300 x 300px - Format .png',
    },
    goToPecInstituion: {
      badgeLabel: 'Avis important',
      title: 'Mettez à jour votre adresse e-mail',
      message:
        "Vous avez saisi une adresse PEC comme e-mail pour l'établissement {{nome}}. Cette adresse ne reçoit pas les codes de vérification (OTP) nécessaires pour vous connecter. Vous devez la remplacer par une adresse e-mail ordinaire pour continuer à accéder sans problème.",
      changeButton: "Changer d'établissement",
    },
    pecOtp: {
      title: 'Mettez à jour votre adresse e-mail',
      message:
        "Vous avez saisi une adresse PEC. Ce type d'adresse ne reçoit pas les codes de vérification (OTP) nécessaires à la connexion. Utilisez une adresse e-mail standard pour continuer à accéder au service sans problème.",
      modifyButton: 'Modifier l’e-mail',
      badgeLabel: 'Avis important',
    },
    changeDetails: 'Gérer les données de l’organisme',
    viewDetails: 'Voir les données de l’organisme',
    partyDetail: {
      institutionType: 'Typologie',
      category: 'Catégorie',
      originId: 'Code',
      companyName: 'Raison sociale',
      denomination: 'Dénomination',
      structure: 'Structure',
      uniqueCode: 'Code Unique',
      geographicTaxonomies: {
        label: 'Zone géographique',
        ariaLabelEdit_zero: 'Modifier la zone géographique',
        ariaLabelEdit_one: 'Modifier la zone géographique, {{count}} autre présente',
        ariaLabelEdit_other: 'Modifier la zone géographique, {{count}} autres présentes',
        modalSections: {
          national: 'Nationale',
          local: 'Locale',
          inputLabel: 'Commune, Province ou Région',
          addMoreArea: 'Ajouter une zone',
          error: {
            notMatchedArea: 'Choisir une localité dans la liste',
          },
        },
        firstTimeInsertGeographicTaxonomiesModal: {
          title: 'Indiquer la zone géographique',
          description:
            'Seleziona il territorio in cui opera il tuo ente. Se locale, puoi scegliere una o più aree di competenza. La scelta verrà applicata a tutti i prodotti PagoPA a cui l’ente aderirà.',
          add: 'Ajouter',
        },
        addNewGeographicTaxonomiesModal: {
          title: 'Modifier la zone géographique',
          description:
            'Seleziona il territorio in cui opera il tuo ente. Se locale, puoi scegliere una o più aree di competenza. La modifica verrà applicata a tutti i prodotti PagoPA a cui l’ente ha già aderito.',
          modify: 'Modifier',
          back: 'Sortir',
        },
      },
      fiscalCode: 'Code Fiscal',
      pec: 'Adresse PEC primaire',
      registeredOffice: 'Siège Social',
      sdiCode: 'Code SDI',
      aooParentCode: 'ZOH de référence',
      contactToModify:
        '<0>Certaines données ne sont pas modifiables à partir de cette section. Pour ce faire, aller sur le site de l’Indice de l’administration publique (IAP)</0>',
      goToIPA: 'Accédez au site',
      institutionTypeValue: {
        GSP: 'Opérateur de services publics',
        PA: 'Administration Publique',
        PT: 'Partenaire technologique',
        SCP: 'Société à contrôle public',
        PSP: 'Fournisseur de Services de Paiement',
        SA: 'Opérateur privé de plateforme e-procurement',
        AS: 'Compagnie d’assurance',
        PG: 'Entreprise',
        REC: 'Livreur',
        CON: 'Consolidateur',
      },
      delegationBanner: {
        title: 'Délègue la gestion des produits à un Partenaire ou à un Intermédiaire',
        subTitle:
          'Se ti avvali di figure come Partner o Intermediari tecnologici, puoi delegare la gestione di alcuni prodotti.',
        goToButton: 'Aller',
      },
      vatNumberGroupValues: {
        yes: 'Oui',
        no: 'Non',
      },
      supportEmail: 'Adresse électronique visible par les citoyens',
      vatNumberGroup: 'Numéro de TVA de groupe',
      isTaxCodeEquals2Piva: 'Code Fiscal / N° de TVA',
      vatNumber: 'N° de TVA',
    },
    delegationsPage: {
      title: 'Procurations',
      subTitle: 'Ajouter ou visualiser les délégués pour la gestion des produits. ',
      whatIsDelegation: 'Qu’est-ce qu’une procuration ?',
      addDelegationsBtn: 'Ajouter procuration',
      delegationsNavigationBar: {
        redirectDescription: 'Aperçu',
        titlePageDescription: 'Procurations',
      },
      productsSection: {
        title: 'Produits',
        labelDelegates: 'Délégué',
        noDelegatesLabel: 'Aucun délégué pour ce produit. <1>Ajouter procuration</1>',
      },
    },
    ptPage: {
      title: 'Organismes gérés',
      subTitle:
        'Qui trovi l’elenco degli enti che ti hanno delegato la gestione di uno o più prodotti. ',
      tableEmptyLabel: 'Vous n’avez pas encore été délégué par un organisme.',
      headerPtTableLabels: {
        party: 'Organisme',
        taxCode: 'Code fiscal',
        product: 'Produit',
        createdAt: 'Délégué le',
      },
      bodyPtTable: {
        showMoreButtonLabel: 'Voir tous',
      },
      filterTechPartner: {
        searchBy: 'Recherche par',
        insert: 'Entrer',
        name: 'Nom',
        taxCode: 'Code fiscal',
        textfieldLabel: 'Recherche par nom',
        productSelectLabel: 'Produit',
        buttonLabel: 'Filtrer',
        allProductsLabel: 'Tous les produits',
        resetFilter: 'Supprimer filtres',
        emptyFilterResult:
          'I filtri che hai applicato non hanno dato nessun risultato. <1>Rimuovi filtri</1>',
      },
    },
    genericError: {
      title: 'Désolé, un problème est survenu.',
      description: `A causa di un errore del sistema non è possibile completare la procedura.
      <1/>
      Ti chiediamo di riprovare più tardi.`,
      backAction: 'Fermer',
    },
  },
  addDelegationPage: {
    title: 'Ajouter procuration',
    subTitle: 'Choisissez le produit et indiquez qui pourra le gérer au nom de votre organisme.',
    navigationBar: {
      overview: 'Aperçu',
      delegations: 'Procurations',
      addDelegation: 'Ajouter procuration',
    },
    addOneDelegation: 'Ajouter une procuration',
    formSubTitle: 'Indiquez pour quel produit vous souhaitez déléguer la gestion',
    findOutMore: 'Des doutes ? Aller au manuel',
    chooseProduct: 'Choisir le produit',
    selectTechPartner: {
      title: 'Choisir qui gérera le produit',
      subTitle: 'Recherche par la raison sociale ou le Code Fiscal de l’organisme',
      radioName: 'Raison sociale',
      radioFiscalCode: 'Code Fiscal organisme',
      labelName: 'Saisir la raison sociale',
      labelFiscalCode: 'Saisir le Code Fiscal',
      groupByName: 'Raison sociale',
      groupByFiscalCode: 'Code Fiscal',
      notFoundTechPartnerOptions: 'Aucun résultat',
      actions: {
        back: 'Retour',
        continue: 'Continuer',
        exit: 'Sortir',
        confirm: 'Confirmer',
      },
    },
    delegationSuccessfulCreated: 'Procuration ajoutée correctement.',
    delegationNotCreated: 'Impossible d’ajouter la procuration. Réessayer.',
    alreadyDelegated: 'Le Partenaire sélectionné est déjà associé à l’organisme.',
  },
  subHeader: {
    partySelectionSearch: {
      title: 'Organismes gérés',
      label: 'Organismes gérés',
    },
    backButton: 'Sortir',
  },
  SessionModalInteropProduct: {
    closeButton: 'Annuler',
    confirmButton: 'Réessayer',
    testLabel: 'Essai',
    uatLabel: 'Attestation',
  },
};
