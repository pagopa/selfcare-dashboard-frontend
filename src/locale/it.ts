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
};
