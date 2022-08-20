import type { NextPage } from 'next'
import { PageContainer } from '../../components/PageContainer';
import VaccineVerification from '../../components/VaccineVerification';

const UploadVaccinePage: NextPage = () => {
  return (
    <PageContainer>
      <VaccineVerification />
    </PageContainer>
  )
}

export default UploadVaccinePage
