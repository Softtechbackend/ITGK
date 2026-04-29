import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.SUPABASE_SERVICE_ROLE_KEY || ''
    );

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const templateType = formData.get('templateType') as string || 'general';

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    if (!file.name.endsWith('.docx')) {
      return NextResponse.json(
        { error: 'Only .docx files are supported' },
        { status: 400 }
      );
    }

    const buffer = await file.arrayBuffer();
    const fileName = `templates/${templateType}/${Date.now()}_${file.name}`;

    // Upload to Supabase storage
    const { data, error } = await supabase
      .storage
      .from('templates')
      .upload(fileName, buffer, {
        contentType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      });

    if (error) {
      return NextResponse.json(
        { error: `Failed to upload template: ${error.message}` },
        { status: 500 }
      );
    }

    // Save template metadata to database
    const { error: dbError } = await supabase
      .from('templates')
      .insert({
        name: file.name,
        file_path: fileName,
        template_type: templateType,
        file_size: file.size,
        uploaded_by: request.headers.get('x-user-id'),
        created_at: new Date().toISOString(),
      });

    if (dbError) {
      return NextResponse.json(
        { error: `Failed to save template metadata: ${dbError.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Template uploaded successfully',
      file: data,
    });
  } catch (error) {
    return NextResponse.json(
      { error: `Server error: ${error}` },
      { status: 500 }
    );
  }
}
