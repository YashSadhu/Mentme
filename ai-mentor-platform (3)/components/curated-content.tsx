"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Play, BookOpen, Headphones, ExternalLink, Clock, Star, Eye, CheckCircle, Award, Users } from "lucide-react"

interface CuratedContentProps {
  pathId: string
  onProgressUpdate?: (contentId: string, type: string, completed: boolean) => void
}

const contentData = {
  "wealth-building": {
    videos: [
      {
        id: "video-1",
        title: "Naval Ravikant: How to Get Rich (without getting lucky)",
        creator: "Naval Ravikant",
        duration: "1:23:45",
        views: "2.1M",
        rating: 4.9,
        difficulty: "Beginner",
        thumbnail: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=400&h=225&fit=crop",
        url: "https://www.youtube.com/watch?v=1-TZqOsVCNM",
        description:
          "Complete guide to building wealth through leverage and specific knowledge. Learn the fundamental principles of wealth creation.",
        tags: ["Wealth", "Entrepreneurship", "Philosophy"],
        keyTakeaways: ["Leverage is key to wealth", "Specific knowledge is valuable", "Build assets, not just income"],
        completed: false,
      },
      {
        id: "video-2",
        title: "Warren Buffett's Investment Masterclass",
        creator: "Berkshire Hathaway",
        duration: "2:15:20",
        views: "3.2M",
        rating: 4.9,
        difficulty: "Intermediate",
        thumbnail: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=225&fit=crop",
        url: "https://www.youtube.com/watch?v=2a9Lx9J8uSs",
        description: "Learn from the Oracle of Omaha's decades of investment wisdom and value investing principles.",
        tags: ["Investing", "Value Investing", "Long-term"],
        keyTakeaways: ["Buy undervalued companies", "Think long-term", "Understand the business"],
        completed: false,
      },
      {
        id: "video-3",
        title: "Ray Dalio: Principles for Success",
        creator: "Ray Dalio",
        duration: "30:15",
        views: "1.8M",
        rating: 4.8,
        difficulty: "Advanced",
        thumbnail: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=400&h=225&fit=crop",
        url: "https://www.youtube.com/watch?v=B9XGUpQZY38",
        description:
          "Fundamental principles for achieving success in life and business from the founder of Bridgewater.",
        tags: ["Principles", "Success", "Leadership"],
        keyTakeaways: ["Embrace radical transparency", "Learn from failures", "Build great relationships"],
        completed: false,
      },
      {
        id: "video-4",
        title: "Charlie Munger: The Psychology of Human Misjudgment",
        creator: "Charlie Munger",
        duration: "1:45:30",
        views: "950K",
        rating: 4.9,
        difficulty: "Advanced",
        thumbnail: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=225&fit=crop",
        url: "https://www.youtube.com/watch?v=pqzcCfUglws",
        description:
          "Understanding cognitive biases and mental models for better decision making in investing and life.",
        tags: ["Psychology", "Decision Making", "Mental Models"],
        keyTakeaways: ["Understand cognitive biases", "Use mental models", "Think in systems"],
        completed: false,
      },
      {
        id: "video-5",
        title: "Peter Thiel: Zero to One - Building Monopolies",
        creator: "Peter Thiel",
        duration: "58:42",
        views: "1.2M",
        rating: 4.7,
        difficulty: "Intermediate",
        thumbnail: "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=400&h=225&fit=crop",
        url: "https://www.youtube.com/watch?v=3Fx5Q8xGU8k",
        description: "How to build companies that create new things and achieve monopoly-like returns.",
        tags: ["Startups", "Innovation", "Monopoly"],
        keyTakeaways: ["Create monopolies", "Focus on 10x improvements", "Build network effects"],
        completed: false,
      },
      {
        id: "video-6",
        title: "Jeff Bezos: Long-term Thinking and Customer Obsession",
        creator: "Jeff Bezos",
        duration: "42:18",
        views: "890K",
        rating: 4.8,
        difficulty: "Intermediate",
        thumbnail: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=225&fit=crop",
        url: "https://www.youtube.com/watch?v=f3NBQcAqyu4",
        description: "Amazon's founder shares insights on building customer-centric businesses and thinking long-term.",
        tags: ["Customer Focus", "Long-term", "Innovation"],
        keyTakeaways: ["Customer obsession", "Think long-term", "Invent and simplify"],
        completed: false,
      },
    ],
    masterclasses: [
      {
        id: "master-1",
        title: "Real Estate Investing Masterclass",
        instructor: "Barbara Corcoran",
        duration: "4:30:00",
        lessons: 12,
        rating: 4.8,
        price: "$90",
        thumbnail: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=225&fit=crop",
        description: "Learn real estate investing from the Shark Tank star and real estate mogul.",
        tags: ["Real Estate", "Investing", "Property"],
        completed: false,
      },
      {
        id: "master-2",
        title: "Business Strategy and Leadership",
        instructor: "Bob Iger",
        duration: "3:45:00",
        lessons: 10,
        rating: 4.9,
        price: "$90",
        thumbnail: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=225&fit=crop",
        description: "Former Disney CEO shares leadership lessons and business strategy insights.",
        tags: ["Leadership", "Strategy", "Management"],
        completed: false,
      },
    ],
    blogs: [
      {
        id: "blog-1",
        title: "The Complete Guide to Financial Independence",
        author: "Mr. Money Mustache",
        readTime: "15 min",
        url: "https://www.mrmoneymustache.com/2012/01/13/the-shockingly-simple-math-behind-early-retirement/",
        description: "Mathematical approach to achieving financial independence and early retirement",
        tags: ["FIRE", "Retirement", "Savings"],
        difficulty: "Beginner",
        completed: false,
      },
      {
        id: "blog-2",
        title: "Building Wealth Through Real Estate",
        author: "BiggerPockets",
        readTime: "12 min",
        url: "https://www.biggerpockets.com/blog/how-to-invest-in-real-estate",
        description: "Comprehensive guide to real estate investing for beginners",
        tags: ["Real Estate", "Passive Income", "Investment"],
        difficulty: "Intermediate",
        completed: false,
      },
      {
        id: "blog-3",
        title: "The Psychology of Money",
        author: "Morgan Housel",
        readTime: "20 min",
        url: "https://www.collaborativefund.com/blog/the-psychology-of-money/",
        description: "Understanding the behavioral aspects of financial decision making",
        tags: ["Psychology", "Money", "Behavior"],
        difficulty: "Intermediate",
        completed: false,
      },
    ],
    podcasts: [
      {
        id: "podcast-1",
        title: "The Tim Ferriss Show - Naval Ravikant",
        host: "Tim Ferriss",
        duration: "2:30:15",
        url: "https://tim.blog/2018/06/04/the-tim-ferriss-show-transcripts-naval-ravikant/",
        description: "Deep dive into wealth creation, happiness, and decision making",
        tags: ["Entrepreneurship", "Philosophy", "Success"],
        completed: false,
      },
      {
        id: "podcast-2",
        title: "Invest Like the Best - Howard Marks",
        host: "Patrick O'Shaughnessy",
        duration: "1:45:30",
        url: "https://investorfieldguide.com/marks/",
        description: "Market cycles, risk management, and contrarian investing",
        tags: ["Investing", "Risk", "Markets"],
        completed: false,
      },
    ],
    books: [
      {
        id: "book-1",
        title: "The Almanack of Naval Ravikant",
        author: "Eric Jorgenson",
        pages: 242,
        rating: 4.8,
        cover: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=200&h=300&fit=crop",
        description: "Compilation of Naval's wisdom on wealth and happiness",
        amazonUrl: "https://www.amazon.com/Almanack-Naval-Ravikant-Wealth-Happiness/dp/1544514212",
        tags: ["Philosophy", "Wealth", "Happiness"],
        completed: false,
      },
      {
        id: "book-2",
        title: "Rich Dad Poor Dad",
        author: "Robert Kiyosaki",
        pages: 336,
        rating: 4.6,
        cover: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=300&fit=crop",
        description: "Financial education and the mindset of the wealthy",
        amazonUrl: "https://www.amazon.com/Rich-Dad-Poor-Teach-Middle/dp/1612680194",
        tags: ["Financial Education", "Mindset", "Assets"],
        completed: false,
      },
      {
        id: "book-3",
        title: "The Intelligent Investor",
        author: "Benjamin Graham",
        pages: 640,
        rating: 4.7,
        cover: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=200&h=300&fit=crop",
        description: "The definitive book on value investing and market psychology",
        amazonUrl: "https://www.amazon.com/Intelligent-Investor-Definitive-Investing-Essentials/dp/0060555661",
        tags: ["Value Investing", "Markets", "Psychology"],
        completed: false,
      },
    ],
    courses: [
      {
        id: "course-1",
        title: "Financial Markets",
        provider: "Yale University (Coursera)",
        instructor: "Robert Shiller",
        duration: "33 hours",
        weeks: 7,
        rating: 4.8,
        price: "Free",
        certificate: true,
        description: "Comprehensive overview of financial markets and institutions",
        tags: ["Finance", "Markets", "Economics"],
        completed: false,
      },
      {
        id: "course-2",
        title: "Entrepreneurship Specialization",
        provider: "University of Pennsylvania (Coursera)",
        instructor: "Multiple",
        duration: "4 months",
        weeks: 16,
        rating: 4.7,
        price: "$49/month",
        certificate: true,
        description: "Complete entrepreneurship program from idea to launch",
        tags: ["Entrepreneurship", "Startups", "Business"],
        completed: false,
      },
    ],
  },
  // Add similar comprehensive data for other paths...
  "optimal-health": {
    videos: [
      {
        id: "video-1",
        title: "Andrew Huberman: Sleep Optimization Protocol",
        creator: "Huberman Lab",
        duration: "1:45:30",
        views: "3.5M",
        rating: 4.9,
        difficulty: "Beginner",
        thumbnail: "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=400&h=225&fit=crop",
        url: "https://www.youtube.com/watch?v=nm1TxQj9IsQ",
        description: "Science-based protocols for better sleep and recovery",
        tags: ["Sleep", "Neuroscience", "Health"],
        keyTakeaways: ["Morning light exposure", "Temperature regulation", "Sleep hygiene"],
        completed: false,
      },
      {
        id: "video-2",
        title: "Peter Attia: The Science of Longevity",
        creator: "Peter Attia",
        duration: "58:42",
        views: "1.2M",
        rating: 4.8,
        difficulty: "Intermediate",
        thumbnail: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&h=225&fit=crop",
        url: "https://www.youtube.com/watch?v=dBnniua6-oM",
        description: "Evidence-based approach to optimal nutrition and longevity",
        tags: ["Nutrition", "Longevity", "Science"],
        keyTakeaways: ["Metabolic health", "Exercise protocols", "Nutritional strategies"],
        completed: false,
      },
      {
        id: "video-3",
        title: "Rhonda Patrick: Exercise for Brain Health",
        creator: "FoundMyFitness",
        duration: "1:12:15",
        views: "890K",
        rating: 4.7,
        difficulty: "Advanced",
        thumbnail: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=225&fit=crop",
        url: "https://www.youtube.com/watch?v=jN0pRAqiUJU",
        description: "How different types of exercise impact aging and brain health",
        tags: ["Exercise", "Brain Health", "Fitness"],
        keyTakeaways: ["BDNF production", "Neuroplasticity", "Exercise types"],
        completed: false,
      },
    ],
    masterclasses: [
      {
        id: "master-1",
        title: "Mindfulness and Meditation",
        instructor: "Jon Kabat-Zinn",
        duration: "3:20:00",
        lessons: 8,
        rating: 4.9,
        price: "$90",
        thumbnail: "https://images.unsplash.com/photo-1545389336-cf090694435e?w=400&h=225&fit=crop",
        description: "Learn mindfulness-based stress reduction techniques",
        tags: ["Mindfulness", "Meditation", "Stress"],
        completed: false,
      },
    ],
    blogs: [
      {
        id: "blog-1",
        title: "The Ultimate Guide to Intermittent Fasting",
        author: "Dr. Jason Fung",
        readTime: "18 min",
        url: "https://www.dietdoctor.com/intermittent-fasting",
        description: "Complete guide to intermittent fasting for health and weight loss",
        tags: ["Fasting", "Weight Loss", "Metabolism"],
        difficulty: "Beginner",
        completed: false,
      },
    ],
    podcasts: [
      {
        id: "podcast-1",
        title: "The Peter Attia Drive - Sleep & Recovery",
        host: "Peter Attia",
        duration: "1:45:20",
        url: "https://peterattiamd.com/podcast/",
        description: "Deep dive into sleep science and recovery protocols",
        tags: ["Sleep", "Recovery", "Health"],
        completed: false,
      },
    ],
    books: [
      {
        id: "book-1",
        title: "Why We Sleep",
        author: "Matthew Walker",
        pages: 368,
        rating: 4.7,
        cover: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=200&h=300&fit=crop",
        description: "The science of sleep and its impact on health and performance",
        amazonUrl: "https://www.amazon.com/Why-We-Sleep-Unlocking-Dreams/dp/1501144316",
        tags: ["Sleep", "Neuroscience", "Health"],
        completed: false,
      },
    ],
    courses: [
      {
        id: "course-1",
        title: "The Science of Well-Being",
        provider: "Yale University (Coursera)",
        instructor: "Laurie Santos",
        duration: "19 hours",
        weeks: 10,
        rating: 4.9,
        price: "Free",
        certificate: true,
        description: "Learn what makes us happy and how to build better habits",
        tags: ["Psychology", "Happiness", "Well-being"],
        completed: false,
      },
    ],
  },
}

