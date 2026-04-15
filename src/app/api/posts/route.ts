import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

const TABLE = 'threads_posts_thai';

export async function GET() {
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .order('day_number', { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const body = await request.json();
  const { day_number, content, images, status, feedback, link } = body;

  if (!content || !day_number) {
    return NextResponse.json({ error: '內容和天數為必填' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from(TABLE)
    .insert({
      day_number,
      content,
      images: images || [],
      status: status || 'pending',
      feedback: feedback || '',
      link: link || '',
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data, { status: 201 });
}
