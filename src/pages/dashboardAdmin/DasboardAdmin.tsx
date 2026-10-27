import withAdminPermissions from '../../decorators/withAdminPermissions';
import AdminRemote from '../../microcomponents/admin/AdminRemote';
import DashboardShell from '../dashboard/DashboardShell';

/**
 * DashboardAdminPage - Dashboard for PagoPA authenticated users
 * This component handles users who login via Google (iss: 'pagopa')
 * Unlike regular users, PagoPA users don't have a partyId and only access Admin features
 */
const DashboardAdminPage: React.FC = () => (
  <DashboardShell
    isAddDelegateSectionVisible={false}
    isInvoiceSectionVisible={false}
    isHandleDelegationsVisible={false}
    isDocumentsSectionVisible={false}
  >
    <AdminRemote />
  </DashboardShell>
);

export default withAdminPermissions(DashboardAdminPage);
