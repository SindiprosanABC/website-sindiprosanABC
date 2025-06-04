import { Button } from "../button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../carousel";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../card";
import Image from "next/image";
import { Badge } from "../badge";
import { ArrowRight } from "lucide-react";

export const LatestNews = () => {
  return (
    <section className="bg-gray-50 py-16">
      <div className="container mx-auto px-4">
        <div className="mb-12 flex flex-col items-start justify-between md:flex-row md:items-center">
          <div>
            <Badge className="mb-2 bg-[#d29531] hover:bg-[#d29531]/90">
              Stay Informed
            </Badge>
            <h2 className="text-3xl font-bold text-[#2e4b89]">
              Latest News & Updates
            </h2>
          </div>
          <Button
            variant="link"
            className="flex h-auto items-center gap-1 p-0 text-[#2e4b89] hover:text-[#d29531]"
          >
            View All News <ArrowRight className="h-4 w-4" />
          </Button>
        </div>

        <Carousel className="w-full">
          <CarouselContent>
            <CarouselItem className="md:basis-1/2 lg:basis-1/3">
              <Card>
                <div className="relative h-48 w-full overflow-hidden rounded-t-lg">
                  <Image
                    src="/placeholder.svg?height=300&width=500"
                    alt="Industry conference"
                    width={500}
                    height={300}
                    className="h-full w-full object-cover"
                  />
                </div>
                <CardHeader>
                  <div className="mb-2 flex items-center justify-between">
                    <Badge variant="outline" className="text-[#2e4b89]">
                      Industry News
                    </Badge>
                    <span className="text-sm text-gray-500">May 15, 2025</span>
                  </div>
                  <CardTitle className="text-[#2e4b89]">
                    New Legislation Impacts Pharmaceutical Sales Representatives
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="line-clamp-3 text-gray-600">
                    Recent legislative changes will affect how pharmaceutical
                    sales representatives interact with healthcare providers.
                    Our union is actively working to address these changes.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button
                    variant="link"
                    className="h-auto p-0 text-[#d29531] hover:text-[#d29531]/80"
                  >
                    Read More
                  </Button>
                </CardFooter>
              </Card>
            </CarouselItem>

            <CarouselItem className="md:basis-1/2 lg:basis-1/3">
              <Card>
                <div className="relative h-48 w-full overflow-hidden rounded-t-lg">
                  <Image
                    src="/placeholder.svg?height=300&width=500"
                    alt="Union meeting"
                    width={500}
                    height={300}
                    className="h-full w-full object-cover"
                  />
                </div>
                <CardHeader>
                  <div className="mb-2 flex items-center justify-between">
                    <Badge variant="outline" className="text-[#2e4b89]">
                      Union Update
                    </Badge>
                    <span className="text-sm text-gray-500">May 10, 2025</span>
                  </div>
                  <CardTitle className="text-[#2e4b89]">
                    Annual Union Conference Scheduled for September
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="line-clamp-3 text-gray-600">
                    Mark your calendars for our annual conference, featuring
                    keynote speakers, workshops, and networking opportunities
                    for all members.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button
                    variant="link"
                    className="h-auto p-0 text-[#d29531] hover:text-[#d29531]/80"
                  >
                    Read More
                  </Button>
                </CardFooter>
              </Card>
            </CarouselItem>

            <CarouselItem className="md:basis-1/2 lg:basis-1/3">
              <Card>
                <div className="relative h-48 w-full overflow-hidden rounded-t-lg">
                  <Image
                    src="/placeholder.svg?height=300&width=500"
                    alt="Healthcare professionals"
                    width={500}
                    height={300}
                    className="h-full w-full object-cover"
                  />
                </div>
                <CardHeader>
                  <div className="mb-2 flex items-center justify-between">
                    <Badge variant="outline" className="text-[#2e4b89]">
                      Member Spotlight
                    </Badge>
                    <span className="text-sm text-gray-500">May 5, 2025</span>
                  </div>
                  <CardTitle className="text-[#2e4b89]">
                    Member Success Story: Breaking Sales Records
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="line-clamp-3 text-gray-600">
                    Read about how union member Jane Smith utilized our
                    resources to achieve record-breaking sales numbers in her
                    territory.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button
                    variant="link"
                    className="h-auto p-0 text-[#d29531] hover:text-[#d29531]/80"
                  >
                    Read More
                  </Button>
                </CardFooter>
              </Card>
            </CarouselItem>

            <CarouselItem className="md:basis-1/2 lg:basis-1/3">
              <Card>
                <div className="relative h-48 w-full overflow-hidden rounded-t-lg">
                  <Image
                    src="/placeholder.svg?height=300&width=500"
                    alt="Digital marketing"
                    width={500}
                    height={300}
                    className="h-full w-full object-cover"
                  />
                </div>
                <CardHeader>
                  <div className="mb-2 flex items-center justify-between">
                    <Badge variant="outline" className="text-[#2e4b89]">
                      Industry Trends
                    </Badge>
                    <span className="text-sm text-gray-500">May 1, 2025</span>
                  </div>
                  <CardTitle className="text-[#2e4b89]">
                    Digital Transformation in Pharmaceutical Sales
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="line-clamp-3 text-gray-600">
                    Explore how digital tools are changing the landscape of
                    pharmaceutical sales and how representatives can adapt.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button
                    variant="link"
                    className="h-auto p-0 text-[#d29531] hover:text-[#d29531]/80"
                  >
                    Read More
                  </Button>
                </CardFooter>
              </Card>
            </CarouselItem>
          </CarouselContent>
          <div className="mt-8 flex justify-center">
            <CarouselPrevious className="static mr-2 translate-y-0" />
            <CarouselNext className="static ml-2 translate-y-0" />
          </div>
        </Carousel>
      </div>
    </section>
  );
};
