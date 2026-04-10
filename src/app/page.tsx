import ClientLayout from '@/components/layout/ClientLayout';
import PremiumLandingPage from '@/components/home/PremiumLandingPage';

export const dynamic = 'force-dynamic';

export default function HomePage() {
  return (
    <ClientLayout>
      <PremiumLandingPage />
    </ClientLayout>
  );
}
