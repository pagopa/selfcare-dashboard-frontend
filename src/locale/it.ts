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
        displayableTitle: 'ERRORE DURANTE LA <1>{{selectedGroupStatusError}}</1> DEL GRUPPO ',
        displayableDescription: `C'è stato un errore durante la <1>{{selectedGroupStatusError}}</1> del gruppo <3>{{groupName}}</3>.`,
      },
    },
  },
};