export default function CuratedContent({ pathId, onProgressUpdate }: CuratedContentProps) {
  const [activeTab, setActiveTab] = useState("videos")
  const [completedItems, setCompletedItems] = useState<Record<string, boolean>>({})
  const [filter, setFilter] = useState("all")
  const [content, setContent] = useState<any>(contentData["wealth-building"])
  
  useEffect(() => {
    // Import the learning paths dynamically to get the updated resources
    import("@/components/learning-paths").then((module) => {
      const paths = module.learningPaths;
      const currentPath = paths.find((p: any) => p.id === pathId);
      
      if (currentPath && currentPath.resources) {
        // Transform the resources from learning-paths.tsx to match the expected format
        const transformedContent: any = {
          videos: [],
          masterclasses: [],
          blogs: [],
          podcasts: [],
          books: [],
          courses: []
        };
        
        // Process videos
        const videos = currentPath.resources.filter((r: any) => r.type.toLowerCase() === "video");
        transformedContent.videos = videos.map((video: any, index: number) => ({
          id: `video-${index + 1}`,
          title: video.title,
          creator: video.creator || "Expert",
          duration: video.duration || "45:00",
          views: video.views || "500K",
          rating: video.rating || 4.7,
          difficulty: video.difficulty || "Intermediate",
          thumbnail: video.thumbnail || "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=400&h=225&fit=crop",
          url: video.url || "#",
          description: video.description || "No description available",
          tags: video.tags || [currentPath.title],
          keyTakeaways: video.keyTakeaways || ["Key insights"],
          completed: false
        }));
        
        // Process articles
        const articles = currentPath.resources.filter((r: any) => r.type.toLowerCase() === "article");
        transformedContent.blogs = articles.map((article: any, index: number) => ({
          id: `blog-${index + 1}`,
          title: article.title,
          author: article.creator || "Expert",
          readTime: article.duration || "10 min",
          url: article.url || "#",
          description: article.description || "No description available",
          tags: article.tags || [currentPath.title],
          difficulty: article.difficulty || "Intermediate",
          completed: false
        }));
        
        // Process exercises (as courses)
        const exercises = currentPath.resources.filter((r: any) => r.type.toLowerCase() === "exercise");
        transformedContent.courses = exercises.map((exercise: any, index: number) => ({
          id: `course-${index + 1}`,
          title: exercise.title,
          provider: exercise.provider || currentPath.title,
          instructor: exercise.creator || "Expert",
          duration: exercise.duration || "1 hour",
          weeks: 1,
          rating: 4.8,
          price: "Free",
          certificate: false,
          description: exercise.description || "No description available",
          tags: exercise.tags || [currentPath.title],
          completed: false
        }));
        
        setContent(transformedContent);
      }
    }).catch(error => {
      console.error("Error loading learning paths:", error);
    });
  }, [pathId])

  useEffect(() => {
    // Load completed items from localStorage
    const saved = localStorage.getItem(`completed-${pathId}`)
    if (saved) {
      setCompletedItems(JSON.parse(saved))
    }
  }, [pathId])

  const handleItemComplete = (itemId: string, type: string) => {
    const newCompleted = { ...completedItems, [itemId]: !completedItems[itemId] }
    setCompletedItems(newCompleted)
    localStorage.setItem(`completed-${pathId}`, JSON.stringify(newCompleted))
    onProgressUpdate?.(itemId, type, newCompleted[itemId])
  }

  const getProgressStats = () => {
    const allItems = [
      ...(content.videos || []),
      ...(content.masterclasses || []),
      ...(content.blogs || []),
      ...(content.podcasts || []),
      ...(content.books || []),
      ...(content.courses || []),
    ]
    const completed = allItems.filter((item) => completedItems[item.id]).length
    return { completed, total: allItems.length, percentage: Math.round((completed / allItems.length) * 100) }
  }

  const stats = getProgressStats()

  const handleWatchVideo = (url: string, videoId: string) => {
    window.open(url, "_blank")
    // Mark as completed when opened
    setTimeout(() => handleItemComplete(videoId, "video"), 1000)
  }

  const handleReadBlog = (url: string, blogId: string) => {
    window.open(url, "_blank")
    setTimeout(() => handleItemComplete(blogId, "blog"), 1000)
  }

  const handleListenPodcast = (url: string, podcastId: string) => {
    window.open(url, "_blank")
    setTimeout(() => handleItemComplete(podcastId, "podcast"), 1000)
  }

  const handleViewBook = (url: string, bookId: string) => {
    window.open(url, "_blank")
    setTimeout(() => handleItemComplete(bookId, "book"), 1000)
  }

  const handleTakeCourse = (courseId: string) => {
    alert("This would redirect to the course platform")
    handleItemComplete(courseId, "course")
  }

  const handleTakeMasterclass = (masterclassId: string) => {
    alert("This would redirect to MasterClass")
    handleItemComplete(masterclassId, "masterclass")
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner":
        return "bg-green-100 text-green-700"
      case "Intermediate":
        return "bg-yellow-100 text-yellow-700"
      case "Advanced":
        return "bg-red-100 text-red-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  return (
    <div className="space-y-6">
      {/* Progress Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Learning Progress</CardTitle>
              <p className="text-gray-600">Track your progress through curated resources</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-purple-600">{stats.percentage}%</div>
              <div className="text-sm text-gray-500">
                {stats.completed} of {stats.total} completed
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Progress value={stats.percentage} className="h-3" />
          <div className="flex items-center justify-between mt-4 text-sm">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-purple-600 rounded-full"></div>
                <span>Completed</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-gray-200 rounded-full"></div>
                <span>Remaining</span>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant={filter === "all" ? "default" : "outline"} size="sm" onClick={() => setFilter("all")}>
                All
              </Button>
              <Button
                variant={filter === "completed" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter("completed")}
              >
                Completed
              </Button>
              <Button
                variant={filter === "remaining" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter("remaining")}
              >
                Remaining
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Curated Learning Resources</CardTitle>
          <p className="text-gray-600">Hand-picked content from industry leaders and experts</p>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="videos" className="flex items-center gap-2">
                <Play className="w-4 h-4" />
                Videos
              </TabsTrigger>
              <TabsTrigger value="masterclasses" className="flex items-center gap-2">
                <Award className="w-4 h-4" />
                Masterclasses
              </TabsTrigger>
              <TabsTrigger value="courses" className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                Courses
              </TabsTrigger>
              <TabsTrigger value="blogs" className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                Articles
              </TabsTrigger>
              <TabsTrigger value="podcasts" className="flex items-center gap-2">
                <Headphones className="w-4 h-4" />
                Podcasts
              </TabsTrigger>
              <TabsTrigger value="books" className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                Books
              </TabsTrigger>
            </TabsList>

            <TabsContent value="videos" className="mt-6">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {content.videos
                  ?.filter((video) => {
                    if (filter === "completed") return completedItems[video.id]
                    if (filter === "remaining") return !completedItems[video.id]
                    return true
                  })
                  .map((video) => (
                    <Card key={video.id} className="hover:shadow-lg transition-shadow relative">
                      {completedItems[video.id] && (
                        <div className="absolute top-2 left-2 z-10">
                          <Badge className="bg-green-600 text-white">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Completed
                          </Badge>
                        </div>
                      )}
                      <div className="relative">
                        <img
                          src={video.thumbnail || "/placeholder.svg"}
                          alt={video.title}
                          className="w-full h-32 object-cover rounded-t-lg"
                        />
                        <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-xs">
                          {video.duration}
                        </div>
                        <div className="absolute top-2 right-2">
                          <Badge className={getDifficultyColor(video.difficulty)}>{video.difficulty}</Badge>
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-semibold mb-2 line-clamp-2">{video.title}</h3>
                        <p className="text-sm text-gray-600 mb-2">by {video.creator}</p>
                        <p className="text-xs text-gray-500 mb-3 line-clamp-2">{video.description}</p>

                        <div className="flex items-center justify-between mb-3 text-xs text-gray-500">
                          <div className="flex items-center gap-1">
                            <Eye className="w-3 h-3" />
                            <span>{video.views} views</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                            <span>{video.rating}</span>
                          </div>
                        </div>

                        {video.keyTakeaways && (
                          <div className="mb-3">
                            <p className="text-xs font-medium text-gray-700 mb-1">Key Takeaways:</p>
                            <ul className="text-xs text-gray-600 space-y-1">
                              {video.keyTakeaways.slice(0, 2).map((takeaway, index) => (
                                <li key={index} className="flex items-start gap-1">
                                  <span className="text-purple-600 mt-1">•</span>
                                  <span>{takeaway}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        <div className="flex flex-wrap gap-1 mb-3">
                          {video.tags.map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>

                        <div className="flex gap-2">
                          <Button className="flex-1" onClick={() => handleWatchVideo(video.url, video.id)}>
                            <Play className="w-4 h-4 mr-2" />
                            Watch
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleItemComplete(video.id, "video")}>
                            {completedItems[video.id] ? (
                              <CheckCircle className="w-4 h-4 text-green-600" />
                            ) : (
                              <div className="w-4 h-4 border-2 border-gray-300 rounded-full" />
                            )}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </TabsContent>

            <TabsContent value="masterclasses" className="mt-6">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {content.masterclasses
                  ?.filter((masterclass) => {
                    if (filter === "completed") return completedItems[masterclass.id]
                    if (filter === "remaining") return !completedItems[masterclass.id]
                    return true
                  })
                  .map((masterclass) => (
                    <Card key={masterclass.id} className="hover:shadow-lg transition-shadow relative">
                      {completedItems[masterclass.id] && (
                        <div className="absolute top-2 left-2 z-10">
                          <Badge className="bg-green-600 text-white">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Completed
                          </Badge>
                        </div>
                      )}
                      <div className="relative">
                        <img
                          src={masterclass.thumbnail || "/placeholder.svg"}
                          alt={masterclass.title}
                          className="w-full h-32 object-cover rounded-t-lg"
                        />
                        <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-xs">
                          {masterclass.duration}
                        </div>
                        <div className="absolute top-2 right-2">
                          <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                            MasterClass
                          </Badge>
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-semibold mb-2">{masterclass.title}</h3>
                        <p className="text-sm text-gray-600 mb-2">by {masterclass.instructor}</p>
                        <p className="text-xs text-gray-500 mb-3">{masterclass.description}</p>

                        <div className="flex items-center justify-between mb-3 text-xs text-gray-500">
                          <div className="flex items-center gap-1">
                            <BookOpen className="w-3 h-3" />
                            <span>{masterclass.lessons} lessons</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                            <span>{masterclass.rating}</span>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-1 mb-3">
                          {masterclass.tags.map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>

                        <div className="flex items-center justify-between mb-3">
                          <span className="text-lg font-bold text-purple-600">{masterclass.price}</span>
                          <Badge variant="outline" className="text-xs">
                            Premium
                          </Badge>
                        </div>

                        <div className="flex gap-2">
                          <Button className="flex-1" onClick={() => handleTakeMasterclass(masterclass.id)}>
                            <Award className="w-4 h-4 mr-2" />
                            Take Class
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleItemComplete(masterclass.id, "masterclass")}
                          >
                            {completedItems[masterclass.id] ? (
                              <CheckCircle className="w-4 h-4 text-green-600" />
                            ) : (
                              <div className="w-4 h-4 border-2 border-gray-300 rounded-full" />
                            )}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </TabsContent>

            <TabsContent value="courses" className="mt-6">
              <div className="grid md:grid-cols-2 gap-6">
                {content.courses
                  ?.filter((course) => {
                    if (filter === "completed") return completedItems[course.id]
                    if (filter === "remaining") return !completedItems[course.id]
                    return true
                  })
                  .map((course) => (
                    <Card key={course.id} className="hover:shadow-lg transition-shadow relative">
                      {completedItems[course.id] && (
                        <div className="absolute top-2 left-2 z-10">
                          <Badge className="bg-green-600 text-white">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Completed
                          </Badge>
                        </div>
                      )}
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h3 className="font-semibold mb-2">{course.title}</h3>
                            <p className="text-sm text-gray-600 mb-1">{course.provider}</p>
                            <p className="text-sm text-gray-600 mb-2">by {course.instructor}</p>
                            <p className="text-sm text-gray-500 mb-3">{course.description}</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-gray-400" />
                            <span>{course.duration}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-gray-400" />
                            <span>{course.weeks} weeks</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span>{course.rating}</span>
                          </div>
                          {course.certificate && (
                            <div className="flex items-center gap-2">
                              <Award className="w-4 h-4 text-purple-600" />
                              <span>Certificate</span>
                            </div>
                          )}
                        </div>

                        <div className="flex flex-wrap gap-1 mb-4">
                          {course.tags.map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>

                        <div className="flex items-center justify-between mb-4">
                          <span className="text-lg font-bold text-green-600">{course.price}</span>
                          {course.certificate && (
                            <Badge variant="outline" className="text-xs">
                              Certificate Available
                            </Badge>
                          )}
                        </div>

                        <div className="flex gap-2">
                          <Button className="flex-1" onClick={() => handleTakeCourse(course.id)}>
                            <ExternalLink className="w-4 h-4 mr-2" />
                            Enroll Now
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleItemComplete(course.id, "course")}>
                            {completedItems[course.id] ? (
                              <CheckCircle className="w-4 h-4 text-green-600" />
                            ) : (
                              <div className="w-4 h-4 border-2 border-gray-300 rounded-full" />
                            )}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </TabsContent>

            <TabsContent value="blogs" className="mt-6">
              <div className="space-y-4">
                {content.blogs
                  ?.filter((blog) => {
                    if (filter === "completed") return completedItems[blog.id]
                    if (filter === "remaining") return !completedItems[blog.id]
                    return true
                  })
                  .map((blog) => (
                    <Card key={blog.id} className="hover:shadow-lg transition-shadow relative">
                      {completedItems[blog.id] && (
                        <div className="absolute top-4 right-4 z-10">
                          <Badge className="bg-green-600 text-white">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Read
                          </Badge>
                        </div>
                      )}
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold">{blog.title}</h3>
                              <Badge className={getDifficultyColor(blog.difficulty)} variant="outline">
                                {blog.difficulty}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">by {blog.author}</p>
                            <p className="text-sm text-gray-500 mb-3">{blog.description}</p>
                          </div>
                          <div className="flex items-center gap-1 text-sm text-gray-500 ml-4">
                            <Clock className="w-4 h-4" />
                            <span>{blog.readTime}</span>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-1 mb-4">
                          {blog.tags.map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>

                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            className="flex-1"
                            onClick={() => handleReadBlog(blog.url, blog.id)}
                          >
                            <ExternalLink className="w-4 h-4 mr-2" />
                            Read Article
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleItemComplete(blog.id, "blog")}>
                            {completedItems[blog.id] ? (
                              <CheckCircle className="w-4 h-4 text-green-600" />
                            ) : (
                              <div className="w-4 h-4 border-2 border-gray-300 rounded-full" />
                            )}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </TabsContent>

            <TabsContent value="podcasts" className="mt-6">
              <div className="space-y-4">
                {content.podcasts
                  ?.filter((podcast) => {
                    if (filter === "completed") return completedItems[podcast.id]
                    if (filter === "remaining") return !completedItems[podcast.id]
                    return true
                  })
                  .map((podcast) => (
                    <Card key={podcast.id} className="hover:shadow-lg transition-shadow relative">
                      {completedItems[podcast.id] && (
                        <div className="absolute top-4 right-4 z-10">
                          <Badge className="bg-green-600 text-white">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Listened
                          </Badge>
                        </div>
                      )}
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h3 className="font-semibold mb-2">{podcast.title}</h3>
                            <p className="text-sm text-gray-600 mb-2">hosted by {podcast.host}</p>
                            <p className="text-sm text-gray-500 mb-3">{podcast.description}</p>
                          </div>
                          <div className="flex items-center gap-1 text-sm text-gray-500 ml-4">
                            <Clock className="w-4 h-4" />
                            <span>{podcast.duration}</span>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-1 mb-4">
                          {podcast.tags.map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>

                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            className="flex-1"
                            onClick={() => handleListenPodcast(podcast.url, podcast.id)}
                          >
                            <Headphones className="w-4 h-4 mr-2" />
                            Listen to Podcast
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleItemComplete(podcast.id, "podcast")}>
                            {completedItems[podcast.id] ? (
                              <CheckCircle className="w-4 h-4 text-green-600" />
                            ) : (
                              <div className="w-4 h-4 border-2 border-gray-300 rounded-full" />
                            )}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </TabsContent>

            <TabsContent value="books" className="mt-6">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {content.books
                  ?.filter((book) => {
                    if (filter === "completed") return completedItems[book.id]
                    if (filter === "remaining") return !completedItems[book.id]
                    return true
                  })
                  .map((book) => (
                    <Card key={book.id} className="hover:shadow-lg transition-shadow relative">
                      {completedItems[book.id] && (
                        <div className="absolute top-2 left-2 z-10">
                          <Badge className="bg-green-600 text-white">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Read
                          </Badge>
                        </div>
                      )}
                      <CardContent className="p-6">
                        <div className="flex gap-4 mb-4">
                          <img
                            src={book.cover || "/placeholder.svg"}
                            alt={book.title}
                            className="w-16 h-24 object-cover rounded"
                          />
                          <div className="flex-1">
                            <h3 className="font-semibold mb-1 line-clamp-2">{book.title}</h3>
                            <p className="text-sm text-gray-600 mb-1">by {book.author}</p>
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              <span>{book.pages} pages</span>
                              <div className="flex items-center gap-1">
                                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                <span>{book.rating}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <p className="text-sm text-gray-500 mb-3">{book.description}</p>

                        <div className="flex flex-wrap gap-1 mb-4">
                          {book.tags.map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>

                        <div className="flex gap-2">
                          <Button className="flex-1" onClick={() => handleViewBook(book.amazonUrl, book.id)}>
                            <ExternalLink className="w-4 h-4 mr-2" />
                            View on Amazon
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleItemComplete(book.id, "book")}>
                            {completedItems[book.id] ? (
                              <CheckCircle className="w-4 h-4 text-green-600" />
                            ) : (
                              <div className="w-4 h-4 border-2 border-gray-300 rounded-full" />
                            )}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
