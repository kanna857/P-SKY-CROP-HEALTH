import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { executeGeneralSearch, SearchResponse } from '@/lib/generalSearchEngine';
import { GoogleHomeView } from '@/components/google/GoogleHomeView';
import { GoogleResultsView } from '@/components/google/GoogleResultsView';

export default function SearchEnginePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryParam = searchParams.get('q') || '';

  const [response, setResponse] = useState<SearchResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);

  const performSearch = useCallback(async (q: string) => {
    if (!q.trim()) {
      setResponse(null);
      return;
    }

    setLoading(true);
    try {
      const res = await executeGeneralSearch(q);
      setResponse(res);
    } catch (err) {
      console.error('Search query failed:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // When URL query parameter changes, execute search
  useEffect(() => {
    if (queryParam) {
      performSearch(queryParam);
    } else {
      setResponse(null);
    }
  }, [queryParam, performSearch]);

  const handleSearchSubmit = (newQuery: string) => {
    if (!newQuery.trim()) {
      setSearchParams({});
      setResponse(null);
      return;
    }
    setSearchParams({ q: newQuery.trim() });
    performSearch(newQuery.trim());
  };

  const handleResetHome = () => {
    setSearchParams({});
    setResponse(null);
  };

  const handleToggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
  };

  return (
    <Layout>
      <div className={`min-h-[90vh] transition-colors duration-300 ${
        isDarkMode ? 'bg-[#060a10]' : 'bg-[#f8f9fa]'
      }`}>
        {queryParam ? (
          <GoogleResultsView
            response={response}
            loading={loading}
            onSearch={handleSearchSubmit}
            onResetHome={handleResetHome}
            isDarkMode={isDarkMode}
            onToggleDarkMode={handleToggleDarkMode}
          />
        ) : (
          <GoogleHomeView
            onSearch={handleSearchSubmit}
            isDarkMode={isDarkMode}
            onToggleDarkMode={handleToggleDarkMode}
          />
        )}
      </div>
    </Layout>
  );
}
