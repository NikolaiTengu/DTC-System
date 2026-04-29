function buildListQuery(query, allowedFilters = []) {
  const page = Math.max(Number(query.page || 1), 1);
  const limit = Math.min(Math.max(Number(query.limit || 10), 1), 100);
  const sort = query.sort || "-createdAt";
  const filters = {};

  allowedFilters.forEach((key) => {
    if (query[key] !== undefined && query[key] !== "") {
      filters[key] = query[key];
    }
  });

  return { page, limit, sort, filters };
}

async function paginate(modelQuery, { page, limit }) {
  const skip = (page - 1) * limit;
  const [items, total] = await Promise.all([
    modelQuery.skip(skip).limit(limit),
    modelQuery.model.countDocuments(modelQuery.getFilter())
  ]);

  return {
    items,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1
    }
  };
}

module.exports = { buildListQuery, paginate };
