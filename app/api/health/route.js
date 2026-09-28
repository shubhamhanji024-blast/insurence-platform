import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectToDatabase from '@/lib/mongodb';

export const dynamic = 'force-dynamic';

export async function GET() {
  const envCheck = {
    hasMongodbUri: !!process.env.MONGODB_URI,
    hasAuthSecret: !!process.env.AUTH_SECRET,
    hasAdminEmail: !!process.env.ADMIN_EMAIL,
    hasAdminPassword: !!process.env.ADMIN_PASSWORD,
    isVercel: process.env.VERCEL === '1',
    nodeEnv: process.env.NODE_ENV,
  };

  let dbStatus = {
    connected: false,
    readyState: mongoose.connection.readyState,
  };

  try {
    const conn = await connectToDatabase();
    dbStatus = {
      connected: true,
      readyState: mongoose.connection.readyState,
      dbName: conn?.connection?.db?.databaseName || 'unknown',
    };
  } catch (err) {
    dbStatus = {
      connected: false,
      readyState: mongoose.connection.readyState,
      errorName: err.name,
      errorMessage: err.message,
      errorCode: err.code || null,
    };
  }

  const isHealthy = envCheck.hasMongodbUri && envCheck.hasAuthSecret && dbStatus.connected;

  return NextResponse.json(
    {
      status: isHealthy ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      env: envCheck,
      database: dbStatus,
    },
    { status: isHealthy ? 200 : 503 }
  );
}
