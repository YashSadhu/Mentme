"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, ArrowRight, CheckCircle, Play, Settings, Users } from "lucide-react"

interface QuickStartGuideProps {
  onBack: () => void
}

const steps = [
  {
    title: "Choose Your Mentor",
    description: "Browse our collection of AI mentors across different fields and expertise areas.",
    icon: Users,
    tips: [
      "Start with popular mentors if you're unsure",
      "Check mentor ratings and session counts",
      "Read mentor descriptions to find the best match",
    ],
  },
  {
    title: "Fine-tune Your Experience",
    description: "Customize the conversation style to match your learning preferences.",
    icon: Settings,
    tips: [
      "Adjust tone from casual to professional",
      "Set fun factor for engagement level",
      "Control seriousness and practical focus",
      "Test different settings to find your preference",
    ],
  },
  {
    title: "Start Your Session",
    description: "Begin your mentoring conversation with personalized guidance.",
    icon: Play,
    tips: [
      "Ask specific questions for better responses",
      "Share context about your situation",
      "Use voice features for natural conversation",
      "Take notes on key insights",
    ],
  },
]

export default function QuickStartGuide({ onBack }: QuickStartGuideProps) {
  const [currentStep, setCurrentStep] = useState(0)

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
            <h1 className="text-2xl font-bold">Quick Start Guide</h1>
          </div>
          <Badge variant="outline">
            Step {currentStep + 1} of {steps.length}
          </Badge>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white border-b border-gray-200 px-4 py-2">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center">
            {steps.map((_, index) => (
              <div key={index} className="flex items-center flex-1">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    index <= currentStep ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-400"
                  }`}
                >
                  {index < currentStep ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    <span className="text-sm font-medium">{index + 1}</span>
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-1 mx-2 ${index < currentStep ? "bg-blue-600" : "bg-gray-200"}`} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto p-6">
        <Card className="mb-6">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              {React.createElement(steps[currentStep].icon, { className: "w-8 h-8 text-blue-600" })}
            </div>
            <CardTitle className="text-2xl">{steps[currentStep].title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 text-center mb-6 text-lg">{steps[currentStep].description}</p>

            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="font-semibold text-blue-900 mb-3">💡 Pro Tips:</h3>
              <ul className="space-y-2">
                {steps[currentStep].tips.map((tip, index) => (
                  <li key={index} className="flex items-start gap-2 text-blue-800">
                    <CheckCircle className="w-4 h-4 mt-0.5 text-blue-600 flex-shrink-0" />
                    <span className="text-sm">{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button variant="outline" onClick={prevStep} disabled={currentStep === 0}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>

          {currentStep === steps.length - 1 ? (
            <Button onClick={onBack} className="bg-green-600 hover:bg-green-700">
              <CheckCircle className="w-4 h-4 mr-2" />
              Get Started
            </Button>
          ) : (
            <Button onClick={nextStep}>
              Next
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>

        {/* Additional Resources */}
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Play className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold mb-2">Try Demo</h3>
              <p className="text-sm text-gray-600 mb-4">Experience the platform with our interactive demo</p>
              <Button variant="outline" size="sm">
                Start Demo
              </Button>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold mb-2">Browse Mentors</h3>
              <p className="text-sm text-gray-600 mb-4">Explore our full collection of AI mentors</p>
              <Button variant="outline" size="sm">
                View All
              </Button>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Settings className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="font-semibold mb-2">Fine-tune Settings</h3>
              <p className="text-sm text-gray-600 mb-4">Customize your mentoring experience</p>
              <Button variant="outline" size="sm">
                Configure
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
