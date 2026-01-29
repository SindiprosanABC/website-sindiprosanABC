import { NextRequest, NextResponse } from "next/server";
import { getJobsCollection } from "@/lib/mongodb";
import type { Job } from "@/lib/types/jobs";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const slug = searchParams.get("slug");
    const category = searchParams.get("category") || "medicina";
    const location = searchParams.get("location"); // Filtro futuro

    const collection = await getJobsCollection();

    // Get single job by slug
    if (slug) {
      const job = await collection.findOne({
        slug,
        category,
        isActive: true,
      });

      if (!job) {
        return NextResponse.json({ error: "Job not found" }, { status: 404 });
      }

      // Transform MongoDB document to Job type
      const jobData: Job = {
        slug: job.slug,
        jobId: job.jobId,
        title: job.title,
        companyName: job.companyName,
        location: job.location,
        description: job.description,
        thumbnail: job.thumbnail,
        via: job.via,
        applyLink: job.applyLink,
        salary: job.salary,
        schedule: job.schedule,
        postedAt: job.postedAt,
        postedDate: job.postedDate,
        extensions: job.extensions,
        isActive: job.isActive,
        createdAt: job.createdAt,
        updatedAt: job.updatedAt,
        category: job.category,
      };

      return NextResponse.json({ job: jobData });
    }

    // Get paginated list of jobs
    const skip = (page - 1) * limit;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filter: any = {
      isActive: true,
      category,
    };

    if (location) {
      filter.location = { $regex: location, $options: "i" };
    }

    const [jobs, total] = await Promise.all([
      collection
        .find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .toArray(),
      collection.countDocuments(filter),
    ]);

    // Transform to Job[] type
    const jobsList: Job[] = jobs.map((job) => ({
      slug: job.slug,
      jobId: job.jobId,
      title: job.title,
      companyName: job.companyName,
      location: job.location,
      description: job.description,
      thumbnail: job.thumbnail,
      via: job.via,
      applyLink: job.applyLink,
      salary: job.salary,
      schedule: job.schedule,
      postedAt: job.postedAt,
      postedDate: job.postedDate,
      extensions: job.extensions,
      isActive: job.isActive,
      createdAt: job.createdAt,
      updatedAt: job.updatedAt,
      category: job.category,
    }));

    return NextResponse.json({
      jobs: jobsList,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    console.error("[API] Error fetching jobs:", errorMessage);

    return NextResponse.json(
      { error: "Failed to fetch jobs" },
      { status: 500 },
    );
  }
}
