#!/usr/bin/env python3
"""
Optional local helper for FindMyAI.
This script validates tools.json and can add a new listing.
It does NOT run a web server and is not needed to open the website.
"""
import json
from pathlib import Path
from urllib.parse import urlparse

DATA_FILE = Path(__file__).with_name("tools.json")

def load_tools():
    return json.loads(DATA_FILE.read_text(encoding="utf-8"))

def validate(tool):
    required = ["id", "name", "category", "pricing", "description", "bestFor", "url"]
    missing = [field for field in required if not tool.get(field)]
    if missing:
        raise ValueError("Missing required fields: " + ", ".join(missing))
    if tool["pricing"] not in {"Free", "Freemium", "Paid"}:
        raise ValueError("pricing must be Free, Freemium, or Paid")
    parsed = urlparse(tool["url"])
    if parsed.scheme not in {"http", "https"} or not parsed.netloc:
        raise ValueError("url must be a valid http/https URL")

def add_tool():
    tools = load_tools()
    tool = {
        "id": input("Unique id (e.g. my-ai-tool): ").strip(),
        "name": input("Tool name: ").strip(),
        "category": input("Category: ").strip(),
        "pricing": input("Pricing (Free/Freemium/Paid): ").strip(),
        "description": input("Short description: ").strip(),
        "bestFor": input("Best for: ").strip(),
        "url": input("Official website URL: ").strip(),
        "tags": [tag.strip() for tag in input("Tags (comma-separated): ").split(",") if tag.strip()],
        "featured": input("Mark as featured? (y/N): ").strip().lower() == "y"
    }
    validate(tool)
    if any(item["id"] == tool["id"] for item in tools):
        raise ValueError("That id already exists.")
    tools.append(tool)
    DATA_FILE.write_text(json.dumps(tools, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(f"Added {tool['name']}. tools.json now contains {len(tools)} listings.")

def main():
    tools = load_tools()
    print(f"FindMyAI data file: {DATA_FILE}")
    print(f"Current listings: {len(tools)}")
    choice = input("Type A to add a tool, or V to validate: ").strip().lower()
    if choice == "a":
        add_tool()
    else:
        for tool in tools:
            validate(tool)
        print("All tool listings passed basic validation.")

if __name__ == "__main__":
    main()
