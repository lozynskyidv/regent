#!/bin/bash

# Create demo account for Apple TestFlight review
# Email: dmy@gmail.com
# Password: 5Q69q25q

echo "Creating demo account in Supabase..."

curl -X POST 'https://jkseowelliyafkoizjzx.supabase.co/auth/v1/signup' \
  -H "apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imprc2Vvd2VsbGl5YWZrb2l6anp4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc3MDQ2MTgsImV4cCI6MjA4MzI4MDYxOH0.b_9GSk4jAUuiHQf01mGOMfhJb_2BIiYkOlCQVmSSCBY" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "dmy@gmail.com",
    "password": "5Q69q25q",
    "options": {
      "data": {
        "demo_account": true
      }
    }
  }'

echo -e "\n\nDemo account created!"
echo "Email: dmy@gmail.com"
echo "Password: 5Q69q25q"
