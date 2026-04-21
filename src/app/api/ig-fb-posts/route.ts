import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

const TABLE = 'ig_fb_posts_thai';

export async function GET() {
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .order('post_number', { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const body = await request.json();
  const { post_number, month, content, images, status, feedback, link, design_note } = body;

  if (!content || !post_number) {
    return NextResponse.json({ error: '內容和編號為必填' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from(TABLE)
    .insert({
      post_number,
      month: month || '',
      content,
      images: images || [],
      status: status || 'pending',
      feedback: feedback || '',
      link: link || '',
      design_note: design_note || '',
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data, { status: 201 });
}
