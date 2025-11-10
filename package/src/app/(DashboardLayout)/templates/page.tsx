import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { getActiveMembershipOrRedirect } from '@/lib/auth/session';
import { listTemplates } from '@/lib/db/queries/templates';

import TemplateFilters from './components/TemplateFilters';
import TemplateGrid from './components/TemplateGrid';
import CreateTemplateButton from './components/CreateTemplateButton';

type TemplatesPageProps = {
  searchParams: Record<string, string | string[] | undefined>;
};

const TemplatesPage = async ({ searchParams }: TemplatesPageProps) => {
  const { organization } = await getActiveMembershipOrRedirect();

  const categoryParam =
    typeof searchParams.category === 'string' ? searchParams.category.toLowerCase() : 'all';
  const search = typeof searchParams.q === 'string' ? searchParams.q : '';

  const templates = await listTemplates({
    organizationId: organization.id,
    category: categoryParam,
    search,
  });

  const categories = Array.from(
    new Set(
      templates
        .map((template) => template.category ?? '')
        .filter((category) => category && category.length > 0),
    ),
  );

  return (
    <Stack spacing={3}>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between"
        alignItems={{ xs: 'flex-start', sm: 'center' }}
        spacing={2}
      >
        <Stack spacing={0.5}>
          <Typography variant="h4" fontWeight={700}>
            Templates
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Create reusable building blocks for offers and proposals.
          </Typography>
        </Stack>
        <CreateTemplateButton />
      </Stack>

      <TemplateFilters categories={categories} selectedCategory={categoryParam} search={search} />

      <TemplateGrid
        templates={templates.map((template) => ({
          ...template,
          updatedAt: new Date(template.updatedAt),
        }))}
      />
    </Stack>
  );
};

export default TemplatesPage;
