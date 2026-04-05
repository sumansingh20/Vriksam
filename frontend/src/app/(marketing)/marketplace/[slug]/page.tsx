import type { Metadata } from 'next';
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

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

interface CatalogMetadataItem {
  name: string;
  scientificName: string;
  description: string | null;
}

async function getCatalogItem(slug: string): Promise<CatalogMetadataItem | null> {
  try {
    const response = await fetch(`${API_BASE}/plants/catalog/${encodeURIComponent(slug)}`, {
      next: { revalidate: 300 },
    });

    if (!response.ok) {
      return null;
    }

    const payload = (await response.json()) as {
      data?: CatalogMetadataItem;
    };

    return payload.data ?? null;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const plant = await getCatalogItem(params.slug);

  if (!plant) {
    return {
      title: 'Plant Not Found | Vriksham Marketplace',
    };
  }

  return {
    title: `${plant.name} - ${plant.scientificName} | Vriksham Marketplace`,
    description:
      plant.description ||
      `${plant.name} live catalog profile on Vriksham Marketplace.`,
  };
}

// ---------------------------------------------------------------------------
// Page (Server Component)
// ---------------------------------------------------------------------------

export default function PlantDetailPage({ params }: Props) {
  return <PlantDetail slug={params.slug} />;
}
