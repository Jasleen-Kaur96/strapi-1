export type McpToolAction =
  | 'list'
  | 'get'
  | 'create'
  | 'update'
  | 'delete'
  | 'publish'
  | 'unpublish'
  | 'discard_draft'
  | 'write'
  | 'log';

const ACTION_PREFIXES: Array<{ prefix: string; action: McpToolAction }> = [
  { prefix: 'discard_', action: 'discard_draft' },
  { prefix: 'list_', action: 'list' },
  { prefix: 'get_', action: 'get' },
  { prefix: 'create_', action: 'create' },
  { prefix: 'update_', action: 'update' },
  { prefix: 'delete_', action: 'delete' },
  { prefix: 'publish_', action: 'publish' },
  { prefix: 'unpublish_', action: 'unpublish' },
  { prefix: 'write_', action: 'write' },
];

/**
 * Maps an MCP tool name to a coarse action category (never returns content-type slugs).
 */
export const normalizeMcpToolAction = (toolName: string): McpToolAction | null => {
  if (toolName === 'log') {
    return 'log';
  }

  for (const { prefix, action } of ACTION_PREFIXES) {
    if (prefix === 'discard_') {
      if (toolName.startsWith('discard_') && toolName.endsWith('_draft')) {
        return action;
      }
      continue;
    }

    if (toolName.startsWith(prefix)) {
      return action;
    }
  }

  return null;
};

export type McpToolSource = 'core' | 'content-manager';

export const resolveMcpToolSource = (toolName: string): McpToolSource =>
  toolName === 'log' ? 'core' : 'content-manager';
