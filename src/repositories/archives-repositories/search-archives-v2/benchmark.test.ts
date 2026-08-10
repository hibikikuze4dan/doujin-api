import Database from "better-sqlite3";
import { randomBytes } from "crypto";
import { searchArchivesV2 } from "./index";

const ARCHIVE_COUNT = 500_000;
const BATCH_SIZE = 10_000;
const TITLE_SEARCH_QUERY = "dragon";
const TAG_SEARCH_QUERY = "martial";
const TITLE_TAG_SEARCH_QUERY = "dragon martial";

const RANDOM_WORDS = [
  "action",
  "martial",
  "shounen",
  "adventure",
  "mystery",
  "dark",
  "fantasy",
  "hero",
  "shadow",
  "blade",
  "spirit",
  "legend",
  "quest",
  "dragon",
  "rise",
  "storm",
  "flame",
  "dream",
  "ghost",
  "ninja",
  "samurai",
  "shinobi",
  "king",
  "kami",
  "god",
  "akuma",
  "animal",
  "beast",
  "instinct",
  "war",
  "combat",
  "greed",
];

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomHex(length: number) {
  return randomBytes(Math.ceil(length / 2))
    .toString("hex")
    .slice(0, length);
}

function randomWord() {
  return RANDOM_WORDS[randomInt(0, RANDOM_WORDS.length - 1)] as string;
}

function randomSentence() {
  return Array.from({ length: randomInt(8, 15) }, randomWord).join(" ");
}

function slugify(str: string) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 120);
}

type SqliteDatabase = ReturnType<typeof Database>;

type ArchiveRow = {
  id: number;
  rating: number;
  hash: string;
  name: string;
  filepath: string;
  tags: string;
  date_added: string;
  date_created: string;
  pagecount: number;
  size: number;
};

function createSchema(db: SqliteDatabase) {
  db.exec(`
    CREATE TABLE archive (
      id INTEGER PRIMARY KEY,
      rating INTEGER NOT NULL DEFAULT 0,
      hash TEXT NOT NULL,
      name TEXT NOT NULL,
      filepath TEXT NOT NULL UNIQUE,
      tags TEXT NOT NULL DEFAULT '',
      date_added TEXT NOT NULL,
      date_created TEXT NOT NULL,
      pagecount INTEGER NOT NULL,
      size INTEGER NOT NULL
    );

    CREATE INDEX IF NOT EXISTS archive_index_rating ON archive(rating);
    CREATE INDEX IF NOT EXISTS archive_index_pagecount ON archive(pagecount);
    CREATE INDEX IF NOT EXISTS archive_index_size ON archive(size);
    CREATE INDEX IF NOT EXISTS archive_index_date_added ON archive(date_added);
    CREATE INDEX IF NOT EXISTS archive_index_date_created ON archive(date_created);

    CREATE VIRTUAL TABLE IF NOT EXISTS archive_fts USING fts5(
      name,
      tags,
      content='archive',
      content_rowid='id'
    );
  `);
}

function formatDate(date: Date) {
  return date.toISOString();
}

function generateArchiveRow(
  id: number,
  seed?: { title?: string; tags?: string },
) {
  const name = seed?.title ?? generateLongTitle();
  const tags = seed?.tags ?? generateCommaSeparatedTags();
  const hash = randomHex(64);
  const slug = slugify(name);
  const filepath = `/archive/${id}-${slug}.cbz`;
  const date = formatDate(
    new Date(
      randomInt(
        new Date("2010-01-01T00:00:00.000Z").getTime(),
        new Date("2025-12-31T23:59:59.999Z").getTime(),
      ),
    ),
  );
  const pagecount = randomInt(10, 300);
  const size = randomInt(100_000, 500_000_000);
  const rating = randomInt(0, 10);

  return [id, rating, hash, name, filepath, tags, date, date, pagecount, size];
}

function generateLongTitle(requiredWord?: string) {
  const sentences: string[] = [];
  while (sentences.join(" ").length < 150) {
    sentences.push(randomSentence());
  }

  let title = sentences.join(" ");
  if (
    requiredWord &&
    !title.toLowerCase().includes(requiredWord.toLowerCase())
  ) {
    title = `${requiredWord} ${title}`;
  }

  title = title.slice(0, 150);
  return title.length >= 150 ? title : title.padEnd(150, " ");
}

function generateCommaSeparatedTags(requiredTag?: string) {
  const tags = new Set<string>();
  if (requiredTag) {
    tags.add(requiredTag.toLowerCase());
  }

  while (tags.size < randomInt(3, 20)) {
    tags.add(randomWord().toLowerCase());
  }

  return Array.from(tags).join(", ");
}

