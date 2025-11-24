#!/usr/bin/env bash
# Public-only API smoke tests for Company and JobPost controllers
# Requires: curl, jq
set -euo pipefail

BASE_URL="${BASE_URL:-http://localhost:8080}"

# Replace these placeholders with real IDs from your DB if available
COMPANY_ID="${COMPANY_ID:-01a1d94f-4e0e-7c5b-8d0f-4e0e7c5b8d0f}"
JOBPOST_ID="${JOBPOST_ID:-00000000-0000-0000-0000-000000000000}"
TAG_NAME="${TAG_NAME:-java}"

echo "== Company: GET by id =="
curl -s "$BASE_URL/api/company/get-by-id/$COMPANY_ID" | jq .

echo
echo "== Company: get-by-most-vacancy (optional tag) =="
curl -s "$BASE_URL/api/company/get-by-most-vacancy?tagName=$TAG_NAME" | jq .

echo
echo "== Company: filter (POST) =="
curl -s -X POST "$BASE_URL/api/company/filter" \
  -H "Content-Type: application/json" \
  -d '{"name":"Acme","website":"","size":null}' | jq .

# echo
# echo "== JobPost: GET by id =="
# curl -s "$BASE_URL/api/job_posts/$JOBPOST_ID" | jq .

echo
echo "== JobPost: get by company id =="
curl -s "$BASE_URL/api/job_posts/by-company/$COMPANY_ID" | jq .

echo
echo "== JobPost: top by vacancies =="
curl -s "$BASE_URL/api/job_posts/top-job-post-by-vacancies?page=0&size=10" | jq .

echo
echo "== JobPost: recent (by creation time) =="
curl -s "$BASE_URL/api/job_posts/top-job-post-by-creation-time?page=0&size=10" | jq .

echo
echo "== JobPost: filter (POST) =="
curl -s -X POST "$BASE_URL/api/job_posts/filter" \
  -H "Content-Type: application/json" \
  -d '{"title":"Developer","location":"Hanoi","jobType":"","companyId":null,"minSalary":null,"maxSalary":null}' | jq .

# echo
# echo "== JobPost: by tag name =="
# curl -s "$BASE_URL/api/job_posts/by-tag-name?tagName=$TAG_NAME&page=0&size=10" | jq .

echo
echo "NOTE: Course endpoints are not public in SecurityConfig; skipped."
