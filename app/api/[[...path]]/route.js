import { MongoClient } from 'mongodb';
import { v4 as uuidv4 } from 'uuid';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

let cachedClient = null;
let cachedDb = null;

async function connectToDatabase() {
  if (cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  const client = await MongoClient.connect(process.env.MONGO_URL);
  const db = client.db(process.env.DB_NAME);

  cachedClient = client;
  cachedDb = db;

  return { client, db };
}

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
  return new Response(null, { headers: corsHeaders });
}

export async function GET(request, { params }) {
  try {
    const { db } = await connectToDatabase();
    const path = params.path ? params.path.join('/') : '';
    const { searchParams } = new URL(request.url);

    // Get all projects
    if (path === 'projects') {
      const projects = await db.collection('projects').find({}).sort({ featured: -1, createdAt: -1 }).toArray();
      return Response.json({ success: true, data: projects }, { headers: corsHeaders });
    }

    // Get single project
    if (path.startsWith('projects/')) {
      const id = path.split('/')[1];
      const project = await db.collection('projects').findOne({ id });
      if (!project) {
        return Response.json({ success: false, error: 'Project not found' }, { status: 404, headers: corsHeaders });
      }
      return Response.json({ success: true, data: project }, { headers: corsHeaders });
    }

    // Get all contacts (admin only)
    if (path === 'contacts') {
      const password = searchParams.get('password');
      if (password !== process.env.ADMIN_PASSWORD) {
        return Response.json({ success: false, error: 'Unauthorized' }, { status: 401, headers: corsHeaders });
      }
      const contacts = await db.collection('contacts').find({}).sort({ createdAt: -1 }).toArray();
      return Response.json({ success: true, data: contacts }, { headers: corsHeaders });
    }

    // Get stats
    if (path === 'stats') {
      const projectCount = await db.collection('projects').countDocuments();
      const contactCount = await db.collection('contacts').countDocuments();
      return Response.json({ 
        success: true, 
        data: { 
          projects: projectCount, 
          contacts: contactCount,
          experience: 3
        } 
      }, { headers: corsHeaders });
    }

    return Response.json({ success: false, error: 'Not found' }, { status: 404, headers: corsHeaders });
  } catch (error) {
    console.error('GET Error:', error);
    return Response.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders });
  }
}

export async function POST(request, { params }) {
  try {
    const { db } = await connectToDatabase();
    const path = params.path ? params.path.join('/') : '';
    const body = await request.json();

    // Create contact submission
    if (path === 'contact') {
      const { name, email, message } = body;
      
      if (!name || !email || !message) {
        return Response.json({ success: false, error: 'All fields are required' }, { status: 400, headers: corsHeaders });
      }

      const contact = {
        id: uuidv4(),
        name,
        email,
        message,
        createdAt: new Date().toISOString()
      };

      await db.collection('contacts').insertOne(contact);

      // Send email via Resend
      try {
        await resend.emails.send({
          from: process.env.FROM_EMAIL,
          to: process.env.TO_EMAIL,
          subject: `Portfolio Contact: ${name}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #333;">New Contact Form Submission</h2>
              <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Message:</strong></p>
                <p style="white-space: pre-wrap;">${message}</p>
              </div>
              <p style="color: #666; font-size: 12px;">Received at: ${new Date().toLocaleString()}</p>
            </div>
          `
        });
      } catch (emailError) {
        console.error('Email sending failed:', emailError);
        // Continue even if email fails
      }

      return Response.json({ success: true, data: contact }, { headers: corsHeaders });
    }

    // Create project (admin only)
    if (path === 'projects') {
      const { password, ...projectData } = body;
      
      if (password !== process.env.ADMIN_PASSWORD) {
        return Response.json({ success: false, error: 'Unauthorized' }, { status: 401, headers: corsHeaders });
      }

      const project = {
        id: uuidv4(),
        ...projectData,
        createdAt: new Date().toISOString()
      };

      await db.collection('projects').insertOne(project);
      return Response.json({ success: true, data: project }, { headers: corsHeaders });
    }

    return Response.json({ success: false, error: 'Not found' }, { status: 404, headers: corsHeaders });
  } catch (error) {
    console.error('POST Error:', error);
    return Response.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders });
  }
}

export async function PUT(request, { params }) {
  try {
    const { db } = await connectToDatabase();
    const path = params.path ? params.path.join('/') : '';
    const body = await request.json();

    // Update project (admin only)
    if (path.startsWith('projects/')) {
      const id = path.split('/')[1];
      const { password, ...projectData } = body;
      
      if (password !== process.env.ADMIN_PASSWORD) {
        return Response.json({ success: false, error: 'Unauthorized' }, { status: 401, headers: corsHeaders });
      }

      const result = await db.collection('projects').updateOne(
        { id },
        { $set: { ...projectData, updatedAt: new Date().toISOString() } }
      );

      if (result.matchedCount === 0) {
        return Response.json({ success: false, error: 'Project not found' }, { status: 404, headers: corsHeaders });
      }

      const updatedProject = await db.collection('projects').findOne({ id });
      return Response.json({ success: true, data: updatedProject }, { headers: corsHeaders });
    }

    return Response.json({ success: false, error: 'Not found' }, { status: 404, headers: corsHeaders });
  } catch (error) {
    console.error('PUT Error:', error);
    return Response.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { db } = await connectToDatabase();
    const path = params.path ? params.path.join('/') : '';
    const { searchParams } = new URL(request.url);
    const password = searchParams.get('password');

    if (password !== process.env.ADMIN_PASSWORD) {
      return Response.json({ success: false, error: 'Unauthorized' }, { status: 401, headers: corsHeaders });
    }

    // Delete project (admin only)
    if (path.startsWith('projects/')) {
      const id = path.split('/')[1];
      const result = await db.collection('projects').deleteOne({ id });

      if (result.deletedCount === 0) {
        return Response.json({ success: false, error: 'Project not found' }, { status: 404, headers: corsHeaders });
      }

      return Response.json({ success: true, message: 'Project deleted' }, { headers: corsHeaders });
    }

    return Response.json({ success: false, error: 'Not found' }, { status: 404, headers: corsHeaders });
  } catch (error) {
    console.error('DELETE Error:', error);
    return Response.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders });
  }
}