function populateArchives(
  db: SqliteDatabase,
  count: number,
  seededRows: ArchiveRow[],
) {
  const insert = db.prepare(`
    INSERT INTO archive (id, rating, hash, name, filepath, tags, date_added, date_created, pagecount, size)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const insertTransaction = db.transaction((rows: Array<unknown[]>) => {
    for (const row of rows) {
      insert.run(...row);
    }
  });

  const seededRowsValues = seededRows.map((seededRow) => [
    seededRow.id,
    seededRow.rating,
    seededRow.hash,
    seededRow.name,
    seededRow.filepath,
    seededRow.tags,
    seededRow.date_added,
    seededRow.date_created,
    seededRow.pagecount,
    seededRow.size,
  ]);

  let batch: Array<unknown[]> = [...seededRowsValues];
  for (let id = seededRows.length + 1; id <= count; id += 1) {
    batch.push(generateArchiveRow(id));
    if (batch.length >= BATCH_SIZE) {
      insertTransaction(batch);
      batch = [];
      if (id % 100_000 === 0) {
        console.log(`Inserted ${id} rows...`);
      }
    }
  }

  if (batch.length > 0) insertTransaction(batch);
}

function populateFts(db: SqliteDatabase) {
  db.exec(
    `INSERT INTO archive_fts(rowid, name, tags) SELECT id, name, tags FROM archive;`,
  );
}

function formatMs(durationMs: number) {
  return `${durationMs.toFixed(2)} ms`;
}

function runSearch(
  db: SqliteDatabase,
  label: string,
  query: string,
  seededTitle: string,
  seededTags: string,
) {
  const { searchArchivesWithMeta } = searchArchivesV2(db);

  const params = {
    query,
    minRating: "1",
    sortBy: "date_added",
    sortDir: "DESC",
    resultsPage: 1,
    archivesPerPage: 50,
  };

  console.log(`\nSearching [${label}] for generated seeded archive:`);
  console.log(`  title = ${seededTitle}`);
  console.log(`  tags = ${seededTags}`);
  console.log(`  query = ${query}`);

  const start = process.hrtime.bigint();
  const result = searchArchivesWithMeta(params as any);
  const end = process.hrtime.bigint();

  const durationMs = Number(end - start) / 1_000_000;
  console.log("Search results:");
  console.log(`  total = ${result.total}`);
  console.log(`  totalPages = ${result.totalPages}`);
  console.log(`  resultsPage = ${result.resultsPage}`);
  console.log(`  archivesPerPage = ${result.archivesPerPage}`);
  console.log(`  resultsReturned = ${result.results?.length ?? 0}`);

  expect(result.total).toBeGreaterThan(0);
  expect(result.results?.length ?? 0).toBeGreaterThan(0);

  if (result.results?.length) {
    console.log(`  first match id = ${result.results?.[0]?.id}`);
    console.log(`  first match name = ${result.results?.[0]?.name}`);
    console.log(`  first match tags = ${result.results?.[0]?.tags}`);
  }
  console.log(`Search elapsed: ${formatMs(durationMs)}`);

  return durationMs;
}

function runBenchmark() {
  console.log("Creating in-memory database and schema...");
  const db = new Database(":memory:");

  createSchema(db);

  const seededTitle = generateLongTitle(TITLE_SEARCH_QUERY);
  const seededTags = generateCommaSeparatedTags();
  const seededTitleOnlyRow: ArchiveRow = {
    id: 1,
    rating: 9,
    hash: randomHex(64),
    name: seededTitle,
    filepath: `/archive/1-${slugify(seededTitle)}.cbz`,
    tags: seededTags,
    date_added: formatDate(new Date()),
    date_created: formatDate(new Date()),
    pagecount: randomInt(10, 300),
    size: randomInt(100_000, 500_000_000),
  };

  const seededTagOnlyTitle = generateLongTitle();
  const seededTagOnlyTags = generateCommaSeparatedTags(TAG_SEARCH_QUERY);
  const seededTagOnlyRow: ArchiveRow = {
    id: 2,
    rating: 9,
    hash: randomHex(64),
    name: seededTagOnlyTitle,
    filepath: `/archive/2-${slugify(seededTagOnlyTitle)}.cbz`,
    tags: seededTagOnlyTags,
    date_added: formatDate(new Date()),
    date_created: formatDate(new Date()),
    pagecount: randomInt(10, 300),
    size: randomInt(100_000, 500_000_000),
  };

  const seededBothTitle = generateLongTitle(TITLE_SEARCH_QUERY);
  const seededBothTags = generateCommaSeparatedTags(TAG_SEARCH_QUERY);
  const seededBothRow: ArchiveRow = {
    id: 3,
    rating: 9,
    hash: randomHex(64),
    name: seededBothTitle,
    filepath: `/archive/3-${slugify(seededBothTitle)}.cbz`,
    tags: seededBothTags,
    date_added: formatDate(new Date()),
    date_created: formatDate(new Date()),
    pagecount: randomInt(10, 300),
    size: randomInt(100_000, 500_000_000),
  };

  console.log(`Populating ${ARCHIVE_COUNT.toLocaleString()} archives...`);
  const insertStart = process.hrtime.bigint();
  populateArchives(db, ARCHIVE_COUNT, [
    seededTitleOnlyRow,
    seededTagOnlyRow,
    seededBothRow,
  ]);
  const insertEnd = process.hrtime.bigint();
  console.log(
    `Archive insert finished in ${formatMs(Number(insertEnd - insertStart) / 1_000_000)}`,
  );

  console.log("Populating FTS index...");
  const ftsStart = process.hrtime.bigint();
  populateFts(db);
  const ftsEnd = process.hrtime.bigint();
  console.log(
    `FTS population finished in ${formatMs(Number(ftsEnd - ftsStart) / 1_000_000)}`,
  );

  console.log("Running search benchmark...");
  runSearch(
    db,
    "title-only",
    TITLE_SEARCH_QUERY,
    seededTitleOnlyRow.name,
    seededTitleOnlyRow.tags,
  );
  runSearch(
    db,
    "tag-only",
    TAG_SEARCH_QUERY,
    seededTagOnlyRow.name,
    seededTagOnlyRow.tags,
  );
  runSearch(
    db,
    "title-and-tag",
    TITLE_TAG_SEARCH_QUERY,
    seededBothRow.name,
    seededBothRow.tags,
  );
  console.log("Benchmark completed");
}

test("benchmark searchArchivesWithMeta on 500k archive rows", () => {
  runBenchmark();
});
