'use client';

import { motion } from 'framer-motion';
import { Code, Palette, Cpu, Award } from 'lucide-react';
import GridBackground from '@/components/GridBackground';

export default function About() {
  const stats = [
    { label: 'Years Experience', value: '3+', icon: Award },
    { label: 'Projects Completed', value: '20+', icon: Code },
    { label: 'Technologies', value: '15+', icon: Cpu },
    { label: 'UI/UX Designs', value: '30+', icon: Palette },
  ];

  const skills = [
    { category: 'Frontend', items: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS'] },
    { category: 'Backend', items: ['Node.js', 'Python', 'MongoDB', 'PostgreSQL'] },
    { category: 'AI/ML', items: ['TensorFlow', 'PyTorch', 'NLP', 'Computer Vision'] },
    { category: 'Blockchain', items: ['Solidity', 'Web3.js', 'Smart Contracts', 'DApps'] },
    { category: 'Design', items: ['Figma', 'Illustrator', 'UI/UX', 'Prototyping'] },
    { category: 'Tools', items: ['Git', 'Docker', 'AWS', 'CI/CD'] },
  ];

  return (
    <div className="min-h-screen pt-24">
      <GridBackground />

      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-20 text-center"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-gray-900 dark:text-white">
            About <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Me</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Passionate about creating innovative solutions that bridge technology and user experience
          </p>
        </motion.div>

        {/* Bio Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-20"
        >
          <div className="p-8 md:p-12 rounded-3xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-lg border border-gray-200/50 dark:border-gray-700/50">
            <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Who I Am</h2>
            <div className="space-y-4 text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
              <p>
                I am <span className="font-semibold text-blue-600 dark:text-blue-400">Shubhsanket Sharma</span>, a Computer Science student and full-stack developer who builds real-world systems using AI, blockchain, and modern web technologies.
              </p>
              <p>
                I focus on designing and shipping practical applications — from backend logic and smart contract integration to clean, scalable frontends — with an emphasis on reliability, performance, and real-world usability.
              </p>
              <p>
                With over 3 years of experience in UI/UX design and development, I bring a unique perspective that combines technical expertise with design thinking to create solutions that are both powerful and user-friendly.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-20"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className="p-6 rounded-2xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 backdrop-blur-lg border border-blue-500/20 dark:border-blue-500/30 text-center hover:scale-105 transition-transform"
                >
                  <Icon className="w-8 h-8 mx-auto mb-3 text-blue-600 dark:text-blue-400" />
                  <div className="text-4xl font-bold mb-2 text-gray-900 dark:text-white">{stat.value}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Skills Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-20"
        >
          <h2 className="text-4xl font-bold mb-12 text-center text-gray-900 dark:text-white">
            Technical <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Skills</span>
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {skills.map((skillGroup, index) => (
              <motion.div
                key={skillGroup.category}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="p-6 rounded-2xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-lg border border-gray-200/50 dark:border-gray-700/50 hover:border-blue-500/50 transition-colors"
              >
                <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">{skillGroup.category}</h3>
                <div className="flex flex-wrap gap-2">
                  {skillGroup.items.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1.5 text-sm rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 text-gray-700 dark:text-gray-300"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Experience Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl font-bold mb-12 text-center text-gray-900 dark:text-white">
            Professional <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Journey</span>
          </h2>
          <div className="max-w-3xl mx-auto">
            <div className="relative pl-8 border-l-2 border-blue-500/30">
              <div className="mb-12">
                <div className="absolute -left-3 w-6 h-6 rounded-full bg-gradient-to-r from-blue-600 to-purple-600" />
                <div className="p-6 rounded-2xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-lg border border-gray-200/50 dark:border-gray-700/50">
                  <div className="text-sm text-blue-600 dark:text-blue-400 mb-2">2021 - Present</div>
                  <h3 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">UI/UX Designer & Developer</h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    Specialized in creating intuitive, user-centric designs and implementing them with modern web technologies. Expertise in design systems, prototyping, and crafting seamless user experiences across web and mobile platforms.
                  </p>
                </div>
              </div>
              <div className="mb-12">
                <div className="absolute -left-3 w-6 h-6 rounded-full bg-gradient-to-r from-purple-600 to-pink-600" />
                <div className="p-6 rounded-2xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-lg border border-gray-200/50 dark:border-gray-700/50">
                  <div className="text-sm text-purple-600 dark:text-purple-400 mb-2">2020 - 2021</div>
                  <h3 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">Full-Stack Development</h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    Focused on building scalable web applications using modern frameworks and technologies. Developed expertise in both frontend and backend development, database design, and API architecture.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}