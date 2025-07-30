import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";

interface Testimonial {
  id: number;
  name: string;
  role: string;
  company: string;
  content: string;
  rating: number;
  avatar: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Sarah Mitchell",
    role: "Full-Stack Developer",
    company: "Melbourne, VIC",
    content:
      "Amazing service! They fixed my laptop's screen in just one day. Professional and affordable.  ",
    rating: 5,
    avatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=64&h=64&fit=crop&crop=face",
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Data Scientist",
    company: "Brisbane, QLD",
    content:
      "Recovered all my important files from a crashed hard drive. Couldn't be happier with the service.",
    rating: 5,
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=face",
  },
  {
    id: 3,
    name: "Jennifer Rodriguez",
    role: "Software Engineer",
    company: "Sydney, NSW",
    content:
      "Fast, reliable, and honest. They explained everything clearly and the price was very reasonable.",
    rating: 5,
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=64&h=64&fit=crop&crop=face",
  },
];

const stats = [
  { label: "Graduates Trained", value: "500+" },
  { label: "Job Placement Rate", value: "95%" },
  { label: "Student Rating", value: "4.9/5" },
  { label: "Average Starting Salary", value: "$75k+" },
];

export default function SuccessStories() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % testimonials.length);
    setIsAutoPlaying(false);
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length,
    );
    setIsAutoPlaying(false);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-400"
        }`}
      />
    ));
  };

  return (
    <section className="bg-white text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,_rgba(255,255,255,0.1)_0%,_transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_75%,_rgba(255,255,255,0.1)_0%,_transparent_50%)]"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-7 lg:py-20">
        {/* Header */}
        <div className="text-center mb-12 lg:mb-12">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-brand-accent">
            What Our Customers Say
          </h2>
          <p className="text-lg sm:text-xl text-black max-w-2xl mx-auto">
            Don't just take our word for it - see what our satisfied customers
            have to say.
          </p>
        </div>

        {/* Testimonials Slider */}
        <div className="relative max-w-6xl mx-auto mb-8">
          <div className="relative overflow-hidden rounded-2xl">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {testimonials.map((testimonial) => (
                <div key={testimonial.id} className="w-full flex-shrink-0 px-4">
                  <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 sm:p-8 lg:p-10 mx-auto max-w-4xl">
                    {/* Stars */}
                    <div className="flex justify-center mb-6">
                      <div className="flex space-x-1">
                        {renderStars(testimonial.rating)}
                      </div>
                    </div>

                    {/* Content */}
                    <blockquote className="text-center mb-8">
                      <p className="text-lg sm:text-xl lg:text-2xl leading-relaxed text-gray-200 font-medium">
                        "{testimonial.content}"
                      </p>
                    </blockquote>

                    {/* Author */}
                    <div className="flex items-center justify-center space-x-4">
                      <img
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        className="w-16 h-16 rounded-full border-2 border-slate-600"
                      />
                      <div className="text-center sm:text-left">
                        <h4 className="text-xl font-semibold text-white">
                          {testimonial.name}
                        </h4>
                        {/* <p className="text-gray-400">
                          {testimonial.role}
                        </p> */}
                        <p className="text-sm text-gray-500">
                          {testimonial.company}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-600 rounded-full p-2 sm:p-3 transition-colors duration-200 backdrop-blur-sm"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-600 rounded-full p-2 sm:p-3 transition-colors duration-200 backdrop-blur-sm"
            aria-label="Next testimonial"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          {/* Dots Indicator */}
          <div className="flex justify-center space-x-2 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-colors duration-200 ${
                  index === currentSlide
                    ? "bg-orange-500"
                    : "bg-slate-600 hover:bg-slate-500"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Statistics */}
        {/* <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 max-w-4xl mx-auto">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-orange-500 mb-2">
                {stat.value}
              </div>
              <div className="text-sm sm:text-base text-gray-400">
                {stat.label}
              </div>
            </div>
          ))}
        </div> */}

        {/* CTA Section */}
        {/* <div className="text-center mt-12 lg:mt-16">
          <div className="bg-yellow-400 p-6 sm:p-8 rounded-2xl max-w-2xl mx-auto">
            <h3 className="text-xl sm:text-2xl font-bold mb-4">
              🚀 Join These Success Stories!
            </h3>
            <button className="bg-[#00303e] text-white font-semibold px-6 sm:px-8 py-3 sm:py-4 rounded-lg  transition-colors duration-200 text-sm sm:text-base">
              📚 GET MY FREE TRAINING GUIDE
            </button>
          </div>
        </div> */}
      </div>
    </section>
  );
}
