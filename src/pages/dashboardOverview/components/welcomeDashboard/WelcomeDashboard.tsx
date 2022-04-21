import TitleBox from '@pagopa/selfcare-common-frontend/components/TitleBox';
import { useTranslation } from 'react-i18next';

export default function WelcomeDashboard() {
  const { t } = useTranslation();
  const title = t('overview.title');
  const subTitle = t('overview.subTitle');
  return (
    <TitleBox
      title={title}
      subTitle={subTitle}
      mbTitle={2}
      mtTitle={10}
      mbSubTitle={6}
      variantTitle="h1"
      variantSubTitle="h5"
    />
  );
}
