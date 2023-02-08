// ==UserScript==
// @name        Replay Twitter Tool
// @namespace   Replay Twitter Tool
// @description Replay Twitter Tool
// @author      ErickYangs
// @copyright   2023+, ErickYangs (https://github.com/ErickYangs)
// @license     CC-BY-NC-SA-4.0; https://creativecommons.org/licenses/by-nc-sa/4.0/legalcode
// @license     GPL-3.0-or-later; http://www.gnu.org/licenses/gpl-3.0.txt
// @include     *://twitter.com/*
// @exclude     *://twitter.com/
// @exclude     *://twitter.com
// @version     1.0.0
// @grant       GM_xmlhttpRequest
// @grant       GM_download
// ==/UserScript==
const twitterAction = {
  replayTwitterText: "template text", // 可替换发推内容
  getCookie: function (name) {
    let cookies = {};
    document.cookie
      .split(";")
      .filter((n) => n.indexOf("=") > 0)
      .forEach((n) => {
        n.replace(/^([^=]+)=(.+)$/, (match, name, value) => {
          cookies[name.trim()] = value.trim();
        });
      });
    return name ? cookies[name] : cookies;
  },
  getFetchData: function name(url) {
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: "GET",
        url: url,
        onload: function (res) {
          if (res.status == 200) {
            var text = res.responseText;
            var json = JSON.parse(text);
            resolve(json);
          }
        },
        onerror: function (err) {
          reject(err);
        },
      });
    });
  },
  fetchRePlayTwitter: async function (twitterId) {
    let url =
      "https://api.twitter.com/graphql/MYy_64Dv_JRBlPN5OZjQXw/CreateTweet";
    let cookies = this.getCookie();
    let headers = {
      accept: "*/*",
      "accept-language": "zh,en;q=0.9,zh-CN;q=0.8",
      authorization:
        "Bearer AAAAAAAAAAAAAAAAAAAAANRILgAAAAAAnNwIzUejRCOuH5E6I8xnZz4puTs%3D1Zv7ttfk8LF81IUq16cHjhLTvJu4FA33AGWWjCpTnA",
      "content-type": "application/json",
      "sec-ch-ua":
        '" Not A;Brand";v="99", "Chromium";v="102", "Google Chrome";v="102"',
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": '"macOS"',
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-origin",
      "x-csrf-token": cookies.ct0,
      "x-twitter-active-user": "yes",
      "x-twitter-auth-type": "OAuth2Session",
      "x-twitter-client-language": "zh-cn",
    };
    if (cookies.ct0.length == 32) headers["x-guest-token"] = cookies.gt;
    return await fetch(url, {
      headers: headers,
      method: "POST",
      referrer: "https://twitter.com/home",
      referrerPolicy: "strict-origin-when-cross-origin",
      body: `{"variables":{"tweet_text":"${this.replayTwitterText}","reply":{"in_reply_to_tweet_id":"${twitter_id}","exclude_reply_user_ids":[]},"dark_request":false,"media":{"media_entities":[],"possibly_sensitive":false},"withDownvotePerspective":false,"withReactionsMetadata":false,"withReactionsPerspective":false,"withSuperFollowsTweetFields":true,"withSuperFollowsUserFields":true,"semantic_annotation_ids":[]},"features":{"longform_notetweets_consumption_enabled":true,"tweetypie_unmention_optimization_enabled":true,"vibe_api_enabled":true,"responsive_web_edit_tweet_api_enabled":true,"graphql_is_translatable_rweb_tweet_is_translatable_enabled":true,"view_counts_everywhere_api_enabled":true,"interactive_text_enabled":true,"responsive_web_text_conversations_enabled":false,"responsive_web_twitter_blue_verified_badge_is_enabled":true,"verified_phone_label_enabled":false,"freedom_of_speech_not_reach_appeal_label_enabled":false,"standardized_nudges_misinfo":true,"tweet_with_visibility_results_prefer_gql_limited_actions_policy_enabled":false,"responsive_web_graphql_timeline_navigation_enabled":true,"responsive_web_enhance_cards_enabled":false},"queryId":"MYy_64Dv_JRBlPN5OZjQXw"}`,
      method: "POST",
      mode: "cors",
      credentials: "include",
    }).then((result) => result.json());
  },
  releaseAction: function (idList) {
    if (idList.length <= 0) {
      return;
    }
    idList.map(async (item) => {
      await this.fetchRePlayTwitter(item);
    });
  },
  init: async function () {
    console.log("init event");
    const url = "http://172.16.8.118:8091/api/v1/searchids";
    const jsonData = await this.getFetchData(url);
    const { result } = jsonData;
    await this.releaseAction(result);
  },
};

window.setTimeout(function () {
  twitterAction.init();
}, 10000);
