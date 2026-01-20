const { MongoClient } = require('mongodb');
const { v4: uuidv4 } = require('uuid');

async function seedProjects() {
  const client = await MongoClient.connect('mongodb://localhost:27017');
  const db = client.db('portfolio_db');

  const projects = [
    {
      id: uuidv4(),
      title: 'AI Gaming Chat - TinyLLaMA QLoRA',
      description: 'A real-time gaming chat web application powered by a TinyLLaMA model fine-tuned using QLoRA (Parameter-Efficient Fine-Tuning). The system enables low-latency, interactive AI conversations suitable for game NPCs, assistants, or immersive AI-driven gameplay.',
      features: [
        'QLoRA-based fine-tuning on TinyLLaMA (memory efficient)',
        'Real-time chat inference (low latency)',
        'Web-based chat interface',
        'Designed for AI-powered gaming / NPC interactions',
        'Modular separation of model, inference, and web UI',
        'Parameter-Efficient Fine-Tuning (PEFT)',
        'The base TinyLLaMA model remains frozen',
        'LoRA adapters are trained instead of full model weights',
        'QLoRA enables 4-bit quantization of the base model',
        'Low VRAM usage and faster experimentation'
      ],
      techStack: ['Python', 'PyTorch', 'Hugging Face Transformers', 'PEFT', 'TinyLLaMA', 'WebSockets', 'HTML', 'CSS', 'JavaScript'],
      category: 'AI/ML',
      featured: true,
      createdAt: new Date().toISOString()
    },
    {
      id: uuidv4(),
      title: 'DealSign Platform - Blockchain Contract Management',
      description: 'A comprehensive platform for digital contract management with AI analysis and blockchain verification. Features smart contract integration, AI-powered contract analysis, and secure document management.',
      features: [
        'Blockchain smart contract integration using Hardhat',
        'AI-powered contract analysis and risk scoring',
        'Real-time contract verification on blockchain',
        'PostgreSQL database with Prisma ORM',
        'Role-based access control (Admin, Legal, Manager)',
        'Document upload and management (PDF, DOCX)',
        'Contract clause extraction using NLP',
        'Transaction hash and block verification',
        'RESTful API backend with Node.js',
        'Modern Next.js frontend with responsive design'
      ],
      techStack: ['Next.js', 'Node.js', 'PostgreSQL', 'Prisma', 'Hardhat', 'Solidity', 'Python', 'FastAPI', 'Spacy', 'Docker', 'TypeScript'],
      category: 'Blockchain & AI',
      featured: true,
      createdAt: new Date().toISOString()
    }
  ];

  // Clear existing projects
  await db.collection('projects').deleteMany({});
  
  // Insert new projects
  await db.collection('projects').insertMany(projects);

  console.log('Projects seeded successfully!');
  await client.close();
}

seedProjects().catch(console.error);
