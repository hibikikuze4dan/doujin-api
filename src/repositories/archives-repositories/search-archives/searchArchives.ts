import { type Database } from "better-sqlite3";
import {
  type DatabaseQueryBindings,
  type DatabaseQueryConditions,
} from "../types";
import { getQueryConditionsAndBindings } from "./getQueryConditionsAndBindings";
import { getTagsConditionsAndBindings } from "./getTagsConditionsAndBindings";
import { getRangeBasedConditionsAndBindings } from "./getRangeBasedConditionsAndBindings";
import { ARCHIVE_SELECT } from "../constants";
import { type SearchArchivesQuery } from "../../../../types/general";
import { parseNumericQuery } from "../../../utils/query";
import { type ArchiveWithConnectedTableData } from "../../../../types/database";

export const searchArchives = (db: Database) => {
  const func = (parameters = {} as SearchArchivesQuery) => {
    const {
      q,
      q_mode = "and",
      q_match_mode = "prefix",
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
      include_total_results = true,
    } = parameters;

    let conditions: DatabaseQueryConditions = [];
    let bindings: DatabaseQueryBindings = [];

    // --- Text search (q) ---
    let newConditionsAndBindings = getQueryConditionsAndBindings({
      bindings,
      conditions,
      q_mode,
      q_match_mode,
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
      rating: "d.rating",
      random: "RANDOM()",
    };

    const sortField = allowedSortFields[sort_by] || allowedSortFields.name;
    let dir = (sort_direction || "asc").toLowerCase();
    dir = dir === "desc" ? "DESC" : "ASC";
    const orderClause =
      sort_by === "random"
        ? `ORDER BY RANDOM()`
        : `ORDER BY ${sortField} ${dir}, d.id ${dir}`;

    // --- Pagination ---
    const offset = page === 1 ? 0 : (page - 1) * archivesPerPage;
    const paginationClause = `LIMIT ${archivesPerPage} OFFSET ${offset}`;

    const filterByTagCount = min_tags !== undefined || max_tags !== undefined;

    const tagCountJoin = filterByTagCount
      ? `
          LEFT JOIN (
            SELECT archive_id, COUNT(*) AS tag_count
            FROM tags
            GROUP BY archive_id
          ) tc ON tc.archive_id = d.id
        `
      : "";

    const sqlForPagedIds = `
      SELECT d.id
      FROM archives d
      ${tagCountJoin}
      ${whereClause}
      ${orderClause}
      ${paginationClause}
    `;

    const sqlForArchives = `
      SELECT
        ${ARCHIVE_SELECT}
      FROM (${sqlForPagedIds}) paged
      JOIN archives d ON d.id = paged.id
      LEFT JOIN tags t ON t.archive_id = d.id
      LEFT JOIN (
        SELECT archive_id, COUNT(*) AS tag_count
        FROM tags
        GROUP BY archive_id
      ) tc ON tc.archive_id = d.id
      GROUP BY d.id
      ${orderClause}
    `;

    const sqlForNumberOfResults = `
      SELECT COUNT(*) AS totalResults
      FROM archives d
      ${tagCountJoin}
      ${whereClause}
    `;

    // const explainstr = db.prepare(explain).all(bindings);
    // console.log(explainstr, "explained");

    const archives = db
      .prepare(sqlForArchives)
      .all(bindings) as ArchiveWithConnectedTableData[];

    const totalResults = include_total_results
      ? (
          db.prepare(sqlForNumberOfResults).get(bindings) as {
            totalResults: number;
          }
        ).totalResults
      : undefined;

    return { archives, totalResults };
  };

  return func;
};
