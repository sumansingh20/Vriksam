import type { Metadata } from 'next';
import { plants } from '../_data';
import PlantDetail from './plant-detail';

// ---------------------------------------------------------------------------
// Static params (returns empty array - pages generated on demand)
// ---------------------------------------------------------------------------

export function generateStaticParams() {
  return [];
}

// ---------------------------------------------------------------------------
// Dynamic metadata
// ---------------------------------------------------------------------------

type Props = { params: { slug: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const plant = plants.find((p) => p.slug === params.slug);

  if (!plant) {
    return {
      title: 'Plant Not Found | Vriksham Marketplace',
    };
  }

  return {
    title: `${plant.name} \u2014 ${plant.scientificName} | Vriksham Marketplace`,
    description: plant.description,
  };
}

// ---------------------------------------------------------------------------
// Page (Server Component)
// ---------------------------------------------------------------------------

export default function PlantDetailPage({ params }: Props) {
  return <PlantDetail slug={params.slug} />;
}
