import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FiArrowRight, FiStar, FiCpu, FiFileText, FiEye, FiSettings, FiCheckCircle, FiThumbsUp, FiZap, FiDownload, FiLayout, FiUserPlus } from 'react-icons/fi';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2, delayChildren: 0.3 },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: 'spring', stiffness: 100 },
  },
};

// --- Helper Components (Defined Before HomePage) ---

// Component for Logged-Out User View
const LoggedOutView = () => (
  <motion.div 
    className="text-center max-w-3xl mx-auto bg-white/5 backdrop-blur-md p-8 sm:p-10 rounded-xl shadow-2xl mb-16"
    variants={itemVariants}
    initial="hidden"
    animate="visible"
  >
    <motion.div variants={itemVariants} className="mb-6">
      <FiZap className="text-6xl sm:text-7xl text-primary-400 mx-auto" />
    </motion.div>
    <motion.h1 
      className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-6 tracking-tight text-dark-50"
      variants={itemVariants}
    >
      Craft Your Future with <span className="text-primary-400">AI Resume Composer</span>
    </motion.h1>
    <motion.p 
      className="text-lg sm:text-xl text-dark-300 mb-10 max-w-xl mx-auto leading-relaxed"
      variants={itemVariants}
    >
      Transform your career prospects with a professionally tailored resume, intelligently generated to highlight your strengths and match your dream job.
    </motion.p>
    <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-center items-center gap-4">
      <Link
        to="/register"
        className="group relative inline-flex items-center justify-center px-8 py-3.5 text-lg font-semibold text-white bg-primary-500 rounded-custom hover:bg-primary-600 transition-custom duration-300 ease-in-out shadow-custom-lg hover:shadow-custom-xl focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2 focus:ring-offset-dark-900 overflow-hidden hover:scale-105"
      >
        <span className="absolute left-0 top-0 w-0 h-full bg-teal-400 transition-all duration-500 ease-out group-hover:w-full"></span>
        <span className="relative flex items-center">
          Get Started Now <FiArrowRight className="ml-2 transition-transform duration-300 group-hover:translate-x-1" />
        </span>
      </Link>
      <Link
        to="/login"
        className="px-8 py-3.5 text-lg font-semibold text-primary-100 bg-transparent border-2 border-primary-300 rounded-custom hover:bg-primary-300 hover:text-primary-700 transition-custom duration-300 ease-in-out shadow-custom-md hover:shadow-custom-lg focus:outline-none focus:ring-2 focus:ring-primary-200 focus:ring-offset-2 focus:ring-offset-dark-900 hover:scale-105"
      >
        Already a Member?
      </Link>
    </motion.div>
  </motion.div>
);

// Component for Logged-In User View
const LoggedInView = () => {
  const { user } = useAuth();
  return (
    <motion.div 
      className="text-center max-w-3xl mx-auto bg-dark-800/10 backdrop-blur-md p-8 sm:p-10 rounded-custom shadow-custom-2xl mb-16 animate-fade-in"
      variants={itemVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants} className="mb-6">
        <FiCheckCircle className="text-6xl sm:text-7xl text-green-400 mx-auto" />
      </motion.div>
      <motion.h1 
        className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 tracking-tight text-dark-50"
        variants={itemVariants}
      >
        Welcome Back, <span className="text-green-300">{user?.username}!</span>
      </motion.h1>
      <motion.p 
        className="text-lg text-dark-300 mb-8 max-w-xl mx-auto leading-relaxed"
        variants={itemVariants}
      >
        Ready to continue shaping your career? Access your dashboard or start a new resume.
      </motion.p>
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-center items-center gap-4">
        <Link
          to="/dashboard"
          className="group relative inline-flex items-center justify-center px-8 py-3.5 text-lg font-semibold text-white bg-primary-500 rounded-custom hover:bg-primary-600 transition-custom duration-300 ease-in-out shadow-custom-lg hover:shadow-custom-xl focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2 focus:ring-offset-dark-900 overflow-hidden hover:scale-105"
        >
          <span className="absolute left-0 top-0 w-0 h-full bg-green-400 transition-all duration-500 ease-out group-hover:w-full"></span>
          <span className="relative flex items-center">
            Go to Dashboard <FiLayout className="ml-2 transition-transform duration-300 group-hover:translate-x-1" />
          </span>
        </Link>
        <Link
          to="/create-resume"
          className="px-8 py-3.5 text-lg font-semibold text-primary-100 bg-transparent border-2 border-primary-300 rounded-custom hover:bg-primary-300 hover:text-primary-700 transition-custom duration-300 ease-in-out shadow-custom-md hover:shadow-custom-lg focus:outline-none focus:ring-2 focus:ring-primary-200 focus:ring-offset-2 focus:ring-offset-dark-900 hover:scale-105"
        >
          Create New Resume
        </Link>
      </motion.div>
    </motion.div>
  );
};

