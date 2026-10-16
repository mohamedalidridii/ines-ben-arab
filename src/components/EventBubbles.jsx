"use client";
import { useState } from "react";
import Link from "next/link";
import StoryViewer from "@/components/StoryViewer";
import { events } from "@/data";

/* Bulles façon stories : un clic ouvre la visionneuse de l'événement */
export default function EventBubbles() {
  const [open, setOpen] = useState(null);
  return (
    <section className="ev-home">
      <div className="container">
        <div className="ev-home-head">
          <p className="sm">Événements</p>
          <Link href="/evenements" className="sm">Tout voir →</Link>
        </div>
        <div className="ev-rings" role="list">
          {events.map((e, i) => (
            <button key={e.id} className="ev-ring" role="listitem" onClick={() => setOpen(i)}>
              <span className="ev-ring-img"><img src={e.cover} alt="" /></span>
              <span className="sm">{e.title}</span>
            </button>
          ))}
        </div>
      </div>
      {open !== null && <StoryViewer events={events} start={open} onClose={() => setOpen(null)} />}
    </section>
  );
}
