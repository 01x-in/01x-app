const shipItems = [
  "A problem statement 3 real people confirmed",
  "A working product. Not a prototype. Not a deck.",
  "10 strangers tested it. You have the receipts.",
  "20 users who came back without being asked",
  "A record of every decision you made and why",
  "A launch-ready page, positioning, and distribution plan",
  "Two public launches. Two sets of real data.",
  "A Demo Day where you show what you actually built",
  "8–12 people who saw you build from zero",
];

export function WhatYouShip() {
  return (
    <>
      <div className="grid md:grid-cols-2 gap-x-6 gap-y-3 mb-10">
        {shipItems.map((item) => (
          <div
            key={item}
            className="flex gap-3 rounded-lg bg-card/30 border border-border/50 px-4 py-3 text-sm"
          >
            <span className="text-green-500 shrink-0 mt-0.5">✓</span>
            <span className="text-muted-foreground">{item}</span>
          </div>
        ))}
      </div>
      <p className="text-muted-foreground text-center text-sm">
        Everything on this list is within reach. Grit is all it takes.
      </p>
    </>
  );
}
