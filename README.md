# selfcare-dashboard-frontend
SelfCare's application which allows users to see the parties to which belongs and their configured products:
* Admin users can list, add and edit other users.
* Admin users can list, add and edit groups of users.

This application makes use of some micro-frontends built using Webpack 5's module federation.

The micro-frontends used are:
* (selfcare-dashboard-users-microfrontend)[https://github.com/pagopa/selfcare-dashboard-users-microfrontend] to handle the management of the users
* (selfcare-dashboard-groups-microfrontend)[https://github.com/pagopa/selfcare-dashboard-groups-microfrontend] to handle the management of the groups of users

## Data and model/types shared with remotes micro-frontend
This application represents the container app for some remotes pages/components and provide to them some shared data having shared types.

### Common models and types
#### UserStatus
An enum containing the possible onboarding status for the parties/users/products:

| Value | Description |
|-------|-------------|
| PENDING | An onboarding has been requested, but not completed |
| ACTIVE | A complete and valid onboarding |
| SUSPENDED | The relationship between party/product/user has been suspended |[](#data)

#### UserRole
An enum containing the possible Selc roles:

| Value | Description |
|-------|-------------|
| ADMIN | Users having admin rights on the party/product |
| LIMITED | Users having limited rights on the party/product (tech operators) |

#### PartyRole
An enum containing the possible Party roles:

| Value | Description |
|-------|-------------|
| MANAGER | The manager, or the person having firm and ADMIN rights |
| DELEGATE | A delegate of the manager having ADMIN rights |
| SUB_DELEGATE | A delegate having ADMIN rights |
| OPERATOR | An allowed user having LIMITED rights |

#### Party
It contains party's info, onboarding status and the selc role of the current user:

| Field | Type | Mandatory | Description |
|-------|------|-----------|-------------|
| partyId | string | Y | The party's id |
| externalId | string | Y | The external id |
| originId | string | Y | The origin id |
| description | string | Y | The party's name |
| digitalAddress | string | Y | The party's PEC |
| fiscalCode | string | Y | The party's tax code |
| status | [UserStatus](#userstatus) | Y | The current users's onboarding status inside the party |
| userRole | [UserRole](#userrole) | Y | The user Selc role inside the party |
| category | string | N | The party's category |
| urlLogo | string | N | The party's url logo |

#### Product
It contains product's info, onboarding status and the selc role of the current user:

| Field | Type | Mandatory | Description |
|-------|------|-----------|-------------|
| id | string | Y | The product's id |
| title | string | Y | The product's name |
| description | string | Y | The product's description |
| logo | string | N | The product's logo url |
| urlBO | string | Y | The product's url to its backoffice |
| urlPublic | string | N | The product's url to an informative page |
| status | `'ACTIVE' | 'INACTIVE' | 'PENDING'` | Y | The product's onboarding status |
| userRole | [UserRole](#userrole) | N | The user Selc role for the product. Mandatory if the product is active |
| authorized | boolean | Y | If the current user is authorized to the current product |

#### ProductRole
It contains data related to one of the possible product roles

| Field | Type | Mandatory | Description |
|-------|------|-----------|-------------|
| productId | string | Y | The product's id |
| selcRole | [UserRole](#userrole) | Y | The mapped selc role |
| partyRole | [PartyRole](#partyrole) | Y | The mapped party role |
| productRole | string | Y | The product specific product role code |
| title | string | Y | The product specific product role title |
| description | string | Y | The product specific product role description |
| multiroleAllowed | boolean | Y | If true, this selcRole allow the association of more than one productRole |

#### ProductRolesLists
For a selected product, it will contains the list of its roles and some usefull aggregation

| Field | Type | Mandatory | Description |
|-------|------|-----------|-------------|
| list | `Array<ProductRole>` | Y | The product's flat list of roles |
| groupByPartyRole | `{ [partyRole in PartyRole]: Array<ProductRole> }` | Y | The product's list of roles grouped by [PartyRole](#partyrole) |
| groupBySelcRole | `{ [selcRole in UserRole]: Array<ProductRole> }` | Y | The product's list of roles grouped by [UserRole](#userrole) |
| groupByProductRole | `{ [productRole: string]: Array<ProductRole> }` | Y | A map to transcode the productRole code to its ProductRole configuration |

### Common Props
Remote micro-components need the following Props:

#### Props to configure Micro-components
Props shared with each type of micro-components:

| Prop | Type | Mandatory | Description |
|------|------|-----------|-------------|
| history | History | Y | The react-router history used by the container app |
| theme | Theme | Y | The mui Theme used by the container app |
| store | `Store<any, any>` | Y | The react-redux store used by the container app |

#### Props to configure Dashboard Micro-frontends pages
The following props, together with the [micro-components props](#props-to-configure-micro-components) are to be provided to all the dashboard pages served by remotes micro-frontends:

| Prop | Type | Mandatory | Description |
|------|------|-----------|-------------|
| party | Party | Y | The selected [Party](#party) |
| products | `Array<Product>` | Y | The complete list of [Product](#product) related to the selected party (active and pending) in case of ADMIN user, otherwise just the authorized products |
| activeProducts | `Array<Product>` | Y | The list of active [Product](#product), also not authorized in case of ADMIN |
| productsMap | `{ [productId: string]: Product }` | Y | A map to transcode productId into a [Product](#product) |
| decorators | DashboardDecoratorsType | Y | A set of decorators that each configured Page could use in order to retrieve Parties and Products extra data |

##### decorators prop
Each decorator has the purpose to retrieve some extra data and:
- Has the type *`(WrappedComponent: React.ComponentType<any>) => React.ComponentType<any>`*
- Represents a decorator that retrieve and provide some Props to the decorated component

###### withProductRolesMap
A decorator usable by all the dashboard pages in order to provide the following Props:

| Field | Type | Mandatory | Description |
|-------|------|-----------|-------------|
| productsRolesMap | `[productId: string]: ProductRolesLists` | Y | A map containing the mapping between productId and its (ProductRolesLists)[#productroleslists] |

###### withSelectedProduct
A decorator usable by the dashboard pages having *productId* as path variable in the configured route in order to provide the following Props:

| Field | Type | Mandatory | Description |
|-------|------|-----------|-------------|
| selectedProduct | Product | Y | The [Product](#product) selected through the *productId* path variable |
| fetchSelectedProductRoles | `(product: Product) => Promise<ProductRolesLists>` | Y | A function to retrieve the (ProductRolesLists)[#productroleslists] associated to the current product |

###### withSelectedProductRoles
A decorator usable by the dashboard pages after the resolution of the selected product in order to fetch immediately and serve its (ProductRolesLists)[#productroleslists]:

| Field | Type | Mandatory | Description |
|-------|------|-----------|-------------|
| productRolesList | ProductRolesLists | Y | The (ProductRolesLists)[#productroleslists] associated to the current product |

It can be combined with [withSelectedProduct](#withselectedproduct) in the following way:
`withSelectedPartyProduct(withSelectedPartyProductAndRoles(`*PageToDecorate*`))`

## To configure the workspace execute the following commands
- yarn install
- yarn generate

## To execute locally a configured workspace execute the following command
- yarn start

The remote components should be put into execution locally or use the following environment variable to customize their URL:
- MICROFRONTEND_URL_USERS
- MICROFRONTEND_URL_GROUPS

## To execute locally mocking REST invocation, modify the file .env.development.local setting
- REACT_APP_API_MOCK_PARTIES=true
- REACT_APP_API_MOCK_PRODUCTS=true

## To build a configured workspace execute the following command
- yarn build