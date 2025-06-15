"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, Search, BookOpen, Clock, Users, Star } from "lucide-react"
import LearningPathDetail from "@/components/learning-path-detail"

interface LearningPathsProps {
  onBack: () => void
}

export const learningPaths = [
  {
    id: "wealth-mastery",
    title: "Wealth Building Mastery",
    description: "Learn the principles of wealth creation, investment strategies, and financial freedom",
    category: "Finance",
    difficulty: "Intermediate",
    duration: "12 weeks",
    modules: 8,
    participants: 12500,
    rating: 4.8,
    mentor: "Robert Kiyosaki",
    color: "bg-blue-500",
    icon: "💰",
    image: "/wealth.jpg",
    skills: ["Financial Literacy", "Investment Strategy", "Asset Management", "Wealth Mindset"],
    overview: "Master the art of wealth creation through proven strategies, investment principles, and financial mindset transformation.",
    resources: [
      {
        type: "Video",
        title: "The Psychology of Money",
        description: "Understanding your relationship with money and wealth",
        duration: "45 min",
        url: "https://www.youtube.com/watch?v=Gg8_TA7Ug48"
      },
      {
        type: "Video",
        title: "Warren Buffett: Investment Principles",
        description: "Timeless wisdom from the world's most successful investor",
        duration: "75 min",
        url: "https://www.youtube.com/watch?v=PX5-XyBNi00"
      },
      {
        type: "Video",
        title: "Ray Dalio: Principles for Success",
        description: "Billionaire hedge fund manager shares his life and work principles",
        duration: "60 min",
        url: "https://www.youtube.com/watch?v=B9XGUpQZY38"
      },
      {
        type: "Video",
        title: "Robert Kiyosaki: Cash Flow Quadrant",
        description: "Understanding the four ways people generate income",
        duration: "55 min",
        url: "https://www.youtube.com/watch?v=hyQQfTFuABw"
      },
      {
        type: "Video",
        title: "Tony Robbins: Money Master the Game",
        description: "Strategies from the world's top financial minds",
        duration: "85 min",
        url: "https://www.youtube.com/watch?v=EIAm_i4MT1E"
      },
      {
        type: "Video",
        title: "Graham Stephan: Real Estate Investing",
        description: "Building wealth through property investment strategies",
        duration: "65 min",
        url: "https://www.youtube.com/watch?v=T_HmJL_v8Oc"
      },
      {
        type: "Video",
        title: "Ramit Sethi: I Will Teach You To Be Rich",
        description: "Practical approach to personal finance and wealth building",
        duration: "70 min",
        url: "https://www.youtube.com/watch?v=bvs2K6QJGQM"
      },
      {
        type: "Video",
        title: "Dave Ramsey: Debt-Free Living",
        description: "Step-by-step plan to eliminate debt and build wealth",
        duration: "60 min",
        url: "https://www.youtube.com/watch?v=r1NJzEYARlM"
      },
      {
        type: "Video",
        title: "JL Collins: The Simple Path to Wealth",
        description: "Index fund investing and financial independence",
        duration: "75 min",
        url: "https://www.youtube.com/watch?v=T71ibcZAX3I"
      },
      {
        type: "Video",
        title: "Investment Fundamentals",
        description: "Learn the basics of stock market, real estate, and alternative investments",
        duration: "60 min",
        url: "https://www.youtube.com/watch?v=WEDIj9JBTC8"
      },
      {
        type: "Video",
        title: "Grant Cardone: 10X Your Wealth",
        description: "Scaling your income and investment strategies",
        duration: "65 min",
        url: "https://www.youtube.com/watch?v=GLNKOjZVsA0"
      },
      {
        type: "Video",
        title: "Naval Ravikant: How to Get Rich",
        description: "Philosophical approach to creating wealth without luck",
        duration: "60 min",
        url: "https://www.youtube.com/watch?v=1-TZqOsVCNM"
      },
      {
        type: "Video",
        title: "Charlie Munger: The Psychology of Human Misjudgment",
        description: "Mental models and cognitive biases in investing",
        duration: "70 min",
        url: "https://www.youtube.com/watch?v=pqzcCfUglws"
      },
      {
        type: "Article",
        title: "The Millionaire Next Door",
        description: "Key principles of wealth accumulation from everyday millionaires",
        duration: "15 min read",
        url: "https://www.investopedia.com/articles/personal-finance/112015/these-7-habits-will-help-you-become-millionaire.asp"
      },
      {
        type: "Article",
        title: "The 4% Rule for Retirement",
        description: "Understanding sustainable withdrawal rates and retirement planning",
        duration: "20 min read",
        url: "https://www.investopedia.com/terms/f/four-percent-rule.asp"
      },
      {
        type: "Exercise",
        title: "Wealth Mindset Assessment",
        description: "Evaluate your current money beliefs and identify areas for growth",
        duration: "30 min",
        url: "/exercises/wealth-mindset"
      },
      {
        type: "Exercise",
        title: "Investment Portfolio Builder",
        description: "Create a diversified investment strategy based on your goals",
        duration: "45 min",
        url: "/exercises/portfolio-builder"
      }
    ]
  },
  {
    id: "optimal-health",
    title: "Optimal Health & Longevity",
    description: "Discover the science of longevity and optimal health practices",
    category: "Health",
    difficulty: "Beginner",
    duration: "8 weeks",
    modules: 6,
    participants: 8900,
    rating: 4.7,
    mentor: "Dr. Peter Attia",
    color: "bg-green-500",
    icon: "🌿",
    image: "/health.jpg",
    skills: ["Nutrition", "Exercise", "Sleep Optimization", "Stress Management"],
    overview: "Learn evidence-based strategies for optimal health, longevity, and peak performance.",
    resources: [
      {
        type: "Video",
        title: "The Science of Longevity with Dr. Peter Attia",
        description: "Deep dive into the mechanisms of aging and evidence-based longevity strategies",
        duration: "90 min",
        url: "https://www.youtube.com/watch?v=dBnniua6-oM"
      },
      {
        type: "Video",
        title: "David Sinclair: The Science of Aging & How to Reverse It",
        description: "Harvard geneticist explains NAD+, sirtuins, and anti-aging interventions",
        duration: "75 min",
        url: "https://www.youtube.com/watch?v=jhKZIq3SlYE"
      },
      {
        type: "Video",
        title: "Andrew Huberman: Sleep Toolkit for Better Health",
        description: "Neuroscience-based protocols for optimizing sleep and circadian rhythms",
        duration: "85 min",
        url: "https://www.youtube.com/watch?v=nm1TxQj9IsQ"
      },
      {
        type: "Video",
        title: "Rhonda Patrick: Nutrition, Micronutrients & Longevity",
        description: "Evidence-based nutrition strategies for optimal health and longevity",
        duration: "120 min",
        url: "https://www.youtube.com/watch?v=XcvhERcZpWw"
      },
      {
        type: "Video",
        title: "Laird Hamilton: Extreme Longevity Through Movement",
        description: "Functional fitness and movement patterns for lifelong health",
        duration: "65 min",
        url: "https://www.youtube.com/watch?v=BQ8_bAN9ZzM"
      },
      {
        type: "Video",
        title: "Wim Hof: Cold Exposure & Breathing for Health",
        description: "The science behind cold therapy and breathwork for longevity",
        duration: "55 min",
        url: "https://www.youtube.com/watch?v=VaMjhwFE1Zw"
      },
      {
        type: "Video",
        title: "Dr. Valter Longo: Fasting Mimicking Diet & Longevity",
        description: "Research on fasting, autophagy, and cellular regeneration",
        duration: "70 min",
        url: "https://www.youtube.com/watch?v=d6PyyatqJSE"
      },
      {
        type: "Video",
        title: "Ben Greenfield: Biohacking for Optimal Performance",
        description: "Advanced biohacking techniques and longevity protocols",
        duration: "95 min",
        url: "https://www.youtube.com/watch?v=hR_BZOBp8bQ"
      },
      {
        type: "Video",
        title: "Dr. Mark Hyman: Functional Medicine Approach to Longevity",
        description: "Root cause medicine and personalized health optimization",
        duration: "80 min",
        url: "https://www.youtube.com/watch?v=IEz1P4i1P7s"
      },
      {
        type: "Video",
        title: "Kelly Starrett: Mobility & Movement for Longevity",
        description: "Movement quality and injury prevention for lifelong mobility",
        duration: "60 min",
        url: "https://www.youtube.com/watch?v=kMlST5rPmik"
      },
      {
        type: "Video",
        title: "Dr. Sten Ekberg: Metabolic Health & Insulin Resistance",
        description: "Understanding metabolism and preventing metabolic dysfunction",
        duration: "45 min",
        url: "https://www.youtube.com/watch?v=3d7KkyXnyB4"
      },
      {
        type: "Video",
        title: "Dr. Jason Fung: Intermittent Fasting for Health",
        description: "The science of fasting and its impact on longevity and disease prevention",
        duration: "50 min",
        url: "https://www.youtube.com/watch?v=7nJgHBbEgsE"
      },
      {
        type: "Video",
        title: "Dave Asprey: Bulletproof Longevity Strategies",
        description: "Mitochondrial health, toxin avoidance, and performance optimization",
        duration: "75 min",
        url: "https://www.youtube.com/watch?v=yQX2bVzf3kM"
      },
      {
        type: "Video",
        title: "Dr. Gabrielle Lyon: Muscle-Centric Medicine",
        description: "The importance of muscle health for longevity and metabolic function",
        duration: "85 min",
        url: "https://www.youtube.com/watch?v=AE_HQr_nAWs"
      },
      {
        type: "Video",
        title: "Dr. Matthew Walker: Sleep Science Masterclass",
        description: "Comprehensive guide to sleep optimization for health and longevity",
        duration: "110 min",
        url: "https://www.youtube.com/watch?v=5MuIMqhT8DM"
      },
      {
        type: "Video",
        title: "Dr. Sara Gottfried: Hormone Optimization for Longevity",
        description: "Balancing hormones naturally for optimal aging and vitality",
        duration: "65 min",
        url: "https://www.youtube.com/watch?v=qJXKhu5UZwk"
      },
      {
        type: "Video",
        title: "Dr. Terry Wahls: Nutrition for Brain Health",
        description: "Therapeutic nutrition protocols for neurological health and longevity",
        duration: "55 min",
        url: "https://www.youtube.com/watch?v=KLjgBLwH3Wc"
      },
      {
        type: "Video",
        title: "Dr. William Li: Foods That Fight Disease",
        description: "Angiogenesis and how specific foods promote health and longevity",
        duration: "70 min",
        url: "https://www.youtube.com/watch?v=B7Aku1xhZho"
      },
      {
        type: "Video",
        title: "Dr. Dominic D'Agostino: Ketosis & Metabolic Therapy",
        description: "Ketogenic diet science and therapeutic applications for longevity",
        duration: "90 min",
        url: "https://www.youtube.com/watch?v=t1b08X-GvRs"
      },
      {
        type: "Video",
        title: "Dr. Rangan Chatterjee: Stress Management for Health",
        description: "Practical strategies for managing stress and improving mental health",
        duration: "60 min",
        url: "https://www.youtube.com/watch?v=IuR5f6Pa3Tw"
      },
      {
        type: "Video",
        title: "Dr. Steven Gundry: The Plant Paradox & Longevity",
        description: "How lectins affect gut health and the immune system",
        duration: "65 min",
        url: "https://www.youtube.com/watch?v=q4KfKapvnuI"
      },
      {
        type: "Video",
        title: "Dr. Dale Bredesen: The End of Alzheimer's",
        description: "Revolutionary approach to preventing cognitive decline",
        duration: "75 min",
        url: "https://www.youtube.com/watch?v=QqQ_X3mD16U"
      },
      {
        type: "Video",
        title: "Dr. David Perlmutter: Brain Health & Nutrition",
        description: "The connection between gut health and brain function",
        duration: "60 min",
        url: "https://www.youtube.com/watch?v=qJXKhu5UZwk"
      },
      {
        type: "Video",
        title: "Dr. Satchin Panda: Circadian Rhythm & Time-Restricted Eating",
        description: "How meal timing affects metabolic health and longevity",
        duration: "70 min",
        url: "https://www.youtube.com/watch?v=iywhaz5z0qs"
      },
      {
        type: "Video",
        title: "Dr. Mercola: EMF Exposure & Mitochondrial Health",
        description: "Protecting cellular function in the modern environment",
        duration: "55 min",
        url: "https://www.youtube.com/watch?v=gJcM6RZwyfA"
      },
      {
        type: "Video",
        title: "Dr. Paul Saladino: Carnivore Diet & Autoimmunity",
        description: "Controversial approach to eliminating plant toxins for health",
        duration: "85 min",
        url: "https://www.youtube.com/watch?v=N39o_DI5laI"
      },
      {
        type: "Video",
        title: "Dr. Zach Bush: Soil Health & Human Health Connection",
        description: "The microbiome, glyphosate, and environmental medicine",
        duration: "90 min",
        url: "https://www.youtube.com/watch?v=X3aOQ0N74PI"
      },
      {
        type: "Video",
        title: "Dr. Daniel Amen: Brain Health & Mental Longevity",
        description: "SPECT imaging and personalized brain optimization",
        duration: "65 min",
        url: "https://www.youtube.com/watch?v=MLKj1puoWCg"
      },
      {
        type: "Video",
        title: "Dr. Molly Maloof: Biohacking for Women's Health",
        description: "Female-specific longevity strategies and hormone optimization",
        duration: "75 min",
        url: "https://www.youtube.com/watch?v=_GJPVKUOgpc"
      },
      {
        type: "Video",
        title: "Dr. Michael Greger: How Not To Die",
        description: "Evidence-based nutrition for disease prevention",
        duration: "70 min",
        url: "https://www.youtube.com/watch?v=lXXXft9-Zb0"
      },
      {
        type: "Video",
        title: "Dr. Felice Gersh: Women's Hormones & Longevity",
        description: "Integrative approach to female hormone balance",
        duration: "65 min",
        url: "https://www.youtube.com/watch?v=BtHg1AZ3XM4"
      },
      {
        type: "Video",
        title: "Dr. Jed Fahey: Sulforaphane & Cellular Protection",
        description: "The science of broccoli sprouts and Nrf2 activation",
        duration: "55 min",
        url: "https://www.youtube.com/watch?v=Q0lBVCpq8jc"
      },
      {
        type: "Article",
        title: "Blue Zones: Lessons for Longevity",
        description: "Learn from the world's longest-living populations",
        duration: "20 min read",
        url: "https://www.bluezones.com/2016/11/power-9/"
      },
      {
        type: "Article",
        title: "Harvard Health: Nutrition for Longevity",
        description: "Evidence-based dietary approaches for optimal health",
        duration: "25 min read",
        url: "https://www.hsph.harvard.edu/nutritionsource/healthy-eating-plate/"
      },
      {
        type: "Article",
        title: "Mayo Clinic: Exercise and Longevity",
        description: "The role of physical activity in healthy aging",
        duration: "15 min read",
        url: "https://www.mayoclinic.org/healthy-lifestyle/fitness/in-depth/exercise/art-20048389"
      },
      {
        type: "Exercise",
        title: "Health Optimization Plan",
        description: "Create your personalized health and longevity strategy",
        duration: "45 min",
        url: "/exercises/health-optimization"
      },
      {
        type: "Exercise",
        title: "Longevity Assessment",
        description: "Evaluate your current health status and longevity potential",
        duration: "30 min",
        url: "/exercises/longevity-assessment"
      }
    ]
  },
  {
    id: "mindset-mastery",
    title: "Mindset Mastery & Growth",
    description: "Transform your mindset and unlock your full potential",
    category: "Mindset",
    difficulty: "All Levels",
    duration: "10 weeks",
    modules: 7,
    participants: 15600,
    rating: 4.9,
    mentor: "Carol Dweck",
    color: "bg-purple-500",
    icon: "🧠",
    image: "/mindset.jpg",
    skills: ["Growth Mindset", "Mental Resilience", "Success Psychology", "Personal Transformation"],
    overview: "Master the principles of mindset transformation and personal growth.",
    resources: [
      {
        type: "Video",
        title: "The Science of Growth Mindset",
        description: "Research-backed insights on developing a growth mindset",
        duration: "50 min",
        url: "https://www.youtube.com/watch?v=pN34FNbOKXc"
      },
      {
        type: "Video",
        title: "Carol Dweck: The Power of Believing You Can Improve",
        description: "TED talk from the pioneer of growth mindset research",
        duration: "10 min",
        url: "https://www.youtube.com/watch?v=_X0mgOOSpLU"
      },
      {
        type: "Video",
        title: "Jim Kwik: Limitless - Upgrade Your Brain & Memory",
        description: "Techniques to improve learning ability and mental performance",
        duration: "90 min",
        url: "https://www.youtube.com/watch?v=o6E2rHV-YZI"
      },
      {
        type: "Video",
        title: "Dr. Joe Dispenza: Breaking the Habit of Being Yourself",
        description: "Neuroscience of personal transformation and habit change",
        duration: "75 min",
        url: "https://www.youtube.com/watch?v=La9oLLoI5Rc"
      },
      {
        type: "Video",
        title: "Brené Brown: The Power of Vulnerability",
        description: "How embracing vulnerability leads to growth and connection",
        duration: "20 min",
        url: "https://www.youtube.com/watch?v=iCvmsMzlF7o"
      },
      {
        type: "Video",
        title: "Angela Duckworth: Grit - The Power of Passion and Perseverance",
        description: "Research on how determination outperforms talent",
        duration: "15 min",
        url: "https://www.youtube.com/watch?v=H14bBuluwB8"
      },
      {
        type: "Video",
        title: "Neuroplasticity and Learning",
        description: "Understanding how your brain adapts and grows",
        duration: "45 min",
        url: "https://www.youtube.com/watch?v=ELpfYCZa87g"
      },
      {
        type: "Video",
        title: "Dr. Shad Helmstetter: The Power of Self-Talk",
        description: "How to reprogram your mind through positive self-talk",
        duration: "60 min",
        url: "https://www.youtube.com/watch?v=gVCFVZ3DidI"
      },
      {
        type: "Video",
        title: "Dr. Tara Swart: The Source - Brain Science of Success",
        description: "Neuroscience-based approach to achieving your goals",
        duration: "55 min",
        url: "https://www.youtube.com/watch?v=ArYzEL4MPEE"
      },
      {
        type: "Video",
        title: "Dr. Andrew Huberman: Rewire Your Brain for Success",
        description: "Neuroplasticity protocols for behavioral change",
        duration: "85 min",
        url: "https://www.youtube.com/watch?v=SwQhKFMxmDY"
      },
      {
        type: "Video",
        title: "Dr. Caroline Leaf: Switch On Your Brain",
        description: "The science of thought management and mental detoxing",
        duration: "65 min",
        url: "https://www.youtube.com/watch?v=yjhAuASCEno"
      },
      {
        type: "Video",
        title: "Steven Kotler: The Art of Impossible",
        description: "Flow states and peak performance psychology",
        duration: "70 min",
        url: "https://www.youtube.com/watch?v=T-ogYrQVL10"
      },
      {
        type: "Video",
        title: "Dr. Kristin Neff: The Power of Self-Compassion",
        description: "Research on self-compassion for resilience and growth",
        duration: "25 min",
        url: "https://www.youtube.com/watch?v=YFhcNPjIMjc"
      },
      {
        type: "Article",
        title: "Fixed vs Growth Mindset",
        description: "Learn the key differences and how to develop a growth mindset",
        duration: "15 min read",
        url: "https://www.mindsetworks.com/science/"
      },
      {
        type: "Article",
        title: "The Power of Yet",
        description: "How to embrace challenges and learn from failures",
        duration: "12 min read",
        url: "https://www.mindsetworks.com/parents/growth-mindset-parenting"
      },
      {
        type: "Exercise",
        title: "Daily Mindset Practice",
        description: "Practical exercises to strengthen your growth mindset",
        duration: "20 min",
        url: "/exercises/mindset-practice"
      },
      {
        type: "Exercise",
        title: "Limiting Beliefs Transformation",
        description: "Identify and reframe limiting beliefs holding you back",
        duration: "35 min",
        url: "/exercises/limiting-beliefs"
      }
    ]
  },
  {
    id: "spiritual-growth",
    title: "Spiritual Growth & Enlightenment",
    description: "Explore spiritual practices and inner transformation",
    category: "Spirituality",
    difficulty: "All Levels",
    duration: "12 weeks",
    modules: 8,
    participants: 7200,
    rating: 4.8,
    mentor: "Eckhart Tolle",
    color: "bg-indigo-500",
    icon: "✨",
    image: "/spirituality.jpg",
    skills: ["Meditation", "Mindfulness", "Spiritual Awareness", "Inner Peace"],
    overview: "Discover ancient wisdom and modern practices for spiritual growth and inner peace.",
    resources: [
      {
        type: "Video",
        title: "Introduction to Meditation",
        description: "Learn the basics of meditation practice",
        duration: "30 min",
        url: "https://www.youtube.com/watch?v=o-kMJBWk9E0"
      },
      {
        type: "Video",
        title: "Eckhart Tolle: The Power of Now",
        description: "Teachings on presence and living in the moment",
        duration: "90 min",
        url: "https://www.youtube.com/watch?v=fPZ6R8MR9mg"
      },
      {
        type: "Video",
        title: "Ram Dass: Being Present",
        description: "Wisdom on spiritual awakening and consciousness",
        duration: "75 min",
        url: "https://www.youtube.com/watch?v=XavQeHGGRMA"
      },
      {
        type: "Video",
        title: "Sadhguru: Inner Engineering",
        description: "Yogic wisdom for self-transformation",
        duration: "65 min",
        url: "https://www.youtube.com/watch?v=IgvkUDhT_WU"
      },
      {
        type: "Video",
        title: "Thich Nhat Hanh: The Art of Mindful Living",
        description: "Buddhist teachings on mindfulness and compassion",
        duration: "55 min",
        url: "https://www.youtube.com/watch?v=dDXcIaUKHDU"
      },
      {
        type: "Video",
        title: "Adyashanti: The End of Your World",
        description: "Insights on spiritual awakening and its challenges",
        duration: "80 min",
        url: "https://www.youtube.com/watch?v=nIOvCHzTc_E"
      },
      {
        type: "Video",
        title: "Understanding Non-Duality",
        description: "Exploring the concept of oneness and non-separation",
        duration: "60 min",
        url: "https://www.youtube.com/watch?v=OZ8tQYYNIg0"
      },
      {
        type: "Video",
        title: "Rupert Spira: The Nature of Consciousness",
        description: "Non-dual teachings on awareness and being",
        duration: "70 min",
        url: "https://www.youtube.com/watch?v=3GXJyJ3Khz4"
      },
      {
        type: "Video",
        title: "Mooji: Invitation to Freedom",
        description: "Direct pointing to self-realization",
        duration: "85 min",
        url: "https://www.youtube.com/watch?v=WQPQKIqwXgw"
      },
      {
        type: "Video",
        title: "Alan Watts: The Real You",
        description: "Eastern philosophy explained for Western minds",
        duration: "45 min",
        url: "https://www.youtube.com/watch?v=mMRrCYPxD0I"
      },
      {
        type: "Video",
        title: "Tara Brach: Radical Acceptance",
        description: "Embracing your life with the heart of a Buddha",
        duration: "65 min",
        url: "https://www.youtube.com/watch?v=4OtZYWdUTpk"
      },
      {
        type: "Video",
        title: "Michael Singer: The Untethered Soul",
        description: "Journey beyond yourself to self-realization",
        duration: "75 min",
        url: "https://www.youtube.com/watch?v=RyKuN1bQzCo"
      },
      {
        type: "Article",
        title: "The Science of Spirituality",
        description: "Research on how spiritual practices affect the brain",
        duration: "20 min read",
        url: "https://www.mindful.org/the-science-of-spirituality/"
      },
      {
        type: "Article",
        title: "Integrating Spiritual Insights",
        description: "How to apply spiritual understanding to daily life",
        duration: "25 min read",
        url: "https://www.spiritualawakeningprocess.com/2014/12/integrating-spiritual-experiences.html"
      },
      {
        type: "Exercise",
        title: "Daily Mindfulness Practice",
        description: "Simple exercises to increase present-moment awareness",
        duration: "15 min",
        url: "/exercises/mindfulness"
      },
      {
        type: "Exercise",
        title: "Self-Inquiry Meditation",
        description: "Guided practice for investigating the nature of self",
        duration: "30 min",
        url: "/exercises/self-inquiry"
      }
    ]
  },
  {
    id: "leadership-excellence",
    title: "Leadership Excellence",
    description: "Develop essential leadership skills and executive presence",
    category: "Leadership",
    difficulty: "Advanced",
    duration: "10 weeks",
    modules: 7,
    participants: 6800,
    rating: 4.7,
    mentor: "Simon Sinek",
    color: "bg-red-500",
    icon: "👥",
    image: "/leadership.jpg",
    skills: ["Strategic Thinking", "Team Building", "Communication", "Decision Making"],
    overview: "Master the art of leadership and create high-performing teams.",
    resources: [
      {
        type: "Video",
        title: "Leaders Eat Last",
        description: "Understanding the principles of servant leadership",
        duration: "48 min",
        url: "https://www.youtube.com/watch?v=RyTQ5-SQYTo"
      },
      {
        type: "Video",
        title: "Simon Sinek: How Great Leaders Inspire Action",
        description: "The power of starting with 'why' in leadership",
        duration: "18 min",
        url: "https://www.youtube.com/watch?v=qp0HIF3SfI4"
      },
      {
        type: "Video",
        title: "Brené Brown: Dare to Lead",
        description: "Courage and vulnerability in leadership",
        duration: "75 min",
        url: "https://www.youtube.com/watch?v=3pUVb-SN3fI"
      },
      {
        type: "Video",
        title: "Jim Collins: Good to Great",
        description: "What makes companies and their leaders excel",
        duration: "60 min",
        url: "https://www.youtube.com/watch?v=q5HoNaZsX0M"
      },
      {
        type: "Video",
        title: "Patrick Lencioni: The Five Dysfunctions of a Team",
        description: "Overcoming obstacles to team success",
        duration: "55 min",
        url: "https://www.youtube.com/watch?v=O5EQW026alY"
      },
      {
        type: "Video",
        title: "Leading Through Change",
        description: "Strategies for navigating organizational transformation",
        duration: "55 min",
        url: "https://www.youtube.com/watch?v=Wh88dfYI-Wg"
      },
      {
        type: "Video",
        title: "Daniel Goleman: Emotional Intelligence in Leadership",
        description: "How EQ drives effective leadership",
        duration: "45 min",
        url: "https://www.youtube.com/watch?v=pt74vK9pgIA"
      },
      {
        type: "Video",
        title: "John Maxwell: The 5 Levels of Leadership",
        description: "Framework for leadership development",
        duration: "70 min",
        url: "https://www.youtube.com/watch?v=aPwXeg8ThWI"
      },
      {
        type: "Video",
        title: "Amy Edmondson: Psychological Safety",
        description: "Creating teams where people can speak up",
        duration: "50 min",
        url: "https://www.youtube.com/watch?v=LhoLuui9gX8"
      },
      {
        type: "Video",
        title: "Adam Grant: Originals - How Non-Conformists Move the World",
        description: "Leading innovation and creative thinking",
        duration: "65 min",
        url: "https://www.youtube.com/watch?v=fxbCHn6gE3U"
      },
      {
        type: "Video",
        title: "Kim Scott: Radical Candor",
        description: "Caring personally while challenging directly",
        duration: "40 min",
        url: "https://www.youtube.com/watch?v=yj9GLeNCgm4"
      },
      {
        type: "Video",
        title: "Marshall Goldsmith: What Got You Here Won't Get You There",
        description: "Overcoming leadership blind spots",
        duration: "55 min",
        url: "https://www.youtube.com/watch?v=2Mftc6Olgrc"
      },
      {
        type: "Article",
        title: "Emotional Intelligence for Leaders",
        description: "How to develop and apply EQ in leadership contexts",
        duration: "22 min read",
        url: "https://hbr.org/2015/04/how-emotional-intelligence-became-a-key-leadership-skill"
      },
      {
        type: "Article",
        title: "Servant Leadership Philosophy",
        description: "Understanding the power of leading by serving others",
        duration: "18 min read",
        url: "https://www.greenleaf.org/what-is-servant-leadership/"
      },
      {
        type: "Exercise",
        title: "Leadership Assessment",
        description: "Evaluate your leadership style and identify growth areas",
        duration: "40 min",
        url: "/exercises/leadership-assessment"
      },
      {
        type: "Exercise",
        title: "Difficult Conversations Practice",
        description: "Framework for handling challenging leadership situations",
        duration: "40 min",
        url: "/exercises/difficult-conversations"
      }
    ]
  }
]

