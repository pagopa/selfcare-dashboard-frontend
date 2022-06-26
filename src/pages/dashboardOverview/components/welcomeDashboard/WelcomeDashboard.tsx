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
      mbSubTitle={5}
      variantTitle="h4"
      variantSubTitle="body1"
    />
  );
}
