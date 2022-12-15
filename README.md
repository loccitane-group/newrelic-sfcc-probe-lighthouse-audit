# newrelic-sfcc-probe-lighthouse-audit
JS Script for NewRelic Probes to get a Google Lighthouse audit for Performance/SEO/Accessibility/...

<p align="center">
<img width="459" alt="image" src="https://user-images.githubusercontent.com/11783843/207828871-f46354e1-f7c6-4bcd-b9ef-1fd456aa72d2.png">
</p>

## Install
On NewRelic, create a new Synthetic monitor with type `Endpoint availability Scripted API`, configure it to run on a regular basis (e.g. every day), then on `Write script` panel paste the code in `index.js` by setting the following values:
- `URL`: The URL of your web page you want to audit.
- `GOOGLE_PAGESPEED_API_KEY`: Google PageSpeed API key (See here to get an API key: https://developers.google.com/speed/docs/insights/v5/get-started#APIKey)
- `CATEGORIES`: The list of audit category to run.
  Available values are:
  - `accessibility`
  - `best_practices`
  - `performance`
  - `pwa`
  - `seo`
- `STRATEGY`: Audit strategy (one of those):
  - `mobile`
  - `desktop`

## Usage
### Latest scores
You can then create a new dashboard widget with the following NRQL query to display the latest audited scores:
Please replace `fr.loccitane.com` by the domain of the website your are auditing

```sql
SELECT latest(numeric(custom.performanceScore)*100) as 'Performance (%)', latest(numeric(custom.seoScore)*100) as 'SEO (%)', latest(numeric(custom.accessibilityScore)*100) as 'Accessibility (%)' FROM SyntheticCheck WHERE custom.url like '%fr.loccitane.com%' SINCE 365 day ago
```

### Scores evolution
You can then create a new dashboard widget with the following NRQL query to display the evolution of all audited scores:
Please replace `fr.loccitane.com` by the domain of the website your are auditing

```sql
SELECT average(numeric(custom.accessibilityScore)*100) as 'Accessibility', average(numeric(custom.seoScore)*100) as 'SEO', average(numeric(custom.performanceScore)*100) as 'Performance' FROM SyntheticCheck WHERE custom.url like '%fr.loccitane.com%' TIMESERIES AUTO SINCE 365 day ago
```
  
Then choose a `Line` chart type.


