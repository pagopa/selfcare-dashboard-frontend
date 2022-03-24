export default {
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
      upload: 'Carica il logo del tuo Ente',
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
      type: 'formato .png',
      size: 'dimensione 300x300px',
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
  groupDetailPage: {
    path: {
      groupDescription: 'Gruppi',
    },
    title: 'Dettaglio Gruppo',
    backActionLabel: 'Indietro',
  },
  groupActions: {
    selectedGroupStatusSuspended: 'sospeso',
    selectedGroupStatusActive: 'riattivato',
    selectedGroupStatusErrorSuspended: 'sospensione',
    selectedGroupStatusErrorActive: 'riattivazione',
    editActionLabel: 'Modifica',
    groupActionActive: 'Riattiva',
    groupActionSuspend: 'Sospendi',
    groupDuplicateAction: 'Duplica',
    groupDeleteAction: 'Elimina',
    handleOpenDelete: {
      addNotify: {
        title: 'Elimina gruppo',
        message: `Stai per eliminare il gruppo <1>{{groupName}}</1>. <3/>Vuoi continuare?`,
        confirmLabel: 'Conferma',
        closeLabel: 'Annulla',
      },
    },
    onDelete: {
      toastComponentThen: {
        title: 'GRUPPO ELIMINATO',
        message: `Hai eliminato correttamente il gruppo <1>{{groupName}}</1>.`,
      },
      toastComponentCatch: {
        displayableTitle: "ERRORE DURANTE L'ELIMINAZIONE",
        displayableDescription: `C'è stato un errore durante l'eliminazione del gruppo <1>{{groupName}}</1>.`,
      },
    },
    handleOpen: {
      addNotify: {
        titleActive: 'Sospendi Gruppo',
        titleSuspended: 'Riabilita Gruppo',
        messageActive: 'Stai per sospendere il gruppo',
        messageSuspended: 'Stai per riabilitare il gruppo',
        messageGroup: ` <0>{{groupName}}</0> di <2>{{productTitle}}</2>.<4/>Vuoi continuare?`,
        confirmLabel: 'Conferma',
        closeLabel: 'Annulla',
      },
    },
    confirmChangeStatus: {
      updatePartyGroupStatusThen: {
        title: `GRUPPO {{selectedGroupStatus}}`,
        message: `Hai <1>{{selectedGroupStatus}}</1> correttamente il gruppo <3>{{groupName}}</3>.`,
      },
      updatePartyGroupStatusCatch: {
        displayableTitle: 'ERRORE DURANTE LA {{selectedGroupStatusError}} DEL GRUPPO ',
        displayableDescription: `C'è stato un errore durante la {{selectedGroupStatusError}} del gruppo <3>{{groupName}}</3>.`,
      },
    },
  },
  groupDetail: {
    name: 'NOME',
    description: 'DESCRIZIONE',
    product: 'PRODOTTO',
    referents: 'REFERENTI',
    creationDate: 'DATA CREAZIONE',
    createdByLabel: 'DA',
    modifiedAt: 'DATA ULTIMA MODIFICA',
    modifiedBy: 'DA',
  },
  groupMenu: {
    dissociateMenuItem: {
      label: 'Dissocia dal gruppo',
    },
    suspendMenuItem: {
      suspendLabel: 'Sospendi Referente',
      activeLabel: 'Riabilita Referente',
    },
    confirmAction: {
      titleSuspended: 'Sospendi Ruolo',
      titleActive: 'Riabilita Ruolo',
      message: `<0>{{transcodeProductRole2Title}}</0> di <2>{{productTitle}}</2> assegnato a <4>{{memberMame}}</4>.<6/>Vuoi continuare?`,
      messageActive: 'Stai per riabilitare il ruolo ',
      messageSuspended: 'Stai per sospendere il ruolo ',
      confirmLabel: 'Conferma',
      closeLabel: 'Annulla',
    },
    confirmChangeStatus: {
      selectedUserStatusSuspended: 'sospeso',
      selectedUserStatusActive: 'riabilitato',
      selectedUserStatusErrorSuspended: 'sospensione',
      selectedUserStatusErrorActive: 'riabilitazione',
      updatePartyUserStatusThen: {
        title: `REFERENTE {{selectedUserStatus}}`,
        message: `Hai <1>{{selectedUserStatus}}</1> correttamente <3>{{membersName}}</3>.`,
      },
      updatePartyUserStatusCatch: {
        displayableTitle: `ERRORE DURANTE LA {{selectedUserStatusError}} DELL'UTENTE `,
        displayableDescription: `C'è stato un errore durante la <1>{{selectedUserStatusError}}</1> dell'utente <3>{{memberName}}</3>.`,
      },
    },
    confirmDisociateAction: {
      title: 'Dissocia',
      message: `Stai per dissociare <1>{{memberName}}</1> dal gruppo <3>{{groupName}}</3> di <5>{{productTitle}}</5>.<7/> Vuoi continuare?`,
      confirmLabel: 'Conferma',
      closeLabel: 'Annulla',
    },
    confirmUserDissociation: {
      deleteGroupRelationThen: {
        title: 'UTENTE DISSOCIATO',
        message: ` Hai dissociato correttamente <1>{{memberName}}</1> dal gruppo <3>{{groupName}}</3>.`,
      },
      deleteGroupRelationCatch: {
        displayableTitle: "ERRORE DURANTE LA DISSOCIAZIONE DELL'UTENTE",
        displayableDescription: `C'è stato un errore durante la dissociazione dell'utente <1>{{memberName}}</1>.`,
      },
    },
  },
  membersGroup: {
    currentUser: ' (tu)',
  },
  dashboardGroupEdit: {
    alertRemoveUsersInClone: {
      label: `Alcuni referenti sono stati eliminati dal gruppo duplicato perchè <1> non presenti </1> nel prodotto selezionato o perchè <3>sospesi</3>. Puoi comunque assegnare altri referenti al gruppo duplicato.`,
    },
    groupForm: {
      formLabels: {
        groupName: 'Nome del gruppo',
        groupNameDuplicated: 'Questo nome è già in uso',
        groupNamePlaceholder: 'Inserisci il nome del gruppo',
        description: 'Descrizione',
        descriptionPlaceholder: 'Inserisci una descrizione',
        product: 'Prodotto',
        prductPlaceholter: 'Seleziona il prodotto',
        noProductSelected: 'Nessun prodotto selezionato',
        referents: 'Referenti',
        referentsPlaceholter: 'Seleziona i referenti che vuoi assegnare al gruppo',
        cancelActionLabel: 'Annulla',
        confirmActionLabel: 'Conferma',
      },
      notifySuccessfulSave: {
        isEdit: 'Hai modificato correttamente il gruppo ',
        isClone: 'Hai duplicato correttamente il gruppo ',
        isCreate: 'Hai creato correttamente il gruppo ',
        message: `<0>{{valuesName}}</0> per il prodotto <2>{{productSelectedtitle}}</>`,
      },
      notifyErrorOnSave: {
        isEdit: 'ERRORE DURANTE LA MODIFICA ',
        isClone: 'ERRORE DURANTE LA DUPLICAZIONE',
        isCreate: 'ERRORE DURANTE LA CREAZIONE',
        displayableDescriptionEdit: `An error occurred while edit of group {{valuesName}}`,
        displayableDescriptionClone: `An error occurred while clone of group {{valuesName}}`,
        displayableDescriptionCreate: `An error occurred while creation of group {{valuesName}}`,
      },
      save: {
        groupNameAlreadyExists: 'Il nome che hai scelto per il nuovo gruppo è già in uso. Cambialo',
        isEdit: "C'è stato un errore durante la modifica del gruppo. Riprova.",
        isClone: "C'è stato un errore durante la duplicazione del gruppo. Riprova.",
        isCreate: "C'è stato un errore durante la creazione del gruppo. Riprova.",
      },
    },
    addGroupPage: {
      groupPathDescription: 'Gruppi',
      pathDescription: 'Crea un nuovo gruppo',
      title: 'Crea un nuovo gruppo',
      subTitle: `Inserisci i dati del gruppo che vuoi creare e assegna a gestire i gruppi per il {{partyDescription}}.`,
    },
    cloneGroupPage: {
      groupPathDescription: 'Gruppi',
      pathDescription: 'Duplica gruppo',
      title: 'Duplica gruppo',
      subTitle: `Duplica il gruppo e modifica i dati`,
      placeholderDuplicateName: 'Copia di ',
    },
    editGroupPage: {
      groupPathDescription: 'Gruppi',
      pathDescription: 'Modifica gruppo',
      title: 'Modifica gruppo',
      subTitle: `Duplica il gruppo e modifica i dati`,
    },
  },
  dashboardGroup: {
    groupsPage: {
      title: 'Gruppi',
      subTitle:
        'Consulta e crea dei gruppi (es. uno per ogni Dipartimento o Ufficio) in modo da gestire meglio il lavoro del tuo Ente.',
    },
    addGroupButton: {
      createActionLabel: 'Crea',
    },
    noGroups: {
      noGroupsLabel: 'Non è ancora stato creato alcun Gruppo.',
    },
    groupProductRowActions: {
      modifyActionLink: 'Modifica',
      duplicateActionLink: 'Duplica',
      suspendActionLink: 'Sospendi',
      activateActionLink: 'Riattiva',
      askConfirm: {
        message: `{{message}} il gruppo <2>{{groupName}}</2> di <4>{{productTitle}}</4>.<6 />Vuoi continuare?`,
        confirmLabel: 'Conferma',
      },
      performAction: {
        updatePartyGroupStatusThen: {
          message: `{{message}} il gruppo <2>{{groupName}}</2>.`,
        },
        updatePartyGroupStatusCatch: {
          displayableTitle: 'ERRORE DURANTE LA {{selectedGroupStatusError}} DEL GRUPPO ',
          displayableDescription: `C'è stato un errore durante la {{selectedGroupStatusError}} del gruppo <3>{{groupName}}</3>.`,
          selectedGroupStatusErrorSuspended: 'sospensione ',
          selectedGroupStatusErrorActive: 'riattivazione ',
        },
      },
      handleChangeState: {
        askConfirmSuspend: 'Sospendi Gruppo',
        askConfirmActive: 'Riattiva Gruppo',
        askConfirmBeforeSuspend: 'Stai per sospendere',
        askConfirmBeforeActive: 'Stai per riattivare',
      },
      updateStatus: {
        nextStatusSuspended: 'sospeso',
        nextStatusActive: 'riattivato',
        performActionTitle: `GRUPPO {{selectedUserStatus}}`,
        performActionActionMessage: `Hai {{selectedUserStatus}} correttamente`,
      },
      handleDelete: {
        askConfirmDeleted: 'Elimina Gruppo',
        askConfirmBeforeDeleted: 'Stai per eliminare',
      },
      deleteGroup: {
        performActionTitle: 'GRUPPO ELIMINATO',
        performActionMessage: 'Hai eliminato correttamente',
      },
    },
    groupProductTableColumns: {
      duplicateActionLink: 'Duplica',
      headerFields: {
        name: 'NOME',
        description: 'DESCRIZIONE',
        product: 'PRODOTTO',
        referents: 'N.REFERENTI',
      },
    },
    groupsProductFetchError: {
      message: `Spiacenti, qualcosa è andato storto. <1><0>Riprova</0></1>.`,
    },
    groupsTableLoadMoreData: {
      loadMoreMessage: 'Carica altri',
    },
  },
};
