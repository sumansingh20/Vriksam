// =============================================================================
// VRIKSHAM API - /api/marketplace
// =============================================================================
// GET - Public plant catalog with filtering, search, and pagination
//       No authentication required.
// =============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { PlantSpecies, PlantCategory } from '@/lib/models';

export const dynamic = 'force-dynamic';

// ---------------------------------------------------------------------------
// GET /api/marketplace - Public plant catalog
// ---------------------------------------------------------------------------
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);

    // Pagination
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '20', 10)));
    const skip = (page - 1) * limit;

    // Build filter — only show active species in the marketplace
    const filter: Record<string, unknown> = { isActive: true };

    // -- Text search (commonName or scientificName) --
    const search = searchParams.get('search');
    if (search) {
      filter.$or = [
        { commonName: { $regex: search, $options: 'i' } },
        { scientificName: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    // -- Category filter --
    const category = searchParams.get('category');
    if (category && Object.values(PlantCategory).includes(category as PlantCategory)) {
      filter.category = category;
    }

    // -- Light requirement filter (matches careInstructions.sunlight) --
    const lightRequirement = searchParams.get('lightRequirement');
    if (lightRequirement) {
      filter['careInstructions.sunlight'] = { $regex: lightRequirement, $options: 'i' };
    }

    // -- Size filter (matches maxHeight) --
    const size = searchParams.get('size');
    if (size) {
      filter.maxHeight = { $regex: size, $options: 'i' };
    }

    // -- Price range filters --
    // Note: PlantSpecies does not currently have a price field.
    // When a price field is added to the model, uncomment below.
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    if (minPrice || maxPrice) {
      const priceFilter: Record<string, number> = {};
      if (minPrice) priceFilter.$gte = parseFloat(minPrice);
      if (maxPrice) priceFilter.$lte = parseFloat(maxPrice);
      if (Object.keys(priceFilter).length > 0) {
        filter.price = priceFilter;
      }
    }

    // -- Sort --
    const sortBy = searchParams.get('sortBy');
    let sortOption: Record<string, 1 | -1> = { createdAt: -1 };
    switch (sortBy) {
      case 'name':
        sortOption = { commonName: 1 };
        break;
      case 'name_desc':
        sortOption = { commonName: -1 };
        break;
      case 'category':
        sortOption = { category: 1, commonName: 1 };
        break;
      case 'difficulty':
        sortOption = { difficulty: 1 };
        break;
      case 'price_asc':
        sortOption = { price: 1 };
        break;
      case 'price_desc':
        sortOption = { price: -1 };
        break;
      case 'newest':
        sortOption = { createdAt: -1 };
        break;
      case 'oldest':
        sortOption = { createdAt: 1 };
        break;
      default:
        sortOption = { createdAt: -1 };
        break;
    }

    const [plants, total] = await Promise.all([
      PlantSpecies.find(filter)
        .sort(sortOption)
        .skip(skip)
        .limit(limit)
        .lean(),
      PlantSpecies.countDocuments(filter),
    ]);

    return NextResponse.json(
      {
        success: true,
        plants,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error('[API] GET /api/marketplace error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 },
    );
  }
}
