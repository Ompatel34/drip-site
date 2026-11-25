/*
 * A/B switch for the usability test.
 *
 * ?v=a hides the buy-back block on product pages and remembers the choice
 * for the browser tab (sessionStorage), so it stays hidden as the tester
 * moves around the site. ?v=b, or no stored choice, shows it as normal.
 *
 * The check runs as an inline script in <head> (see app/layout.tsx), before
 * the page is drawn, so the block never flashes. It marks <html> with
 * data-ab="a" and a CSS rule in globals.css hides .buyback-ab.
 */
const KEY = "drip-ab-variant"

export const AB_SCRIPT = `(function(){try{var v=new URLSearchParams(location.search).get("v");if(v==="a"||v==="b")sessionStorage.setItem("${KEY}",v);if(sessionStorage.getItem("${KEY}")==="a")document.documentElement.setAttribute("data-ab","a")}catch(e){}})()`

export function BuybackAB({ children }: { children: React.ReactNode }) {
  return <div className="buyback-ab">{children}</div>
}
