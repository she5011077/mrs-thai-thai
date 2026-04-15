import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

const TABLE = 'site_settings_thai';

export async function GET() {
  const { data, error } = await supabase.from(TABLE).select('*');
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  const settings: Record<string, string> = {};
  data?.forEach((row: { key: string; value: string }) => {
    settings[row.key] = row.value;
  });
  return NextResponse.json(settings);
}

export async function PUT(request: Request) {
  const body = await request.json();
  const { key, value } = body;

  if (!key) {
    return NextResponse.json({ error: 'key 為必填' }, { status: 400 });
  }

  const { error } = await supabase
    .from(TABLE)
    .upsert({ key, value: value || '' }, { onConflict: 'key' });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ success: true });
}
