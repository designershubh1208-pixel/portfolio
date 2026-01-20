'use client';

import { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Github, Instagram, Mail, Moon, Sun, ExternalLink, Plus, Edit, Trash2, X, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

export default function Portfolio() {
  const [theme, setTheme] = useState('dark');
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [editingProject, setEditingProject] = useState(null);
  const [projectForm, setProjectForm] = useState({
    title: '',
    description: '',
    features: '',
    techStack: '',
    category: '',
    link: '',
    featured: false
  });
  
  const { toast } = useToast();
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.8]);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setTheme(savedTheme);
    document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/projects');
      const data = await response.json();
      if (data.success) {
        setProjects(data.data);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contactForm)
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Message sent!",
          description: "Thanks for reaching out. I'll get back to you soon!",
        });
        setContactForm({ name: '', email: '', message: '' });
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to send message",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleAdminLogin = () => {
    if (adminPassword === 'admin123') {
      setIsAdmin(true);
      toast({
        title: "Admin Access Granted",
        description: "You can now manage projects",
      });
    } else {
      toast({
        title: "Access Denied",
        description: "Incorrect password",
        variant: "destructive"
      });
    }
  };

  const handleProjectSubmit = async (e) => {
    e.preventDefault();
    
    const projectData = {
      ...projectForm,
      features: projectForm.features.split('\n').filter(f => f.trim()),
      techStack: projectForm.techStack.split(',').map(t => t.trim()),
      password: adminPassword
    };

    try {
      const url = editingProject ? `/api/projects/${editingProject.id}` : '/api/projects';
      const method = editingProject ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(projectData)
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: editingProject ? "Project Updated" : "Project Created",
          description: "Project saved successfully",
        });
        fetchProjects();
        setProjectForm({
          title: '',
          description: '',
          features: '',
          techStack: '',
          category: '',
          link: '',
          featured: false
        });
        setEditingProject(null);
      } else {
        toast({
          title: "Error",
          description: data.error,
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save project",
        variant: "destructive"
      });
    }
  };

  const handleDeleteProject = async (id) => {
    if (!confirm('Are you sure you want to delete this project?')) return;

    try {
      const response = await fetch(`/api/projects/${id}?password=${adminPassword}`, {
        method: 'DELETE'
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Project Deleted",
          description: "Project removed successfully",
        });
        fetchProjects();
      } else {
        toast({
          title: "Error",
          description: data.error,
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete project",
        variant: "destructive"
      });
    }
  };

  const handleEditProject = (project) => {
    setEditingProject(project);
    setProjectForm({
      title: project.title,
      description: project.description,
      features: project.features.join('\n'),
      techStack: project.techStack.join(', '),
      category: project.category,
      link: project.link || '',
      featured: project.featured || false
    });
  };

  const skills = [
    { name: 'React', level: 95 },
    { name: 'Next.js', level: 90 },
    { name: 'Node.js', level: 85 },
    { name: 'JavaScript', level: 95 },
    { name: 'Python', level: 80 },
    { name: 'Figma', level: 90 },
    { name: 'Illustrator', level: 85 }
  ];

  return (
    <div className={`min-h-screen transition-colors duration-300 ${theme === 'dark' ? 'bg-black text-white' : 'bg-white text-black'}`}>
      {/* Fixed Theme Toggle */}
      <motion.button
        onClick={toggleTheme}
        className="fixed top-6 right-6 z-50 p-3 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg hover:shadow-xl transition-all"
        whileHover={{ scale: 1.1, rotate: 180 }}
        whileTap={{ scale: 0.9 }}
      >
        {theme === 'dark' ? <Sun className="w-5 h-5 text-white" /> : <Moon className="w-5 h-5 text-white" />}
      </motion.button>

      {/* Admin Toggle */}
      {!isAdmin && (
        <Dialog>
          <DialogTrigger asChild>
            <motion.button
              className="fixed top-6 right-20 z-50 px-4 py-2 text-sm rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg"
              whileHover={{ scale: 1.05 }}
            >
              Admin
            </motion.button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Admin Access</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                type="password"
                placeholder="Admin Password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAdminLogin()}
              />
              <Button onClick={handleAdminLogin} className="w-full">Login</Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Hero Section */}
      <motion.section
        style={{ opacity, scale }}
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
      >
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-3xl"
            animate={{
              x: [0, 100, 0],
              y: [0, -100, 0],
              scale: [1, 1.2, 1]
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl"
            animate={{
              x: [0, -100, 0],
              y: [0, 100, 0],
              scale: [1, 1.3, 1]
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.h1
              className="text-6xl md:text-8xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500"
              animate={{ backgroundPosition: ['0%', '100%', '0%'] }}
              transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
              style={{ backgroundSize: '200% auto' }}
            >
              Shubhsanket Sharma
            </motion.h1>
            <motion.p
              className="text-xl md:text-2xl mb-8 text-gray-400"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              Full-Stack Developer | AI/ML Engineer | UI/UX Designer
            </motion.p>
            <motion.div
              className="flex gap-4 justify-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              <Button variant="outline" size="lg" asChild className="rounded-full">
                <a href="https://github.com/designershubh1208-pixel" target="_blank" rel="noopener noreferrer">
                  <Github className="mr-2 h-5 w-5" /> GitHub
                </a>
              </Button>
              <Button variant="outline" size="lg" asChild className="rounded-full">
                <a href="https://www.instagram.com/webtech_shubh/" target="_blank" rel="noopener noreferrer">
                  <Instagram className="mr-2 h-5 w-5" /> Instagram
                </a>
              </Button>
              <Button variant="outline" size="lg" asChild className="rounded-full">
                <a href="#contact">
                  <Mail className="mr-2 h-5 w-5" /> Contact
                </a>
              </Button>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
            className="text-4xl"
          >
            <motion.span
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              ↓
            </motion.span>
          </motion.div>
        </div>
      </motion.section>

      {/* About Section */}
      <section id="about" className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-5xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500">
              About Me
            </h2>
            <Card className="p-8 backdrop-blur-lg bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/20">
              <p className="text-lg leading-relaxed text-gray-300">
                I am Shubhsanket Sharma and I'm a Computer Science student and full-stack developer who builds real-world systems using AI, blockchain, and modern web technologies.
                I focus on designing and shipping practical applications — from backend logic and smart contract integration to clean, scalable frontends — with an emphasis on reliability, performance, and real-world usability.
              </p>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Experience Section */}
      <section id="experience" className="py-20 px-6 bg-gradient-to-b from-transparent to-purple-900/10">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-5xl font-bold mb-12 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-cyan-500">
              Experience
            </h2>
            <Card className="p-8 backdrop-blur-lg bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-blue-500/20">
              <div className="flex items-start gap-6">
                <div className="w-2 h-full bg-gradient-to-b from-blue-500 to-cyan-500 rounded-full" />
                <div>
                  <h3 className="text-2xl font-bold mb-2">UI/UX Designer & Developer</h3>
                  <p className="text-purple-400 mb-4">3 Years Experience</p>
                  <p className="text-gray-300 leading-relaxed">
                    Specialized in creating intuitive, user-centric designs and implementing them with modern web technologies. 
                    Expertise in design systems, prototyping, and crafting seamless user experiences across web and mobile platforms.
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-5xl font-bold mb-12 bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-500">
              Skills
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {skills.map((skill, index) => (
                <motion.div
                  key={skill.name}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                >
                  <Card className="p-6 backdrop-blur-lg bg-gradient-to-br from-pink-500/10 to-purple-500/10 border-pink-500/20">
                    <div className="flex justify-between mb-2">
                      <span className="font-semibold text-lg">{skill.name}</span>
                      <span className="text-purple-400">{skill.level}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-pink-500 to-purple-500 rounded-full"
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.level}%` }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 + 0.2, duration: 1, ease: "easeOut" }}
                      />
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-20 px-6 bg-gradient-to-b from-purple-900/10 to-transparent">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex justify-between items-center mb-12">
              <h2 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-500 to-blue-500">
                Projects
              </h2>
              {isAdmin && (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="bg-gradient-to-r from-purple-500 to-pink-500">
                      <Plus className="mr-2 h-4 w-4" /> Add Project
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>{editingProject ? 'Edit Project' : 'Add New Project'}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleProjectSubmit} className="space-y-4">
                      <div>
                        <Label>Title</Label>
                        <Input
                          value={projectForm.title}
                          onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <Label>Description</Label>
                        <Textarea
                          value={projectForm.description}
                          onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                          rows={3}
                          required
                        />
                      </div>
                      <div>
                        <Label>Features (one per line)</Label>
                        <Textarea
                          value={projectForm.features}
                          onChange={(e) => setProjectForm({ ...projectForm, features: e.target.value })}
                          rows={5}
                          required
                        />
                      </div>
                      <div>
                        <Label>Tech Stack (comma separated)</Label>
                        <Input
                          value={projectForm.techStack}
                          onChange={(e) => setProjectForm({ ...projectForm, techStack: e.target.value })}
                          placeholder="React, Node.js, MongoDB"
                          required
                        />
                      </div>
                      <div>
                        <Label>Category</Label>
                        <Input
                          value={projectForm.category}
                          onChange={(e) => setProjectForm({ ...projectForm, category: e.target.value })}
                          placeholder="AI/ML, Web Development, etc."
                          required
                        />
                      </div>
                      <div>
                        <Label>Link (optional)</Label>
                        <Input
                          value={projectForm.link}
                          onChange={(e) => setProjectForm({ ...projectForm, link: e.target.value })}
                          placeholder="https://..."
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={projectForm.featured}
                          onCheckedChange={(checked) => setProjectForm({ ...projectForm, featured: checked })}
                        />
                        <Label>Featured Project</Label>
                      </div>
                      <Button type="submit" className="w-full">
                        {editingProject ? 'Update Project' : 'Create Project'}
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>
              )}
            </div>

            {loading ? (
              <div className="text-center py-20">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-8">
                {projects.map((project, index) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                  >
                    <Card className="p-8 backdrop-blur-lg bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border-cyan-500/20 hover:border-cyan-500/50 transition-all group relative overflow-hidden">
                      {/* Animated background on hover */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity"
                        animate={{
                          backgroundPosition: ['0% 0%', '100% 100%']
                        }}
                        transition={{ duration: 3, repeat: Infinity, repeatType: 'reverse' }}
                      />
                      
                      <div className="relative z-10">
                        <div className="flex justify-between items-start mb-4">
                          <h3 className="text-2xl font-bold text-cyan-400 group-hover:text-cyan-300 transition-colors">
                            {project.title}
                          </h3>
                          {isAdmin && (
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleEditProject(project)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleDeleteProject(project.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          )}
                        </div>
                        <p className="text-gray-400 mb-4">{project.description}</p>
                        <div className="mb-4">
                          <h4 className="font-semibold text-blue-400 mb-2">Key Features:</h4>
                          <ul className="space-y-1 text-sm text-gray-300">
                            {project.features?.slice(0, 4).map((feature, i) => (
                              <li key={i} className="flex items-start">
                                <span className="text-cyan-500 mr-2">▹</span>
                                {feature}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {project.techStack?.map((tech, i) => (
                            <span
                              key={i}
                              className="px-3 py-1 text-xs rounded-full bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 text-cyan-300"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                        {project.link && (
                          <Button variant="outline" size="sm" asChild className="mt-2">
                            <a href={project.link} target="_blank" rel="noopener noreferrer">
                              View Project <ExternalLink className="ml-2 h-3 w-3" />
                            </a>
                          </Button>
                        )}
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-6">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-5xl font-bold mb-12 text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500">
              Get In Touch
            </h2>
            <Card className="p-8 backdrop-blur-lg bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/20">
              <form onSubmit={handleContactSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={contactForm.name}
                    onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                    required
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={contactForm.email}
                    onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                    required
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    value={contactForm.message}
                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                    required
                    rows={5}
                    className="mt-2"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                >
                  {submitting ? 'Sending...' : 'Send Message'}
                </Button>
              </form>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-gray-800">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-gray-400 mb-4">
            © 2025 Shubhsanket Sharma. Built with Next.js & MongoDB
          </p>
          <div className="flex gap-4 justify-center">
            <a href="mailto:designershubh1208@gmail.com" className="text-gray-400 hover:text-purple-500 transition-colors">
              <Mail className="h-5 w-5" />
            </a>
            <a href="https://github.com/designershubh1208-pixel" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-purple-500 transition-colors">
              <Github className="h-5 w-5" />
            </a>
            <a href="https://www.instagram.com/webtech_shubh/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-purple-500 transition-colors">
              <Instagram className="h-5 w-5" />
            </a>
          </div>
        </div>
      </footer>

      <Toaster />
    </div>
  );
}