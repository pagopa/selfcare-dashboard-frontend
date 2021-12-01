import TitleBox from '../../../../../../components/TitleBox';

export default function WelcomeDashboard() {
  const title = 'Il tuo Ente è attivo sui prodotti PagoPA';
  const subTitle =
    'Benvenuto nell’area di Self Care riservata al tuo Ente, puoi gestire qui i prodotti PagoPA che hai già attivato. ';
  return (
    <TitleBox
      title={title}
      subTitle={subTitle}
      mbTitle={2}
      mtGrid={10}
      mbSubTitle={6}
      variantTitle="h1"
      variantSubTitle="h5"
    />
  );
}
