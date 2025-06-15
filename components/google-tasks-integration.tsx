"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
  CheckCircle,
  Circle,
  CalendarIcon,
  Plus,
  Settings,
  FolderSyncIcon as Sync,
  ExternalLink,
  Edit,
  Trash2,
} from "lucide-react"
import { format } from "date-fns"

interface GoogleTasksIntegrationProps {
  path: any
}

export default function GoogleTasksIntegration({ path }: GoogleTasksIntegrationProps) {
  const [isConnected, setIsConnected] = useState(false)
  const [autoSync, setAutoSync] = useState(true)
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [isAddingTask, setIsAddingTask] = useState(false)
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    dueDate: new Date(),
  })
  const [tasks, setTasks] = useState([
    {
      id: "task-1",
      title: "Complete Module 1: Foundation Principles",
      description: "Watch all videos and complete the quiz",
      dueDate: new Date(2024, 1, 15),
      completed: true,
      synced: true,
    },
    {
      id: "task-2",
      title: "Read: The Almanack of Naval Ravikant (Chapters 1-3)",
      description: "Focus on wealth creation principles",
      dueDate: new Date(2024, 1, 18),
      completed: false,
      synced: true,
    },
    {
      id: "task-3",
      title: "Practice Exercise: Investment Portfolio Analysis",
      description: "Analyze a sample portfolio using learned principles",
      dueDate: new Date(2024, 1, 20),
      completed: false,
      synced: false,
    },
    {
      id: "task-4",
      title: "Watch: Warren Buffett's Investment Strategy",
      description: "Take notes on key investment principles",
      dueDate: new Date(2024, 1, 22),
      completed: false,
      synced: false,
    },
  ])

  const handleTaskToggle = (taskId: string) => {
    setTasks(tasks.map((task) => (task.id === taskId ? { ...task, completed: !task.completed } : task)))
  }

  const handleSyncToGoogle = () => {
    // Simulate syncing to Google Tasks
    setTasks(tasks.map((task) => ({ ...task, synced: true })))
    // In real implementation, this would call Google Tasks API
    alert("Tasks synced to Google Tasks successfully!")
  }

  const connectToGoogle = () => {
    // Simulate Google OAuth flow
    setIsConnected(true)
    alert("Successfully connected to Google Tasks!")
    // In real implementation, this would initiate OAuth flow
  }

  const handleAddTask = () => {
    if (!newTask.title.trim()) return

    const task = {
      id: `task-${Date.now()}`,
      title: newTask.title,
      description: newTask.description,
      dueDate: newTask.dueDate,
      completed: false,
      synced: autoSync,
    }

    setTasks([...tasks, task])
    setNewTask({ title: "", description: "", dueDate: new Date() })
    setIsAddingTask(false)

    if (autoSync) {
      alert("Task added and synced to Google Tasks!")
    } else {
      alert("Task added locally. Use 'Sync Now' to sync with Google Tasks.")
    }
  }

  const handleDeleteTask = (taskId: string) => {
    setTasks(tasks.filter((task) => task.id !== taskId))
    alert("Task deleted!")
  }

  const openGoogleTasks = () => {
    window.open("https://tasks.google.com", "_blank")
  }

  return (
    <div className="space-y-6">
      {/* Connection Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Google Tasks Integration
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!isConnected ? (
            <div className="text-center py-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ExternalLink className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-2">Connect to Google Tasks</h3>
              <p className="text-gray-600 mb-4">
                Sync your learning tasks with Google Tasks to stay organized across all your devices
              </p>
              <Button onClick={connectToGoogle}>Connect Google Account</Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="font-medium">Connected to Google Tasks</span>
                </div>
                <Badge variant="secondary">Active</Badge>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Auto-sync new tasks</p>
                  <p className="text-sm text-gray-600">Automatically create tasks in Google Tasks</p>
                </div>
                <Switch checked={autoSync} onCheckedChange={setAutoSync} />
              </div>

              <div className="flex gap-2">
                <Button onClick={handleSyncToGoogle} variant="outline">
                  <Sync className="w-4 h-4 mr-2" />
                  Sync Now
                </Button>
                <Button variant="outline" onClick={openGoogleTasks}>
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Open Google Tasks
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Task Management */}
      {isConnected && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Learning Tasks</span>
              <Dialog open={isAddingTask} onOpenChange={setIsAddingTask}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Task
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Learning Task</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Task Title</label>
                      <Input
                        value={newTask.title}
                        onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                        placeholder="Enter task title..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Description</label>
                      <Textarea
                        value={newTask.description}
                        onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                        placeholder="Enter task description..."
                        rows={3}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Due Date</label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full justify-start">
                            <CalendarIcon className="w-4 h-4 mr-2" />
                            {format(newTask.dueDate, "PPP")}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={newTask.dueDate}
                            onSelect={(date) => date && setNewTask({ ...newTask, dueDate: date })}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={handleAddTask} className="flex-1">
                        Add Task
                      </Button>
                      <Button variant="outline" onClick={() => setIsAddingTask(false)} className="flex-1">
                        Cancel
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {tasks.map((task) => (
                <div key={task.id} className="flex items-start gap-3 p-4 border rounded-lg">
                  <button onClick={() => handleTaskToggle(task.id)} className="mt-1">
                    {task.completed ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <Circle className="w-5 h-5 text-gray-400" />
                    )}
                  </button>

                  <div className="flex-1">
                    <h4 className={`font-medium ${task.completed ? "line-through text-gray-500" : ""}`}>
                      {task.title}
                    </h4>
                    <p className="text-sm text-gray-600 mt-1">{task.description}</p>

                    <div className="flex items-center gap-4 mt-2">
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <CalendarIcon className="w-4 h-4" />
                        <span>Due {format(task.dueDate, "MMM d")}</span>
                      </div>

                      <Badge variant={task.synced ? "secondary" : "outline"} className="text-xs">
                        {task.synced ? "Synced" : "Pending sync"}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex gap-1">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <CalendarIcon className="w-4 h-4" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar mode="single" selected={selectedDate} onSelect={setSelectedDate} initialFocus />
                      </PopoverContent>
                    </Popover>
                    <Button variant="ghost" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDeleteTask(task.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Task Statistics */}
      {isConnected && (
        <Card>
          <CardHeader>
            <CardTitle>Task Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{tasks.filter((t) => t.completed).length}</div>
                <div className="text-sm text-gray-600">Completed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{tasks.filter((t) => !t.completed).length}</div>
                <div className="text-sm text-gray-600">Remaining</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{tasks.filter((t) => t.synced).length}</div>
                <div className="text-sm text-gray-600">Synced</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {Math.round((tasks.filter((t) => t.completed).length / tasks.length) * 100)}%
                </div>
                <div className="text-sm text-gray-600">Progress</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
