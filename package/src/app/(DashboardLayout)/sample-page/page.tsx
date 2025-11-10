import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer';
import DashboardCard from '@/app/(DashboardLayout)/components/shared/DashboardCard';


const SamplePage = () => {
  return (
    <PageContainer title="Sample Page" description="this is Sample page">
      <DashboardCard title="Sample Page">
        <p className="text-sm text-muted-foreground">This is a sample page</p>
      </DashboardCard>
    </PageContainer>
  );
};

export default SamplePage;

