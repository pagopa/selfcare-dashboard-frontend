export default {
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
    memberName: ' (tu)',
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
};
