"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { Button } from "../button";
import { Card } from "../card";
import { Badge } from "../badge";
import { MapPin, Loader2, Building } from "lucide-react";
import type { Job } from "@/lib/types/jobs";
import Link from "next/link";

export const JobsListing = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const pageRef = useRef(1);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const fetchJobs = useCallback(async (pageNum: number, append = false) => {
    try {
      if (append) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }

      const response = await fetch(`/api/jobs?limit=20&page=${pageNum}&category=medicina`);
      if (!response.ok) throw new Error("Failed to fetch jobs");

      const data = await response.json();
      const newJobs = data.jobs || [];

      if (append) {
        setJobs(prev => [...prev, ...newJobs]);
      } else {
        setJobs(newJobs);
      }

      // Check if there are more jobs to load
      const totalPages = data.pagination?.pages || 1;
      setHasMore(pageNum < totalPages);

    } catch (err) {
      console.error("Error fetching jobs:", err);
      setError(true);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    fetchJobs(1, false);
  }, [fetchJobs]);

  // Infinite scroll observer
  useEffect(() => {
    if (loading || loadingMore || !hasMore) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore) {
          pageRef.current += 1;
          fetchJobs(pageRef.current, true);
        }
      },
      { threshold: 0.1 }
    );

    if (sentinelRef.current) {
      observerRef.current.observe(sentinelRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [loading, loadingMore, hasMore, fetchJobs]);

  return (
    <div className="w-full">
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-[#2e4b89]"></div>
        </div>
      ) : error ? (
        <div className="py-12 text-center">
          <p className="text-gray-600">
            Não foi possível carregar as vagas. Tente novamente mais tarde.
          </p>
        </div>
      ) : jobs.length === 0 ? (
        <div className="py-12 text-center">
          <p className="text-gray-600">Nenhuma vaga disponível no momento.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {jobs.map((job, index) => (
              <Card
                key={job.slug || index}
                className="border border-gray-200 hover:shadow-xl hover:scale-[1.01] hover:border-[#2e4b89] transition-all duration-300 ease-in-out"
              >
                <div className="flex flex-col md:flex-row gap-4 p-6">
                    <div className="shrink-0">
                      <div className="relative h-16 w-16 overflow-hidden rounded-lg bg-[#2e4b89]/10 flex items-center justify-center">
                        <Building className="h-8 w-8 text-[#2e4b89]" />
                      </div>
                    </div>

                  {/* Job Details */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl font-bold text-[#2e4b89] mb-2 line-clamp-2">
                      {job.title}
                    </h3>
                    <p className="text-sm text-gray-700 font-medium mb-2">
                      {job.companyName}
                    </p>
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span>{job.location}</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {job.schedule && (
                        <Badge
                          variant="outline"
                          className="text-xs hover:bg-gray-100 hover:scale-105 transition-all duration-200 cursor-pointer"
                        >
                          {job.schedule}
                        </Badge>
                      )}
                      {job.postedDate && (
                        <Badge
                          variant="outline"
                          className="text-xs text-gray-600 hover:bg-gray-100 hover:scale-105 transition-all duration-200 cursor-pointer"
                        >
                          {job.postedDate}
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="flex items-center justify-end md:justify-center">
                    <Link
                      href={job.applyLink}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button className="bg-[#cc892b] hover:bg-[#cc892b]/90 hover:scale-105 active:scale-95 transition-transform duration-200 whitespace-nowrap">
                        Ver Vaga
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Loading More Indicator */}
          {loadingMore && (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-[#2e4b89]" />
            </div>
          )}

          {/* End of List Message */}
          {!hasMore && jobs.length > 0 && (
            <div className="py-8 text-center">
              <p className="text-gray-600">Não há mais vagas disponíveis</p>
            </div>
          )}

          {/* Infinite Scroll Sentinel */}
          <div ref={sentinelRef} className="h-4" />
        </>
      )}
    </div>
  );
};
