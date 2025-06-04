import { Button } from "../button";

export const CallToAction = () => {
  return (
    <section className="bg-[#2e4b89] py-16 text-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="mb-4 text-3xl font-bold">Join Our Union Today</h2>
        <p className="mx-auto mb-8 max-w-2xl text-xl">
          Become part of a community dedicated to advancing the interests of
          pharmaceutical sales representatives.
        </p>
        <div className="flex flex-col justify-center gap-4 sm:flex-row">
          <Button size="lg" className="bg-[#d29531] hover:bg-[#d29531]/90">
            Join Now
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-white text-white hover:bg-white hover:text-[#2e4b89]"
          >
            Contact Us
          </Button>
        </div>
      </div>
    </section>
  );
};
