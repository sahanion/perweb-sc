/**
 * Supabase Keep-Alive Ping Script
 * Prevents Supabase Free Tier projects from pausing after 7 days of inactivity.
 * Pings the PostgREST API to register inbound traffic and database activity.
 */

import https from 'node:https'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// 1. Resolve Supabase URL & Anon Key from process.env or .env file
let supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL
let supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  const envPath = path.resolve(__dirname, '../.env')
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8')
    for (const line of envContent.split(/\r?\n/)) {
      const trimmed = line.trim()
      if (trimmed.startsWith('#') || !trimmed.includes('=')) continue
      const [key, ...rest] = trimmed.split('=')
      const val = rest.join('=').trim().replace(/^['"]|['"]$/g, '')
      if (key === 'VITE_SUPABASE_URL' && !supabaseUrl) supabaseUrl = val
      if (key === 'VITE_SUPABASE_ANON_KEY' && !supabaseAnonKey) supabaseAnonKey = val
    }
  }
}

// Fallback to project defaults if not provided in environment
if (!supabaseUrl) {
  supabaseUrl = 'https://rkfoduchimoydfqvqofw.supabase.co'
}
if (!supabaseAnonKey) {
  supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJrZm9kdWNoaW1veWRmcXZxb2Z3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTMxMTM3MDAsImV4cCI6MjEwODY4OTcwMH0.UdVg9MAzFTY1rXjV1t1z3-bALWpJGix5tDtntXwAfwg'
}

// Clean base URL
supabaseUrl = supabaseUrl.replace(/\/+$/, '')

const pingEndpoint = `${supabaseUrl}/rest/v1/collaborators?select=id&limit=1`
const startTime = Date.now()

console.log('--------------------------------------------------')
console.log('⚡ SUPABASE AUTO-PING KEEP-ALIVE')
console.log(`📡 Target Project: ${supabaseUrl}`)
console.log(`🕒 Timestamp: ${new Date().toISOString()}`)
console.log('--------------------------------------------------')

const urlObj = new URL(pingEndpoint)
const options = {
  hostname: urlObj.hostname,
  port: 443,
  path: urlObj.pathname + urlObj.search,
  method: 'GET',
  headers: {
    'apikey': supabaseAnonKey,
    'Authorization': `Bearer ${supabaseAnonKey}`,
    'User-Agent': 'Supabase-KeepAlive-Ping/1.0',
    'Accept': 'application/json'
  }
}

const req = https.request(options, (res) => {
  let body = ''
  res.on('data', (chunk) => { body += chunk })
  res.on('end', () => {
    const elapsed = Date.now() - startTime
    if (res.statusCode >= 200 && res.statusCode < 300) {
      console.log(`✅ Success! HTTP ${res.statusCode} in ${elapsed}ms`)
      console.log(`📊 Response: ${body.substring(0, 100)}`)
      console.log('🎉 Project activity registered. Inactivity countdown reset!')
      process.exit(0)
    } else {
      console.error(`⚠️ Ping returned status ${res.statusCode}: ${body}`)
      process.exit(1)
    }
  })
})

req.on('error', (err) => {
  console.error(`❌ Network error while pinging Supabase: ${err.message}`)
  process.exit(1)
})

req.setTimeout(15000, () => {
  req.destroy()
  console.error('❌ Ping timed out after 15 seconds')
  process.exit(1)
})

req.end()

