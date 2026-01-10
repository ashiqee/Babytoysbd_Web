import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request: Request) {
  const { eventName, params } = await request.json();
  
  // Replace with your actual GA4 Measurement ID (from GA4 Admin > Data Streams)
  const measurementId = 'G-TWXQPLVXS1';  // e.g., G-ABC123XYZ
  

  console.log(params);
  

  const payload = {
    client_id: params?.clientId || 'default_client',
    events: [{
      name: eventName,
      params: { ...params, debug_mode: process.env.NODE_ENV === 'development' }
    }]
  };
  
  try {
    const response = await axios.post(
      `https://babytoysbd.com/som/mp/collect?measurement_id=${measurementId}`,
      payload,
      {
        headers: { 
          'Content-Type': 'application/json',  // Explicitly set for MP
          'User-Agent': request.headers.get('user-agent') || ''
        }
      }
    );
    console.log('GTM Server Response:', response.status, response.data);  // Add for debugging
  } catch (error: any) {
    console.error('Tracking failed:', error.response?.data || error.message);  // Log response.data for details
  }
  
  return NextResponse.json({ success: true });
}