const categories = ["All", "Mindset", "Wealth", "Health", "Wisdom", "Spirituality", "Creativity", "Leadership"]
const difficulties = ["All", "Beginner", "Intermediate", "Advanced"]

export default function LearningPaths({ onBack }: LearningPathsProps) {
  const [selectedPath, setSelectedPath] = useState<any>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedDifficulty, setSelectedDifficulty] = useState("All")

  const filteredPaths = learningPaths.filter((path) => {
    const matchesSearch =
      path.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      path.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      path.skills.some((skill) => skill.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesCategory = selectedCategory === "All" || path.category === selectedCategory
    const matchesDifficulty = selectedDifficulty === "All" || path.difficulty === selectedDifficulty
    return matchesSearch && matchesCategory && matchesDifficulty
  })

  if (selectedPath) {
    return <LearningPathDetail path={selectedPath} onBack={() => setSelectedPath(null)} />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-4 mb-4">
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Learning Paths</h1>
              <p className="text-gray-600">Structured journeys to master life's essential skills</p>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search learning paths..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex gap-2 flex-wrap">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Button>
              ))}
            </div>

            <div className="flex gap-2 flex-wrap">
              {difficulties.map((difficulty) => (
                <Button
                  key={difficulty}
                  variant={selectedDifficulty === difficulty ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedDifficulty(difficulty)}
                >
                  {difficulty}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Learning Paths Grid */}
      <div className="max-w-6xl mx-auto p-6">
        <div className="mb-4 text-sm text-gray-600">
          Showing {filteredPaths.length} learning path{filteredPaths.length !== 1 ? "s" : ""}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPaths.map((path) => (
            <Card
              key={path.id}
              className="hover:shadow-xl transition-all duration-300 cursor-pointer group overflow-hidden"
              onClick={() => setSelectedPath(path)}
            >
              <div className="relative">
                <img
                  src={path.image || "/placeholder.svg"}
                  alt={path.title}
                  className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-2 right-2">
                  <Badge variant="outline" className="bg-white">
                    {path.difficulty}
                  </Badge>
                </div>
                <div className="absolute bottom-2 left-2">
                  <div
                    className={`w-10 h-10 rounded-lg ${path.color} flex items-center justify-center text-xl bg-white bg-opacity-90`}
                  >
                    {path.icon}
                  </div>
                </div>
              </div>

              <CardHeader>
                <CardTitle className="text-lg group-hover:text-purple-600 transition-colors">{path.title}</CardTitle>
                <p className="text-sm text-gray-600">{path.description}</p>
              </CardHeader>

              <CardContent>
                {/* Progress */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Progress</span>
                    <span>{Math.round((path.completedModules / path.modules) * 100)}%</span>
                  </div>
                  <Progress value={(path.completedModules / path.modules) * 100} className="h-2" />
                  <p className="text-xs text-gray-500 mt-1">
                    {path.completedModules} of {path.modules} modules completed
                  </p>
                </div>

                {/* Skills */}
                <div className="mb-4">
                  <p className="text-xs font-medium text-gray-500 mb-2">Skills you'll learn:</p>
                  <div className="flex flex-wrap gap-1">
                    {path.skills.slice(0, 3).map((skill) => (
                      <Badge key={skill} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                    {path.skills.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{path.skills.length - 3}
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Stats */}
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{path.duration}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>{path.participants.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span>{path.rating}</span>
                  </div>
                </div>

                {/* Mentor */}
                <div className="flex items-center justify-between">
                  <div className="text-sm">
                    <span className="text-gray-500">Mentor: </span>
                    <span className="font-medium">{path.mentor}</span>
                  </div>
                  <Button size="sm" className="group-hover:bg-purple-700 transition-colors">
                    {path.completedModules > 0 ? "Continue" : "Start Path"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredPaths.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <BookOpen className="w-12 h-12 mx-auto" />
            </div>
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No learning paths found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>
    </div>
  )
}
