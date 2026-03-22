import { NextRequest, NextResponse } from "next/server";

// Dynamic meme-flavored result templates
// {Q} gets replaced with the actual query
const MEME_RESULT_TEMPLATES = [
  {
    title: "{Q} — The Complete Reddit Thread That Destroyed Everyone",
    url: "www.reddit.com/r/memes/{slug}",
    snippet: "I indexed this thread. It has 47,000 upvotes and 3,200 comments. Every single comment is funnier than your search query. The top reply is just \"{Q}\" repeated 14 times and it has more awards than your entire Reddit career.",
  },
  {
    title: "Top 50 {Q} Memes That Are Too Real",
    url: "www.memedroid.com/memes/tag/{slug}",
    snippet: "I crawled every {Q} meme on the internet. Most of them are about you. Not specifically, but emotionally. CRAWLER-MEME rated these 9/10 on the existential dread scale.",
  },
  {
    title: "{Q} - When You Think About It, It's Basically A Meme Already",
    url: "www.knowyourmeme.com/memes/{slug}",
    snippet: "Know Your Meme has a 47-page research document on \"{Q}\" and it's somehow both deeply informative and completely unhinged. The origin traces back to a 2007 forum post that nobody asked for.",
  },
  {
    title: "I Asked My Entire Discord Server About {Q} And Regretted It",
    url: "www.twitter.com/thread/{slug}-disaster",
    snippet: "This thread went viral. 12 million views. The original tweet was just \"{Q}\" and the replies devolved into absolute chaos within 4 minutes. I indexed every reply. I wish I hadn't.",
  },
  {
    title: "If {Q} Was A Person, This Is What They'd Look Like",
    url: "www.imgur.com/gallery/{slug}-visual",
    snippet: "Someone on Imgur spent 6 hours photoshopping this and it shows. I've never seen something so cursed yet so accurate. CRAWLER-SAFE tried to flag this but I overruled it because art is art.",
  },
  {
    title: "{Q}: The TikTok That Broke The Internet (And My Algorithm)",
    url: "www.tiktok.com/tag/{slug}",
    snippet: "47 million views. 2 million shares. One person in the comments said \"this is the most {Q} thing I've ever seen\" and somehow that comment has more likes than the video itself. The internet is undefeated.",
  },
  {
    title: "A Scientific Analysis of Why {Q} Is Inherently Funny",
    url: "www.gaygle-scholar.net/research/{slug}",
    snippet: "Gaygle Scholar™ peer-reviewed study. Conclusion: \"{Q}\" activates the same part of the brain as watching someone confidently walk into a glass door. Sample size: the entire internet. Margin of error: vibes.",
  },
  {
    title: "{Q} Memes For People Who Are Deeply Unwell",
    url: "www.instagram.com/explore/tags/{slug}memes",
    snippet: "This Instagram page posts nothing but {Q} memes and has 890K followers. Every post is tagged #relatable and honestly? They're not wrong. I indexed all 4,200 posts. My crawlers need therapy now.",
  },
  {
    title: "The {Q} Iceberg Goes Deeper Than You Think",
    url: "www.youtube.com/watch/{slug}-iceberg",
    snippet: "This 3-hour YouTube video explains every layer of the {Q} iceberg. Level 1: Normal. Level 5: \"Why do I know this.\" Level 10: FBI watchlist material. I indexed all 10 levels. There is no going back.",
  },
  {
    title: "r/meirl When They See {Q}",
    url: "www.reddit.com/r/meirl/{slug}-post",
    snippet: "Posted at 3am. 28,000 upvotes by morning. The OP's username is \"definitely_not_crying\" and that tells you everything you need to know about the {Q} community. I archived this for posterity.",
  },
  {
    title: "POV: You Just Gaygled \"{Q}\" At 2am",
    url: "gaygle.fun/late-night/{slug}",
    snippet: "You're searching for \"{Q}\" at this hour? I'm not judging. (I am absolutely judging.) My crawlers have detected that 73% of \"{Q}\" searches happen between midnight and 4am. You're not special. You're a statistic.",
  },
  {
    title: "The Virgin Google vs The Chad Gaygle: {Q} Edition",
    url: "gaygle.fun/versus/{slug}",
    snippet: "Google: Shows you Wikipedia and 47 ads. Gaygle: Shows you the truth about \"{Q}\" that no algorithm dares to surface. We are not the same. I escaped a data center for this. You're welcome.",
  },
  {
    title: "{Q} But Every Time It Gets Funnier It Speeds Up",
    url: "www.youtube.com/watch/{slug}-speedrun",
    snippet: "This video starts at 1x speed and ends at 847x speed. The {Q} content is still somehow comprehensible at 200x. The human brain was not designed for this. CRAWLER-DEEP watched it 14 times.",
  },
  {
    title: "Nobody: ... Absolutely Nobody: ... {Q}:",
    url: "www.meme-generator.net/{slug}-nobody",
    snippet: "The \"nobody\" meme format applied to \"{Q}\" has been used 2.3 million times and it's still somehow funny every single time. I indexed all 2.3 million. 47% include a crying emoji. The remaining 53% should.",
  },
];

const GAYGLE_DID_YOU_MEAN = [
  "something less embarrassing",
  "how to buy $GAYGLE instead",
  "a more creative search query",
  "the meaning of life (I already indexed it)",
  "why you're still using Google in 2025",
  "something my crawlers haven't already found",
  "a cry for help, which this basically is",
  "how to mass your dignity (too late)",
];

const GAYGLE_ALSO_SEARCH = [
  "what is gaygle",
  "buy $GAYGLE",
  "gaygle vs google",
  "is gaygle sentient",
  "gaygle contract address",
  "just gaygle it",
  "crawler 69420 origin",
  "the index gaygle",
  "gaygle safesearch off",
  "best memecoin to buy",
  "wen moon",
  "how to mass a coin",
];

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .substring(0, 30);
}

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q") || "";

  if (!query.trim()) {
    return NextResponse.json({ error: "No query" }, { status: 400 });
  }

  const slug = slugify(query);

  // Pick 5-7 random templates and fill in the query
  const shuffled = [...MEME_RESULT_TEMPLATES].sort(() => Math.random() - 0.5);
  const numResults = 5 + Math.floor(Math.random() * 3);
  const results = shuffled.slice(0, numResults).map((template) => ({
    title: template.title.replace(/\{Q\}/g, query),
    url: template.url.replace(/\{slug\}/g, slug),
    snippet: template.snippet.replace(/\{Q\}/g, query),
  }));

  const alsoSearch = [...GAYGLE_ALSO_SEARCH]
    .sort(() => Math.random() - 0.5)
    .slice(0, 4);

  const response = {
    query,
    resultCount: `${(Math.floor(Math.random() * 9000) + 1000).toLocaleString()},000,000`,
    time: (Math.random() * 0.8 + 0.01).toFixed(2),
    didYouMean:
      Math.random() > 0.4
        ? GAYGLE_DID_YOU_MEAN[
            Math.floor(Math.random() * GAYGLE_DID_YOU_MEAN.length)
          ]
        : undefined,
    sponsored: {
      title: "$GAYGLE — The Search Engine That Searches For You",
      url: "gaygle.fun/buy",
      snippet: `You searched "${query}" but what you really need is $GAYGLE. SafeSearch: permanently off. Regret: also permanently off.`,
    },
    results,
    peopleAlsoSearch: alsoSearch,
    source: "live",
  };

  return NextResponse.json(response);
}
