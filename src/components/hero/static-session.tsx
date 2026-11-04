import { SessionFooter, SessionHeader } from "./security-indicators";
import { BOX_CLASS, LIST_CLASS, STAGE_CLASS, StreamLines } from "./stream-lines";
import { compile, frameAt, restingTime, type Workflow } from "./workflow-engine";

/**
 * The first frame (the finished SentinelRules workflow) as plain
 * server-rendered HTML. It is never hydrated, which keeps the page's
 * hydration cost low; it is also what visitors see without JavaScript and
 * with reduced motion. SessionActivator later swaps in the live animation,
 * which starts from this exact frame.
 */
export function StaticSession({ workflows }: { workflows: Workflow[] }) {
  const timeline = compile(workflows);
  const frame = frameAt(timeline, restingTime(timeline));
  return (
    <div className={STAGE_CLASS}>
      <SessionHeader frame={frame} titles={workflows.map((w) => w.title)} />
      <div className="relative min-h-0 flex-1">
        <div className={BOX_CLASS}>
          <div className={LIST_CLASS}>
            <StreamLines frame={frame} />
          </div>
        </div>
      </div>
      <SessionFooter frame={frame} />
    </div>
  );
}
