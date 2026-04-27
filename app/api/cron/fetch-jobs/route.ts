import { NextRequest, NextResponse } from "next/server";
import { createSerpApiClient } from "@/lib/serpapi";
import { getJobsCollection } from "@/lib/mongodb";
import { transformBatchJobs } from "@/utils/jobs-transformer";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    // Verify cron secret for security
    const authHeader = request.headers.get("authorization");
    const expectedAuth = `Bearer ${process.env.CRON_SECRET}`;

    if (authHeader !== expectedAuth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Validate search keywords environment variable
    const searchKeywords = process.env.SERPAPI_SEARCH_KEYWORDS;
    if (!searchKeywords) {
      return NextResponse.json(
        { error: "SERPAPI_SEARCH_KEYWORDS environment variable is not set" },
        { status: 500 },
      );
    }

    // Parse keywords (pode ser múltiplas queries separadas por vírgula)
    const queries = searchKeywords
      .split(",")
      .map((q) => q.trim())
      .filter(Boolean);

    const serpClient = createSerpApiClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const allJobs: any[] = [];

    // Buscar vagas para cada termo
    for (const query of queries) {
      try {
        const response = await serpClient.searchJobs(query, {
          location: "Brazil",
          num: 20, // Máximo de resultados por query
        });

        console.log(response);

        if (response.jobs_results && response.jobs_results.length > 0) {
          allJobs.push(...response.jobs_results);
        }
      } catch (error) {
        console.error(
          `[Cron] Error fetching jobs for query "${query}":`,
          error,
        );
        // Continue com próxima query mesmo se esta falhar
      }
    }

    if (allJobs.length === 0) {
      return NextResponse.json({
        success: true,
        message: "No new jobs found",
        count: 0,
      });
    }

    // Filtrar apenas vagas das regiões-alvo
    const TARGET_LOCATIONS = /Santo André|São Bernardo|São Caetano|Diadema|Mauá|Ribeirão Pires|Rio Grande da Serra|Santos|São Vicente|Guarujá|Cubatão|Praia Grande|Bertioga|Itanhaém|Mongaguá|Peruíbe|Caraguatatuba|Ubatuba|São Sebastião|Ilhabela/i;
    const filteredJobs = allJobs.filter((job) =>
      job.location && TARGET_LOCATIONS.test(job.location)
    );

    if (filteredJobs.length === 0) {
      return NextResponse.json({
        success: true,
        message: "No jobs found for target regions",
        count: 0,
      });
    }

    // Transform jobs
    const transformedJobs = transformBatchJobs(filteredJobs);

    // Store in MongoDB
    const collection = await getJobsCollection();

    // Use upsert to avoid duplicates based on jobId
    const bulkOps = transformedJobs.map((job) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { createdAt, updatedAt, ...jobData } = job;

      return {
        updateOne: {
          filter: { jobId: job.jobId },
          update: {
            $set: { ...jobData, updatedAt: new Date() },
            $setOnInsert: { createdAt: new Date() },
          },
          upsert: true,
        },
      };
    });

    // Desativar vagas fora das regiões-alvo que já estavam no banco
    await collection.updateMany(
      { isActive: true, location: { $not: TARGET_LOCATIONS } },
      { $set: { isActive: false, updatedAt: new Date() } },
    );

    const result = await collection.bulkWrite(bulkOps);

    // Create indexes if they don't exist
    await collection.createIndex({ slug: 1 }, { unique: true, sparse: true });
    await collection.createIndex({ jobId: 1 }, { unique: true });
    await collection.createIndex({ isActive: 1, createdAt: -1 });
    await collection.createIndex(
      { category: 1, isActive: 1, createdAt: -1 },
      { background: true, name: "category_active_created_idx" },
    );
    await collection.createIndex({ location: 1, isActive: 1 });

    return NextResponse.json({
      success: true,
      message: "Jobs fetched and stored successfully",
      count: allJobs.length,
      inserted: result.upsertedCount,
      updated: result.modifiedCount,
    });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    console.error("[Cron] Error fetching jobs:", error);

    return NextResponse.json(
      {
        success: false,
        error: errorMessage || "Failed to fetch jobs",
      },
      { status: 500 },
    );
  }
}
