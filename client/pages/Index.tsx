import { useState, useRef, useEffect } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  useAnimation,
  AnimatePresence,
} from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Shield,
  Star,
  CheckCircle,
  Smartphone,
  Tablet,
  Laptop,
  Facebook,
  Instagram,
  Youtube,
  Twitter,
  Sparkles,
  Zap,
  Award,
  Eye,
  EyeOff,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import SuccessStories from "./SuccessStories ";

interface BookingForm {
  fullName: string;
  email: string;
  phone: string;
  deviceType: string;
  issueDescription: string;
}

// Enhanced floating particles with more variety
const FloatingParticles = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(30)].map((_, i) => (
        <motion.div
          key={i}
          className={`absolute rounded-full ${
            i % 3 === 0
              ? "w-1 h-1 bg-white/30"
              : i % 3 === 1
                ? "w-2 h-2 bg-yellow-400/20"
                : "w-1.5 h-1.5 bg-blue-300/25"
          }`}
          initial={{
            x:
              Math.random() *
              (typeof window !== "undefined" ? window.innerWidth : 1000),
            y:
              Math.random() *
              (typeof window !== "undefined" ? window.innerHeight : 1000),
            opacity: Math.random() * 0.5 + 0.3,
          }}
          animate={{
            x:
              Math.random() *
              (typeof window !== "undefined" ? window.innerWidth : 1000),
            y:
              Math.random() *
              (typeof window !== "undefined" ? window.innerHeight : 1000),
            opacity: [0.3, 0.8, 0.3],
          }}
          transition={{
            duration: Math.random() * 15 + 20,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
};

// Animated counter component
const AnimatedCounter = ({
  target,
  suffix = "",
}: {
  target: number;
  suffix?: string;
}) => {
  const [count, setCount] = useState(0);
  const controls = useAnimation();
  const ref = useRef(null);
  const inView = useInView(ref);

  useEffect(() => {
    if (inView) {
      controls.start({
        opacity: 1,
        scale: 1,
        transition: { duration: 0.5 },
      });

      let startTime: number;
      const animate = (currentTime: number) => {
        if (!startTime) startTime = currentTime;
        const progress = Math.min((currentTime - startTime) / 2000, 1);
        setCount(Math.floor(progress * target));

        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };
      requestAnimationFrame(animate);
    }
  }, [inView, target, controls]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={controls}
      className="text-3xl font-bold text-yellow-400"
    >
      {count}
      {suffix}
    </motion.div>
  );
};

// Form components removed - using standard labels now

export default function Index() {
  const [bookingForm, setBookingForm] = useState<BookingForm>({
    fullName: "",
    email: "",
    phone: "",
    deviceType: "",
    issueDescription: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  const [formProgress, setFormProgress] = useState(0);
  const fullNameRef = useRef<HTMLInputElement>(null);
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

  // Calculate form completion progress
  useEffect(() => {
    const fields = [
      bookingForm.fullName,
      bookingForm.email,
      bookingForm.phone,
      bookingForm.deviceType,
      bookingForm.issueDescription,
    ];
    const completedFields = fields.filter(
      (field) => field.trim() !== "",
    ).length;
    setFormProgress((completedFields / fields.length) * 100);
  }, [bookingForm]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage("");

    try {
      if (!supabase) {
        await new Promise((resolve) => setTimeout(resolve, 1500));
        setSubmitMessage(
          "Form submitted successfully! We'll contact you soon.",
        );
        setBookingForm({
          fullName: "",
          email: "",
          phone: "",
          deviceType: "",
          issueDescription: "",
        });
        return;
      }

      const { error } = await supabase.from("bookings").insert([
        {
          full_name: bookingForm.fullName,
          email: bookingForm.email,
          phone: bookingForm.phone,
          device_type: bookingForm.deviceType,
          issue_description: bookingForm.issueDescription,
          status: "pending",
        },
      ]);

      if (error) {
        setSubmitMessage("Error submitting booking. Please try again.");
      } else {
        setSubmitMessage(
          "Booking submitted successfully! We'll contact you soon.",
        );
        setBookingForm({
          fullName: "",
          email: "",
          phone: "",
          deviceType: "",
          issueDescription: "",
        });
      }
    } catch (error) {
      setSubmitMessage("Error submitting booking. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBookNowClick = () => {
    fullNameRef.current?.focus();
    fullNameRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  };

  const handlePhoneClick = (phoneNumber: string) => {
    window.open(`tel:${phoneNumber}`, "_self");
  };

  const handleAddressClick = (address: string) => {
    const encodedAddress = encodeURIComponent(address);
    window.open(`https://maps.google.com/?q=${encodedAddress}`, "_blank");
  };

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const fadeInLeft = {
    hidden: { opacity: 0, x: -40 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const fadeInRight = {
    hidden: { opacity: 0, x: 40 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const cardHover = {
    rest: { scale: 1, rotateY: 0 },
    hover: {
      scale: 1.05,
      rotateY: 5,
      transition: { duration: 0.3, ease: "easeInOut" },
    },
  };

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* Animated Header */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="bg-brand-success text-black py-3 px-4 relative overflow-hidden"
      >
        <motion.div
          className="absolute inset-0 bg-yellow-400"
          animate={{
            backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "linear",
          }}
        />
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-3 relative z-10">
          <motion.div
            className="flex items-center gap-2 text-xs sm:text-sm text-center sm:text-left"
            whileHover={{ scale: 1.02 }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <Shield className="w-4 h-4" />
            </motion.div>
            <span className="font-medium">
              FREE Screen Protector with Every Screen Repair!
            </span>
          </motion.div>
          <div className="flex items-center gap-3 sm:gap-4">
            <motion.button
              onClick={() => handlePhoneClick("0286783298")}
              className="flex items-center gap-2 hover:text-yellow-200 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Phone className="w-4 h-4" />
              </motion.div>
              <span className="text-xs sm:text-sm font-medium">
                (02) 8678 3298
              </span>
            </motion.button>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={handleBookNowClick}
                variant="outline"
                className="bg-[#00303e] text-white border-white  text-xs sm:text-sm px-3 sm:px-4 py-2 relative overflow-hidden font-bold"
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-yellow-500"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: 0 }}
                  transition={{ duration: 0.3 }}
                />
                <span className="relative z-10">BOOK NOW</span>
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.header>

      {/* Hero Section with Advanced Form */}
      <section className="bg-[#00303e] py-8 sm:py-12 lg:py-11 relative overflow-hidden">
        <FloatingParticles />

        {/* Enhanced background shapes */}
        <motion.div
          className="absolute top-5 left-5 sm:top-10 sm:left-10 w-20 h-20 sm:w-32 sm:h-32 bg-gradient-to-r from-yellow-400/30 to-orange-400/30 rounded-full blur-xl"
          animate={{
            scale: [1, 1.5, 1],
            rotate: [0, 180, 360],
            x: [0, 30, 0],
            y: [0, 20, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-5 right-5 sm:bottom-10 sm:right-10 w-24 h-24 sm:w-40 sm:h-40 bg-gradient-to-r from-pink-400/20 to-purple-400/20 rounded-full blur-xl"
          animate={{
            scale: [1.2, 1, 1.3],
            rotate: [360, 180, 0],
            x: [0, -20, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-8 lg:gap-12 items-center relative z-10">
          <motion.div
            className="text-white order-2 lg:order-1"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <motion.div
              className="flex items-center gap-2 mb-4 sm:mb-6"
              variants={fadeInUp}
            >
              <motion.div
                animate={{
                  rotate: [0, 360],
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <Smartphone className="w-5 h-5 sm:w-6 sm:h-6" />
              </motion.div>
              <span className="text-xs sm:text-sm font-medium uppercase tracking-wider">
                WALK-IN MOBILE PHONE REPAIRS
              </span>
            </motion.div>

            <motion.h1
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-tight"
              variants={fadeInUp}
            >
              Fast, Friendly &<br />
              Hassle-Free
              <br />
              <motion.span
                className="text-brand-accent"
                animate={{
                  textShadow: [
                    "0 0 20px #fbbf24",
                    "0 0 40px #fbbf24",
                    "0 0 20px #fbbf24",
                  ],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                Device Repairs
              </motion.span>
            </motion.h1>

            <motion.p
              className="text-base sm:text-lg lg:text-xl mb-6 sm:mb-8 text-blue-100 max-w-lg"
              variants={fadeInUp}
            >
              Forget the long wait times and unreliable service. At PRC Repair,
              we make it easy for you to get your device fixed with confidence.
            </motion.p>

            <motion.div variants={fadeInUp} className="hidden lg:block">
              <motion.div
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  onClick={handleBookNowClick}
                  className="bg-yellow-400 text-black font-bold px-6 sm:px-8 py-3 sm:py-4 mb-4 sm:mb-6 relative overflow-hidden group text-base sm:text-lg shadow-2xl"
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-400"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: 0 }}
                    transition={{ duration: 0.4 }}
                  />
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="inline-block mr-2 sm:mr-3"
                  >
                    <Clock className="w-4 h-4 sm:w-5 sm:h-5 relative z-10" />
                  </motion.div>
                  <span className="relative z-10">
                    GET FREE QUOTE & DIAGNOSIS
                  </span>
                </Button>
              </motion.div>
            </motion.div>

            <motion.div
              className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-blue-200"
              variants={fadeInUp}
            >
              <motion.div
                animate={{ scale: [1, 1.3, 1], rotate: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
              </motion.div>
              <span>FREE diagnosis • No obligation • Expert advice</span>
            </motion.div>
          </motion.div>

          {/* Modern Clean Booking Form */}
          <motion.div
            className="order-1 lg:order-2 w-full"
            initial="hidden"
            animate="visible"
            variants={fadeInRight}
          >
            <motion.div
              className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 overflow-hidden mx-auto max-w-lg lg:max-w-none"
              whileHover={{
                scale: 1.01,
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
              }}
              transition={{ duration: 0.3 }}
            >
              {/* Form Header */}
              <div className="bg-[#00303e] p-3 sm:p-4 text-center">
                {/* <motion.div
                  className="inline-flex items-center bg-yellow-400 text-blue-900 px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-bold mb-3"
                  animate={{
                    boxShadow: [
                      "0 0 20px rgba(251, 191, 36, 0.5)",
                      "0 0 30px rgba(251, 191, 36, 0.8)",
                      "0 0 20px rgba(251, 191, 36, 0.5)",
                    ],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  FREE QUOTE & DIAGNOSIS
                </motion.div> */}

                <h2 className="text-xl sm:text-2xl font-bold text-white mb-1">
                  Book Your Repair Today!
                </h2>
                <p className="text-blue-100 text-xs sm:text-sm">
                  Get a free assessment and honest quote for your device
                </p>

                {/* Progress Bar */}
                <div className="mt-3 sm:mt-4">
                  <div className="flex justify-between text-xs text-blue-200 mb-2">
                    <span>Form Completion</span>
                    <span>{Math.round(formProgress)}%</span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden">
                    <motion.div
                      className="h-full bg-yellow-400 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${formProgress}%` }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                    />
                  </div>
                </div>
              </div>

              {/* Form Body */}
              <div className="p-4 sm:p-4">
                <form
                  onSubmit={handleSubmit}
                  className="space-y-4 sm:space-y-5"
                >
                  {/* Full Name */}
                  <motion.div
                    whileHover={{ scale: 1.01 }}
                    transition={{ duration: 0.2 }}
                  >
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <Input
                      ref={fullNameRef}
                      type="text"
                      placeholder="Enter your full name"
                      value={bookingForm.fullName}
                      onChange={(e) =>
                        setBookingForm({
                          ...bookingForm,
                          fullName: e.target.value,
                        })
                      }
                      required
                      className="w-full h-11 sm:h-12 px-3 sm:px-4 border-2 border-gray-200 rounded-xl bg-gray-50 focus:border-blue-500 focus:bg-white focus:ring-0 transition-all duration-300 text-gray-900 text-sm sm:text-base"
                    />
                  </motion.div>

                  {/* Email */}
                  <motion.div
                    whileHover={{ scale: 1.01 }}
                    transition={{ duration: 0.2 }}
                  >
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="email"
                      placeholder="your.email@example.com"
                      value={bookingForm.email}
                      onChange={(e) =>
                        setBookingForm({
                          ...bookingForm,
                          email: e.target.value,
                        })
                      }
                      required
                      className="w-full h-11 sm:h-12 px-3 sm:px-4 border-2 border-gray-200 rounded-xl bg-gray-50 focus:border-blue-500 focus:bg-white focus:ring-0 transition-all duration-300 text-gray-900 text-sm sm:text-base"
                    />
                  </motion.div>

                  {/* Phone */}
                  <motion.div
                    whileHover={{ scale: 1.01 }}
                    transition={{ duration: 0.2 }}
                  >
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="tel"
                      placeholder="(000) 000 000"
                      value={bookingForm.phone}
                      onChange={(e) =>
                        setBookingForm({
                          ...bookingForm,
                          phone: e.target.value,
                        })
                      }
                      required
                      className="w-full h-11 sm:h-12 px-3 sm:px-4 border-2 border-gray-200 rounded-xl bg-gray-50 focus:border-blue-500 focus:bg-white focus:ring-0 transition-all duration-300 text-gray-900 text-sm sm:text-base"
                    />
                  </motion.div>

                  {/* Device Type */}
                  <motion.div
                    whileHover={{ scale: 1.01 }}
                    transition={{ duration: 0.2 }}
                  >
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Device Type <span className="text-red-500">*</span>
                    </label>
                    <Select
                      value={bookingForm.deviceType}
                      onValueChange={(value) =>
                        setBookingForm({ ...bookingForm, deviceType: value })
                      }
                      required
                    >
                      <SelectTrigger className="w-full h-11 sm:h-12 px-3 sm:px-4 border-2 border-gray-200 rounded-xl bg-gray-50 focus:border-blue-500 focus:bg-white focus:ring-0 transition-all duration-300 text-sm sm:text-base">
                        <SelectValue placeholder="Select your device type" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border border-gray-200 rounded-xl shadow-lg">
                        <SelectItem
                          value="iphone"
                          className="hover:bg-blue-50 py-3"
                        >
                          <div className="flex items-center gap-2">
                            <span>📱</span>
                            <span>iPhone</span>
                          </div>
                        </SelectItem>
                        <SelectItem
                          value="android"
                          className="hover:bg-blue-50 py-3"
                        >
                          <div className="flex items-center gap-2">
                            <span>🤖</span>
                            <span>Android Phone</span>
                          </div>
                        </SelectItem>
                        <SelectItem
                          value="ipad"
                          className="hover:bg-blue-50 py-3"
                        >
                          <div className="flex items-center gap-2">
                            <span>📱</span>
                            <span>iPad</span>
                          </div>
                        </SelectItem>
                        <SelectItem
                          value="tablet"
                          className="hover:bg-blue-50 py-3"
                        >
                          <div className="flex items-center gap-2">
                            <span>📱</span>
                            <span>Android Tablet</span>
                          </div>
                        </SelectItem>
                        <SelectItem
                          value="laptop"
                          className="hover:bg-blue-50 py-3"
                        >
                          <div className="flex items-center gap-2">
                            <span>💻</span>
                            <span>Laptop</span>
                          </div>
                        </SelectItem>
                        <SelectItem
                          value="other"
                          className="hover:bg-blue-50 py-3"
                        >
                          <div className="flex items-center gap-2">
                            <span>🔧</span>
                            <span>Other</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </motion.div>

                  {/* Issue Description */}
                  <motion.div
                    whileHover={{ scale: 1.01 }}
                    transition={{ duration: 0.2 }}
                  >
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Describe the Issue <span className="text-red-500">*</span>
                    </label>
                    <Textarea
                      placeholder="Please describe what's wrong with your device..."
                      value={bookingForm.issueDescription}
                      onChange={(e) =>
                        setBookingForm({
                          ...bookingForm,
                          issueDescription: e.target.value,
                        })
                      }
                      required
                      className="w-full min-h-[80px] sm:min-h-[100px] p-3 sm:p-4 border-2 border-gray-200 rounded-xl bg-gray-50 focus:border-blue-500 focus:bg-white focus:ring-0 transition-all duration-300 text-gray-900 resize-none text-sm sm:text-base"
                    />
                  </motion.div>

                  {/* Submit Button */}
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full h-12 sm:h-14 bg-yellow-400 text-black font-bold text-base sm:text-lg relative overflow-hidden group shadow-xl rounded-xl"
                    >
                      {/* Animated shine effect */}
                      <motion.div
                        className="absolute inset-0"
                        animate={{
                          x: ["-100%", "100%"],
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                      />

                      <AnimatePresence mode="wait">
                        {isSubmitting ? (
                          <motion.div
                            key="loading"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex items-center justify-center gap-2 sm:gap-3"
                          >
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{
                                duration: 1,
                                repeat: Infinity,
                                ease: "linear",
                              }}
                              className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full"
                            />
                            <span>Submitting...</span>
                          </motion.div>
                        ) : (
                          <motion.div
                            key="submit"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex items-center justify-center gap-2 sm:gap-3"
                          >
                            <Zap className="w-4 h-4 sm:w-5 sm:h-5" />
                            <span>Book Your Repair Now</span>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </Button>
                  </motion.div>

                  <AnimatePresence>
                    {submitMessage && (
                      <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.8 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.8 }}
                        className={`text-center p-4 rounded-xl ${
                          submitMessage.includes("Error")
                            ? "bg-red-50 text-red-700 border border-red-200"
                            : "bg-green-50 text-green-700 border border-green-200"
                        }`}
                      >
                        <motion.div
                          animate={{ scale: [1, 1.05, 1] }}
                          transition={{ duration: 0.5 }}
                        >
                          {submitMessage}
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </form>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Rest of the sections with tighter spacing... */}
      {/* Complimentary Screen Protector Section */}
      <motion.section
        className="bg-brand-success text-black py-3 relative overflow-hidden"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <motion.div
          className="absolute inset-0 bg-yellow-400"
          animate={{
            backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "linear",
          }}
        />
        <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
          <motion.div
            className="flex items-center justify-center gap-3"
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            transition={{ duration: 0.5, type: "spring" }}
            viewport={{ once: true }}
          >
            <motion.div
              animate={{
                rotate: [0, 360],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <Shield className="w-5 h-5" />
            </motion.div>
            <h3 className="text-lg font-bold">
              Complimentary Screen Protector
            </h3>
          </motion.div>
          <motion.p
            className="mt-2 text-black text-sm"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            We believe in giving more value - so every screen repair includes a
            free screen protector.
          </motion.p>
        </div>
      </motion.section>

      {/* About Section with Counters - Tighter spacing */}
      <motion.section
        className="py-7 bg-gray-50"
        initial="hidden"
        whileInView="visible"
        variants={staggerContainer}
        viewport={{ once: true }}
      >
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.h2
            className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4"
            variants={fadeInUp}
          >
            PRC Repair is Your Local Mobile Phone Repair Experts
          </motion.h2>
          <motion.p
            className="text-base lg:text-lg text-gray-600 leading-relaxed mb-8"
            variants={fadeInUp}
          >
            With 10+ years of hands-on experience and a passion for quality, our
            technicians handle everything from cracked screens and battery
            issues to complete hardware repairs.
          </motion.p>

          {/* Animated Stats */}
          <motion.div
            className="grid grid-cols-3 gap-8"
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp} className="text-center">
              <AnimatedCounter target={10} suffix="+" />
              <p className="text-gray-600 text-sm mt-2">Years Experience</p>
            </motion.div>
            <motion.div variants={fadeInUp} className="text-center">
              <AnimatedCounter target={5000} suffix="+" />
              <p className="text-gray-600 text-sm mt-2">Devices Repaired</p>
            </motion.div>
            <motion.div variants={fadeInUp} className="text-center">
              <AnimatedCounter target={98} suffix="%" />
              <p className="text-gray-600 text-sm mt-2">Success Rate</p>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Why Locals Trust Us - Animated Cards */}
      <motion.section
        className="py-10"
        initial="hidden"
        whileInView="visible"
        variants={staggerContainer}
        viewport={{ once: true }}
      >
        <div className="max-w-7xl mx-auto px-4">
          <motion.h2
            className="text-2xl lg:text-3xl font-bold text-center text-gray-900 mb-8"
            variants={fadeInUp}
          >
            Why Locals Trust Us?
          </motion.h2>

          <motion.div
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={staggerContainer}
          >
            {[
              {
                icon: Shield,
                title: "10+ Years of Repair Experience",
                desc: "Hands-on expertise you can trust",
              },
              {
                icon: CheckCircle,
                title: "Honest Quotes",
                desc: "Transparent pricing, no surprises",
              },
              {
                icon: Star,
                title: "Only High-Quality Parts Used",
                desc: "Premium components for lasting repairs",
              },
              {
                icon: CheckCircle,
                title: "No Hidden Fees",
                desc: "What you see is what you pay",
              },
              {
                icon: Clock,
                title: "Fast Turnaround",
                desc: "Get your device back quickly",
              },
              {
                icon: Star,
                title: "Expert Repairs",
                desc: "Professional technicians, quality results",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                className="text-center group rounded-lg border p-3"
                variants={fadeInUp}
                initial="rest"
                whileHover="hover"
                animate="rest"
              >
                <motion.div
                  className="bg-blue-100 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-brand-accent transition-colors duration-300"
                  variants={cardHover}
                >
                  <item.icon className="w-7 h-7 text-blue-600 group-hover:text-white transition-colors duration-300" />
                </motion.div>
                <motion.h3
                  className="text-lg font-semibold mb-2"
                  variants={cardHover}
                >
                  {item.title}
                </motion.h3>
                <motion.p
                  className="text-gray-600 text-sm"
                  variants={cardHover}
                >
                  {item.desc}
                </motion.p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Devices We Repair - 3D Card Effects */}
      <motion.section
        className="py-7 bg-gray-50"
        initial="hidden"
        whileInView="visible"
        variants={staggerContainer}
        viewport={{ once: true }}
      >
        <div className="max-w-7xl mx-auto px-4">
          <motion.h2
            className="text-2xl lg:text-3xl font-bold text-center text-gray-900 mb-8"
            variants={fadeInUp}
          >
            Devices We Repair
          </motion.h2>

          <motion.div
            className="grid md:grid-cols-3 gap-6 mb-8"
            variants={staggerContainer}
          >
            {[
              {
                icon: Smartphone,
                title: "Mobile Phones",
                color: "blue",
                services: [
                  "Charging ports",
                  "Battery issues",
                  "Camera repair",
                  "Data recovery",
                  "Software updates",
                ],
              },
              {
                icon: Tablet,
                title: "Tablets",
                color: "green",
                services: [
                  "Screen replacements",
                  "Charging problems",
                  "Battery & motherboard issues",
                ],
              },
              {
                icon: Laptop,
                title: "Laptops",
                color: "purple",
                services: [
                  "Slow systems",
                  "Virus removal",
                  "Screen and battery replacements",
                  "Data recovery and file restoration",
                ],
              },
            ].map((device, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                whileHover={{
                  scale: 1.05,
                  rotateY: 5,
                  rotateX: 5,
                }}
                style={{ perspective: 1000 }}
              >
                <Card className="hover:shadow-2xl transition-all duration-500 transform-gpu relative overflow-hidden group">
                  <motion.div className="absolute inset-0 bg-gradient-to-br from-transparent to-blue-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <CardContent className="p-6 relative z-10">
                    <motion.div
                      className={`bg-${device.color}-100 w-14 h-14 rounded-lg flex items-center justify-center mb-4`}
                      whileHover={{ scale: 1.2, rotate: 360 }}
                      transition={{ duration: 0.5 }}
                    >
                      <device.icon
                        className={`w-7 h-7 text-${device.color}-600`}
                      />
                    </motion.div>
                    <h3 className="text-xl font-semibold mb-4">
                      {device.title}
                    </h3>
                    <ul className="space-y-2 text-gray-600">
                      {device.services.map((service, serviceIndex) => (
                        <motion.li
                          key={serviceIndex}
                          className="flex items-center gap-2 text-sm"
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ delay: serviceIndex * 0.1 }}
                          viewport={{ once: true }}
                        >
                          <motion.div
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              delay: serviceIndex * 0.2,
                            }}
                          >
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          </motion.div>
                          <span>{service}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          <motion.div className="text-center" variants={fadeInUp}>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={handleBookNowClick}
                className="bg-yellow-400 text-black px-6 py-3 relative overflow-hidden group"
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-yellow-500"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: 0 }}
                  transition={{ duration: 0.3 }}
                />
                <span className="relative z-10">📅 Book Your Repair Now</span>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* FAQ Section - Tighter spacing */}
      <motion.section
        className="py-10"
        initial="hidden"
        whileInView="visible"
        variants={staggerContainer}
        viewport={{ once: true }}
      >
        <div className="max-w-4xl mx-auto px-4">
          <motion.h2
            className="text-2xl lg:text-3xl font-bold text-center text-gray-900 mb-8"
            variants={fadeInUp}
          >
            Frequently Asked Questions
          </motion.h2>
          <motion.p
            className="text-center text-gray-600 mb-6 text-sm lg:text-base"
            variants={fadeInUp}
          >
            Got questions about device repairs? Here are the answers to the most
            common questions.
          </motion.p>

          <motion.div variants={staggerContainer}>
            <Accordion type="single" collapsible className="space-y-3">
              {[
                {
                  question: "How long does a typical repair take?",
                  answer:
                    "Most repairs are completed within 1-2 hours, depending on the complexity and parts availability. We'll give you an accurate timeframe during your free diagnosis.",
                },
                {
                  question: "Do you provide warranty on repairs?",
                  answer:
                    "Yes, all our repairs come with a comprehensive warranty. Screen repairs include a 6-month warranty, and other repairs typically have a 3-month warranty period.",
                },
                {
                  question: "What brands do you repair?",
                  answer:
                    "We repair all major brands including Apple (iPhone, iPad), Samsung, Google, OnePlus, Huawei, Oppo, and many more. Our technicians are experienced with both iOS and Android devices.",
                },
                {
                  question: "Do you offer same-day repairs?",
                  answer:
                    "Yes, most common repairs like screen replacements and battery changes can be completed the same day. For more complex issues, we'll provide you with a realistic timeframe.",
                },
                {
                  question: "Can you recover data from a damaged phone?",
                  answer:
                    "We offer data recovery services for various scenarios. While we can't guarantee 100% recovery in all cases, our success rate is very high. We'll assess your device and provide honest feedback about recovery chances.",
                },
                {
                  question: "How much does a screen repair cost?",
                  answer:
                    "Screen repair costs vary depending on your device model and screen type. We provide free quotes and always use high-quality replacement parts. Contact us for a specific quote for your device.",
                },
              ].map((faq, index) => (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  whileHover={{ scale: 1.02 }}
                >
                  <AccordionItem
                    value={`item-${index + 1}`}
                    className="border rounded-lg px-4 hover:shadow-md transition-shadow"
                  >
                    <AccordionTrigger className="text-left hover:no-underline">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-600">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                </motion.div>
              ))}
            </Accordion>
          </motion.div>
        </div>
      </motion.section>

      {/* Company Info Section - Glowing Effects */}
      <motion.section
        className="bg-brand-primary text-white py-10 relative overflow-hidden"
        initial="hidden"
        whileInView="visible"
        variants={staggerContainer}
        viewport={{ once: true }}
      >
        {/* Animated background */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-brand-primary via-brand-secondary to-brand-primary"
          animate={{
            backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear",
          }}
        />

        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <motion.div className="mb-8" variants={fadeInUp}>
            <motion.div
              className="w-20 h-20 bg-brand-accent rounded-full flex items-center justify-center mx-auto mb-6 relative"
              whileHover={{ scale: 1.1 }}
              animate={{
                boxShadow: [
                  "0 0 20px #fbbf24",
                  "0 0 40px #fbbf24",
                  "0 0 60px #fbbf24",
                  "0 0 40px #fbbf24",
                  "0 0 20px #fbbf24",
                ],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <div className="text-brand-primary font-bold text-2xl">PRC</div>
            </motion.div>
            <motion.p
              className="text-lg lg:text-xl leading-relaxed text-gray-200"
              variants={fadeInUp}
            >
              PRC is a professional and skilful phone repair service provider in
              Australia
            </motion.p>
          </motion.div>

          <motion.div
            className="flex justify-center gap-4"
            variants={staggerContainer}
          >
            {[Facebook, Instagram, Twitter, Youtube].map((Icon, index) => (
              <motion.div
                key={index}
                className="w-12 h-12 bg-brand-accent rounded-full flex items-center justify-center cursor-pointer relative overflow-hidden group"
                variants={fadeInUp}
                whileHover={{
                  scale: 1.2,
                  rotate: 360,
                }}
                whileTap={{ scale: 0.9 }}
                animate={{
                  y: [0, -10, 0],
                }}
                transition={{
                  duration: 2 + index * 0.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-yellow-600"
                  initial={{ scale: 0 }}
                  whileHover={{ scale: 1 }}
                  transition={{ duration: 0.3 }}
                />
                <Icon className="w-6 h-6 text-brand-primary relative z-10" />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>
      <SuccessStories />
      {/* Footer with Parallax */}
      <motion.footer
        className="bg-brand-secondary text-white py-8 relative"
        // style={{ y }}
      >
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
            initial="hidden"
            whileInView="visible"
            variants={staggerContainer}
            viewport={{ once: true }}
          >
            <motion.div variants={fadeInLeft}>
              <h3 className="text-lg font-bold mb-3">PRC Repair</h3>
              <p className="text-gray-300 text-sm mb-4">
                Your trusted local mobile phone repair experts. Fast, friendly,
                and hassle-free device repairs with 10+ years of experience.
              </p>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <h3 className="text-lg font-bold mb-3">Our Locations</h3>
              <div className="space-y-3 text-gray-300 text-sm">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 mt-1 flex-shrink-0" />
                  <div>
                    <motion.button
                      onClick={() =>
                        handleAddressClick(
                          "https://www.google.com/maps/place/122+Queen+St,+St+Marys+NSW+2760,+Australia/@-33.7586704,150.756797,5340m/data=!3m1!1e3!4m6!3m5!1s0x6b129ab1929d4f97:0x103feb9784d7d023!8m2!3d-33.766127!4d150.7743917!16s%2Fg%2F11b8y9vjx6?entry=ttu&g_ep=EgoyMDI1MDYwMi4wIKXMDSoASAFQAw%3D%3D",
                        )
                      }
                      className="hover:text-brand-accent transition-colors cursor-pointer"
                      whileHover={{ scale: 1.05 }}
                    >
                      122 Queen St, St Marys NSW 2760, Australia
                    </motion.button>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 mt-1 flex-shrink-0" />
                  <div>
                    {/* <p className="font-medium">Schofields</p> */}
                    <motion.button
                      onClick={() =>
                        handleAddressClick(
                          "https://www.google.com/maps/place/TechCity+Schofields+Phone+Repair/@-33.7057889,150.8759664,859m/data=!3m2!1e3!4b1!4m6!3m5!1s0x6b129f1f16bc4395:0xf55b68eeebf4e2e2!8m2!3d-33.7057889!4d150.8759664!16s%2Fg%2F11smlzr8dn?entry=ttu&g_ep=EgoyMDI1MDYzMC4wIKXMDSoASAFQAw%3D%3D",
                        )
                      }
                      className="hover:text-brand-accent transition-colors cursor-pointer"
                      whileHover={{ scale: 1.05 }}
                    >
                      Kiosk 1/227 Railway Terrace, Schofields NSW 2762,
                      Australia
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div variants={fadeInRight}>
              <h3 className="text-lg font-bold mb-3">Contact Us</h3>
              <div className="space-y-2 text-gray-300 text-sm">
                <motion.button
                  onClick={() => handlePhoneClick("0286783298")}
                  className="flex items-center gap-2 hover:text-brand-accent transition-colors"
                  whileHover={{ scale: 1.05, x: 5 }}
                >
                  <Phone className="w-4 h-4" />
                  <span>(02) 8678 3298</span>
                </motion.button>
                <motion.button
                  onClick={() => handlePhoneClick("0272527141")}
                  className="flex items-center gap-2 hover:text-brand-accent transition-colors"
                  whileHover={{ scale: 1.05, x: 5 }}
                >
                  <Phone className="w-4 h-4" />
                  <span>(02) 7252 7141</span>
                </motion.button>
                <a
                  className="flex items-center gap-2"
                  href="mailto:service@prcrepair.com.au"
                >
                  <Mail className="w-4 h-4" />
                  <span>service@prcrepair.com.au</span>
                </a>
              </div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  onClick={handleBookNowClick}
                  className="bg-brand-accent hover:bg-yellow-500 text-brand-primary font-semibold mt-3 text-sm px-4 py-2 relative overflow-hidden group"
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-yellow-300 to-yellow-400"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: 0 }}
                    transition={{ duration: 0.3 }}
                  />
                  <span className="relative z-10">Book Repair Now</span>
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>

          <motion.div
            className="border-t border-gray-600 mt-6 pt-6 flex flex-col lg:flex-row justify-between items-center text-gray-400 text-xs"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
          >
            <p>
              © {new Date().getFullYear()} PRC Repair. All rights reserved.
              Fast, friendly & hassle-free device repairs.
            </p>

            <div className="flex gap-4 mt-3 lg:mt-0">
              <span>FREE Screen Protector with Screen Repairs</span>
              <span>•</span>
              <span>Same Day Service Available</span>
            </div>
          </motion.div>
        </div>
      </motion.footer>
    </div>
  );
}
