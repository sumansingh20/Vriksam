// =============================================================================
// VRIKSHAM API - /api/marketplace/[slug]
// =============================================================================
// GET - Retrieve a single plant species by slug (derived from commonName) or
//       by MongoDB ObjectId. Returns full details including care instructions,
//       description, and up to 4 related plants in the same category.
//       No authentication required.
// =============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { PlantSpecies } from '@/lib/models';
import mongoose from 'mongoose';

interface RouteParams {
  params: Promise<{ slug: string }>;
}

/**
 * Convert a slug string back to a regex that can match a commonName.
 * E.g. "snake-plant" -> /^snake\s+plant$/i  (hyphens become whitespace matchers)
 *
 * Escapes special regex characters first, then converts hyphens to \s+ so the
 * whitespace pattern is not accidentally escaped.
 */
function slugToNameRegex(slug: string): RegExp {
  const escaped = slug.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const namePattern = escaped.replace(/-/g, '\\s+');
  return new RegExp(`^${namePattern}$`, 'i');
}

// ---------------------------------------------------------------------------
// GET /api/marketplace/[slug] - Single plant detail
// ---------------------------------------------------------------------------
export async function GET(_req: NextRequest, { params }: RouteParams) {
  try {
    await connectDB();

    const { slug } = await params;

    if (!slug) {
      return NextResponse.json(
        { success: false, message: 'Slug or ID is required' },
        { status: 400 },
      );
    }

    // Try to find by ObjectId first, then by slug derived from commonName
    let species = null;

    if (mongoose.Types.ObjectId.isValid(slug)) {
      species = await PlantSpecies.findOne({
        _id: slug,
        isActive: true,
      }).lean();
    }

    if (!species) {
      species = await PlantSpecies.findOne({
        commonName: slugToNameRegex(slug),
        isActive: true,
      }).lean();
    }

    if (!species) {
      return NextResponse.json(
        { success: false, message: 'Plant not found' },
        { status: 404 },
      );
    }

    // Fetch up to 4 related plants in the same category (excluding current)
    const typedSpecies = species as { _id: mongoose.Types.ObjectId; category: string };
    const relatedPlants = await PlantSpecies.find({
      _id: { $ne: typedSpecies._id },
      category: typedSpecies.category,
      isActive: true,
    })
      .limit(4)
      .lean();

    return NextResponse.json(
      {
        success: true,
        plant: species,
        relatedPlants,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error('[API] GET /api/marketplace/[slug] error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 },
    );
  }
}
