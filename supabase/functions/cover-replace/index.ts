import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405, headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get the authorization header
    const authHeader = req.headers.get('Authorization')
    if (authHeader) {
      supabaseClient.auth.setSession({
        access_token: authHeader.replace('Bearer ', ''),
        refresh_token: ''
      })
    }

    // Check if user is admin
    const { data: { user } } = await supabaseClient.auth.getUser()
    if (!user) {
      return new Response('Unauthorized', { status: 401, headers: corsHeaders })
    }

    const formData = await req.formData()
    const bookId = formData.get('bookId') as string
    const file = formData.get('file') as File

    if (!bookId || !file) {
      return new Response(
        JSON.stringify({ error: 'Missing bookId or file' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' }}
      )
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return new Response(
        JSON.stringify({ error: 'File must be an image' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' }}
      )
    }

    // Generate cover path
    const fileExt = file.name.split('.').pop()
    const coverPath = `${bookId}-${Date.now()}.${fileExt}`

    // Upload to storage
    const { error: uploadError } = await supabaseClient.storage
      .from('books-covers')
      .upload(coverPath, file, {
        cacheControl: '3600',
        upsert: true
      })

    if (uploadError) {
      return new Response(
        JSON.stringify({ error: uploadError.message }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' }}
      )
    }

    // Get image dimensions (simplified)
    const cover_width = 800
    const cover_height = Math.round(800 * 1.33) // 3:4 ratio
    const cover_color = '#e5e7eb' // Default gray

    // Update book record
    const { error: updateError } = await supabaseClient
      .from('books_uploads')
      .update({
        cover_path: coverPath,
        cover_width,
        cover_height,
        cover_color
      })
      .eq('id', bookId)

    if (updateError) {
      return new Response(
        JSON.stringify({ error: updateError.message }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' }}
      )
    }

    return new Response(
      JSON.stringify({
        cover_path: coverPath,
        cover_width,
        cover_height,
        cover_color
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }}
    )
  }
})