const testimonials = [
    {
      quote: "This platform has transformed how we manage our QR codes. The analytics are invaluable.",
      author: "Sarah Johnson",
      role: "Marketing Director",
      company: "TechCorp",
    },
    {
      quote: "The calendar features save us hours every month. Exactly what we needed.",
      author: "Michael Chen",
      role: "Event Manager",
      company: "EventPro",
    },
    {
      quote: "Best QR code solution we've used. The customer support is exceptional.",
      author: "Emma Wilson",
      role: "Operations Lead",
      company: "RetailPlus",
    },
  ];
  
  export function TestimonialSection() {
    return (
      <div className="space-y-16">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Trusted by Industry Leaders
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            See what our customers have to say
          </p>
        </div>
  
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.author}
              className="p-6 rounded-lg bg-white/5 border border-white/10"
            >
              <blockquote className="text-lg text-gray-300 mb-6">
                "{testimonial.quote}"
              </blockquote>
              <div>
                <div className="font-semibold text-white">
                  {testimonial.author}
                </div>
                <div className="text-sm text-gray-400">
                  {testimonial.role}, {testimonial.company}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }