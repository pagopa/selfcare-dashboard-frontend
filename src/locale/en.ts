export default {
  contractUpdateWizard: {
    openDevelopment: 'Try contract update',
    exit: 'Exit',
    back: 'Back',
    continue: 'Continue',
    steps: {
      institutionData: 'Institution data',
      addLR: 'Enter the Legal Representative',
      addUsers: 'Specify the Administrators',
    },
    institutionData: {
      description: 'Check and confirm the institution data, making sure it is correct.',
      alert:
        'Is your institution data incorrect or out of date? Report it to support to request a change.',
      contactSupport: 'Contact support',
      fields: {
        businessName: 'Company name',
        registeredOffice: 'Registered office address and street number',
        zipCode: 'Postal code',
        city: 'City',
        county: 'Province',
        digitalAddress: 'PEC address',
        fiscalCode: 'Tax code',
        vatNumber: 'VAT number',
        recipientCode: 'SDI code',
        supportEmail: 'Email address visible to citizens',
        geographicTaxonomies: 'Geographic area',
      },
    },
    addLR: {
      description:
        "Enter the details of your institution's Legal Representative or attorney. They will be responsible for signing the contract for {{productName}} and will have the Admin role for this product in the Reserved Area.",
      rolesInfo: 'More information on roles',
      fields: {
        name: 'Name',
        surname: 'Surname',
        taxCode: 'Tax code',
        email: 'Institutional email',
      },
      emailHint:
        'Please enter the institutional email address used for the entity. PEC addresses are not allowed.',
      errors: {
        required: 'Required field',
        nameMismatch: 'Incorrect or different than the fiscal code',
        surnameMismatch: 'Incorrect or different than the fiscal code',
        invalidTaxCode: 'The entered fiscal code is not valid',
        invalidEmail: 'The email address is not valid',
        pecEmail:
          'PEC email address not accepted. Please enter the institutional email address used for the entity.',
      },
    },
    addUsers: {
      description:
        'Check the data of the current Administrators or add other Administrators to the list. They will be responsible for managing {{productName}} and will appear in the membership contract as delegates of the Legal Representative.',
      legalRepresentativeTitle: 'Legal Representative and Administrator',
      adminTitle: 'Administrator {{index}}',
      remove: 'Remove',
      removeAriaLabel: 'Remove {{title}}',
      add: 'Add administrator',
      errors: {
        duplicateTaxCode: 'The Tax Code entered is already present',
      },
      removeModal: {
        title: 'Do you want to remove this administrator?',
        message:
          'All the related data entered will be deleted and will not appear in the contract.',
        back: 'Back',
        remove: 'Remove',
        close: 'Close',
      },
      removedSnackbar: 'You removed an administrator',
    },
    exitModal: {
      title: 'Do you really want to leave?',
      message: 'If you leave, the request will be cancelled and you will have to start over.',
      exit: 'Back to Documents',
      stay: 'Continue',
      close: 'Close',
    },
  },
  customAlert: {
    message:
      '<1>What’s new!</1><br />Available from 31/03/2025, the <2>Groups</2> feature for IO allows you to manage services by limiting access to specific groups of users. <3>How does it work?</3>',
  },
  exitModal: {
    title: 'Do you confirm that you want to leave the Reserved Area?',
    titleBackstage: 'Do you confirm that you want to leave the Reserved Area Backstage?',
    confirm: 'Exit',
    cancel: 'Cancel',
  },
  session: {
    expired: {
      title: 'Session expired',
      message: 'You are being redirected to the login page...',
    },
  },
  partySelection: {
    title: 'Select your institution',
    subTitle:
      'If you work for multiple institutions, you can change your selection after <1 /> logging in.',
    partyStatus: {
      pending: 'To be completed',
      toBeValidated: 'Wait',
    },
    continueButton: 'Login',
    backButton: 'Go back',
    label: 'Search for the institution',
    notFoundResults: 'No result',
  },
  searchBackstagePage: {
    supportRole: 'Support',
  },
  noActiveParty: {
    pending: {
      title: 'There are no registration requests <1 /> for this institution',
      description:
        'Registration may still be in progress. <1 /> Check that all required steps have been completed.',
    },
    toBeValidated: {
      title: 'The registration request is <1 />is being validated',
      description:
        'The registration request for the institution {{partyName}} must <3 />still be confirmed. To log in, wait for the confirmation <5 />that will be sent to the PEC address of the institution.',
    },
    close: 'Close',
  },
  noParty: {
    title: 'Access not permitted',
    description:
      'The reserved area is dedicated to institutions that use <1 /> PagoPA products.  To work for an institution, ask an Administrator <3 /> to add you in the Users section.',
    backHome: 'Close',
    addAdmin:
      'Gli attuali Amministratori non sono più disponibili e hai l’esigenza<1 /> di gestire i prodotti? <3>Aggiungi un nuovo Amministratore</3>',
    moreInformationOnRoles: 'Più informazioni sui ruoli',
  },
  activeProductCard: {
    disableInfo: 'To manage this product, contact one of your administrators',
  },
  overview: {
    title: 'Overview',
    subTitle:
      'Manage the active PagoPA products and, if you have permissions, you can register for new products.',
    sideMenu: {
      titleExpand: 'Expand side menu',
      titleCollapse: 'Collapse side menu',
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
          'The test environment allows you to learn about <1>{{productTitle}}</1> and perform tests securely. In the production environment, the product is fully operative.',
        devEnviromentMessage:
          'This allows you to learn about the product and perform tests securely',
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
        'There is already a registration request in progress for this product. Do you still want to proceed?',
      confirmButton: 'Proceed with a new registration',
      closeButton: 'Exit',
    },
    partyLogo: {
      upload: 'Upload your institution’s logo',
      modify: 'Change image',
      uploadError: {
        title: 'Uploading unsuccessful',
        description:
          'The logo was not uploaded successfully. Check that the format and dimensions are correct and upload it again',
      },
      modifyError: {
        title: 'Uploading unsuccessful',
        description: 'Sorry, something went wrong. Try again later',
      },
      size: 'Exact dimensions 300 x <1/> 300px - Format .png',
      info: 'Enter only the logo of your institution. You will be responsible for entering images different than the one indicated.',
      infoEditLabel: 'Exact dimensions 300 x 300px - Format .jpg or .png',
    },
    goToPecInstituion: {
      badgeLabel: 'Important notice',
      title: 'Update your email address',
      message:
        'You have entered a PEC address as the email for the institution {{nome}}. This address does not receive the verification codes (OTP) required to log in. You need to replace it with a regular email to continue accessing without issues.',
      changeButton: 'Change institution',
    },
    pecOtp: {
      title: 'Update your email address',
      message:
        'You have entered a PEC address. These addresses cannot receive the verification codes (OTP) required for login. Please use a standard email address to ensure uninterrupted access.',
      modifyButton: 'Change email',
      badgeLabel: 'Important notice',
    },
    changeDetails: 'Manage the institution data',
    viewDetails: 'See the entity’s data',
    partyDetail: {
      institutionType: 'Type',
      category: 'Category',
      originId: 'Code',
      companyName: 'Company name',
      denomination: 'Name',
      structure: 'Structure',
      uniqueCode: 'Univocal code',
      geographicTaxonomies: {
        label: 'Geographic area',
        ariaLabelEdit_zero: 'Edit geographic area',
        ariaLabelEdit_one: 'Edit geographic area, {{count}} other present',
        ariaLabelEdit_other: 'Edit geographic area, {{count}} others present',
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
            'Select the territory in which your institution operates. If local, you can select one or more areas of competence. The selection will be applied to all the PagoPA products for which the institution will register.',
          add: 'Add',
        },
        addNewGeographicTaxonomiesModal: {
          title: 'Change the geographical area',
          description:
            'Select the territory in which your institution operates. If local, you can select one or more areas of competence. The change will be applied to all the PagoPA products for which the institution has already registered.',
          modify: 'Change',
          back: 'Exit',
        },
      },
      fiscalCode: 'Tax code',
      pec: 'Primary PEC address',
      registeredOffice: 'Registered office',
      sdiCode: 'SDI code',
      aooParentCode: 'AOO (Homogeneous Organizational Area) of reference',
      contactToModify:
        '<0>Some data cannot be changed in this section. To do so, go to the website of the Public Administration Index (IPA)</0>',
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
          'If you use figures such as technical partners or intermediaries, you can delegate the management of some products.',
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
        'Here you can find the list of institutions who delegated the management of one or more products to you. ',
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
        resetFilter: 'Remove filters',
        emptyFilterResult: 'No result from the filters you used. <1>Remove filters</1>',
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
      groupByFiscalCode: 'Tax code',
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
