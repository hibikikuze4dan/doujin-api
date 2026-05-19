const {
  getQueryConditionsAndBindings,
} = require("./getQueryConditionsAndBindings");
const {
  getTagsConditionsAndBindings,
} = require("./getTagsConditionsAndBindings");

const searchArchives = (db) => {
  const func = (parameters = {}) => {
    const {
      q,
      q_mode = "and",
      tag,
      tag_mode = "and",
      min_pages,
      max_pages,
      min_size,
      max_size,
      added_after,
      added_before,
      created_after,
      created_before,
      collection,
      sort_by,
      sort_direction,
    } = parameters ?? {};

    let conditions = [];
    let bindings = [];

    // --- Text search (q) ---
    const queryConditionsAndBindings = getQueryConditionsAndBindings({
      bindings,
      conditions,
      q_mode,
      q,
    });

    conditions = queryConditionsAndBindings?.conditions;
    bindings = queryConditionsAndBindings?.bindings;

    // --- Tag filtering ---
    const tagsConditionsAndBindings = getTagsConditionsAndBindings({
      bindings,
      conditions,
      tag,
      tag_mode,
    });

    conditions = [...conditions, ...tagsConditionsAndBindings.conditions];
    bindings = [...bindings, ...tagsConditionsAndBindings.bindings];

    // --- Scalar range filters ---
    if (min_pages !== undefined) {
      conditions.push("d.pagecount >= ?");
      bindings.push(min_pages);
    }
    if (max_pages !== undefined) {
      conditions.push("d.pagecount <= ?");
      bindings.push(max_pages);
    }
    if (min_size !== undefined) {
      conditions.push("d.size >= ?");
      bindings.push(min_size);
    }
    if (max_size !== undefined) {
      conditions.push("d.size <= ?");
      bindings.push(max_size);
    }

    // --- Date range filters ---
    if (added_after !== undefined) {
      conditions.push("d.date_added >= ?");
      bindings.push(added_after);
    }
    if (added_before !== undefined) {
      conditions.push("d.date_added <= ?");
      bindings.push(added_before);
    }
    if (created_after !== undefined) {
      conditions.push("d.date_created >= ?");
      bindings.push(created_after);
    }
    if (created_before !== undefined) {
      conditions.push("d.date_created <= ?");
      bindings.push(created_before);
    }

    // --- Collection membership ---
    if (collection !== undefined) {
      conditions.push(`
      EXISTS (
        SELECT 1 FROM collection_archives cd
        WHERE cd.archive_id = d.id
        AND cd.collection_id = ?
      )
    `);
      bindings.push(collection);
    }

    const whereClause =
      conditions.length > 0 ? `WHERE ${conditions.join("\n  AND ")}` : "";

    // --- Sorting ---
    const allowedSortFields = {
      name: "d.name",
      size: "d.size",
      pagecount: "d.pagecount",
      date_added: "d.date_added",
      date_created: "d.date_created",
      rating: "COALESCE(ar.avg_rating, 0)",
    };

    const sortField = allowedSortFields[sort_by] || allowedSortFields.name;
    let dir = (sort_direction || "asc").toLowerCase();
    dir = dir === "desc" ? "DESC" : "ASC";
    const orderClause =
      sort_by === "rating"
        ? `ORDER BY ${sortField} ${dir}, d.name ${dir}`
        : `ORDER BY ${sortField} ${dir}`;

    const sql = `
    SELECT DISTINCT
      d.id,
      d.name,
      d.filepath,
      d.date_added,
      d.date_created,
      d.pagecount,
      d.size,
      COALESCE(ar.avg_rating, 0) AS rating
    FROM archives d
    LEFT JOIN tags t ON t.archive_id = d.id
    LEFT JOIN (
      SELECT archive_id, AVG(rating) AS avg_rating
      FROM archive_rating
      GROUP BY archive_id
    ) ar ON ar.archive_id = d.id
    ${whereClause}
    ${orderClause}
  `;

    const results = db.prepare(sql).all(bindings);
    return { results };
  };

  return func;
};

exports.searchArchives = searchArchives;
