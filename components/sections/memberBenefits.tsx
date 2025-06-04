import { BarChart2, BookOpen, ChevronRight, FileText } from "lucide-react";
import { Badge } from "../badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../card";
import { Button } from "../button";

export const MemberBenefits = () => {
  return (
    <section className="bg-gray-50 py-16">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <Badge className="mb-2 bg-[#d29531] hover:bg-[#d29531]/90">
            Why Join Us
          </Badge>
          <h2 className="mb-4 text-3xl font-bold text-[#2e4b89]">
            Member Benefits
          </h2>
          <p className="mx-auto max-w-2xl text-gray-600">
            Our union provides comprehensive benefits designed specifically for
            pharmaceutical sales representatives.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#2e4b89]/10">
                <BarChart2 className="h-6 w-6 text-[#2e4b89]" />
              </div>
              <CardTitle className="text-[#2e4b89]">
                Career Development
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start gap-2">
                  <ChevronRight className="mt-0.5 h-5 w-5 shrink-0 text-[#d29531]" />
                  <span>Professional certification programs</span>
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight className="mt-0.5 h-5 w-5 shrink-0 text-[#d29531]" />
                  <span>Networking opportunities with industry leaders</span>
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight className="mt-0.5 h-5 w-5 shrink-0 text-[#d29531]" />
                  <span>Career advancement resources and coaching</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button
                variant="outline"
                className="w-full border-[#2e4b89] text-[#2e4b89] hover:bg-[#2e4b89] hover:text-white"
              >
                Learn More
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#2e4b89]/10">
                <FileText className="h-6 w-6 text-[#2e4b89]" />
              </div>
              <CardTitle className="text-[#2e4b89]">Legal Protection</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start gap-2">
                  <ChevronRight className="mt-0.5 h-5 w-5 shrink-0 text-[#d29531]" />
                  <span>Contract review and negotiation assistance</span>
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight className="mt-0.5 h-5 w-5 shrink-0 text-[#d29531]" />
                  <span>Workplace dispute resolution</span>
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight className="mt-0.5 h-5 w-5 shrink-0 text-[#d29531]" />
                  <span>Legal consultation for work-related issues</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button
                variant="outline"
                className="w-full border-[#2e4b89] text-[#2e4b89] hover:bg-[#2e4b89] hover:text-white"
              >
                Learn More
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#2e4b89]/10">
                <BookOpen className="h-6 w-6 text-[#2e4b89]" />
              </div>
              <CardTitle className="text-[#2e4b89]">
                Education & Training
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start gap-2">
                  <ChevronRight className="mt-0.5 h-5 w-5 shrink-0 text-[#d29531]" />
                  <span>Continuing education courses</span>
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight className="mt-0.5 h-5 w-5 shrink-0 text-[#d29531]" />
                  <span>Industry-specific workshops and seminars</span>
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight className="mt-0.5 h-5 w-5 shrink-0 text-[#d29531]" />
                  <span>Access to research and educational resources</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button
                variant="outline"
                className="w-full border-[#2e4b89] text-[#2e4b89] hover:bg-[#2e4b89] hover:text-white"
              >
                Learn More
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="mt-12 text-center">
          <Button className="bg-[#d29531] hover:bg-[#d29531]/90">
            View All Benefits
          </Button>
        </div>
      </div>
    </section>
  );
};
