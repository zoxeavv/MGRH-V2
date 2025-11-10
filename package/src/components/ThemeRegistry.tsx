'use client';

import * as React from 'react';
import { useServerInsertedHTML } from 'next/navigation';
import { CacheProvider } from '@emotion/react';
import { CssBaseline, ThemeProvider } from '@mui/material';

import createEmotionCache from '@/utils/createEmotionCache';
import { baselightTheme } from '@/utils/theme/DefaultColors';

type ThemeRegistryProps = {
  children: React.ReactNode;
};

const ThemeRegistry = ({ children }: ThemeRegistryProps) => {
  const [{ cache, flush }] = React.useState(() => {
    const cacheInstance = createEmotionCache();
    cacheInstance.compat = true;

    const prevInsert = cacheInstance.insert;
    let inserted: string[] = [];

    cacheInstance.insert = (...args) => {
      const serialized = args[1];
      if (cacheInstance.inserted[serialized.name] === undefined) {
        inserted.push(serialized.name);
      }
      return prevInsert(...args);
    };

    const flush = () => {
      const prev = inserted;
      inserted = [];
      return prev;
    };

    return { cache: cacheInstance, flush };
  });

  useServerInsertedHTML(() => {
    const names = flush();

    if (names.length === 0) {
      return null;
    }

    return (
      <style
        key={cache.key}
        data-emotion={`${cache.key} ${names.join(' ')}`}
        dangerouslySetInnerHTML={{
          __html: names.map((name) => cache.inserted[name]).join(''),
        }}
      />
    );
  });

  return (
    <CacheProvider value={cache}>
      <ThemeProvider theme={baselightTheme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </CacheProvider>
  );
};

export default ThemeRegistry;

