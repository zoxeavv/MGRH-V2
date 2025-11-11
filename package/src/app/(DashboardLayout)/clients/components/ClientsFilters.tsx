'use client';

import React from 'react';
import {
  Chip,
  Divider,
  Stack,
  Typography,
  Tooltip,
} from '@mui/material';
import type { ClientStatus } from '@/app/(DashboardLayout)/clients/actions';

type FilterOption = {
  value: string;
  label: string;
};

type ClientsFiltersProps = {
  statusOptions: { value: ClientStatus; label: string }[];
  selectedStatuses: ClientStatus[];
  onToggleStatus: (status: ClientStatus) => void;
  ownerOptions: FilterOption[];
  selectedOwners: string[];
  onToggleOwner: (ownerId: string) => void;
  tagOptions: string[];
  selectedTags: string[];
  onToggleTag: (tag: string) => void;
};

const Section = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <Stack spacing={1.5}>
    <Typography variant="subtitle2" color="text.secondary" textTransform="uppercase">
      {title}
    </Typography>
    {children}
  </Stack>
);

const ChipGroup = ({
  options,
  selected,
  onToggle,
}: {
  options: FilterOption[];
  selected: string[];
  onToggle: (value: string) => void;
}) => (
  <Stack direction="row" spacing={1} flexWrap="wrap">
    {options.map((option) => {
      const isSelected = selected.includes(option.value);
      return (
        <Chip
          key={option.value}
          label={option.label}
          variant={isSelected ? 'filled' : 'outlined'}
          color={isSelected ? 'primary' : 'default'}
          onClick={() => onToggle(option.value)}
          sx={{ mb: 1 }}
        />
      );
    })}
    {options.length === 0 ? (
      <Typography variant="body2" color="text.secondary">
        Nothing to filter yet.
      </Typography>
    ) : null}
  </Stack>
);

export default function ClientsFilters({
  statusOptions,
  selectedStatuses,
  onToggleStatus,
  ownerOptions,
  selectedOwners,
  onToggleOwner,
  tagOptions,
  selectedTags,
  onToggleTag,
}: ClientsFiltersProps) {
  return (
    <Stack
      spacing={3}
      divider={<Divider />}
      sx={{
        borderRadius: 2,
        border: (theme) => `1px solid ${theme.palette.divider}`,
        padding: 3,
        backgroundColor: (theme) => theme.palette.background.paper,
      }}
    >
      <Section title="Status">
        <ChipGroup
          options={statusOptions}
          selected={selectedStatuses}
          onToggle={(value) => onToggleStatus(value as ClientStatus)}
        />
      </Section>

      <Section title="Owner">
        <ChipGroup
          options={ownerOptions}
          selected={selectedOwners}
          onToggle={onToggleOwner}
        />
      </Section>

      <Section title="Tags">
        <Stack direction="row" spacing={1} flexWrap="wrap">
          {tagOptions.map((tag) => {
            const isSelected = selectedTags.includes(tag);
            return (
              <Tooltip key={tag} title={isSelected ? 'Remove tag filter' : 'Filter by tag'}>
                <Chip
                  label={tag}
                  variant={isSelected ? 'filled' : 'outlined'}
                  color={isSelected ? 'primary' : 'default'}
                  onClick={() => onToggleTag(tag)}
                  sx={{ mb: 1 }}
                />
              </Tooltip>
            );
          })}
          {tagOptions.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              Tags will appear as you enrich client records.
            </Typography>
          ) : null}
        </Stack>
      </Section>
    </Stack>
  );
}
