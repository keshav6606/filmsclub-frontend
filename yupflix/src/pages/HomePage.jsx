import React from 'react';
import { useParams } from 'react-router-dom';
import { CatalogView } from '../components/CatalogView';

export function HomePage() {
  return <CatalogView type="" />;
}

export function BrowsePage() {
  const { type = '' } = useParams();
  const normalizedType = type === 'all' ? '' : type;
  return <CatalogView key={normalizedType} type={normalizedType} />;
}
