import { type Database } from "better-sqlite3";
import {
  type DatabaseQueryBindings,
  type DatabaseQueryConditions,
} from "../types";
import { getQueryConditionsAndBindings } from "./getQueryConditionsAndBindings";
import { getTagsConditionsAndBindings } from "./getTagsConditionsAndBindings";
import { getRangeBasedConditionsAndBindings } from "./getRangeBasedConditionsAndBindings";
import { ARCHIVE_JOINS, ARCHIVE_SELECT } from "../constants";
import { type SearchArchivesQuery } from "../../../../types/general";
import { parseNumericQuery } from "../../../utils/query";
import { type ArchiveWithConnectedTableData } from "../../../../types/database";

export const searchArchives = (db: Database) => {
  const func = (parameters = {} as SearchArchivesQuery) => {
    const {
      q,
      q_mode = "and",
      tags,
      tag_mode = "and",
      min_pages,
      max_pages,
      min_size,
      max_size,
      min_rating,
      max_rating,
      min_tags,
      max_tags,
      added_after,
      added_before,
      created_after,
      created_before,
      collection,
      sort_by = "name",
      sort_direction = "asc",
      page = 1,
      archivesPerPage = 20,
    } = parameters;

    let conditions: DatabaseQueryConditions = [];
    let bindings: DatabaseQueryBindings = [];

    // --- Text search (q) ---
    let newConditionsAndBindings = getQueryConditionsAndBindings({
      bindings,
      conditions,
      q_mode,
      q,
    });
    conditions = newConditionsAndBindings?.conditions;
    bindings = newConditionsAndBindings?.bindings;

    // --- Tag filtering ---
    newConditionsAndBindings = getTagsConditionsAndBindings({
      bindings,
      conditions,
      tags,
      tag_mode,
    });
    conditions = newConditionsAndBindings?.conditions;
    bindings = newConditionsAndBindings?.bindings;

    // --- Scalar range filters ---
    newConditionsAndBindings = getRangeBasedConditionsAndBindings({
      bindings,
      conditions,
      min_pages: parseNumericQuery(min_pages),
      max_pages: parseNumericQuery(max_pages),
      min_size: parseNumericQuery(min_size),
      max_size: parseNumericQuery(max_size),
      min_rating: parseNumericQuery(min_rating),
      max_rating: parseNumericQuery(max_rating),
      min_tags: parseNumericQuery(min_tags),
      max_tags: parseNumericQuery(max_tags),
    });
    conditions = newConditionsAndBindings?.conditions;
    bindings = newConditionsAndBindings?.bindings;

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
      random: "RANDOM()",
    };

    const sortField = allowedSortFields[sort_by] || allowedSortFields.name;
    let dir = (sort_direction || "asc").toLowerCase();
    dir = dir === "desc" ? "DESC" : "ASC";
    const orderClause =
      sort_by === "rating"
        ? `ORDER BY ${sortField} ${dir}, d.name ${dir}`
        : `ORDER BY ${sortField} ${dir}`;

    // --- Pagination ---
    const offset = page === 1 ? 0 : (page - 1) * archivesPerPage;
    const paginationClause = `LIMIT ${archivesPerPage} OFFSET ${offset}`;

    const sqlForArchives = `
      SELECT
        ${ARCHIVE_SELECT}
      ${ARCHIVE_JOINS}  
      ${whereClause}
      GROUP BY d.id
      ${orderClause}
      ${paginationClause}
    `;

    const sqlForNumberOfResults = `
      SELECT COUNT(DISTINCT d.id) AS totalResults
      ${ARCHIVE_JOINS}  
      ${whereClause}
    `;

    const archives = db
      .prepare(sqlForArchives)
      .all(bindings) as ArchiveWithConnectedTableData[];

    const { totalResults } = db
      .prepare(sqlForNumberOfResults)
      .get(bindings) as { totalResults: number };

    return { archives, totalResults };
  };

  return func;
};
