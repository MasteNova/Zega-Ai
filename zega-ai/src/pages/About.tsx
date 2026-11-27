import { Card, PageTitle, Badge } from '../components/ui';

export default function About() {
  return (
    <div className="max-w-2xl space-y-5">
      <PageTitle title="About Zega-AI" sub="An intelligent, honest travel companion for Arba Minch, Ethiopia." />
      <Card className="p-5 text-sm text-ink/70 space-y-3">
        <p>Zega-AI helps you plan by budget, explore verified destinations, check bajaj fares against local estimates, learn useful phrases, and reach Zega responders in an emergency.</p>
        <p><strong className="text-forest">Our honesty rules:</strong></p>
        <ul className="list-disc pl-4 space-y-1">
          <li>The AI plans only from our destination catalog — it never invents places.</li>
          <li>Prices are local estimates, never official or guaranteed. Unverified data is badged.</li>
          <li>Gamo translations and audio are published only after native-speaker verification.</li>
          <li>SOS reaches Zega responders — not police or ambulance. Always know local emergency contacts.</li>
          <li>Offline mode is real: cached data works; network features say so when unavailable.</li>
        </ul>
        <div className="flex gap-2 flex-wrap pt-2">
          <Badge tone="green">Offline-first PWA</Badge>
          <Badge tone="green">Privacy-protected SOS</Badge>
          <Badge>Map © OpenStreetMap contributors</Badge>
        </div>
      </Card>
    </div>
  );
}
