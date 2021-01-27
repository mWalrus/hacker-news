import xmlParser from "fast-xml-parser";
import Parser from "fast-html-parser";

/**
 * Security/Hacker news app
 */
export class App {
  constructor() {
    this.hnTitle = "ycombinator";
    this.hnEntries = [];
    this.nsTitle = "/r/netsec";
    this.nsEntries = [];
    this.corsURL = "https://cors-anywhere.herokuapp.com/"; // allows cors requests from client
    document.addEventListener("aurelia-composed", async () => {
      this.hnEntries = await this.fetchEntries(
        "https://news.ycombinator.com/rss"
      );
      this.nsEntries = await this.fetchEntries(
        "https://www.reddit.com/r/netsec.rss"
      );
    });
  }
  /**
   * Gets the entries from a given page
   * @param {string} url destination homepage url
   * @param {boolean} hn set to true if url is hacker news url
   */
  async fetchEntries(url) {
    const req = await fetch(this.corsURL + url);
    const resText = await req.text();
    if (url.match("ycombinator")) return this.getHNEntries(resText);
    return this.getNSEntries(resText);
  }

  /**
   * Gets the hackernews entries
   * @param {string} text page content
   */
  getHNEntries(text) {
    const xml = xmlParser.parse(text);
    const items = xml.rss.channel.item;
    // Constructing new array because we want to format the dates provided
    let fItems = [];
    for (let item of items) {
      // Creating temp div to convert html character entities to their actual display characters
      const tempTitleEl = document.createElement("div");
      tempTitleEl.innerHTML = item.title;
      const title = tempTitleEl.firstChild.data;

      fItems.push({
        title,
        link: item.link,
        date: this.formatDate(item.pubDate),
      });
    }
    return fItems;
  }

  /**
   * Gets the /r/netsec entries from the reddit page rss
   * @param {string} text page contents
   */
  getNSEntries(text) {
    const xml = xmlParser.parse(text);
    // rss xml is structured weird so we need to parse it further
    const links = this.parseEntries(xml.feed.entry);
    return links;
  }

  /**
   * Parses each entry and packages the information gathered
   * @param {array} entries entries from rss feed
   */
  parseEntries(entries) {
    let results = [];
    for (let entry of entries) {
      // if the entry is the monthly discussion or the hiring thread we skip them
      if (
        entry.title.match(
          /(\/r\/netsec.+Q[1-4].+Hiring|([mM]onthly)? [dD]iscussion)/
        )
      ) {
        continue;
      }

      const title = entry.title;
      const date = this.formatDate(entry.updated);

      // each entry has a "link" where one could think the would be but nah, it's empty.
      // The link is actually hidden inside the "content" key which is a jumbled mess
      // of text and html character entities.
      // So to extract it we need to parse it:
      // 1. We take the contents of the "content" key and set it as innerHTML of a temp div.
      //    This converts the character entities into actual characters. Which is good.
      const tempHTMLElement = document.createElement("div");
      tempHTMLElement.innerHTML = entry.content;
      // 2. Then we extract the text with the good formatting and remove the crap we dont need.
      const value = tempHTMLElement.firstChild.data.slice(25);
      // 3. Now we can put the text into a html parser to grab the link.
      const html = Parser.parse(value);
      // 4. The link is always last in the line so we grab the rawAttrs from there.
      let link =
        html.childNodes[html.childNodes.length - 1].childNodes[0].rawAttrs;
      // 5. Lastly we remove the attribute name and the quotation marks around it, and voila!
      link = link.replace(/(href="|")/g, "");
      // 6. rss masters PogU @reddit

      results.push({
        title,
        link,
        date,
      });
    }
    return results;
  }

  /**
   * Formats date string into a more readable format
   * @param {string} dateString unformatted date
   */
  formatDate(dateString) {
    const date = new Date(dateString).toDateString();
    const time = new Date(dateString).toLocaleTimeString();
    return `${date} ${time}`;
  }
}
