import json
import time
import requests
from abc import ABC, abstractmethod
from typing import List, Dict, Optional
from bs4 import BeautifulSoup
from playwright.sync_api import sync_playwright
from app.config import settings
# Configuration constants (Move these to settings in production)
PH_API_TOKEN = "YOUR_PRODUCT_HUNT_DEVELOPER_TOKEN"  # Get from https://www.producthunt.com/v2/oauth/applications
USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"

class BaseConnector(ABC):
    @abstractmethod
    def fetch_signals(self, query: str, limit: int = 5) -> List:
        pass

class YCombinatorConnector(BaseConnector):
    """
    Implements the 'Scroll and Wait' pattern to harvest YC Company data.
    Source: Research Section 2.1
    """
    def fetch_signals(self, query: str, limit: int = 10) -> List:
        results = []
        with sync_playwright() as p:
            browser = p.chromium.launch(headless=True)
            page = browser.new_page(user_agent=USER_AGENT)
            
            # Navigate to YC directory (filtered by query if possible, or general)
            # Note: YC's search URL structure varies, defaulting to main list for demo
            url = f"https://www.ycombinator.com/companies?q={query}"
            print(f"DEBUG: Scraping YC URL: {url}")
            page.goto(url)
            
            # Infinite Scroll Logic
            previous_height = 0
            while len(results) < limit:
                # Extract cards currently in DOM
                company_cards = page.locator('a._company_86jzd_338').all() # Note: Class names are dynamic, selector might need adjustment to generic 'a[href*="/companies/"]'
                
                if not company_cards:
                    # Fallback selector if class names changed
                    company_cards = page.locator('a[href^="/companies/"]').all()

                for card in company_cards:
                    if len(results) >= limit: 
                        break
                    
                    try:
                        name = card.locator('.coName').first.text_content()
                        desc = card.locator('.coDescription').first.text_content()
                        batch = card.locator('.coBatch').first.text_content() if card.locator('.coBatch').count() > 0 else "Unknown"
                        
                        # Deduping check
                        if not any(r['name'] == name for r in results):
                            results.append({
                                "source": "Y Combinator",
                                "type": "supply_signal",
                                "name": name,
                                "description": desc,
                                "batch": batch,
                                "url": f"https://www.ycombinator.com{card.get_attribute('href')}"
                            })
                    except Exception:
                        continue

                # Scroll down
                page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
                page.wait_for_timeout(2000) # Wait for React to hydrate new items
                
                new_height = page.evaluate("document.body.scrollHeight")
                if new_height == previous_height:
                    break # End of list
                previous_height = new_height
                
            browser.close()
        return results

class ProductHuntConnector(BaseConnector):
    """
    Implements GraphQL v2 API to fetch high-velocity launches.
    Source: Research Section 3.2
    """
    def fetch_signals(self, query: str, limit: int = 5) -> List:
        if not PH_API_TOKEN or PH_API_TOKEN == "YOUR_PRODUCT_HUNT_DEVELOPER_TOKEN":
            return

        url = "https://api.producthunt.com/v2/api/graphql"
        headers = {"Authorization": f"Bearer {PH_API_TOKEN}"}
        
        # GraphQL Query extracting "Sentiment Gap" metrics (votes vs comments)
        graphql_query = """
        {
          posts(first: %d, order: VOTES_COUNT) {
            edges {
              node {
                name
                tagline
                description
                votesCount
                commentsCount
                website
                topics {
                  edges {
                    node {
                      name
                    }
                  }
                }
              }
            }
          }
        }
        """ % limit

        response = requests.post(url, json={'query': graphql_query}, headers=headers)
        if response.status_code!= 200:
            return [{"error": f"Product Hunt API Error: {response.status_code}"}]

        data = response.json().get('data', {}).get('posts', {}).get('edges', [])
        normalized = []
        
        for edge in data:
            node = edge['node']
            topics = [t['node']['name'] for t in node['topics']['edges']]
            normalized.append({
                "source": "Product Hunt",
                "type": "market_velocity",
                "name": node['name'],
                "pitch": node['tagline'],
                "metrics": f"{node['votesCount']} votes, {node['commentsCount']} comments",
                "tags": topics,
                "url": node['website']
            })
            
        return normalized

class DevpostConnector(BaseConnector):
    """
    Scrapes 'Built With' tags to identify Technical Momentum.
    Source: Research Section 4.2
    """
    def fetch_signals(self, query: str, limit: int = 5) -> List:
        # Search Devpost projects
        search_url = f"https://devpost.com/software/search?query={query}"
        resp = requests.get(search_url, headers={'User-Agent': USER_AGENT})
        soup = BeautifulSoup(resp.text, 'html.parser')
        
        projects = []
        project_links = [a['href'] for a in soup.select('.link-to-software')][:limit]
        
        for link in project_links:
            try:
                p_resp = requests.get(link, headers={'User-Agent': USER_AGENT})
                p_soup = BeautifulSoup(p_resp.text, 'html.parser')
                
                title = p_soup.select_one('#app-title').text.strip() if p_soup.select_one('#app-title') else "Unknown"
                tagline = p_soup.select_one('.large.mb-4').text.strip() if p_soup.select_one('.large.mb-4') else ""
                
                # Extracting the "Pickaxe Index" (Tech Stack)
                built_with = [li.text.strip() for li in p_soup.select('#built-with li')]
                
                projects.append({
                    "source": "Devpost",
                    "type": "technical_signal",
                    "name": title,
                    "tagline": tagline,
                    "tech_stack": built_with,
                    "url": link
                })
            except Exception as e:
                continue
                
        return projects

class RedditDorkGenerator(BaseConnector):
    """
    Generates 'Google Dork' URLs for high-intent social listening.
    Source: Research Section 5.1
    """
    def fetch_signals(self, query: str, limit: int = 5) -> List:
        # We don't scrape Reddit directly (API is expensive/strict). 
        # We generate the exact search strings for the 'search_all' tool to use.
        dorks = [
            f'site:reddit.com "{query}" "I hate doing"',
            f'site:reddit.com "{query}" "alternative to"',
            f'site:reddit.com "{query}" "willing to pay"',
            f'site:reddit.com "{query}" "why isn\'t there a"',
        ]
        
        return dorks

def market_intel_search(query: str, sources: List[str] = ["yc", "ph", "devpost", "reddit"]):
    """
    The Orchestrator function to be called by the Agent.
    """
    aggregator = []
    
    if "yc" in sources:
        aggregator.extend(YCombinatorConnector().fetch_signals(query))
    if "ph" in sources:
        aggregator.extend(ProductHuntConnector().fetch_signals(query))
    if "devpost" in sources:
        aggregator.extend(DevpostConnector().fetch_signals(query))
    if "reddit" in sources:
        aggregator.extend(RedditDorkGenerator().fetch_signals(query))
        
    return json.dumps(aggregator, indent=2)

# --- Integration with your existing tool list ---

tools = [
    {
        "type": "function",
        "function": {
            "name": "market_intel_search",
            "description": "Search for market intelligence signals across multiple sources (YC, Product Hunt, Devpost, Reddit).",
            "parameters": {
                "type": "object",
                "properties": {
                    "query": {
                        "type": "string",
                        "description": "The market/product/technology query to search for."
                    },
                    "sources": {
                        "type": "array",
                        "items": {"type": "string"},
                        "description": "Specific data silos to mine."
                    }
                },
                "required": ["query"]
            }
        }
    }
]