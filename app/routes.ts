import type { RouteConfig } from "@react-router/dev/routes";
import { index, route } from "@react-router/dev/routes";

export default [
  index("routes/_index.tsx"),
  route("play/:sessionId", "routes/play.$sessionId.tsx"),
  route("api/session", "routes/api.session.ts"),
  route("api/action", "routes/api.action.ts"),
] satisfies RouteConfig;
