import {
  normalizeMcpToolAction,
  resolveMcpToolSource,
  type McpToolAction,
  type McpToolSource,
} from './normalizeMcpToolAction';

export type McpCapabilityType = 'tool' | 'prompt' | 'resource';

export type McpCapabilityIdentity = {
  type: McpCapabilityType;
  action: McpToolAction;
  source: McpToolSource;
};

/**
 * Maps a capability to coarse telemetry identity (never returns content-type slugs).
 * Prompts and resources are tracked once normalization rules exist.
 */
export const normalizeMcpCapability = (
  type: McpCapabilityType,
  name: string
): McpCapabilityIdentity | null => {
  if (type !== 'tool') {
    return null;
  }

  const action = normalizeMcpToolAction(name);

  if (action === null) {
    return null;
  }

  return {
    type,
    action,
    source: resolveMcpToolSource(name),
  };
};