// Section: How It Works
const HowItWorksSection = () => {
  const steps = [
    { icon: <FiUserPlus className="text-4xl text-teal-300 mx-auto mb-3" />, title: "1. Sign Up / Log In", description: "Create an account or log in to access your personalized dashboard." },
    { icon: <FiFileText className="text-4xl text-teal-300 mx-auto mb-3" />, title: "2. Input Your Details", description: "Provide your skills, experience, and education through our intuitive forms." },
    { icon: <FiCpu className="text-4xl text-teal-300 mx-auto mb-3" />, title: "3. AI Crafts Your Resume", description: "Our intelligent engine analyzes your info and crafts a professional resume." },
    { icon: <FiDownload className="text-4xl text-teal-300 mx-auto mb-3" />, title: "4. Download & Apply", description: "Review, download your resume in multiple formats, and start applying!" },
  ];
  return (
    <motion.section 
      className="py-12 sm:py-16 w-full max-w-5xl mx-auto"
      variants={containerVariants} // Use containerVariants for the section itself
      initial="hidden"
      animate="visible"
    >
      <h2 className="text-3xl font-bold text-center text-dark-400 mb-10">How It Works</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
        {steps.map((step, index) => (
          <motion.div 
            key={index} 
            className="bg-dark-800/10 backdrop-blur-sm p-6 rounded-custom shadow-custom-lg hover:shadow-accent-500/20 transition-custom duration-300 hover:scale-105"
            variants={itemVariants} // Use itemVariants for individual steps
          >
            {step.icon}
            <h3 className="text-xl font-semibold text-gray-200 mb-2">{step.title}</h3>
            <p className="text-gray-400 text-sm">{step.description}</p>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
};

// Section: Key Features
const FeaturesSection = () => {
  const features = [
    { icon: <FiStar className="text-4xl text-yellow-300 mx-auto mb-3" />, title: "Professionally Designed Templates", description: "Choose from a variety of modern, ATS-friendly resume templates." },
    { icon: <FiCpu className="text-4xl text-blue-300 mx-auto mb-3" />, title: "AI-Powered Content Suggestions", description: "Get smart recommendations for skills, action verbs, and summaries." },
    { icon: <FiEye className="text-4xl text-purple-300 mx-auto mb-3" />, title: "Real-time Preview", description: "See your resume take shape instantly as you input your information." },
    { icon: <FiSettings className="text-4xl text-green-300 mx-auto mb-3" />, title: "Quick & Easy Editing", description: "Effortlessly update and customize your resume anytime, anywhere." },
  ];
  return (
    <motion.section 
      className="py-12 sm:py-16 bg-white/5 w-full" // Added a subtle background to differentiate
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center text-dark-400 mb-12">Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div 
              key={index} 
              className="flex flex-col items-center text-center p-6 bg-dark-800/40 rounded-custom shadow-custom-xl hover:shadow-primary-500/20 transition-custom duration-300 hover:scale-105"
              variants={itemVariants}
            >
              {feature.icon}
              <h3 className="text-xl font-semibold text-dark-200 mt-4 mb-2">{feature.title}</h3>
              <p className="text-gray-400 text-sm">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
};

// Section: Testimonials
const TestimonialsSection = () => {
  const testimonials = [
    { name: "Sarah L.", feedback: "The AI suggestions were a game-changer! My resume looks amazing and I landed an interview within a week.", icon: <FiThumbsUp className="text-3xl text-green-400" /> },
    { name: "John B.", feedback: "So easy to use, and the templates are very professional. Highly recommend this to anyone job searching.", icon: <FiThumbsUp className="text-3xl text-green-400" /> },
    { name: "Alex P.", feedback: "I struggled with writing my resume for ages. This tool made it simple and effective. Thank you!", icon: <FiThumbsUp className="text-3xl text-green-400" /> },
  ];
  return (
    <motion.section 
      className="py-12 sm:py-16 w-full max-w-5xl mx-auto"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <h2 className="text-3xl font-bold text-center text-dark-400 mb-12">What Our Users Say</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {testimonials.map((testimonial, index) => (
          <motion.div 
            key={index} 
            className="bg-white/10 backdrop-blur-md p-6 rounded-lg shadow-lg text-center"
            variants={itemVariants}
          >
            <div className="flex justify-center mb-4">{testimonial.icon}</div>
            <p className="text-gray-300 italic mb-4">\"{testimonial.feedback}\"</p>
            <p className="text-teal-300 font-semibold">- {testimonial.name}</p>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
};

// Footer Information
const FooterInfo = () => (
  <motion.footer 
    className="w-full text-center py-8 mt-16 border-t border-gray-700/50"
    variants={itemVariants} // Simple fade-in for the footer
    initial="hidden"
    animate="visible"
  >
    <p className="text-gray-400 text-sm">&copy; {new Date().getFullYear()} AI Resume Composer. All rights reserved.</p>
    <p className="text-gray-500 text-xs mt-1">Crafted with 💡 in Silicon Valley</p>
  </motion.footer>
);

// --- Main HomePage Component ---
const HomePage = () => {
  const { user } = useAuth();

  // If user is logged in, redirect to dashboard
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <motion.div 
      className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center p-4 text-dark-400"
      style={{
        background: 'linear-gradient(135deg, var(--color-primary-900) 0%, var(--color-primary-700) 50%, var(--color-primary-600) 100%)', 
      }}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <LoggedOutView />
      <HowItWorksSection />
      <FeaturesSection />
      <TestimonialsSection />
      <FooterInfo />
    </motion.div>
  );
};

export default HomePage;

