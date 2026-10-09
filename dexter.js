/**
 * Dexter Provider for Nuvio App
 * Optimized for Hermes Engine (ES6 Promises)
 */

function getStreams(tmdbId, mediaType, seasonNum, episodeNum) {
  // 1. Build the correct URL dynamically based on media type
  const isTv = mediaType === 'tv' || mediaType === 'series';
  const pageUrl = isTv 
    ? "https://dexter.pw/tv/" + tmdbId + "/season/" + seasonNum + "/episode/" + episodeNum 
    : "https://dexter.pw/movie/" + tmdbId;

  // 2. Fetch the page using pure Promise chains (Best for Nuvio/Hermes)
  return fetch(pageUrl)
    .then(function(response) {
      if (!response.ok) return '';
      return response.text();
    })
    .then(function(html) {
      if (!html) return [];

      // 3. Extract the vault server (fast regex)
      const vaultMatch = html.match(/name="cno:vault"\s+content="([^"]+)"/i);
      if (!vaultMatch) return [];
      
      const primaryVault = vaultMatch[1].split(',')[0].trim();

      // 4. Extract the watch slug (fast regex fallback to tmdbId)
      const slugMatch = html.match(/\/watch\/(\d+-[a-zA-Z0-9-]+)/i);
      const watchSlug = slugMatch ? slugMatch[1] : tmdbId;

      // 5. Return Nuvio-formatted stream array
      return [{
        name: "Dexter",
        title: "Auto HD - Vault HLS",
        url: primaryVault + "/v/" + watchSlug + "/master.m3u8",
        quality: "1080p",
        format: "m3u8",
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          "Referer": "https://dexter.pw/watch/" + watchSlug
        }
      }];
    })
    .catch(function() {
      // Silent fail: If anything goes wrong, return empty array so Nuvio can move on instantly
      return [];
    });
}

module.exports = { getStreams };

  

 
      
