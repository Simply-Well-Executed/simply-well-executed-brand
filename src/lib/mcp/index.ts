import { defineMcp } from "@lovable.dev/mcp-js";
import listStandardsTool from "./tools/list-standards";
import getBrandInfoTool from "./tools/get-brand-info";
import submitDemoRequestTool from "./tools/submit-demo-request";
import getAuditTrailTool from "./tools/get-audit-trail";

export default defineMcp({
  name: "simply-well-executed-brand",
  title: "Simply Well Executed Brand",
  version: "0.1.0",
  instructions:
    "Public tools for Simply Well Executed. Use `list_standards` to browse the operating standards, " +
    "`get_brand_info` for the brand system and downloadable assets, `submit_demo_request` to request a demo, " +
    "and `get_audit_trail` to inspect the append-only, hash-chained audit log of tool calls.",
  tools: [listStandardsTool, getBrandInfoTool, submitDemoRequestTool, getAuditTrailTool],
});
